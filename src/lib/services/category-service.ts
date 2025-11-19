import { getDatabase } from '@/lib/database'

/**
 * Get all active categories with hierarchy
 */
export async function getCategories() {
  const db = getDatabase()
  return db.getCategories()
}

/**
 * Get root categories (no parent)
 */
export async function getRootCategories() {
  const db = getDatabase()
  return db.getRootCategories()
}

/**
 * Get category by slug with full hierarchy
 */
export async function getCategoryBySlug(slug: string) {
  const db = getDatabase()
  return db.getCategoryBySlug(slug)
}

/**
 * Get category breadcrumbs
 */
export async function getCategoryBreadcrumbs(categoryId: string) {
  const db = getDatabase()
  const breadcrumbs: Array<{
    id: string
    name: string
    slug: string
  }> = []

  let currentCategory = await db.getCategoryById(categoryId)

  while (currentCategory) {
    breadcrumbs.unshift({
      id: currentCategory.id,
      name: currentCategory.name,
      slug: currentCategory.slug,
    })

    if (currentCategory.parentId) {
      currentCategory = await db.getCategoryById(currentCategory.parentId)
    } else {
      break
    }
  }

  return breadcrumbs
}
