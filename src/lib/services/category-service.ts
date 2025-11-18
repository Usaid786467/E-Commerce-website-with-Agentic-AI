import { prisma } from '@/lib/prisma'

/**
 * Get all active categories with hierarchy
 */
export async function getCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    include: {
      parent: true,
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * Get root categories (no parent)
 */
export async function getRootCategories() {
  return prisma.category.findMany({
    where: {
      isActive: true,
      parentId: null,
    },
    include: {
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * Get category by slug with full hierarchy
 */
export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      parent: true,
      children: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
    },
  })
}

/**
 * Get category breadcrumbs
 */
export async function getCategoryBreadcrumbs(categoryId: string) {
  const breadcrumbs: Array<{
    id: string
    name: string
    slug: string
  }> = []

  let currentCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { parent: true },
  })

  while (currentCategory) {
    breadcrumbs.unshift({
      id: currentCategory.id,
      name: currentCategory.name,
      slug: currentCategory.slug,
    })

    if (currentCategory.parentId) {
      currentCategory = await prisma.category.findUnique({
        where: { id: currentCategory.parentId },
        include: { parent: true },
      })
    } else {
      break
    }
  }

  return breadcrumbs
}
