export interface User {
  id: string
  email: string
  emailVerified?: Date | null
  passwordHash?: string | null
  phone?: string | null
  phoneVerified: boolean
  firstName: string
  lastName: string
  avatarUrl?: string | null
  dateOfBirth?: Date | null
  gender?: string | null
  isActive: boolean
  isAdmin: boolean
  role: string
  provider?: string | null
  providerId?: string | null
  twoFactorEnabled: boolean
  twoFactorSecret?: string | null
  lastLogin?: Date | null
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export interface UserProfile extends User {
  fullName: string
  initials: string
}

export interface Address {
  id: string
  userId?: string | null
  orderId?: string | null
  firstName: string
  lastName: string
  phone: string
  email?: string | null
  addressLine1: string
  addressLine2?: string | null
  city: string
  state?: string | null
  postalCode?: string | null
  country: string
  addressType: 'shipping' | 'billing'
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  language: 'en' | 'ur'
  currency: 'PKR' | 'USD' | 'EUR'
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export interface UserStats {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  wishlistCount: number
  reviewsCount: number
}
