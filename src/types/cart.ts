import { Product, ProductVariant } from './product'
import { Decimal } from '@prisma/client/runtime/library'

export interface Cart {
  id: string
  userId?: string | null
  sessionId?: string | null
  expiresAt?: Date | null
  createdAt: Date
  updatedAt: Date
  items: CartItem[]
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  productVariantId?: string | null
  quantity: number
  price: number | Decimal
  createdAt: Date
  updatedAt: Date
  product?: Product
  productVariant?: ProductVariant | null
}

export interface CartSummary {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  itemsCount: number
}

export interface AddToCartInput {
  productId: string
  productVariantId?: string
  quantity: number
}

export interface UpdateCartItemInput {
  itemId: string
  quantity: number
}
