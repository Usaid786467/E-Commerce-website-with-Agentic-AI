import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Search, Eye, Mail } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'

async function getCustomers(searchParams: any) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const skip = (page - 1) * limit

  const where: any = {
    role: 'customer',
  }

  if (searchParams.search) {
    where.OR = [
      { email: { contains: searchParams.search, mode: 'insensitive' } },
      { name: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  const [customers, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        createdAt: true,
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  // Get total spent for each customer
  const customersWithSpent = await Promise.all(
    customers.map(async (customer) => {
      const orderStats = await prisma.order.aggregate({
        where: {
          userId: customer.id,
          paymentStatus: 'paid',
        },
        _sum: {
          totalAmount: true,
        },
      })

      return {
        ...customer,
        totalSpent: Number(orderStats._sum.totalAmount || 0),
      }
    })
  )

  return {
    customers: customersWithSpent,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export default async function CustomersManagementPage({
  searchParams,
}: {
  searchParams: Promise<any>
}) {
  const params = await searchParams
  const { customers, total, page, totalPages } = await getCustomers(params)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground mt-1">
          Manage and view customer information ({total} customers)
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers by name or email..."
              className="pl-9"
              defaultValue={searchParams.search}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Orders
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Total Spent
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
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <p className="text-muted-foreground">No customers found</p>
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{customer.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">
                            ID: {customer.id.slice(0, 8)}...
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{customer.email}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">
                          {formatDate(customer.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium">{customer._count.orders}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">
                          {formatCurrency(customer.totalSpent)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {customer.emailVerified ? (
                          <Badge variant="default">Verified</Badge>
                        ) : (
                          <Badge variant="secondary">Unverified</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/customers/${customer.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={`mailto:${customer.email}`}>
                              <Mail className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, total)} of{' '}
                {total} customers
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  asChild
                >
                  <Link href={`/admin/customers?page=${page - 1}`}>
                    Previous
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  asChild
                >
                  <Link href={`/admin/customers?page=${page + 1}`}>Next</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
