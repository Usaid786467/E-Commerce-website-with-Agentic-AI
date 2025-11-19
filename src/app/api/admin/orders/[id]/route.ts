import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendShippingNotificationEmail } from '@/lib/email/email-service'

async function checkAdminAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  return user?.role === 'admin' || user?.role === 'superadmin'
}

export async function GET(
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

    const order = await prisma.order.findUnique({
      where: { id: params.id },
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
            productVariant: true,
          },
        },
        shippingAddress: true,
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error('Admin order fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
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

    const order = await prisma.order.findUnique({
      where: { id: params.id },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status: body.status,
        paymentStatus: body.paymentStatus,
        trackingNumber: body.trackingNumber || null,
        courierName: body.courierName || null,
        ...(body.status === 'delivered' && {
          deliveredAt: new Date(),
        }),
      },
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
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'order_status_updated',
        entity: 'order',
        entityId: order.id,
        changes: {
          status: { from: order.status, to: body.status },
          paymentStatus: { from: order.paymentStatus, to: body.paymentStatus },
          trackingNumber: body.trackingNumber,
          courierName: body.courierName,
        },
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    })

    // Send shipping notification email if status changed to shipped
    if (body.status === 'shipped' && order.status !== 'shipped') {
      const orderEmail = updatedOrder.guestEmail
      if (orderEmail) {
        sendShippingNotificationEmail(orderEmail, {
          orderNumber: updatedOrder.orderNumber,
          trackingNumber: updatedOrder.trackingNumber || undefined,
          courierName: updatedOrder.courierName || undefined,
          estimatedDelivery: updatedOrder.estimatedDelivery || undefined,
        }).catch((error) => {
          console.error('Failed to send shipping notification email:', error)
        })
      }
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Admin order update error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
