/**
 * Database Factory
 *
 * Central place to create and manage database instances
 * Switch between different database providers easily
 */

import type { IDatabase, DatabaseProvider } from './types'
import { PrismaAdapter } from './prisma-adapter'
import { SupabaseAdapter } from './supabase-adapter'
import { MockAdapter } from './mock-adapter'
import { LocalStorageAdapter } from './localstorage-adapter'

// Export types
export * from './types'

/**
 * Get the database provider from environment variable
 * Defaults to 'prisma' if not specified
 */
function getDatabaseProvider(): DatabaseProvider {
  const provider = process.env.DATABASE_PROVIDER as DatabaseProvider
  return provider || 'prisma'
}

/**
 * Create database instance based on provider
 */
function createDatabase(provider?: DatabaseProvider): IDatabase {
  const dbProvider = provider || getDatabaseProvider()

  switch (dbProvider) {
    case 'localstorage':
      return new LocalStorageAdapter()

    case 'supabase':
      return new SupabaseAdapter()

    case 'mock':
      return new MockAdapter()

    case 'prisma':
    default:
      return new PrismaAdapter()
  }
}

// Singleton instance
let dbInstance: IDatabase | null = null

/**
 * Get the database instance (singleton)
 * Use this in your application code
 */
export function getDatabase(provider?: DatabaseProvider): IDatabase {
  if (!dbInstance) {
    dbInstance = createDatabase(provider)
  }
  return dbInstance
}

/**
 * Reset database instance (useful for testing)
 */
export function resetDatabase(): void {
  if (dbInstance) {
    dbInstance.disconnect().catch(console.error)
    dbInstance = null
  }
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(): Promise<{
  connected: boolean
  provider: DatabaseProvider
  error?: string
}> {
  const provider = getDatabaseProvider()
  const db = getDatabase()

  try {
    await db.connect()
    const healthy = await db.healthCheck()

    return {
      connected: healthy,
      provider,
    }
  } catch (error: any) {
    return {
      connected: false,
      provider,
      error: error.message,
    }
  }
}

// Default export
export default getDatabase
