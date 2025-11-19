# 🛍️ Enterprise E-Commerce Platform with AI

A production-ready, scalable e-commerce platform built with Next.js 14+, featuring AI-powered capabilities via Google Gemini, designed for the Pakistani market with international scalability.

## 🚀 Features Implemented

### ✅ Core Infrastructure
- **Next.js 14+** with App Router and TypeScript (strict mode)
- **Tailwind CSS** with custom design system and responsive utilities
- **Prisma ORM** with comprehensive PostgreSQL database schema
- **NextAuth.js** for authentication (email/password, Google OAuth, Facebook OAuth)
- **Complete TypeScript** type definitions for all domain models
- **Enterprise-grade** folder structure and architecture

### ✅ Authentication System
- Email/Password authentication with bcrypt hashing
- Google OAuth integration
- Facebook OAuth integration
- User registration with email verification (token-based)
- Password reset functionality
- Session management with JWT
- Role-based access control (RBAC)
- Audit logging for all authentication events

### ✅ Database Schema
Complete Prisma schema with 20+ tables including:
- **Users & Authentication**: User profiles, sessions, verification tokens
- **Product Catalog**: Products, categories, variants, images, attributes
- **Shopping Cart**: Cart management with persistence
- **Wishlist**: Multiple wishlists per user
- **Orders**: Complete order management with tracking
- **Payments**: Multiple payment gateway support
- **Reviews**: Product reviews with sentiment analysis
- **Promotions**: Discount codes and promotional campaigns
- **Notifications**: Multi-channel notification system
- **Analytics**: Product views, search history, audit logs

### ✅ UI Components
Custom Shadcn/ui-inspired components:
- Button (multiple variants and sizes)
- Input (with validation styles)
- Card (with header, content, footer)
- Badge (status indicators)
- Label (form labels)
- Skeleton (loading states)

### ✅ Utilities
- Currency formatting (PKR, USD, EUR support)
- Date formatting and relative time
- Text manipulation (slugify, truncate)
- Discount calculations
- Password hashing and verification
- Token generation
- Role-based authorization helpers

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+ with custom config
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form (ready to integrate)
- **State**: Zustand (ready to integrate)
- **Animations**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (via Prisma)
- **ORM**: Prisma 6+
- **Authentication**: NextAuth.js v4
- **Password**: bcrypt
- **Validation**: Zod

### AI Integration
- **Provider**: Google Gemini AI
- **API Key**: Configured and ready
- **Use Cases**: Recommendations, search, chatbot, sentiment analysis

### Payments (Ready to Integrate)
- Stripe
- EasyPaisa
- JazzCash
- Cash on Delivery (COD)

### Additional Services (Ready to Integrate)
- **Email**: Resend
- **File Storage**: Cloudinary
- **Caching**: Redis (ioredis)
- **Real-time**: Socket.io

