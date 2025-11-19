# 🆓 Free Database Options for E-Commerce Platform

**All these databases offer FREE tiers perfect for development and small-scale production!**

---

## 📊 Comparison Table

| Database | Type | Free Tier | Best For |
|----------|------|-----------|----------|
| **Supabase** | PostgreSQL | 500MB, 2 concurrent connections | Full-featured, real-time |
| **PlanetScale** | MySQL | 5GB storage, 1 billion reads/month | Serverless, branching |
| **Railway** | PostgreSQL | $5 credit/month | All-in-one hosting |
| **Neon** | PostgreSQL | 3GB storage, 1 compute hour/day | Serverless PostgreSQL |
| **ElephantSQL** | PostgreSQL | 20MB | Testing, prototypes |
| **CockroachDB** | PostgreSQL | 5GB storage, 50M requests | Distributed, scalable |

---

## 1. Supabase ⭐ (RECOMMENDED - Already Configured!)

### Why Choose Supabase?

✅ **Already set up** in your `.env` file
✅ **PostgreSQL** (same as production)
✅ **Real-time** subscriptions
✅ **Authentication** built-in
✅ **Storage** for images
✅ **FREE** 500MB database

### Setup Steps

#### Option A: Use Existing Configuration (EASIEST)

Your `.env` already has:
```env
DATABASE_URL="postgresql://postgres.vqwwbsxdngbbolticggm:0510@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&schema=public"
NEXT_PUBLIC_SUPABASE_URL=https://vqwwbsxdngbbolticggm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_iOOrkGT741MrSkfRPo04xw_WjO__9n3
```

**Just run the SQL migrations:**

1. Go to: https://supabase.com/dashboard/project/vqwwbsxdngbbolticggm/sql
2. Click "New Query"
3. Paste contents of `supabase-migration.sql`
4. Click "Run"
5. Repeat for `prisma/seed.sql`

Done! ✅

---

#### Option B: Create New Supabase Project

1. **Sign Up**: https://supabase.com
2. **Create Project**:
   - Name: `ecommerce-platform`
   - Database Password: (choose strong password)
   - Region: Closest to you

3. **Get Connection String**:
   ```
   Go to: Settings → Database → Connection String
   Copy: Connection Pooling URL
   ```

4. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
   NEXT_PUBLIC_SUPABASE_URL=https://[PROJECT_REF].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
   ```

5. **Run Migrations**:
   - Copy `supabase-migration.sql` to SQL Editor
   - Run it
   - Copy `prisma/seed.sql` to SQL Editor
   - Run it

6. **Test**:
   ```bash
   npm run dev
   ```

---

## 2. PlanetScale (MySQL)

### Why Choose PlanetScale?

✅ **Generous free tier** (5GB storage)
✅ **Serverless MySQL**
✅ **Database branching**
✅ **No connection limits**
✅ **Great performance**

### Setup Steps

1. **Sign Up**: https://planetscale.com

2. **Create Database**:
   ```
   Name: ecommerce-platform
   Region: Select closest
   Plan: Hobby (FREE)
   ```

3. **Get Connection String**:
   ```
   Go to: Database → Connect
   Framework: Prisma
   Copy connection string
   ```

4. **Update Prisma Schema**:
   ```prisma
   datasource db {
     provider = "mysql"  // Change from postgresql
     url      = env("DATABASE_URL")
   }
   ```

5. **Update `.env`**:
   ```env
   DATABASE_URL="mysql://[username]:[password]@aws.connect.psdb.cloud/ecommerce-platform?sslaccept=strict"
   ```

6. **Modify Schema for MySQL**:
   ```bash
   # Some PostgreSQL features need adjustment
   # DateTime(3) → DateTime
   # TEXT → LONGTEXT for long content
   ```

7. **Push Schema**:
   ```bash
   npx prisma db push
   ```

8. **Seed Data**:
   ```bash
   # Create seed script
   npm run seed
   ```

---

## 3. Railway

### Why Choose Railway?

✅ **PostgreSQL + Hosting** in one
✅ **$5 free credit/month**
✅ **Easy deployment**
✅ **GitHub integration**
✅ **Automatic HTTPS**

### Setup Steps

1. **Sign Up**: https://railway.app

2. **Create Project** → **New Project** → **Deploy PostgreSQL**

3. **Get Connection String**:
   ```
   Click database → Connect → Postgres Connection URL
   ```

4. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:1234/railway"
   ```

5. **Deploy App** (Optional):
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login
   railway login

   # Link project
   railway link

   # Deploy
   railway up
   ```

6. **Run Migrations**:
   ```bash
   npx prisma db push
   ```

---

## 4. Neon (Serverless PostgreSQL)

### Why Choose Neon?

✅ **True serverless** PostgreSQL
✅ **Instant branching**
✅ **3GB free storage**
✅ **PostgreSQL compatible**
✅ **Fast cold starts**

### Setup Steps

1. **Sign Up**: https://neon.tech

2. **Create Project**:
   ```
   Name: ecommerce-platform
   Postgres version: 15
   Region: Select closest
   ```

3. **Get Connection String**:
   ```
   Dashboard → Connection Details
   Copy: Connection string
   ```

4. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://user:password@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb"
   ```

