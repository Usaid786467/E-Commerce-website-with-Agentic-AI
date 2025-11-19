import { getDatabase } from '@/lib/database'
import { Product, ProductFilter, ProductListResponse } from '@/types'

/**
 * Get paginated products with filters
 */
export async function getProducts(
  filter: ProductFilter = {}
): Promise<ProductListResponse> {
  const db = getDatabase()

  // Use database abstraction layer
  const result = await db.getProducts(filter)

  return {
    products: result.products as any,
    total: result.total,
    page: filter.page || 1,
    limit: filter.limit || 20,
    totalPages: Math.ceil(result.total / (filter.limit || 20)),
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string) {
  const db = getDatabase()
  return db.getProductById(id)
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string) {
  const db = getDatabase()
  return db.getProductBySlug(slug)
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 8) {
  const db = getDatabase()
  return db.getFeaturedProducts(limit)
}

/**
 * Get new arrivals
 */
export async function getNewArrivals(limit: number = 8) {
  const db = getDatabase()
  return db.getNewArrivals(limit)
}

/**
 * Get related products
 */
export async function getRelatedProducts(
  productId: string,
  categoryId?: string | null,
  limit: number = 4
) {
  if (!categoryId) {
    return []
  }

  const db = getDatabase()
  return db.getRelatedProducts(productId, categoryId, limit)
}

/**
 * Track product view
 */
export async function trackProductView(
  productId: string,
  userId?: string | null,
  sessionId?: string,
  data?: {
    ipAddress?: string
    userAgent?: string
    referrer?: string
  }
) {
  // For localStorage adapter, this is a no-op
  // For real database, this would create a view record
  const db = getDatabase()

  // Most database adapters may not implement this
  // So we just return a mock response
  return {
    id: `view-${Date.now()}`,
    productId,
    userId,
    sessionId,
    createdAt: new Date(),
  }
}

/**
 * Get product availability
 */
export async function checkProductAvailability(
  productId: string,
  variantId?: string,
  quantity: number = 1
): Promise<{
  available: boolean
  stockQuantity: number
  message?: string
}> {
  const db = getDatabase()
  const product = await db.getProductById(productId)

  if (!product || product.status !== 'published') {
    return {
      available: false,
      stockQuantity: 0,
      message: 'Product not available',
    }
  }

  if (!product.trackInventory) {
    return {
      available: true,
      stockQuantity: 9999,
      message: 'In stock',
    }
  }

  return {
    available: product.stockQuantity >= quantity,
    stockQuantity: product.stockQuantity,
    message:
      product.stockQuantity >= quantity ? 'In stock' : 'Insufficient stock',
  }
}
