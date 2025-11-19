export * from './product'
export * from './user'
export * from './cart'
export * from './order'

// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  field?: string
}

// Search Types
export interface SearchResult<T> {
  items: T[]
  total: number
  query: string
  filters?: Record<string, any>
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  data?: any
  isRead: boolean
  link?: string | null
  createdAt: Date
}

// Review Types
export interface Review {
  id: string
  productId: string
  userId?: string | null
  orderItemId?: string | null
  rating: number
  title?: string | null
  comment?: string | null
  isVerifiedPurchase: boolean
  helpfulCount: number
  notHelpfulCount: number
  sentimentScore?: number | null
  status: 'pending' | 'approved' | 'rejected'
  sellerResponse?: string | null
  respondedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  images?: ReviewImage[]
  user?: {
    id: string
    firstName: string
    lastName: string
    avatarUrl?: string | null
  }
}

export interface ReviewImage {
  id: string
  reviewId: string
  imageUrl: string
  createdAt: Date
}

export interface CreateReviewInput {
  productId: string
  orderItemId?: string
  rating: number
  title?: string
  comment?: string
  images?: string[]
}

// Wishlist Types
export interface Wishlist {
  id: string
  userId: string
  name: string
  isDefault: boolean
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
  items: WishlistItem[]
}

export interface WishlistItem {
  id: string
  wishlistId: string
  productId: string
  productVariantId?: string | null
  addedAt: Date
  product?: any
  productVariant?: any
}

// Promotion Types
export interface Promotion {
  id: string
  name: string
  code?: string | null
  description?: string | null
  discountType: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_x_get_y'
  discountValue?: number | null
  minimumPurchaseAmount?: number | null
  minimumQuantity?: number | null
  maxUsageCount?: number | null
  usageCount: number
  maxUsagePerUser: number
  appliesTo: 'all' | 'specific_products' | 'specific_categories'
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Analytics Types
export interface DashboardStats {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  revenue: number
  revenueGrowth: number
  orderGrowth: number
  averageOrderValue: number
  conversionRate: number
  cartAbandonmentRate: number
}

export interface SalesChart {
  date: string
  sales: number
  orders: number
  revenue: number
}

export interface TopProduct {
  id: string
  name: string
  sales: number
  revenue: number
  image: string
}