5. **Run Migrations**:
   ```bash
   npx prisma db push
   ```

---

## 5. Elephant SQL (Tiny Free Tier)

### Why Choose ElephantSQL?

✅ **Quick setup**
✅ **20MB free** (good for testing)
✅ **PostgreSQL compatible**
⚠️ **Limited** for production

### Setup Steps

1. **Sign Up**: https://elephantsql.com

2. **Create Instance**:
   ```
   Name: ecommerce-dev
   Plan: Tiny Turtle (FREE - 20MB)
   Region: Select closest
   ```

3. **Get URL**:
   ```
   Dashboard → Instance → URL
   ```

4. **Update `.env`**:
   ```env
   DATABASE_URL="postgres://username:password@jelani.db.elephantsql.com/username"
   ```

5. **Run Migrations**:
   ```bash
   npx prisma db push
   ```

---

## 6. CockroachDB Serverless

### Why Choose CockroachDB?

✅ **Distributed database**
✅ **PostgreSQL wire compatible**
✅ **5GB free storage**
✅ **Global scale**

### Setup Steps

1. **Sign Up**: https://cockroachlabs.cloud

2. **Create Cluster**:
   ```
   Name: ecommerce-platform
   Plan: Serverless (FREE)
   Region: Select closest
   ```

3. **Download CA Certificate**:
   ```bash
   # Copy CA cert to your project
   ```

4. **Get Connection String**:
   ```
   Dashboard → Connect
   Copy: Connection string for Prisma
   ```

5. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://user:password@region.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dcluster-name"
   ```

6. **Run Migrations**:
   ```bash
   npx prisma db push
   ```

---

## 🔄 Switching Between Databases

Thanks to our **database abstraction layer**, switching is easy!

### From Supabase to PlanetScale:

1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "mysql"  // Change from postgresql
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:
   ```env
   DATABASE_URL="mysql://[planetscale-url]"
   ```

3. Push schema:
   ```bash
   npx prisma db push
   ```

### Using Different Providers:

```env
# Option 1: Prisma (works with all)
DATABASE_PROVIDER=prisma

# Option 2: Direct Supabase client
DATABASE_PROVIDER=supabase

# Option 3: Mock (no database!)
DATABASE_PROVIDER=mock
```

---

## 💰 Cost Comparison

| Database | Free Tier | Paid Plans Start |
|----------|-----------|------------------|
| Supabase | 500MB, 2GB bandwidth | $25/month |
| PlanetScale | 5GB storage | $29/month |
| Railway | $5 credit/month | $5/month usage |
| Neon | 3GB storage | $19/month |
| ElephantSQL | 20MB | $5/month |
| CockroachDB | 5GB | $0.50/GB |

---

## 🎯 Recommendations

### For Development/Testing:
**Use**: Mock Database or Supabase Free
```env
DATABASE_PROVIDER=mock  # Fastest, no setup
```

### For Small Production:
**Use**: Supabase or Railway
- Supabase: Best for real-time features
- Railway: Best for simple deployment

### For Scaling:
**Use**: PlanetScale or CockroachDB
- PlanetScale: Great for MySQL users
- CockroachDB: Best for global scale

---

## 🧪 Testing Database Connection

### Test Script:

```bash
# For Supabase
npx ts-node tests/supabase-test.ts

# For Prisma (works with all)
npx prisma studio  # Opens GUI

# For any database
node -e "
const { prisma } = require('./src/lib/prisma');
prisma.\$connect()
  .then(() => console.log('✓ Connected!'))
  .catch((e) => console.error('✗ Failed:', e.message));
"
```

---

## 🔧 Troubleshooting

### Connection Timeout:

```bash
# Check if database is accessible
ping your-database-host.com

# Test connection with psql
psql "postgresql://user:password@host:5432/dbname"
```

### SSL Errors:

```env
# Add SSL parameter to connection string
DATABASE_URL="postgresql://...?sslmode=require"
```

### Too Many Connections:

```env
# Use connection pooling
DATABASE_URL="postgresql://...?pgbouncer=true&connection_limit=1"
```

---

## ✨ Summary

**Easiest**: Supabase (already configured!)
**Most Generous**: PlanetScale (5GB free)
**All-in-One**: Railway (DB + hosting)
**Serverless**: Neon or Supabase
**Global Scale**: CockroachDB

**Recommended Setup:**
1. **Development**: Mock database (`DATABASE_PROVIDER=mock`)
2. **Staging**: Supabase free tier
3. **Production**: Supabase Pro or PlanetScale

---

**You now have 6 FREE database options! Pick the one that fits your needs!** 🎉