## 🛠️ Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, register)
│   │   ├── (shop)/             # Shop pages (products, cart, checkout)
│   │   ├── (account)/          # User account pages
│   │   ├── (admin)/            # Admin dashboard
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── products/       # Product endpoints
│   │   │   ├── cart/           # Cart endpoints
│   │   │   ├── orders/         # Order endpoints
│   │   │   └── ...
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Layout components
│   │   ├── product/            # Product components
│   │   ├── cart/               # Cart components
│   │   ├── checkout/           # Checkout components
│   │   └── admin/              # Admin components
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── auth-helpers.ts     # Auth utility functions
│   │   └── utils.ts            # General utilities
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # Zustand stores
│   ├── types/                  # TypeScript type definitions
│   │   ├── product.ts
│   │   ├── user.ts
│   │   ├── cart.ts
│   │   ├── order.ts
│   │   └── index.ts
│   └── styles/                 # Additional styles
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── .env                        # Environment variables
├── .env.example                # Example environment variables
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd E-Commerce-website-with-Agentic-AI
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-min-32-chars

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (optional)
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Gemini AI
GEMINI_API_KEY=AIzaSyDoM23RVH_WZLsiNGxYpYlulLfEGb9XrNY
```

4. **Set up database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations
npm run db:migrate
```

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run test         # Run tests (not yet configured)
npm run test:e2e     # Run E2E tests (not yet configured)
```

## 🗄️ Database Schema Highlights

### Users Table
- Email/password authentication
- OAuth provider support
- Two-factor authentication ready
- Role-based access control
- Email and phone verification
- Audit trail (last login, created/updated dates)

### Products Table
- Complete product information (name, description, pricing)
- Multiple images per product
- Product variants (size, color, etc.)
- Custom attributes
- Stock management
- SEO fields (meta title, description, keywords)
- Rating system
- Featured/new/sale flags

### Orders Table
- Complete order lifecycle tracking
- Multiple payment methods
- Shipping information with tracking
- Order notes and customer notes
- IP and user agent tracking for fraud prevention
- Multiple order statuses

### Reviews Table
- Star ratings (1-5)
- Review text and title
- Image uploads
- Verified purchase badges
- Helpful/not helpful voting
- AI sentiment analysis (ready to implement)
- Seller responses

## 🔐 Authentication Flow

1. **Registration**
   - User submits registration form
   - Password is hashed with bcrypt (12 rounds)
   - Verification token is generated
   - Email verification link sent (ready to implement email service)
   - User account created in database

2. **Login**
   - Credentials validated against database
   - JWT token generated
   - Session created
   - Last login timestamp updated
   - Audit log entry created

3. **OAuth**
   - User clicks OAuth provider button
   - Redirected to provider (Google/Facebook)
   - User authorizes application
   - Account linked or created
   - Session established

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Secondary**: Green (#10B981)
- **Accent**: Orange (#F59E0B)
- **Background**: Light Gray (#F9FAFB)
- **Text**: Dark Gray (#111827)
- **Error**: Red (#EF4444)
- **Success**: Green (#10B981)

### Typography
- **Font Family**: Inter (body), Poppins (headings)
- **Font Sizes**: 14px (small), 16px (base), 20px (h4), 24px (h3), 30px (h2), 36px (h1)

### Spacing
- Base unit: 4px (0.25rem)
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px

## 🔜 Next Steps & Roadmap

### Phase 1: Core Features (In Progress)
- [x] Project setup and configuration
- [x] Database schema design
- [x] Authentication system
- [x] TypeScript types
- [x] Core UI components
- [ ] Product catalog API
- [ ] Shopping cart functionality
- [ ] Checkout process
- [ ] Order management

### Phase 2: AI Integration
- [ ] Gemini AI service setup
- [ ] Product recommendations
- [ ] Smart search with NLP
- [ ] Chatbot integration
- [ ] Review sentiment analysis
- [ ] Fraud detection

### Phase 3: Payment Integration
- [ ] Stripe integration
- [ ] EasyPaisa integration
- [ ] JazzCash integration
- [ ] COD handling
- [ ] Payment webhooks

### Phase 4: Admin Dashboard
- [ ] Dashboard overview
- [ ] Product management
- [ ] Order management
- [ ] Customer management
- [ ] Analytics and reports
- [ ] Settings

### Phase 5: Advanced Features
- [ ] Wishlist system
- [ ] Review system
- [ ] Notification system
- [ ] Email templates
- [ ] SMS notifications
- [ ] Push notifications
- [ ] PWA features

### Phase 6: Optimization
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Security hardening
- [ ] Testing (unit, integration, E2E)
- [ ] Documentation
- [ ] Deployment

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+92 300 1234567"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST `/api/auth/[...nextauth]`
NextAuth.js endpoints (signin, signout, callback, etc.)

## 🛡️ Security Features

- **Password Hashing**: bcrypt with 12 rounds
- **JWT Tokens**: Secure session management
- **HTTPS**: Enforced in production
- **SQL Injection**: Protected via Prisma parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: Built into NextAuth.js
- **Rate Limiting**: Ready to implement
- **Input Validation**: Zod schemas
- **Audit Logging**: All critical actions logged

## 🤝 Contributing

This is a proprietary e-commerce platform. For questions or issues, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Vercel for hosting solutions
- Google for Gemini AI
- The open-source community

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
