# Database Switching Guide

This guide shows you how to easily switch between different database providers (Prisma, Supabase, MongoDB, etc.) in your e-commerce platform.

## 🎯 Architecture Overview

The project uses a **Database Abstraction Layer** that allows you to switch database providers without changing application code.

### Files Structure:

```
src/lib/database/
├── index.ts              # Database factory (main entry point)
├── types.ts              # Database interface definitions
├── prisma-adapter.ts     # Prisma ORM implementation
├── supabase-adapter.ts   # Supabase client implementation
├── mock-adapter.ts       # In-memory mock for testing
└── [your-adapter].ts     # Add your own adapter here!
```

---

## 🔄 How to Switch Databases

### Method 1: Environment Variable (Recommended)

Add this to your `.env` file:

```env
# Choose: 'prisma' | 'supabase' | 'mock'
DATABASE_PROVIDER=prisma
```

**Options:**
- `prisma` - Use Prisma ORM (default)
- `supabase` - Use Supabase client directly
- `mock` - Use in-memory database (for testing)

### Method 2: Programmatic Switch

In your code:

```typescript
import { getDatabase } from '@/lib/database'

// Use default provider from .env
const db = getDatabase()

// Or specify provider explicitly
const supabaseDb = getDatabase('supabase')
const mockDb = getDatabase('mock')
```

---

## 📚 Available Adapters

### 1. Prisma Adapter (Default)

**When to use:**
- Need a type-safe ORM
- Want automatic migrations
- Prefer SQL-based workflows

**Setup:**

```env
DATABASE_PROVIDER=prisma
DATABASE_URL="postgresql://..."
```

**Features:**
- ✅ Type-safe queries
- ✅ Auto migrations
- ✅ Multi-database support (PostgreSQL, MySQL, SQLite, etc.)
- ✅ Relation handling

### 2. Supabase Adapter

**When to use:**
- Using Supabase hosting
- Want real-time subscriptions
- Prefer Supabase's client library

**Setup:**

```env
DATABASE_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Features:**
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Row-level security
- ✅ Storage and edge functions

### 3. Mock Adapter

**When to use:**
- Running tests
- Development without database
- Demos and prototypes

**Setup:**

```env
DATABASE_PROVIDER=mock
```

**Features:**
- ✅ No database required
- ✅ In-memory storage
- ✅ Pre-seeded with test data
- ✅ Fast and simple

---

## 🛠️ Creating Your Own Adapter

Want to use MongoDB, Firebase, or another database? Here's how:

### Step 1: Create Adapter File

Create `src/lib/database/mongodb-adapter.ts`:

```typescript
import { IDatabase, User, Product, Category, Order } from './types'
import { MongoClient } from 'mongodb'

export class MongoDBAdapter implements IDatabase {
  private client: MongoClient

  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URL!)
  }

  async connect(): Promise<void> {
    await this.client.connect()
  }

  async disconnect(): Promise<void> {
    await this.client.close()
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.client.db().admin().ping()
      return true
    } catch {
      return false
    }
  }

  // Implement all interface methods...
  async getUser(id: string): Promise<User | null> {
    const db = this.client.db()
    const user = await db.collection('users').findOne({ _id: id })
    return user as User | null
  }

  // ... implement remaining methods
}
```

### Step 2: Register in Factory

Edit `src/lib/database/index.ts`:

```typescript
import { MongoDBAdapter } from './mongodb-adapter'

function createDatabase(provider?: DatabaseProvider): IDatabase {
  const dbProvider = provider || getDatabaseProvider()

  switch (dbProvider) {
    case 'mongodb':
      return new MongoDBAdapter()

    case 'supabase':
      return new SupabaseAdapter()

    case 'mock':
      return new MockAdapter()

    case 'prisma':
    default:
      return new PrismaAdapter()
  }
}
```

### Step 3: Use It

```env
DATABASE_PROVIDER=mongodb
MONGODB_URL=mongodb://localhost:27017/ecommerce
```

Done! Your app now uses MongoDB.

---

## 🧪 Testing Databases

### Test Supabase Connection

```bash
npx ts-node tests/supabase-test.ts
```

This will:
- ✅ Test connection
- ✅ Health check
- ✅ Fetch categories
- ✅ Fetch products
- ✅ Fetch users

### Test with Mock Database

```env
DATABASE_PROVIDER=mock
```

```bash
npm run dev
```

Visit pages - everything works without a real database!

---

## 📝 Usage in Your Code

### Old Way (Tightly Coupled):

```typescript
// ❌ Directly using Prisma everywhere
import { prisma } from '@/lib/prisma'

