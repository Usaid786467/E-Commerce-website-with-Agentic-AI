import { prisma } from '@/lib/prisma'
import { ProductForm } from '@/components/admin/ProductForm'

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

export default async function AddProductPage() {
  const categories = await getCategories()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground mt-2">
          Create a new product in your catalog
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
