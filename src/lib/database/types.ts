/**
 * Database Abstraction Layer - Types
 *
 * This file defines interfaces for database operations
 * allowing easy switching between different database providers
 * (Prisma, Supabase, MongoDB, etc.)
 */

export type DatabaseProvider = 'prisma' | 'supabase' | 'mock' | 'localstorage'

export interface DatabaseConfig {
  provider: DatabaseProvider
  url?: string
  options?: Record<string, any>
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  sku: string
  brand?: string
  stockQuantity: number
  categoryId: string
  status: string
  isFeatured: boolean
  isNewArrival: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  isActive: boolean
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  totalAmount: number
  status: string
  paymentStatus: string
  createdAt: Date
}

/**
 * Database Interface
 * Implement this interface for each database provider
 */
export interface IDatabase {
  // Users
  getUser(id: string): Promise<User | null>
  getUserByEmail(email: string): Promise<User | null>
  createUser(data: Partial<User>): Promise<User>
  updateUser(id: string, data: Partial<User>): Promise<User>

  // Products
  getProducts(params: any): Promise<{ products: Product[]; total: number }>
  getProduct(id: string): Promise<Product | null>
  getProductById(id: string): Promise<Product | null>
  getProductBySlug(slug: string): Promise<Product | null>
  getFeaturedProducts(limit?: number): Promise<Product[]>
  getNewArrivals(limit?: number): Promise<Product[]>
  getRelatedProducts(productId: string, categoryId: string, limit?: number): Promise<Product[]>
  createProduct(data: Partial<Product>): Promise<Product>
  updateProduct(id: string, data: Partial<Product>): Promise<Product>
  deleteProduct(id: string): Promise<void>

  // Categories
  getCategories(): Promise<Category[]>
  getRootCategories(): Promise<Category[]>
  getCategory(id: string): Promise<Category | null>
  getCategoryById(id: string): Promise<Category | null>
  getCategoryBySlug(slug: string): Promise<Category | null>

  // Orders
  getOrders(params: any): Promise<{ orders: Order[]; total: number }>
  getOrder(id: string): Promise<Order | null>
  createOrder(data: Partial<Order>): Promise<Order>
  updateOrder(id: string, data: Partial<Order>): Promise<Order>

  // Connection
  connect(): Promise<void>
  disconnect(): Promise<void>
  healthCheck(): Promise<boolean>
}
