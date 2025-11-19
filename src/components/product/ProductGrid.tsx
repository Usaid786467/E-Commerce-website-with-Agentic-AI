import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Array<{
    id: string
    name: string
    slug: string
    price: number
    compareAtPrice?: number | null
    images?: Array<{ imageUrl: string; altText?: string | null }>
    ratingAverage: number
    ratingCount: number
    stockStatus: string
    isSale?: boolean
    isNew?: boolean
    isFeatured?: boolean
  }>
  columns?: 2 | 3 | 4 | 5 | 6
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No products found</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
