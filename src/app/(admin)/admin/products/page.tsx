import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { DeleteProductButton } from '@/components/admin/DeleteProductButton'

async function getProducts(searchParams: any) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20
  const skip = (page - 1) * limit

  const where: any = {}

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { sku: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  if (searchParams.status) {
    where.status = searchParams.status
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: {
          select: { name: true },
        },
        images: {
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export default async function ProductsManagementPage({
  searchParams,
}: {
  searchParams: any
}) {
  const { products, total, page, totalPages } = await getProducts(searchParams)

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (stock <= 10) {
      return <Badge variant="secondary">Low Stock ({stock})</Badge>
    }
    return <Badge variant="default">In Stock ({stock})</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: any = {
      published: 'default',
      draft: 'secondary',
      archived: 'destructive',
    }
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog ({total} products)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/add">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                className="pl-9"
                defaultValue={searchParams.search}
              />
            </div>
            <select className="px-4 py-2 border rounded-md bg-background">
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select className="px-4 py-2 border rounded-md bg-background">
              <option value="">All Categories</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Stock
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
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <p className="text-muted-foreground">No products found</p>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-muted">
                            {product.images[0] ? (
                              <Image
                                src={product.images[0].imageUrl}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Eye className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {product.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm">{product.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">
                          {product.category?.name || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">
                          {formatCurrency(Number(product.price))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {getStockBadge(product.stockQuantity)}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(product.status)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/products/${product.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteProductButton
                            productId={product.id}
                            productName={product.name}
                          />
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
                {total} products
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  asChild
                >
                  <Link href={`/admin/products?page=${page - 1}`}>Previous</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  asChild
                >
                  <Link href={`/admin/products?page=${page + 1}`}>Next</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
