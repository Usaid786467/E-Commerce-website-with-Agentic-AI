/**
 * Supabase Database Adapter
 *
 * Implements the database interface using Supabase Client
 * Alternative to Prisma for direct Supabase usage
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { IDatabase, User, Product, Category, Order } from './types'

export class SupabaseAdapter implements IDatabase {
  private client: SupabaseClient

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    this.client = createClient(supabaseUrl, supabaseKey)
  }

  async connect(): Promise<void> {
    // Supabase client is always connected
  }

  async disconnect(): Promise<void> {
    // No explicit disconnect needed for Supabase
  }

  async healthCheck(): Promise<boolean> {
    try {
      const { error } = await this.client.from('users').select('count').limit(1)
      return !error
    } catch {
      return false
    }
  }

  // Users
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data as User
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) return null
    return data as User
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const { data, error } = await this.client
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) throw error
    return data as User
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await this.client
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as User
  }

  // Products
  async getProducts(params: any): Promise<{ products: Product[]; total: number }> {
    const { page = 1, limit = 20, search, categoryId } = params
    const offset = (page - 1) * limit

    let query = this.client.from('products').select('*, category(*), images(*)', { count: 'exact' })

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1)

    if (error) throw error

    return {
      products: (data || []) as any,
      total: count || 0,
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*, category(*), images(*), variants(*), attributes(*)')
      .eq('id', id)
      .single()

    if (error) return null
    return data as any
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from('products')
      .select('*, category(*), images(*), variants(*), attributes(*), reviews(*, user(*))')
      .eq('slug', slug)
      .single()

    if (error) return null
    return data as any
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const { data, error } = await this.client
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (error) throw error
    return data as any
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const { data, error } = await this.client
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as any
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await this.client.from('products').delete().eq('id', id)

    if (error) throw error
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')

    if (error) throw error
    return (data || []) as any
  }

  async getCategory(id: string): Promise<Category | null> {
    const { data, error } = await this.client
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data as any
  }

  // Orders
  async getOrders(params: any): Promise<{ orders: Order[]; total: number }> {
    const { page = 1, limit = 20, userId, status } = params
    const offset = (page - 1) * limit

    let query = this.client
      .from('orders')
      .select('*, user(*), items(*)', { count: 'exact' })

    if (userId) query = query.eq('user_id', userId)
    if (status) query = query.eq('status', status)

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return {
      orders: (data || []) as any,
      total: count || 0,
    }
  }

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await this.client
      .from('orders')
      .select('*, user(*), items(*, product(*)), shipping_address(*)')
      .eq('id', id)
      .single()

    if (error) return null
    return data as any
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .insert(orderData)
      .select()
      .single()

    if (error) throw error
    return data as any
  }

  async updateOrder(id: string, orderData: Partial<Order>): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .update(orderData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as any
  }
}
