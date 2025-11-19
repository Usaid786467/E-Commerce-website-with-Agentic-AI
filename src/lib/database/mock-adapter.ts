/**
 * Mock Database Adapter
 *
 * In-memory database implementation for testing and development
 * without requiring a real database connection
 */

import type { IDatabase, User, Product, Category, Order } from './types'

export class MockAdapter implements IDatabase {
  private users: Map<string, User> = new Map()
  private products: Map<string, Product> = new Map()
  private categories: Map<string, Category> = new Map()
  private orders: Map<string, Order> = new Map()

  constructor() {
    this.seedMockData()
  }

  private seedMockData() {
    // Mock Categories
    const categories: Category[] = [
      {
        id: 'cat-1',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        isActive: true,
      },
      {
        id: 'cat-2',
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing and accessories',
        isActive: true,
      },
      {
        id: 'cat-3',
        name: 'Home & Living',
        slug: 'home-living',
        isActive: true,
      },
    ]

    categories.forEach((cat) => this.categories.set(cat.id, cat))

    // Mock Products
    const products: Product[] = [
      {
        id: 'prod-1',
        name: 'Wireless Headphones',
        slug: 'wireless-headphones',
        description: 'Premium wireless headphones with noise cancellation',
        price: 15999,
        salePrice: 12999,
        sku: 'WH-001',
        brand: 'AudioTech',
        stockQuantity: 50,
        categoryId: 'cat-1',
        status: 'active',
        isFeatured: true,
        isNewArrival: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'prod-2',
        name: 'Smart Watch',
        slug: 'smart-watch',
        description: 'Advanced fitness tracker with heart rate monitor',
        price: 29999,
        sku: 'SW-001',
        brand: 'TechWear',
        stockQuantity: 30,
        categoryId: 'cat-1',
        status: 'active',
        isFeatured: true,
        isNewArrival: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'prod-3',
        name: 'Running Shoes',
        slug: 'running-shoes',
        description: 'Comfortable running shoes for all terrains',
        price: 8999,
        salePrice: 7499,
        sku: 'RS-001',
        brand: 'SportFit',
        stockQuantity: 100,
        categoryId: 'cat-2',
        status: 'active',
        isFeatured: false,
        isNewArrival: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    products.forEach((prod) => this.products.set(prod.id, prod))

    // Mock Users
    const users: User[] = [
      {
        id: 'user-1',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'user-2',
        email: 'customer@test.com',
        firstName: 'John',
        lastName: 'Doe',
        isAdmin: false,
        role: 'customer',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    users.forEach((user) => this.users.set(user.id, user))
  }

  async connect(): Promise<void> {
    console.log('📦 Mock database connected')
  }

  async disconnect(): Promise<void> {
    console.log('📦 Mock database disconnected')
  }

  async healthCheck(): Promise<boolean> {
    return true
  }

  // Users
  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find((u) => u.email === email) || null
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      isAdmin: data.isAdmin || false,
      role: data.role || 'customer',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.set(user.id, user)
    return user
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const existing = this.users.get(id)
    if (!existing) throw new Error('User not found')

    const updated = { ...existing, ...data, updatedAt: new Date() }
    this.users.set(id, updated)
    return updated
  }

  // Products
  async getProducts(params: any): Promise<{ products: Product[]; total: number }> {
    const { page = 1, limit = 20, search, categoryId } = params
    let products = Array.from(this.products.values())

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (categoryId) {
      products = products.filter((p) => p.categoryId === categoryId)
    }

    const total = products.length
    const start = (page - 1) * limit
    const paginatedProducts = products.slice(start, start + limit)

    return { products: paginatedProducts, total }
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.products.get(id) || null
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return Array.from(this.products.values()).find((p) => p.slug === slug) || null
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const product: Product = {
      id: `prod-${Date.now()}`,
      name: data.name || '',
      slug: data.slug || '',
      description: data.description || '',
      price: data.price || 0,
      salePrice: data.salePrice,
      sku: data.sku || '',
      brand: data.brand,
      stockQuantity: data.stockQuantity || 0,
      categoryId: data.categoryId || '',
      status: data.status || 'draft',
      isFeatured: data.isFeatured || false,
      isNewArrival: data.isNewArrival || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.products.set(product.id, product)
    return product
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const existing = this.products.get(id)
    if (!existing) throw new Error('Product not found')

    const updated = { ...existing, ...data, updatedAt: new Date() }
    this.products.set(id, updated)
    return updated
  }

  async deleteProduct(id: string): Promise<void> {
    this.products.delete(id)
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter((c) => c.isActive)
  }

  async getCategory(id: string): Promise<Category | null> {
    return this.categories.get(id) || null
  }

  // Orders
  async getOrders(params: any): Promise<{ orders: Order[]; total: number }> {
    let orders = Array.from(this.orders.values())

    if (params.userId) {
      orders = orders.filter((o) => o.userId === params.userId)
    }

    if (params.status) {
      orders = orders.filter((o) => o.status === params.status)
    }

    const total = orders.length
    const start = (params.page - 1) * params.limit
    const paginatedOrders = orders.slice(start, start + params.limit)

    return { orders: paginatedOrders, total }
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orders.get(id) || null
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    const order: Order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD-${Date.now()}`,
      userId: data.userId || '',
      totalAmount: data.totalAmount || 0,
      status: data.status || 'pending',
      paymentStatus: data.paymentStatus || 'pending',
      createdAt: new Date(),
    }
    this.orders.set(order.id, order)
    return order
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const existing = this.orders.get(id)
    if (!existing) throw new Error('Order not found')

    const updated = { ...existing, ...data }
    this.orders.set(id, updated)
    return updated
  }
}
