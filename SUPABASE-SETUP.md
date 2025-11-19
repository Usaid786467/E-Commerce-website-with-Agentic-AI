# Supabase Database Setup Guide

## Quick Setup (5 minutes)

### Step 1: Run Database Migration

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/vqwwbsxdngbbolticggm
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Copy the entire contents of `supabase-migration.sql` file
5. Paste it into the SQL Editor
6. Click **"Run"** button

This will create all 20+ tables needed for the e-commerce platform.

### Step 2: Verify Tables Created

After running the migration, you should see these tables in your database:

**User Management:**
- `users`
- `accounts`
- `sessions`
- `verification_tokens`

**E-Commerce:**
- `products`
- `product_images`
- `product_variants`
- `product_attributes`
- `categories`
- `reviews`

**Shopping:**
- `carts`
- `cart_items`
- `wishlists`
- `wishlist_items`

**Orders:**
- `orders`
- `order_items`
- `shipping_addresses`

**Admin:**
- `coupons`
- `audit_logs`
- `notifications`
- `analytics_events`

### Step 3: Seed Test Data (Optional)

To add test data for development:

1. In SQL Editor, run the seed script from `prisma/seed.sql` (will be created)
2. Or run: `npm run seed` from your local environment

### Step 4: Verify Connection

Once tables are created, restart your development server:

```bash
npm run dev
```

Then test the connection by visiting:
- Homepage: http://localhost:3000
- Products: http://localhost:3000/products
- Admin: http://localhost:3000/admin

---

## Alternative: Using Prisma Migrate (If you have direct access)

If you can connect directly to Supabase from your local machine:

```bash
# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed database
npm run seed
```

---

## Troubleshooting

### Can't see tables after running SQL?

1. Refresh your Supabase dashboard
2. Check the "Table Editor" section
3. Look for errors in the SQL Editor output

### Connection errors in the app?

1. Verify DATABASE_URL in `.env` is correct
2. Check that all tables were created
3. Restart your dev server

### Need to reset database?

**Warning: This deletes all data!**

Run this in SQL Editor:
```sql
-- Drop all tables (CAREFUL!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then re-run the migration SQL.

---

## Next Steps

After setting up the database:

1. ✅ Create an admin user (instructions below)
2. ✅ Add test products
3. ✅ Test all features

### Creating an Admin User

You can create an admin user by:

1. **Register normally** through the app at `/register`
2. **Then update the user** in Supabase SQL Editor:

```sql
UPDATE users
SET is_admin = true, role = 'admin'
WHERE email = 'your-email@example.com';
```

Or create directly:

```sql
INSERT INTO users (
  id, email, first_name, last_name,
  password_hash, is_admin, role,
  created_at, updated_at
) VALUES (
  gen_random_uuid()::text,
  'admin@example.com',
  'Admin',
  'User',
  '$2a$10$YourHashedPasswordHere', -- Use bcrypt to hash 'password123'
  true,
  'admin',
  NOW(),
  NOW()
);
```

---

## Environment Variables

Make sure your `.env` file has:

```env
DATABASE_URL="postgresql://postgres.vqwwbsxdngbbolticggm:0510@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"
DIRECT_URL="postgresql://postgres:0510@db.vqwwbsxdngbbolticggm.supabase.co:5432/postgres?schema=public"
NEXT_PUBLIC_SUPABASE_URL=https://vqwwbsxdngbbolticggm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_iOOrkGT741MrSkfRPo04xw_WjO__9n3
SUPABASE_SERVICE_ROLE_KEY=sb_secret_sl0NaaKfJpu-Oe0CIGdJFQ_75mfkSrr
```

✅ These are already configured in your `.env` file!

---

## Support

If you encounter issues:

1. Check Supabase logs in Dashboard → Logs
2. Check app console for errors
3. Verify all environment variables are set
4. Ensure database tables were created successfully

---

**Ready to go!** 🚀

Once you run the migration SQL, your database will be fully set up and ready to use!
