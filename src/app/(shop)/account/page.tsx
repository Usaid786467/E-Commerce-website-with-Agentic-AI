import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  ShoppingBag,
  Package,
  Heart,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import Image from 'next/image'

async function getUserStats(userId: string) {
  const [orderCount, orderStats, wishlistCount, addressCount] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.aggregate({
      where: { userId, paymentStatus: 'paid' },
      _sum: { totalAmount: true },
    }),
    prisma.wishlistItem.count({
      where: { wishlist: { userId } },
    }),
    prisma.shippingAddress.count({ where: { userId } }),
  ])

  return {
    totalOrders: orderCount,
    totalSpent: orderStats._sum.totalAmount || 0,
    wishlistItems: wishlistCount,
    savedAddresses: addressCount,
  }
}

async function getRecentOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        take: 1,
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: { take: 1 },
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return orders
}

export default async function AccountDashboard() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const [stats, recentOrders] = await Promise.all([
    getUserStats(session.user.id),
    getRecentOrders(session.user.id),
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'processing':
        return <Package className="h-4 w-4 text-yellow-600" />
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: string) => {
    return status
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold">
          Welcome back, {session.user.name || 'User'}!
        </h2>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your account
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold mt-1">{stats.totalOrders}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(Number(stats.totalSpent))}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wishlist Items</p>
                <p className="text-2xl font-bold mt-1">{stats.wishlistItems}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saved Addresses</p>
                <p className="text-2xl font-bold mt-1">{stats.savedAddresses}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                Start shopping to see your orders here
              </p>
              <Button asChild>
                <Link href="/">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.orderNumber}`}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted transition-colors"
                >
                  {order.items[0]?.product?.images[0] ? (
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={order.items[0].product.images[0].imageUrl}
                        alt={order.items[0].productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 flex-shrink-0 rounded-md bg-muted flex items-center justify-center">
                      <Package className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      {getStatusIcon(order.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} •{' '}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(Number(order.totalAmount))}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {getStatusLabel(order.status)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <Link href="/account/orders" className="block">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Track Orders</h3>
                  <p className="text-sm text-muted-foreground">View order status</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <Link href="/account/wishlist" className="block">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-pink-100 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-semibold">My Wishlist</h3>
                  <p className="text-sm text-muted-foreground">{stats.wishlistItems} items saved</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <Link href="/account/addresses" className="block">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Manage Addresses</h3>
                  <p className="text-sm text-muted-foreground">{stats.savedAddresses} addresses</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
