import { getProductBySlug, getRelatedProducts } from '@/lib/services/product-service'
import { notFound } from 'next/navigation'
import { ProductImageGallery } from '@/components/product/ProductImageGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { ProductTabs } from '@/components/product/ProductTabs'
import { ProductGrid } from '@/components/product/ProductGrid'
import { generateSEO, generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo'
import Script from 'next/script'

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const firstImage = product.images?.[0]?.imageUrl

  return generateSEO({
    title: product.name,
    description: product.shortDescription || product.description?.substring(0, 160) || `Buy ${product.name} at the best price. ${product.stockQuantity > 0 ? 'In stock' : 'Out of stock'}. Shop now!`,
    image: firstImage,
    url: `/products/${product.slug}`,
    type: 'product',
  })
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.categoryId,
    4
  )

  // Generate breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Products', url: '/products' },
    { name: product.name, url: `/products/${product.slug}` },
  ]

  // Generate product schema data
  const productSchemaData = generateProductSchema({
    name: product.name,
    description: product.description || product.shortDescription || '',
    image: product.images?.[0]?.imageUrl,
    price: Number(product.salePrice || product.price),
    currency: 'PKR',
    sku: product.sku,
    brand: product.brand || undefined,
    ratingValue: product.ratingAverage ? Number(product.ratingAverage) : undefined,
    ratingCount: product.ratingCount || undefined,
    availability: product.stockQuantity > 0 ? 'InStock' : 'OutOfStock',
    condition: 'NewCondition',
  })

  return (
    <div className="container-wide section-padding">
      {/* Product Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
        {/* Image Gallery */}
        <ProductImageGallery images={product.images || []} productName={product.name} />

        {/* Product Info */}
        <ProductInfo product={product as any} />
      </div>

      {/* Product Details Tabs */}
      <ProductTabs
        description={product.description || ''}
        attributes={product.attributes || []}
        reviews={product.reviews || []}
        productId={product.id}
      />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold font-heading mb-6">
            You May Also Like
          </h2>
          <ProductGrid products={relatedProducts as any} columns={4} />
        </div>
      )}

      {/* Structured Data for SEO */}
      <Script id="product-schema" type="application/ld+json">
        {JSON.stringify(productSchemaData)}
      </Script>
      <Script id="breadcrumb-schema" type="application/ld+json">
        {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
      </Script>
    </div>
  )
}
