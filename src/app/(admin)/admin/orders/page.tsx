import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Search, Eye, Download } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

async function getOrders(searchParams: any) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const skip = (page - 1) * limit

  const where: any = {}

  if (searchParams.search) {
    where.orderNumber = {
      contains: searchParams.search,
      mode: 'insensitive',
    }
  }

  if (searchParams.status) {
    where.status = searchParams.status
  }

  if (searchParams.paymentStatus) {
    where.paymentStatus = searchParams.paymentStatus
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: {
          take: 1,
        },
        shippingAddress: {
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ])

  return {
    orders,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export default async function OrdersManagementPage({
  searchParams,
}: {
  searchParams: any
}) {
  const { orders, total, page, totalPages } = await getOrders(searchParams)

  const getStatusBadge = (status: string) => {
    const variants: any = {
      pending: 'secondary',
      confirmed: 'default',
      processing: 'default',
      shipped: 'default',
      delivered: 'default',
      cancelled: 'destructive',
      failed: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  const getPaymentBadge = (status: string) => {
    const variants: any = {
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'secondary',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground mt-1">
          Manage and process customer orders ({total} orders)
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number..."
                className="pl-9"
                defaultValue={searchParams.search}
              />
            </div>
            <select
              className="px-4 py-2 border rounded-md bg-background"
              defaultValue={searchParams.status || ''}
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="px-4 py-2 border rounded-md bg-background"
              defaultValue={searchParams.paymentStatus || ''}
            >
              <option value="">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Order Number
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <p className="text-muted-foreground">No orders found</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const shippingAddress = order.shippingAddress[0]
                    return (
                      <tr
                        key={order.id}
                        className="border-b hover:bg-muted/50"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="font-mono text-sm hover:text-primary"
                          >
                            #{order.orderNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-sm">
                              {shippingAddress
                                ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
                                : 'N/A'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.guestEmail}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm">
                            {order.items.length} item
                            {order.items.length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold">
                            {formatCurrency(Number(order.totalAmount))}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {getPaymentBadge(order.paymentStatus)}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/admin/orders/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of{' '}
                {total} orders
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  asChild
                >
                  <Link href={`/admin/orders?page=${page - 1}`}>Previous</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  asChild
                >
                  <Link href={`/admin/orders?page=${page + 1}`}>Next</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
