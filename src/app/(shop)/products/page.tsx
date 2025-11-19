import { getProducts } from '@/lib/services/product-service'
import { getRootCategories } from '@/lib/services/category-service'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters } from '@/components/product/ProductFilters'
import { ProductSort } from '@/components/product/ProductSort'
import { Pagination } from '@/components/ui/pagination'

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string
    categoryId?: string
    minPrice?: string
    maxPrice?: string
    brand?: string
    rating?: string
    sortBy?: string
    page?: string
  }>
}

export const metadata = {
  title: 'All Products | ShopAI',
  description: 'Browse our complete catalog of products with AI-powered recommendations',
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page) : 1
  const limit = 20

  const [productsData, categories] = await Promise.all([
    getProducts({
      search: params.search,
      categoryId: params.categoryId,
      minPrice: params.minPrice
        ? parseFloat(params.minPrice)
        : undefined,
      maxPrice: params.maxPrice
        ? parseFloat(params.maxPrice)
        : undefined,
      brand: params.brand?.split(','),
      rating: params.rating ? parseInt(params.rating) : undefined,
      sortBy: params.sortBy as any,
      page,
      limit,
    }),
    getRootCategories(),
  ])

  // Get unique brands from products for filter
  const brands = [
    ...new Set(
      productsData.products
        .map((p: any) => p.brand)
        .filter((b): b is string => !!b)
    ),
  ]

  return (
    <div className="container-wide section-padding">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-heading mb-2">
          {params.search
            ? `Search Results for "${params.search}"`
            : 'All Products'}
        </h1>
        <p className="text-muted-foreground">
          Showing {productsData.products.length} of {productsData.total} products
        </p>
      </div>

      {/* Layout: Filters + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1">
          <ProductFilters
            categories={categories as any}
            brands={brands}
            selectedFilters={{
              categoryId: params.categoryId,
              minPrice: params.minPrice,
              maxPrice: params.maxPrice,
              brand: params.brand?.split(','),
              rating: params.rating,
            }}
          />
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sort & View Options */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {page} of {productsData.totalPages}
            </div>
            <ProductSort currentSort={params.sortBy} />
          </div>

          {/* Products */}
          {productsData.products.length > 0 ? (
            <>
              <ProductGrid products={productsData.products as any} columns={3} />

              {/* Pagination */}
              {productsData.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={page}
                    totalPages={productsData.totalPages}
                    baseUrl="/products"
                    searchParams={params}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products found matching your criteria.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