const products = await prisma.product.findMany()
```

### New Way (Abstracted):

```typescript
// ✅ Using database abstraction
import { getDatabase } from '@/lib/database'

const db = getDatabase()
const { products } = await db.getProducts({ page: 1, limit: 20 })
```

**Benefits:**
- ✅ Switch databases by changing `.env` variable
- ✅ Mock database for testing
- ✅ Consistent API across all databases
- ✅ Easy to migrate

---

## 🔄 Migration Guide

### From Direct Prisma to Abstraction Layer

**Before:**
```typescript
const product = await prisma.product.findUnique({
  where: { id },
  include: { category: true, images: true }
})
```

**After:**
```typescript
import { getDatabase } from '@/lib/database'

const db = getDatabase()
const product = await db.getProduct(id)
```

### From Supabase to Prisma

Just change the environment variable:

```env
# Before
DATABASE_PROVIDER=supabase

# After
DATABASE_PROVIDER=prisma
```

No code changes required! ✨

---

## 🎯 Best Practices

### 1. Use Dependency Injection

```typescript
export async function getProducts(db?: IDatabase) {
  const database = db || getDatabase()
  return database.getProducts({ page: 1, limit: 20 })
}
```

This makes testing easier:

```typescript
import { MockAdapter } from '@/lib/database/mock-adapter'

const mockDb = new MockAdapter()
const products = await getProducts(mockDb)
```

### 2. Type Safety

The interface ensures type safety across all adapters:

```typescript
// TypeScript will enforce this matches IDatabase interface
class MyAdapter implements IDatabase {
  // Must implement all methods with correct types
}
```

### 3. Error Handling

```typescript
const db = getDatabase()

try {
  const product = await db.getProduct(id)
} catch (error) {
  console.error('Database error:', error)
  // Handle gracefully
}
```

---

## 🚀 Quick Switch Examples

### Switch from Prisma to Mock (for testing)

```bash
# .env
DATABASE_PROVIDER=mock
```

```bash
npm run dev
```

All pages work with test data!

### Switch from Prisma to Supabase

```bash
# .env
DATABASE_PROVIDER=supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

```bash
npm run dev
```

Now using Supabase client!

---

## 📊 Comparison

| Feature | Prisma | Supabase | Mock |
|---------|--------|----------|------|
| Type Safety | ✅ Excellent | ⚠️ Good | ✅ Excellent |
| Real-time | ❌ No | ✅ Yes | ❌ No |
| Migrations | ✅ Built-in | ⚠️ Manual | ❌ N/A |
| Performance | ✅ Fast | ✅ Fast | ✅ Very Fast |
| Setup Time | ⏱️ Medium | ⏱️ Quick | ⚡ Instant |
| Production Ready | ✅ Yes | ✅ Yes | ❌ No |

---

## 🔍 Troubleshooting

### "Provider not found" error

Make sure `DATABASE_PROVIDER` is set correctly in `.env`:

```env
DATABASE_PROVIDER=prisma  # Not 'PRISMA' or 'Prisma'
```

### Connection errors

Test the connection:

```typescript
import { testDatabaseConnection } from '@/lib/database'

const result = await testDatabaseConnection()
console.log(result)
```

### Methods not implemented

Make sure your adapter implements ALL methods from `IDatabase` interface.

---

## 📚 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Database Interface](./src/lib/database/types.ts)
- [Adapter Examples](./src/lib/database/)

---

## 🎉 Summary

You now have a **flexible, modular database layer** that:

✅ Switches databases with ONE environment variable
✅ Works with Prisma, Supabase, or any database you want
✅ Provides mock data for testing
✅ Maintains type safety
✅ Makes migration easy

**To switch databases:**
1. Change `DATABASE_PROVIDER` in `.env`
2. Add required environment variables
3. Restart your app

That's it! No code changes needed. 🚀
