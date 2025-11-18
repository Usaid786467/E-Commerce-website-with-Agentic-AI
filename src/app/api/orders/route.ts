import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CreateOrderInput } from '@/types/order'
import { generateOrderNumber } from '@/lib/utils'
import { Decimal } from '@prisma/client/runtime/library'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = (await request.json()) as CreateOrderInput

    // Validate required fields
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!body.shippingAddress) {
      return NextResponse.json(
        { error: 'Shipping address is required' },
        { status: 400 }
      )
    }

    if (!body.paymentMethod) {
      return NextResponse.json(
        { error: 'Payment method is required' },
        { status: 400 }
      )
    }

    // Calculate order totals
    let subtotal = 0

    // Validate products and calculate subtotal
    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      })

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        )
      }

      // Check stock availability
      if (product.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      // If variant is specified, check variant stock
      if (item.productVariantId) {
        const variant = product.variants.find((v) => v.id === item.productVariantId)
        if (!variant) {
          return NextResponse.json(
            { error: `Variant ${item.productVariantId} not found` },
            { status: 400 }
          )
        }
        if (variant.stockQuantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name} - ${variant.name}` },
            { status: 400 }
          )
        }
      }

      subtotal += item.price * item.quantity
    }

    // Calculate shipping cost
    const shippingCosts: Record<string, number> = {
      standard: 200,
      express: 500,
      overnight: 1000,
      pickup: 0,
    }
    const shippingCost = shippingCosts[body.shippingMethod] || 200

    // Calculate tax (10% for Pakistan, 0% for others for now)
    const taxRate = body.shippingAddress.country === 'PK' ? 0.1 : 0
    const taxAmount = subtotal * taxRate

    // Calculate discount (if promo code provided)
    let discountAmount = 0
    if (body.promoCode) {
      const promotion = await prisma.promotion.findFirst({
        where: {
          code: body.promoCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      })

      if (promotion) {
        if (promotion.discountType === 'percentage') {
          discountAmount = (subtotal * Number(promotion.discountValue)) / 100
        } else if (promotion.discountType === 'fixed') {
          discountAmount = Number(promotion.discountValue)
        }

        // Apply max discount limit
        if (promotion.maxDiscountAmount) {
          discountAmount = Math.min(
            discountAmount,
            Number(promotion.maxDiscountAmount)
          )
        }
      }
    }

    const totalAmount = subtotal + shippingCost + taxAmount - discountAmount

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Get client IP and user agent
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    const userAgent = request.headers.get('user-agent')

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create shipping address
      const shippingAddress = await tx.shippingAddress.create({
        data: {
          ...body.shippingAddress,
          userId: session?.user?.id,
        },
      })

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id,
          guestEmail: session?.user?.email || body.shippingAddress.userId,
          status: 'pending',
          paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'pending',
          subtotal: new Decimal(subtotal),
          discountAmount: new Decimal(discountAmount),
          shippingCost: new Decimal(shippingCost),
          taxAmount: new Decimal(taxAmount),
          totalAmount: new Decimal(totalAmount),
          currency: 'PKR',
          paymentMethod: body.paymentMethod,
          shippingMethod: body.shippingMethod,
          customerNotes: body.customerNotes,
          ipAddress,
          userAgent,
          shippingAddress: {
            connect: { id: shippingAddress.id },
          },
        },
        include: {
          shippingAddress: true,
        },
      })

      // Create order items and update stock
      for (const item of body.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        })

        if (!product) continue

        const variant = item.productVariantId
          ? product.variants.find((v) => v.id === item.productVariantId)
          : null

        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            productVariantId: item.productVariantId,
            productName: product.name,
            productSku: variant?.sku || product.sku,
            variantName: variant?.name,
            quantity: item.quantity,
            unitPrice: new Decimal(item.price),
            subtotal: new Decimal(item.price * item.quantity),
            discountAmount: new Decimal(0),
            total: new Decimal(item.price * item.quantity),
          },
        })

        // Update stock
        if (item.productVariantId && variant) {
          await tx.productVariant.update({
            where: { id: item.productVariantId },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          })
        } else {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { decrement: item.quantity },
            },
          })
        }
      }

      // Create audit log
      if (session?.user?.id) {
        await tx.auditLog.create({
          data: {
            userId: session.user.id,
            action: 'order_created',
            entity: 'order',
            entityId: newOrder.id,
            changes: {
              orderNumber,
              totalAmount,
              paymentMethod: body.paymentMethod,
            },
            ipAddress,
            userAgent,
          },
        })
      }

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  images: { take: 1 },
                },
              },
            },
          },
          shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId: session.user.id } }),
    ])

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Orders fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
