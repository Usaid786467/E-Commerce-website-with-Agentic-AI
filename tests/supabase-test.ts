/**
 * Supabase Database Test Script
 *
 * Run this manually to test Supabase connection and operations
 * Usage: npx ts-node tests/supabase-test.ts
 */

import { SupabaseAdapter } from '../src/lib/database/supabase-adapter'
import { testDatabaseConnection } from '../src/lib/database'

async function testSupabase() {
  console.log('🧪 Starting Supabase Database Tests...\n')

  // Test 1: Connection
  console.log('Test 1: Testing database connection...')
  const connectionResult = await testDatabaseConnection()
  console.log('Result:', connectionResult)

  if (!connectionResult.connected) {
    console.error('❌ Failed to connect to Supabase')
    console.error('Error:', connectionResult.error)
    process.exit(1)
  }

  console.log('✅ Successfully connected to Supabase\n')

  // Test 2: Create adapter
  console.log('Test 2: Creating Supabase adapter...')
  const db = new SupabaseAdapter()
  console.log('✅ Adapter created\n')

  // Test 3: Health check
  console.log('Test 3: Health check...')
  const healthy = await db.healthCheck()
  console.log('Result:', healthy ? '✅ Healthy' : '❌ Unhealthy\n')

  if (!healthy) {
    console.error('❌ Database health check failed')
    process.exit(1)
  }

  // Test 4: Get categories
  console.log('Test 4: Fetching categories...')
  try {
    const categories = await db.getCategories()
    console.log(`✅ Found ${categories.length} categories`)
    if (categories.length > 0) {
      console.log('Sample category:', categories[0])
    }
  } catch (error: any) {
    console.error('❌ Failed to fetch categories:', error.message)
  }
  console.log('')

  // Test 5: Get products
  console.log('Test 5: Fetching products...')
  try {
    const { products, total } = await db.getProducts({ page: 1, limit: 10 })
    console.log(`✅ Found ${total} total products`)
    console.log(`Showing first ${products.length} products`)
    if (products.length > 0) {
      console.log('Sample product:', {
        id: products[0].id,
        name: products[0].name,
        price: products[0].price,
      })
    }
  } catch (error: any) {
    console.error('❌ Failed to fetch products:', error.message)
  }
  console.log('')

  // Test 6: Get users
  console.log('Test 6: Fetching users...')
  try {
    const user = await db.getUserByEmail('admin@shop.com')
    if (user) {
      console.log('✅ Found admin user:', {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        isAdmin: user.isAdmin,
      })
    } else {
      console.log('⚠️  Admin user not found (run seed.sql first)')
    }
  } catch (error: any) {
    console.error('❌ Failed to fetch user:', error.message)
  }
  console.log('')

  // Summary
  console.log('📊 Test Summary:')
  console.log('================')
  console.log('✅ All Supabase tests completed!')
  console.log('\n💡 Next steps:')
  console.log('1. Make sure you ran the migration SQL in Supabase dashboard')
  console.log('2. Run the seed.sql to add test data')
  console.log('3. Start your app with: npm run dev')
  console.log('4. Visit: http://localhost:3000/products')
}

// Run tests
testSupabase().catch((error) => {
  console.error('\n❌ Fatal error:', error)
  process.exit(1)
})
