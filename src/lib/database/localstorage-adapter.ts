/**
 * LocalStorage Database Adapter
 *
 * Complete database implementation using browser localStorage
 * Perfect for testing without any database setup!
 *
 * Features:
 * - Persists across page refreshes
 * - Pre-seeded with test data
 * - Full CRUD operations
 * - No backend required!
 */

import type { IDatabase, User, Product, Category, Order } from './types'

const STORAGE_PREFIX = 'ecommerce_'

class LocalStorageDB {
  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue

    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  }

  private setItem(key: string, value: any): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.error('LocalStorage full:', e)
    }
  }

  // Generic CRUD operations
  getAll<T>(entity: string): T[] {
    return this.getItem<T[]>(entity, [])
  }

  getById<T extends { id: string }>(entity: string, id: string): T | null {
    const items = this.getAll<T>(entity)
    return items.find(item => item.id === id) || null
  }

  create<T extends { id: string }>(entity: string, data: T): T {
    const items = this.getAll<T>(entity)
    items.push(data)
    this.setItem(entity, items)
    return data
  }

  update<T extends { id: string }>(entity: string, id: string, data: Partial<T>): T | null {
    const items = this.getAll<T>(entity)
    const index = items.findIndex(item => item.id === id)

    if (index === -1) return null

    items[index] = { ...items[index], ...data }
    this.setItem(entity, items)
    return items[index]
  }

  delete(entity: string, id: string): boolean {
    const items = this.getAll<any>(entity)
    const filtered = items.filter(item => item.id !== id)

    if (filtered.length === items.length) return false

    this.setItem(entity, filtered)
    return true
  }

  query<T>(entity: string, predicate: (item: T) => boolean): T[] {
    const items = this.getAll<T>(entity)
    return items.filter(predicate)
  }

  count(entity: string): number {
    return this.getAll(entity).length
  }

  clear(entity: string): void {
    this.setItem(entity, [])
  }

  clearAll(): void {
    if (typeof window === 'undefined') return

    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  }
}

export class LocalStorageAdapter implements IDatabase {
  private db: LocalStorageDB

  constructor() {
    this.db = new LocalStorageDB()
    this.seedDataIfEmpty()
  }

  private seedDataIfEmpty() {
    // Only seed if no data exists
    if (this.db.count('users') === 0) {
      this.seedUsers()
    }
    if (this.db.count('categories') === 0) {
      this.seedCategories()
    }
    if (this.db.count('products') === 0) {
      this.seedProducts()
    }
  }

  private seedUsers() {
    const users: User[] = [
      {
        id: 'user-admin-001',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        isAdmin: true,
        role: 'admin',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'user-customer-001',
        email: 'customer@test.com',
        firstName: 'John',
        lastName: 'Doe',
        isAdmin: false,
        role: 'customer',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 'user-customer-002',
        email: 'jane@test.com',
        firstName: 'Jane',
        lastName: 'Smith',
        isAdmin: false,
        role: 'customer',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-01'),
      },
    ]

    users.forEach(user => this.db.create('users', user))
    console.log('✅ Seeded users:', users.length)
  }

  private seedCategories() {
    const categories: Category[] = [
      {
        id: 'cat-electronics-001',
        name: 'Electronics',
        slug: 'electronics',
        description: 'Latest electronic devices and gadgets',
        isActive: true,
      },
      {
        id: 'cat-phones-001',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Latest smartphones and mobile devices',
        parentId: 'cat-electronics-001',
        isActive: true,
      },
      {
        id: 'cat-laptops-001',
        name: 'Laptops',
        slug: 'laptops',
        description: 'High-performance laptops and notebooks',
        parentId: 'cat-electronics-001',
        isActive: true,
      },
      {
        id: 'cat-audio-001',
        name: 'Audio',
        slug: 'audio',
        description: 'Headphones, speakers, and audio equipment',
        parentId: 'cat-electronics-001',
        isActive: true,
      },
      {
        id: 'cat-fashion-001',
        name: 'Fashion',
        slug: 'fashion',
        description: 'Clothing, shoes, and accessories',
        isActive: true,
      },
      {
        id: 'cat-home-001',
        name: 'Home & Living',
        slug: 'home-living',
        description: 'Furniture and home decor',
        isActive: true,
      },
    ]

    categories.forEach(cat => this.db.create('categories', cat))
    console.log('✅ Seeded categories:', categories.length)
  }

