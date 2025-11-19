# 🚀 Complete Setup Guide - E-Commerce Platform

**Last Updated**: 2025-11-19
**Platform**: Next.js 16 | TypeScript | PostgreSQL | Supabase

This is the COMPLETE guide to set up, run, and test your e-commerce platform from scratch.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (5 Minutes)](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Database Options](#database-options)
5. [Running the Platform](#running-the-platform)
6. [Testing All Features](#testing-all-features)
7. [Troubleshooting](#troubleshooting)
8. [Production Deployment](#production-deployment)

---

## ✅ Prerequisites

### Required Software

```bash
# 1. Node.js (v18 or higher)
node --version  # Should show v18.x.x or higher

# 2. npm (comes with Node.js)
npm --version   # Should show 8.x.x or higher

# 3. Git
git --version   # Should show 2.x.x or higher
```

### Optional (for database)
- **Supabase Account** (FREE): https://supabase.com
- **PostgreSQL** (if running locally)
- **Docker** (for containerized database)

---

## ⚡ Quick Start (5 Minutes)

### Option 1: Run Without Database (Fastest)

```bash
# 1. Clone/Navigate to project
cd E-Commerce-website-with-Agentic-AI

# 2. Install dependencies
npm install

# 3. Use mock database (no setup needed!)
echo "DATABASE_PROVIDER=mock" >> .env

# 4. Start the app
npm run dev

# 5. Open in browser
# http://localhost:3000
```

✅ **All features work** with test data!
✅ **No database setup** required!
✅ **Perfect for testing** UI/UX

---

### Option 2: With Supabase Database

```bash
# 1-2. Same as above
cd E-Commerce-website-with-Agentic-AI
npm install

# 3. Database setup is already done in .env
# (You just need to run SQL in Supabase dashboard)

# 4. Go to Supabase Dashboard
# https://supabase.com/dashboard/project/vqwwbsxdngbbolticggm

# 5. Click "SQL Editor" → "New Query"

# 6. Copy and paste ENTIRE contents of:
# - supabase-migration.sql (creates tables)
# - prisma/seed.sql (adds test data)

# 7. Click "Run" for each

# 8. Start the app
npm run dev

# 9. Open http://localhost:3000
```

✅ **Real database** with persistent data
✅ **Production-like** environment
✅ **All features** fully functional

---

## 📖 Detailed Setup

### Step 1: Install Dependencies

```bash
cd E-Commerce-website-with-Agentic-AI

# Install all required packages
npm install

# This installs:
# - Next.js 16
# - React 19
# - Prisma 6
# - TypeScript
# - Tailwind CSS
# - And 200+ dependencies
```

**Expected output:**
```
added 946 packages in 15s
```

---

### Step 2: Environment Variables

The `.env` file is already configured! Here's what's in it:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="E-Commerce Platform"
NODE_ENV=development

# Database - Supabase PostgreSQL (ALREADY CONFIGURED)
DATABASE_URL="postgresql://postgres.vqwwbsxdngbbolticggm:0510@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"
DIRECT_URL="postgresql://postgres:0510@db.vqwwbsxdngbbolticggm.supabase.co:5432/postgres?schema=public"

# Supabase (ALREADY CONFIGURED)
NEXT_PUBLIC_SUPABASE_URL=https://vqwwbsxdngbbolticggm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_iOOrkGT741MrSkfRPo04xw_WjO__9n3
SUPABASE_SERVICE_ROLE_KEY=sb_secret_sl0NaaKfJpu-Oe0CIGdJFQ_75mfkSrr

# AI - Gemini (ALREADY CONFIGURED)
GEMINI_API_KEY=AIzaSyDoM23RVH_WZLsiNGxYpYlulLfEGb9XrNY

# Database Provider (CHOOSE ONE)
DATABASE_PROVIDER=prisma  # Default: Prisma ORM
# DATABASE_PROVIDER=supabase  # Or: Supabase client
# DATABASE_PROVIDER=mock      # Or: Mock (no database!)
```

**You don't need to change anything!** ✨

---

### Step 3: Choose Database Option

#### Option A: Mock Database (No Setup)

```bash
# Add to .env
echo "DATABASE_PROVIDER=mock" >> .env

# Start app
npm run dev
```

**Benefits:**
- ✅ No setup required
- ✅ Instant testing
- ✅ Pre-seeded data
- ✅ Perfect for development

**Limitations:**
- ❌ Data resets on restart
- ❌ Not for production

---

#### Option B: Supabase (Recommended)

1. **Go to Supabase SQL Editor:**
   https://supabase.com/dashboard/project/vqwwbsxdngbbolticggm/sql

2. **Create Tables** (First SQL):
   ```sql
   -- Copy ENTIRE contents of: supabase-migration.sql
   -- Paste in SQL Editor
   -- Click "Run"
   ```

3. **Add Test Data** (Second SQL):
   ```sql
   -- Copy ENTIRE contents of: prisma/seed.sql
   -- Paste in new SQL query
   -- Click "Run"
   ```

4. **Verify Tables Created:**
   - Go to "Table Editor"
   - Should see 20+ tables
   - `products` table should have 6 products

5. **Set Database Provider:**
   ```bash
   # .env already has DATABASE_PROVIDER=prisma
   # No changes needed!
   ```

6. **Start App:**
   ```bash
   npm run dev
   ```

**Benefits:**
- ✅ Real PostgreSQL database
- ✅ Persistent data
- ✅ Production-ready
- ✅ Real-time features
- ✅ FREE tier available

---

#### Option C: Other Free Databases

See [FREE-DATABASE-OPTIONS.md](./FREE-DATABASE-OPTIONS.md) for:
- PlanetScale (MySQL)
- Railway (PostgreSQL)
- Neon (PostgreSQL)
- ElephantSQL (PostgreSQL)

---

## 🏃 Running the Platform

### Development Mode

```bash
npm run dev
```

**What happens:**
1. Next.js starts development server
2. Compiles TypeScript
3. Processes Tailwind CSS
4. Hot reload enabled
5. Server ready in ~15 seconds

**Output:**
```
▲ Next.js 16.0.3 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.1.x:3000

✓ Ready in 15.8s
```

**Open in browser:**
http://localhost:3000

---

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

**Output:**
```
Route (app)                  Size     First Load JS
┌ ○ /                       142 B          87.3 kB
├ ○ /login                  1.45 kB        88.6 kB
├ ○ /products               3.21 kB        90.4 kB
└ ○ /admin                  2.84 kB        89.9 kB

○  (Static)  prerendered as static content
```

---

## 🧪 Testing All Features

### Test Script

```bash
# Make script executable
chmod +x test-all-pages.sh

# Run all tests
./test-all-pages.sh
```

**Expected Output:**
```
📄 PUBLIC PAGES
Testing Homepage... ✓ PASS (HTTP 200)
Testing Login Page... ✓ PASS (HTTP 200)
Testing Register Page... ✓ PASS (HTTP 200)
Testing Search Page... ✓ PASS (HTTP 200)
```

---

### Manual Testing Checklist

#### ✅ Client-Side Pages (No Database Needed)

| Page | URL | Test |
|------|-----|------|
| Login | `/login` | Form renders, validation works |
| Register | `/register` | Form renders, fields validate |
| Search | `/search` | Search bar works, UI loads |

**Test Command:**
```bash
curl -I http://localhost:3000/login
# Should return: HTTP/1.1 200 OK
```

---

#### ✅ Shop Pages (Need Database/Mock)

| Page | URL | Test With Mock DB |
|------|-----|-------------------|
| Homepage | `/` | Shows featured products |
| Products | `/products` | Lists 3 mock products |
| Product Detail | `/products/wireless-headphones` | Shows product details |
| Checkout | `/checkout` | Checkout form loads |

**Enable Mock DB:**
```bash
echo "DATABASE_PROVIDER=mock" >> .env
npm run dev
```

**Test:**
```bash
curl http://localhost:3000/products
# Should show products HTML
```

---

#### ✅ Admin Pages (Need Database + Auth)

| Page | URL | Requires |
|------|-----|----------|
| Admin Dashboard | `/admin` | Database + Admin user |
| Manage Products | `/admin/products` | Database + Admin user |
| Add Product | `/admin/products/add` | Database + Admin user |
| Orders | `/admin/orders` | Database + Admin user |
| Customers | `/admin/customers` | Database + Admin user |

**Create Admin User:**
```sql
-- Run in Supabase SQL Editor
INSERT INTO users (
  id, email, first_name, last_name,
  password_hash, is_admin, role,
  created_at, updated_at
) VALUES (
  gen_random_uuid()::text,
  'admin@test.com',
  'Admin',
  'User',
  '$2a$10$YourHashedPassword',  -- Hash "admin123"
  true,
  'admin',
  NOW(),
  NOW()
);
```

---

#### ✅ API Endpoints

| Endpoint | Method | Test |
|----------|--------|------|
| `/api/products` | GET | Lists products |
| `/api/products/[id]` | GET | Gets single product |
| `/api/categories` | GET | Lists categories |
| `/api/cart` | POST | Adds to cart |

**Test API:**
```bash
curl http://localhost:3000/api/products
# Should return JSON with products
```

---

#### ✅ Features Testing

**1. Shopping Cart (Works Without DB)**
```
✓ Add product to cart
✓ Update quantity
✓ Remove item
✓ Cart persists (localStorage)
✓ Total calculation
```

**2. Search (Works Without DB)**
```
✓ Search bar renders
✓ Recent searches (localStorage)
✓ Popular searches display
✓ AI enhancement button
```

**3. User Authentication (Needs DB)**
```
✓ Register new user
✓ Login with credentials
✓ Password validation
✓ Session management
```

**4. Product Management (Needs DB + Admin)**
```
✓ Create product
✓ Edit product
✓ Delete product
✓ Upload images
✓ Manage variants
```

---

## 🔧 Troubleshooting

### Issue 1: Port 3000 Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

---

### Issue 2: Database Connection Failed

**Error:**
```
Can't reach database server at localhost:5432
```

**Solutions:**

**A. Use Mock Database:**
```bash
echo "DATABASE_PROVIDER=mock" >> .env
npm run dev
```

**B. Check Supabase Connection:**
```bash
# Test connection
npx ts-node tests/supabase-test.ts
```

**C. Verify Environment Variables:**
```bash
# Check .env file has correct values
cat .env | grep DATABASE_URL
```

---

### Issue 3: Pages Return 404

**Error:**
```
404: This page could not be found
```

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart server
npm run dev
```

---

### Issue 4: TypeScript Errors

**Error:**
```
Type error: Cannot find module 'X'
```

**Solution:**
```bash
# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server (in VS Code)
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

---

### Issue 5: Module Not Found

**Error:**
```
Module not found: Can't resolve '@/lib/...'
```

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run dev

# Verify tsconfig.json has paths
cat tsconfig.json | grep "@/*"
```

---

## 🎯 Production Deployment

### Vercel (Recommended - FREE)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Follow prompts
# ✓ Link to existing project? No
# ✓ What's your project's name? e-commerce-platform
# ✓ In which directory is your code located? ./

# 5. Add environment variables in Vercel dashboard
# Settings → Environment Variables
# Add all from .env file
```

**Live URL:** `https://your-project.vercel.app`

---

### Railway (FREE PostgreSQL + Hosting)

See [FREE-DATABASE-OPTIONS.md](./FREE-DATABASE-OPTIONS.md#railway)

---

### Docker

```bash
# Build image
docker build -t ecommerce-platform .

# Run container
docker run -p 3000:3000 --env-file .env ecommerce-platform
```

---

## 📚 Additional Resources

- **[DATABASE-SWITCHING.md](./DATABASE-SWITCHING.md)** - Switch between databases
- **[FREE-DATABASE-OPTIONS.md](./FREE-DATABASE-OPTIONS.md)** - Free database providers
- **[FILE-BY-FILE-GUIDE.md](./FILE-BY-FILE-GUIDE.md)** - What each file does
- **[TESTING-GUIDE.md](./TESTING-GUIDE.md)** - Complete testing documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Production deployment guide

---

## 🎉 Success Checklist

After setup, verify:

- [x] `npm install` completed successfully
- [x] `.env` file configured
- [x] `npm run dev` starts without errors
- [x] Homepage loads at http://localhost:3000
- [x] Login page works at http://localhost:3000/login
- [x] Products page loads (with mock or real DB)
- [x] No console errors in browser

---

## 💡 Quick Tips

**Development:**
```bash
# Watch for file changes
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint
```

**Database:**
```bash
# Use mock for quick testing
DATABASE_PROVIDER=mock npm run dev

# Switch to Supabase
DATABASE_PROVIDER=prisma npm run dev

# Test Supabase connection
npx ts-node tests/supabase-test.ts
```

**Debugging:**
```bash
# Clear all caches
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

## 🆘 Get Help

1. **Check documentation** in this repo
2. **Review error messages** carefully
3. **Check browser console** for client errors
4. **Check terminal** for server errors
5. **Verify environment variables** in `.env`

---

## ✨ You're Ready!

Your e-commerce platform is now set up and ready to use!

**Next Steps:**
1. Explore the codebase
2. Customize for your needs
3. Add your products
4. Deploy to production
5. Start selling! 🚀

---

**Happy Coding!** 💻🎉
