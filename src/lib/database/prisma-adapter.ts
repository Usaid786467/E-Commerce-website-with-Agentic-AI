/**
 * Prisma Database Adapter
 *
 * Implements the database interface using Prisma ORM
 */

import { prisma } from '@/lib/prisma'
import type { IDatabase, User, Product, Category, Order } from './types'

export class PrismaAdapter implements IDatabase {
  async connect(): Promise<void> {
    await prisma.$connect()
  }

  async disconnect(): Promise<void> {
    await prisma.$disconnect()
  }

  async healthCheck(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`
      return true
    } catch {
      return false
    }
  }

  // Users
  async getUser(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } })
    return user as User | null
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })
    return user as User | null
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = await prisma.user.create({
      data: data as any,
    })
    return user as User
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data: data as any,
    })
    return user as User
  }

  // Products
  async getProducts(params: any): Promise<{ products: Product[]; total: number }> {
    const { page = 1, limit = 20, search, categoryId } = params
    const skip = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (categoryId) {
      where.categoryId = categoryId
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
          images: { take: 1 },
        },
      }),
      prisma.product.count({ where }),
    ])

    return { products: products as any, total }
  }

  async getProduct(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: true,
        attributes: true,
      },
    })
    return product as any
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        variants: true,
        attributes: true,
        reviews: {
          where: { status: 'approved' },
          include: { user: true },
        },
      },
    })
    return product as any
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const product = await prisma.product.create({
      data: data as any,
    })
    return product as any
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const product = await prisma.product.update({
      where: { id },
      data: data as any,
    })
    return product as any
  }

  async deleteProduct(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } })
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    })
    return categories as any
  }

  async getCategory(id: string): Promise<Category | null> {
    const category = await prisma.category.findUnique({
      where: { id },
    })
    return category as any
  }

  // Orders
  async getOrders(params: any): Promise<{ orders: Order[]; total: number }> {
    const { page = 1, limit = 20, userId, status } = params
    const skip = (page - 1) * limit

    const where: any = {}
    if (userId) where.userId = userId
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: true,
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return { orders: orders as any, total }
  }

  async getOrder(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: {
            product: true,
          },
        },
        shippingAddress: true,
      },
    })
    return order as any
  }

  async createOrder(data: Partial<Order>): Promise<Order> {
    const order = await prisma.order.create({
      data: data as any,
    })
    return order as any
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: data as any,
    })
    return order as any
  }
}
