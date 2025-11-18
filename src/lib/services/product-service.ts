import { prisma } from '@/lib/prisma'
import { Product, ProductFilter, ProductListResponse } from '@/types'
import { Prisma } from '@prisma/client'

/**
 * Get paginated products with filters
 */
export async function getProducts(
  filter: ProductFilter = {}
): Promise<ProductListResponse> {
  const {
    search,
    categoryId,
    minPrice,
    maxPrice,
    brand,
    rating,
    stockStatus,
    sortBy = 'relevance',
    page = 1,
    limit = 20,
  } = filter

  // Build where clause
  const where: Prisma.ProductWhereInput = {
    status: 'published',
    deletedAt: null,
  }

  // Search filter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
    ]
  }

  // Category filter
  if (categoryId) {
    where.categoryId = categoryId
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) {
      where.price.gte = minPrice
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice
    }
  }

  // Brand filter
  if (brand && brand.length > 0) {
    where.brand = { in: brand }
  }

  // Rating filter
  if (rating) {
    where.ratingAverage = { gte: rating }
  }

  // Stock status filter
  if (stockStatus && stockStatus.length > 0) {
    where.stockStatus = { in: stockStatus }
  }

  // Build order by clause
  let orderBy: Prisma.ProductOrderByWithRelationInput = {}

  switch (sortBy) {
    case 'price-asc':
      orderBy = { price: 'asc' }
      break
    case 'price-desc':
      orderBy = { price: 'desc' }
      break
    case 'newest':
      orderBy = { createdAt: 'desc' }
      break
    case 'bestselling':
      orderBy = { salesCount: 'desc' }
      break
    case 'top-rated':
      orderBy = { ratingAverage: 'desc' }
      break
    default:
      orderBy = { viewsCount: 'desc' }
  }

  // Calculate pagination
  const skip = (page - 1) * limit

  // Execute queries
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { sortOrder: 'asc' },
          take: 5,
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: products as any,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
      attributes: true,
      category: true,
      reviews: {
        where: { status: 'approved' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          images: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (product) {
    // Increment view count
    await prisma.product.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    })
  }

  return product
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      variants: {
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      },
      attributes: true,
      category: true,
      reviews: {
        where: { status: 'approved' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
          images: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  })

  if (product) {
    // Increment view count
    await prisma.product.update({
      where: { slug },
      data: { viewsCount: { increment: 1 } },
    })
  }

  return product
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 8) {
  return prisma.product.findMany({
    where: {
      isFeatured: true,
      status: 'published',
      deletedAt: null,
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { viewsCount: 'desc' },
    take: limit,
  })
}

/**
 * Get new arrivals
 */
export async function getNewArrivals(limit: number = 8) {
  return prisma.product.findMany({
    where: {
      isNew: true,
      status: 'published',
      deletedAt: null,
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })
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

  return prisma.product.findMany({
    where: {
      categoryId,
      id: { not: productId },
      status: 'published',
      deletedAt: null,
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
    },
    orderBy: { viewsCount: 'desc' },
    take: limit,
  })
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
  return prisma.productView.create({
    data: {
      productId,
      userId,
      sessionId,
      ipAddress: data?.ipAddress,
      userAgent: data?.userAgent,
      referrer: data?.referrer,
    },
  })
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
  if (variantId) {
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    })

    if (!variant || !variant.isActive) {
      return {
        available: false,
        stockQuantity: 0,
        message: 'Product variant not available',
      }
    }

    return {
      available: variant.stockQuantity >= quantity,
      stockQuantity: variant.stockQuantity,
      message:
        variant.stockQuantity >= quantity
          ? 'In stock'
          : 'Insufficient stock',
    }
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

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
