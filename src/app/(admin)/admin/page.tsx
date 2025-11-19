import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

async function getDashboardStats() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalRevenue,
    lastMonthRevenue,
    totalOrders,
    lastMonthOrders,
    totalCustomers,
    totalProducts,
    pendingOrders,
    recentOrders,
    lowStockProducts,
  ] = await Promise.all([
    // Total revenue this month
    prisma.order.aggregate({
      where: {
        paymentStatus: 'paid',
        createdAt: { gte: startOfMonth },
      },
      _sum: { totalAmount: true },
    }),
    // Last month revenue
    prisma.order.aggregate({
      where: {
        paymentStatus: 'paid',
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
      _sum: { totalAmount: true },
    }),
    // Total orders this month
    prisma.order.count({
      where: { createdAt: { gte: startOfMonth } },
    }),
    // Last month orders
    prisma.order.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lte: endOfLastMonth,
        },
      },
    }),
    // Total customers
    prisma.user.count({
      where: { role: 'customer' },
    }),
    // Total products
    prisma.product.count({
      where: { status: 'published' },
    }),
    // Pending orders
    prisma.order.count({
      where: {
        status: { in: ['pending', 'confirmed', 'processing'] },
      },
    }),
    // Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          take: 1,
          include: {
            product: {
              select: { name: true, images: { take: 1 } },
            },
          },
        },
      },
    }),
    // Low stock products
    prisma.product.findMany({
      where: {
        status: 'published',
        stockQuantity: { lte: 10 },
      },
      take: 5,
      orderBy: { stockQuantity: 'asc' },
      select: {
        id: true,
        name: true,
        stockQuantity: true,
        images: { take: 1 },
      },
    }),
  ])

  const revenue = Number(totalRevenue._sum.totalAmount || 0)
  const lastRevenue = Number(lastMonthRevenue._sum.totalAmount || 0)
  const revenueChange =
    lastRevenue > 0 ? ((revenue - lastRevenue) / lastRevenue) * 100 : 0

  const ordersChange =
    lastMonthOrders > 0
      ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 0

  return {
    revenue,
    revenueChange,
    totalOrders,
    ordersChange,
    totalCustomers,
    totalProducts,
    pendingOrders,
    recentOrders,
    lowStockProducts,
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    prefix = '',
  }: {
    title: string
    value: string | number
    icon: any
    change?: number
    prefix?: string
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {prefix}
              {value}
            </p>
            {change !== undefined && (
              <div
                className={`flex items-center gap-1 text-sm mt-1 ${
                  change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>
                  {change >= 0 ? '+' : ''}
                  {change.toFixed(1)}% from last month
                </span>
              </div>
            )}
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Revenue (This Month)"
          value={formatCurrency(stats.revenue)}
          icon={DollarSign}
          change={stats.revenueChange}
        />
        <StatCard
          title="Orders (This Month)"
          value={stats.totalOrders}
          icon={ShoppingBag}
          change={stats.ordersChange}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link
                href="/admin/orders"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No orders yet
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    {order.items[0]?.product?.images[0] ? (
                      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                        <Image
                          src={order.items[0].product.images[0].imageUrl}
                          alt="Order"
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex-shrink-0 rounded bg-muted flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">#{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">
                        {formatCurrency(Number(order.totalAmount))}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alert</CardTitle>
              <Link
                href="/admin/products"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                All products are well stocked
              </p>
            ) : (
              <div className="space-y-4">
                {stats.lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200"
                  >
                    {product.images[0] ? (
                      <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                        <Image
                          src={product.images[0].imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex-shrink-0 rounded bg-muted flex items-center justify-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-amber-700">
                        Only {product.stockQuantity} left in stock
                      </p>
                    </div>
                    <Badge variant="destructive">Low</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders Alert */}
      {stats.pendingOrders > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium text-blue-900">
                  {stats.pendingOrders} order{stats.pendingOrders !== 1 ? 's' : ''}{' '}
                  pending processing
                </p>
                <p className="text-sm text-blue-700">
                  Review and process pending orders to keep customers happy
                </p>
              </div>
              <Link href="/admin/orders?status=pending">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  View Orders
                </button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
