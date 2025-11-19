import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Package,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  ArrowLeft,
  Download,
} from 'lucide-react'
import Image from 'next/image'

async function getOrder(orderNumber: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
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

  if (!order || order.userId !== userId) {
    return null
  }

  return order
}

const getOrderTimeline = (order: any) => {
  const timeline = [
    {
      status: 'pending',
      label: 'Order Placed',
      description: 'We have received your order',
      completed: true,
      timestamp: order.createdAt,
    },
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      description: 'Your order has been confirmed',
      completed: ['confirmed', 'processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.status),
      timestamp: order.updatedAt,
    },
    {
      status: 'processing',
      label: 'Processing',
      description: 'We are preparing your order',
      completed: ['processing', 'packed', 'shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.status),
      timestamp: null,
    },
    {
      status: 'shipped',
      label: 'Shipped',
      description: 'Your order has been shipped',
      completed: ['shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(order.status),
      timestamp: null,
    },
    {
      status: 'delivered',
      label: 'Delivered',
      description: 'Order delivered successfully',
      completed: order.status === 'delivered',
      timestamp: order.deliveredAt,
    },
  ]

  // If order is cancelled, show different timeline
  if (order.status === 'cancelled') {
    return [
      timeline[0],
      {
        status: 'cancelled',
        label: 'Order Cancelled',
        description: 'This order has been cancelled',
        completed: true,
        timestamp: order.updatedAt,
      },
    ]
  }

  return timeline
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'default'
    case 'shipped':
    case 'in_transit':
    case 'out_for_delivery':
      return 'default'
    case 'processing':
    case 'confirmed':
      return 'secondary'
    case 'cancelled':
    case 'failed':
      return 'destructive'
    default:
      return 'secondary'
  }
}

const getStatusLabel = (status: string) => {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default async function OrderDetailPage({
  params,
}: {
  params: { orderNumber: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/login')
  }

  const order = await getOrder(params.orderNumber, session.user.id)

  if (!order) {
    notFound()
  }

  const shippingAddress = order.shippingAddress[0]
  const payment = order.payments[0]
  const timeline = getOrderTimeline(order)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">Order #{order.orderNumber}</h2>
            <p className="text-muted-foreground mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={getStatusColor(order.status)}>
            {getStatusLabel(order.status)}
          </Badge>
        </div>
      </div>

      {/* Order Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order.trackingNumber && (
            <div className="mb-6 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Tracking Number</p>
              <p className="font-mono font-semibold">{order.trackingNumber}</p>
              {order.courierName && (
                <p className="text-sm text-muted-foreground mt-1">
                  Courier: {order.courierName}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            {timeline.map((step, index) => (
              <div key={step.status} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div
                      className={`w-0.5 h-12 ${
                        step.completed ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <p
                    className={`font-medium ${
                      step.completed ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  {step.timestamp && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(step.timestamp)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Items ({order.items.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                  {item.product?.images[0] ? (
                    <Image
                      src={item.product.images[0].imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.productName}</h4>
                  {item.variantName && (
                    <p className="text-sm text-muted-foreground">{item.variantName}</p>
                  )}
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(Number(item.total))}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(Number(item.unitPrice))} each
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shippingAddress ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium">
                  {shippingAddress.firstName} {shippingAddress.lastName}
                </p>
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{' '}
                  {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
                <p className="pt-2 border-t">{shippingAddress.phone}</p>
              </div>
            ) : (
              <p className="text-muted-foreground">No shipping address</p>
            )}
          </CardContent>
        </Card>

        {/* Payment & Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span className="font-medium capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge
                  variant={
                    order.paymentStatus === 'paid'
                      ? 'default'
                      : order.paymentStatus === 'failed'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(Number(order.subtotal))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(Number(order.shippingCost))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatCurrency(Number(order.taxAmount))}</span>
                </div>
                {Number(order.discountAmount) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(Number(order.discountAmount))}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(Number(order.totalAmount))}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href={`/orders/${order.orderNumber}/confirmation`}>
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Link>
        </Button>
        {order.status !== 'cancelled' && order.status !== 'delivered' && (
          <Button variant="outline">Request Cancellation</Button>
        )}
      </div>
    </div>
  )
}
