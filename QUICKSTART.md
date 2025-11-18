# 🚀 Quick Start Guide

Get the E-Commerce platform running in 5 minutes!

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Git

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file (already created, update if needed):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production-min-32-chars
GEMINI_API_KEY=AIzaSyDoM23RVH_WZLsiNGxYpYlulLfEGb9XrNY
```

### 3. Setup Database

**Option A: Push Schema (Quick for Development)**
```bash
npm run db:push
```

**Option B: Run Migrations (Recommended for Production)**
```bash
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## What's Built?

✅ **Authentication**
- Login: [http://localhost:3000/login](http://localhost:3000/login)
- Register: [http://localhost:3000/register](http://localhost:3000/register)
- Email/Password + OAuth (Google, Facebook)

✅ **Database**
- 20+ tables with complete schema
- Products, Orders, Users, Cart, Wishlist, Reviews, etc.

✅ **UI Components**
- Button, Input, Card, Badge, Label, Skeleton
- Fully styled with Tailwind CSS

✅ **TypeScript**
- Complete type definitions for all models
- Strict mode enabled

## Testing Authentication

### Register a New User
1. Go to `/register`
2. Fill in the form:
   - Email: test@example.com
   - Password: TestPass123
   - First Name: Test
   - Last Name: User
3. Click "Create Account"
4. You'll be redirected to login

### Login
1. Go to `/login`
2. Enter credentials
3. Click "Sign In"
4. You'll be redirected to homepage

## Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema to DB
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:generate      # Generate Prisma Client

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
```

## Prisma Studio (Database GUI)

View and edit your database:

```bash
npm run db:studio
```

Open [http://localhost:5555](http://localhost:5555)

## Next Steps

1. **Add Products**: Create product API and admin interface
2. **Shopping Cart**: Implement cart with Zustand
3. **Checkout**: Build checkout flow
4. **Payments**: Integrate Stripe, EasyPaisa, JazzCash
5. **AI Features**: Implement Gemini recommendations
6. **Admin Dashboard**: Build complete admin panel

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Create database: `createdb ecommerce`

### Authentication Not Working
- Verify `NEXTAUTH_SECRET` is set (min 32 chars)
- Check `NEXTAUTH_URL` matches your dev server

### Build Errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## Need Help?

Check the detailed [README_DETAILED.md](./README_DETAILED.md) for complete documentation.

---

Happy coding! 🚀
