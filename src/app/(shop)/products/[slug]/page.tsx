import { getProductBySlug, getRelatedProducts } from '@/lib/services/product-service'
import { notFound } from 'next/navigation'
import { ProductImageGallery } from '@/components/product/ProductImageGallery'
import { ProductInfo } from '@/components/product/ProductInfo'
import { ProductTabs } from '@/components/product/ProductTabs'
import { ProductGrid } from '@/components/product/ProductGrid'

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

  return {
    title: `${product.name} | ShopAI`,
    description: product.shortDescription || product.description?.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || '',
      images: product.images?.[0]?.imageUrl ? [product.images[0].imageUrl] : [],
    },
  }
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
    </div>
  )
}
