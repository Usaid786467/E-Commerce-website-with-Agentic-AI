import { PaymentMethod } from './order'

export type CheckoutStep = 'shipping' | 'payment' | 'review'

export interface ShippingFormData {
  // Contact Information
  email: string
  phone: string

  // Shipping Address
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string

  // Shipping Method
  shippingMethod: string

  // Optional
  saveAddress?: boolean
  sameAsBilling?: boolean
}

export interface BillingFormData {
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface PaymentFormData {
  paymentMethod: PaymentMethod

  // Card details (for Stripe)
  cardNumber?: string
  cardExpiry?: string
  cardCvc?: string
  cardholderName?: string

  // Mobile wallet details
  mobileNumber?: string

  // Notes
  orderNotes?: string
}

export interface CheckoutState {
  currentStep: CheckoutStep
  shippingData: Partial<ShippingFormData>
  paymentData: Partial<PaymentFormData>
  billingData: Partial<BillingFormData>
  isProcessing: boolean
}

export interface ShippingMethodOption {
  id: string
  name: string
  description: string
  estimatedDays: string
  price: number
}

export const SHIPPING_METHODS: ShippingMethodOption[] = [
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Delivered within 5-7 business days',
    estimatedDays: '5-7 days',
    price: 200,
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Delivered within 2-3 business days',
    estimatedDays: '2-3 days',
    price: 500,
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    description: 'Next business day delivery',
    estimatedDays: '1 day',
    price: 1000,
  },
  {
    id: 'pickup',
    name: 'Store Pickup',
    description: 'Pick up from nearest store',
    estimatedDays: 'Ready in 2 hours',
    price: 0,
  },
]

export const PAYMENT_METHOD_OPTIONS = [
  {
    id: 'stripe' as PaymentMethod,
    name: 'Credit/Debit Card',
    description: 'Pay securely with your credit or debit card',
    icon: 'CreditCard',
    supported: true,
  },
  {
    id: 'easypaisa' as PaymentMethod,
    name: 'EasyPaisa',
    description: 'Pay with your EasyPaisa wallet',
    icon: 'Smartphone',
    supported: true,
  },
  {
    id: 'jazzcash' as PaymentMethod,
    name: 'JazzCash',
    description: 'Pay with your JazzCash wallet',
    icon: 'Smartphone',
    supported: true,
  },
  {
    id: 'cod' as PaymentMethod,
    name: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: 'Banknote',
    supported: true,
  },
  {
    id: 'bank_transfer' as PaymentMethod,
    name: 'Bank Transfer',
    description: 'Direct bank transfer',
    icon: 'Building2',
    supported: false,
  },
]

export const COUNTRIES = [
  { code: 'PK', name: 'Pakistan' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
]

export const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Gilgit-Baltistan',
  'Azad Kashmir',
  'Islamabad Capital Territory',
]