  private seedProducts() {
    const products: Product[] = [
      {
        id: 'prod-iphone15-001',
        name: 'iPhone 15 Pro',
        slug: 'iphone-15-pro',
        description: 'Latest iPhone 15 Pro with A17 Pro chip, titanium design, and advanced camera system. Experience the ultimate in smartphone technology with groundbreaking features.',
        price: 449999,
        salePrice: 429999,
        sku: 'IPH15PRO-001',
        brand: 'Apple',
        stockQuantity: 50,
        categoryId: 'cat-phones-001',
        status: 'active',
        isFeatured: true,
        isNewArrival: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: 'prod-macbook-001',
        name: 'MacBook Pro 14"',
        slug: 'macbook-pro-14',
        description: 'Supercharged by M3 Pro chip. The most advanced Mac laptop for demanding workflows. Perfect for professionals and creatives.',
        price: 599999,
        sku: 'MBP14-001',
        brand: 'Apple',
        stockQuantity: 25,
        categoryId: 'cat-laptops-001',
        status: 'active',
        isFeatured: true,
        isNewArrival: true,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
      {
        id: 'prod-airpods-001',
        name: 'AirPods Pro (2nd Gen)',
        slug: 'airpods-pro-2nd-gen',
        description: 'Active Noise Cancellation, Adaptive Audio, and Personalized Spatial Audio. Up to 2x more noise cancellation than before.',
        price: 74999,
        salePrice: 69999,
        sku: 'AIRPODS-PRO2',
        brand: 'Apple',
        stockQuantity: 100,
        categoryId: 'cat-audio-001',
        status: 'active',
        isFeatured: true,
        isNewArrival: false,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05'),
      },
      {
        id: 'prod-galaxy-001',
        name: 'Samsung Galaxy S24 Ultra',
        slug: 'samsung-galaxy-s24-ultra',
        description: 'The ultimate Samsung Galaxy with AI-powered features, 200MP camera, and S Pen. Titanium frame with superior durability.',
        price: 419999,
        salePrice: 399999,
        sku: 'S24-ULTRA-001',
        brand: 'Samsung',
        stockQuantity: 40,
        categoryId: 'cat-phones-001',
        status: 'active',
        isFeatured: true,
        isNewArrival: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
      {
        id: 'prod-sony-xm5-001',
        name: 'Sony WH-1000XM5',
        slug: 'sony-wh-1000xm5',
        description: 'Industry-leading noise canceling headphones with exceptional sound quality and all-day comfort. Perfect for music lovers.',
        price: 89999,
        sku: 'SONY-XM5-001',
        brand: 'Sony',
        stockQuantity: 60,
        categoryId: 'cat-audio-001',
        status: 'active',
        isFeatured: false,
        isNewArrival: false,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
      },
      {
        id: 'prod-dell-xps-001',
        name: 'Dell XPS 13',
        slug: 'dell-xps-13',
        description: 'Ultra-portable 13-inch laptop with stunning InfinityEdge display and powerful performance. Perfect for productivity.',
        price: 299999,
        sku: 'DELL-XPS13-001',
        brand: 'Dell',
        stockQuantity: 30,
        categoryId: 'cat-laptops-001',
        status: 'active',
        isFeatured: false,
        isNewArrival: false,
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-18'),
      },
    ]

    products.forEach(product => this.db.create('products', product))
    console.log('✅ Seeded products:', products.length)
  }

  async connect(): Promise<void> {
    console.log('📦 LocalStorage database connected')
  }

  async disconnect(): Promise<void> {
    console.log('📦 LocalStorage database disconnected')
  }

  async healthCheck(): Promise<boolean> {
    return typeof window !== 'undefined' && !!localStorage
  }

  // Users
  async getUser(id: string): Promise<User | null> {
    return this.db.getById<User>('users', id)
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const users = this.db.query<User>('users', user => user.email === email)
    return users[0] || null
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
    return this.db.create('users', user)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const updated = this.db.update<User>('users', id, { ...data, updatedAt: new Date() })
    if (!updated) throw new Error('User not found')
    return updated
  }

  // Products
  async getProducts(params: any): Promise<{ products: Product[]; total: number }> {
    const { page = 1, limit = 20, search, categoryId, minPrice, maxPrice, brand, rating, sortBy } = params

    let products = this.db.getAll<Product>('products')

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (categoryId) {
      products = products.filter(p => p.categoryId === categoryId)
    }

    // Filter by price range
    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= minPrice)
    }
    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= maxPrice)
    }

    // Filter by brand
    if (brand && Array.isArray(brand) && brand.length > 0) {
      products = products.filter(p => brand.includes(p.brand || ''))
    }

    // Sort
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          products.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          products.sort((a, b) => b.price - a.price)
          break
        case 'name_asc':
          products.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name_desc':
          products.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'newest':
          products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
      }
    }

    const total = products.length
    const start = (page - 1) * limit
    const paginatedProducts = products.slice(start, start + limit)

    return { products: paginatedProducts, total }
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.db.getById<Product>('products', id)
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const products = this.db.query<Product>('products', p => p.slug === slug)
    return products[0] || null
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
    return this.db.create('products', product)
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const updated = this.db.update<Product>('products', id, { ...data, updatedAt: new Date() })
    if (!updated) throw new Error('Product not found')
    return updated
  }

  async deleteProduct(id: string): Promise<void> {
    const deleted = this.db.delete('products', id)
    if (!deleted) throw new Error('Product not found')
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.getProduct(id)
  }

  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const products = this.db.query<Product>('products', p => p.isFeatured && p.status === 'active')
    return products.slice(0, limit)
  }

  async getNewArrivals(limit: number = 8): Promise<Product[]> {
    const products = this.db.query<Product>('products', p => p.isNewArrival && p.status === 'active')
    // Sort by creation date
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return products.slice(0, limit)
  }

  async getRelatedProducts(productId: string, categoryId: string, limit: number = 4): Promise<Product[]> {
    const products = this.db.query<Product>(
      'products',
      p => p.categoryId === categoryId && p.id !== productId && p.status === 'active'
    )
    return products.slice(0, limit)
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.db.query<Category>('categories', c => c.isActive)
  }

  async getRootCategories(): Promise<Category[]> {
    return this.db.query<Category>('categories', c => c.isActive && !c.parentId)
  }

  async getCategory(id: string): Promise<Category | null> {
    return this.db.getById<Category>('categories', id)
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.getCategory(id)
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const categories = this.db.query<Category>('categories', c => c.slug === slug)
    return categories[0] || null
  }

  // Orders
  async getOrders(params: any): Promise<{ orders: Order[]; total: number }> {
    const { page = 1, limit = 20, userId, status } = params

    let orders = this.db.getAll<Order>('orders')

    if (userId) {
      orders = orders.filter(o => o.userId === userId)
    }

    if (status) {
      orders = orders.filter(o => o.status === status)
    }

    const total = orders.length
    const start = (page - 1) * limit
    const paginatedOrders = orders.slice(start, start + limit)

    return { orders: paginatedOrders, total }
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.db.getById<Order>('orders', id)
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
    return this.db.create('orders', order)
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const updated = this.db.update<Order>('orders', id, data)
    if (!updated) throw new Error('Order not found')
    return updated
  }
}
