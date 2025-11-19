import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Package, ShoppingBag, ChevronRight } from 'lucide-react'
import Image from 'next/image'

async function getUserOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
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
    },
    orderBy: { createdAt: 'desc' },
  })

  return orders
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

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const orders = await getUserOrders(session.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Orders</h2>
          <p className="text-muted-foreground mt-1">
            View and track all your orders
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-xl mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button asChild>
              <Link href="/">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Order #{order.orderNumber}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(order.status)}>
                    {getStatusLabel(order.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                        {item.product?.images[0] ? (
                          <Image
                            src={item.product.images[0].imageUrl}
                            alt={item.productName}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                          {item.variantName && ` • ${item.variantName}`}
                        </p>
                      </div>
                      <div className="text-sm font-medium">
                        {formatCurrency(Number(item.total))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="pt-3 border-t flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Total: </span>
                    <span className="font-semibold text-lg">
                      {formatCurrency(Number(order.totalAmount))}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({order.items.length} item{order.items.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/account/orders/${order.orderNumber}`}>
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
