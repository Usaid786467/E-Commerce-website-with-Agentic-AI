import { Address } from './user'
import { Product, ProductVariant } from './product'
import { Decimal } from '@prisma/client/runtime/library'

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
  | 'failed'
  | 'on_hold'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type PaymentMethod =
  | 'easypaisa'
  | 'jazzcash'
  | 'card'
  | 'bank_transfer'
  | 'cod'
  | 'paypal'
  | 'stripe'

export interface Order {
  id: string
  orderNumber: string
  userId?: string | null
  guestEmail?: string | null
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number | Decimal
  discountAmount: number | Decimal
  shippingCost: number | Decimal
  taxAmount: number | Decimal
  totalAmount: number | Decimal
  currency: string
  paymentMethod?: PaymentMethod | null
  paymentId?: string | null
  shippingMethod?: string | null
  trackingNumber?: string | null
  courierName?: string | null
  estimatedDelivery?: Date | null
  deliveredAt?: Date | null
  notes?: string | null
  customerNotes?: string | null
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
  updatedAt: Date
  items: OrderItem[]
  shippingAddress?: Address[]
  payments?: Payment[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId?: string | null
  productVariantId?: string | null
  productName: string
  productSku?: string | null
  variantName?: string | null
  quantity: number
  unitPrice: number | Decimal
  subtotal: number | Decimal
  discountAmount: number | Decimal
  total: number | Decimal
  createdAt: Date
  product?: Product | null
  productVariant?: ProductVariant | null
}

export interface Payment {
  id: string
  orderId: string
  paymentMethod: PaymentMethod
  paymentGateway?: string | null
  transactionId?: string | null
  amount: number | Decimal
  currency: string
  status: PaymentStatus
  paymentData?: any
  errorMessage?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderInput {
  items: {
    productId: string
    productVariantId?: string
    quantity: number
    price: number
  }[]
  shippingAddress: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>
  billingAddress?: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>
  paymentMethod: PaymentMethod
  shippingMethod: string
  customerNotes?: string
  promoCode?: string
}

export interface OrderTracking {
  orderNumber: string
  status: OrderStatus
  trackingNumber?: string | null
  courierName?: string | null
  estimatedDelivery?: Date | null
  timeline: OrderTimeline[]
}

export interface OrderTimeline {
  status: OrderStatus
  message: string
  timestamp: Date
  location?: string
}
