import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/ProductForm'

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      attributes: true,
      images: true,
    },
  })

  return product
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return categories
}

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([
    getProduct(params.id),
    getCategories(),
  ])

  if (!product) {
    notFound()
  }

  // Transform product data for the form
  const initialData = {
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    shortDescription: product.shortDescription || '',
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : undefined,
    sku: product.sku,
    brand: product.brand || '',
    stockQuantity: product.stockQuantity,
    categoryId: product.categoryId,
    status: product.status as 'draft' | 'active' | 'inactive',
    isFeatured: product.isFeatured,
    isNewArrival: product.isNewArrival,
    images: product.images.map((img) => img.imageUrl),
    variants: product.variants.map((v) => ({
      name: v.name,
      sku: v.sku,
      price: v.price ? Number(v.price) : undefined,
      stockQuantity: v.stockQuantity,
    })),
    attributes: product.attributes.map((a) => ({
      name: a.name,
      value: a.value,
    })),
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-muted-foreground mt-2">
          Update product information
        </p>
      </div>

      <ProductForm
        initialData={initialData}
        productId={params.id}
        categories={categories}
      />
    </div>
  )
}
