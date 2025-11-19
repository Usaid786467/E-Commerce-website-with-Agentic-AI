import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'

async function checkAdminAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  return user?.role === 'admin' || user?.role === 'superadmin'
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkAdminAccess(session.user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.slug || !body.price || !body.sku || !body.categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: body.slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'A product with this slug already exists' },
        { status: 400 }
      )
    }

    // Create product with relations in transaction
    const product = await prisma.$transaction(async (tx) => {
      const newProduct = await tx.product.create({
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description || null,
          shortDescription: body.shortDescription || null,
          price: new Decimal(body.price),
          salePrice: body.salePrice ? new Decimal(body.salePrice) : null,
          sku: body.sku,
          brand: body.brand || null,
          stockQuantity: body.stockQuantity || 0,
          categoryId: body.categoryId,
          status: body.status || 'draft',
          isFeatured: body.isFeatured || false,
          isNewArrival: body.isNewArrival || false,
        },
      })

      // Create product images
      if (body.images && body.images.length > 0) {
        await tx.productImage.createMany({
          data: body.images.map((imageUrl: string, index: number) => ({
            productId: newProduct.id,
            imageUrl,
            altText: `${body.name} - Image ${index + 1}`,
            sortOrder: index,
          })),
        })
      }

      // Create product variants
      if (body.variants && body.variants.length > 0) {
        await tx.productVariant.createMany({
          data: body.variants.map((variant: any) => ({
            productId: newProduct.id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price ? new Decimal(variant.price) : null,
            stockQuantity: variant.stockQuantity || 0,
          })),
        })
      }

      // Create product attributes
      if (body.attributes && body.attributes.length > 0) {
        await tx.productAttribute.createMany({
          data: body.attributes.map((attr: any) => ({
            productId: newProduct.id,
            name: attr.name,
            value: attr.value,
          })),
        })
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'product_created',
          entity: 'product',
          entityId: newProduct.id,
          changes: {
            name: body.name,
            sku: body.sku,
            price: body.price,
          },
          ipAddress:
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      })

      return newProduct
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
