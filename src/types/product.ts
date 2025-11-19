import { Decimal } from '@prisma/client/runtime/library'

export interface Product {
  id: string
  name: string
  slug: string
  sku: string
  barcode?: string | null
  brand?: string | null
  shortDescription?: string | null
  description?: string | null
  price: number | Decimal
  compareAtPrice?: number | Decimal | null
  cost?: number | Decimal | null
  weight?: number | Decimal | null
  categoryId?: string | null
  stockQuantity: number
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'pre_order'
  lowStockThreshold: number
  trackInventory: boolean
  allowBackorder: boolean
  isFeatured: boolean
  isNew: boolean
  isSale: boolean
  status: 'draft' | 'published' | 'archived'
  publishDate?: Date | null
  viewsCount: number
  salesCount: number
  ratingAverage: number | Decimal
  ratingCount: number
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
  images?: ProductImage[]
  variants?: ProductVariant[]
  attributes?: ProductAttribute[]
  category?: Category | null
}

export interface ProductImage {
  id: string
  productId: string
  imageUrl: string
  altText?: string | null
  sortOrder: number
  isPrimary: boolean
  createdAt: Date
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  barcode?: string | null
  name: string
  price?: number | Decimal | null
  compareAtPrice?: number | Decimal | null
  cost?: number | Decimal | null
  stockQuantity: number
  weight?: number | Decimal | null
  imageUrl?: string | null
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductAttribute {
  id: string
  productId: string
  attributeName: string
  attributeValue: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string | null
  parentId?: string | null
  imageUrl?: string | null
  bannerUrl?: string | null
  icon?: string | null
  sortOrder: number
  isActive: boolean
  metaTitle?: string | null
  metaDescription?: string | null
  metaKeywords?: string | null
  createdAt: Date
  updatedAt: Date
  parent?: Category | null
  children?: Category[]
}

export interface ProductFilter {
  search?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  brand?: string[]
  rating?: number
  stockStatus?: string[]
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'bestselling' | 'top-rated'
  page?: number
  limit?: number
}

export interface ProductListResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
}
