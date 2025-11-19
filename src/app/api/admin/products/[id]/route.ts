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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Check if slug is being changed and if it's already taken
    if (body.slug && body.slug !== existingProduct.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: body.slug },
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'A product with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update product with relations in transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update main product
      const updatedProduct = await tx.product.update({
        where: { id: params.id },
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description || null,
          shortDescription: body.shortDescription || null,
          price: body.price ? new Decimal(body.price) : undefined,
          salePrice: body.salePrice ? new Decimal(body.salePrice) : null,
          sku: body.sku,
          brand: body.brand || null,
          stockQuantity: body.stockQuantity,
          categoryId: body.categoryId,
          status: body.status,
          isFeatured: body.isFeatured,
          isNewArrival: body.isNewArrival,
        },
      })

      // Update images (delete old, create new)
      if (body.images !== undefined) {
        await tx.productImage.deleteMany({
          where: { productId: params.id },
        })

        if (body.images.length > 0) {
          await tx.productImage.createMany({
            data: body.images.map((imageUrl: string, index: number) => ({
              productId: params.id,
              imageUrl,
              altText: `${body.name} - Image ${index + 1}`,
              sortOrder: index,
            })),
          })
        }
      }

      // Update variants (delete old, create new)
      if (body.variants !== undefined) {
        await tx.productVariant.deleteMany({
          where: { productId: params.id },
        })

        if (body.variants.length > 0) {
          await tx.productVariant.createMany({
            data: body.variants.map((variant: any) => ({
              productId: params.id,
              name: variant.name,
              sku: variant.sku,
              price: variant.price ? new Decimal(variant.price) : null,
              stockQuantity: variant.stockQuantity || 0,
            })),
          })
        }
      }

      // Update attributes (delete old, create new)
      if (body.attributes !== undefined) {
        await tx.productAttribute.deleteMany({
          where: { productId: params.id },
        })

        if (body.attributes.length > 0) {
          await tx.productAttribute.createMany({
            data: body.attributes.map((attr: any) => ({
              productId: params.id,
              name: attr.name,
              value: attr.value,
            })),
          })
        }
      }

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'product_updated',
          entity: 'product',
          entityId: params.id,
          changes: {
            name: body.name,
            sku: body.sku,
            price: body.price,
            status: body.status,
          },
          ipAddress:
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      })

      return updatedProduct
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Product update error:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const isAdmin = await checkAdminAccess(session.user.id)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Delete product and related records in transaction
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.productImage.deleteMany({ where: { productId: params.id } })
      await tx.productVariant.deleteMany({ where: { productId: params.id } })
      await tx.productAttribute.deleteMany({ where: { productId: params.id } })
      await tx.cartItem.deleteMany({ where: { productId: params.id } })
      await tx.wishlistItem.deleteMany({ where: { productId: params.id } })

      // Soft delete reviews (keep for historical purposes)
      await tx.review.updateMany({
        where: { productId: params.id },
        data: { status: 'archived' },
      })

      // Delete the product
      await tx.product.delete({
        where: { id: params.id },
      })

      // Create audit log
      await tx.auditLog.create({
        data: {
          userId: session.user.id,
          action: 'product_deleted',
          entity: 'product',
          entityId: params.id,
          changes: {
            name: existingProduct.name,
            sku: existingProduct.sku,
          },
          ipAddress:
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Product deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
