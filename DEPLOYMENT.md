# 🚀 Deployment Guide

This guide will help you deploy your e-commerce platform to production.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- Domain name (optional)
- SSL certificate (recommended)

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Set Environment Variables**

   In your Vercel dashboard, add these environment variables:

   ```
   DATABASE_URL=postgresql://user:password@host:5432/database
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://yourdomain.com
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GEMINI_API_KEY=your-gemini-api-key
   STRIPE_SECRET_KEY=your-stripe-secret-key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   RESEND_API_KEY=your-resend-api-key
   EMAIL_FROM=noreply@yourdomain.com
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

5. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

6. **Seed Initial Data (Optional)**
   ```bash
   npm run seed
   ```

### Option 2: Docker

Deploy using Docker for more control.

#### Steps:

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npx prisma generate
   RUN npm run build

   FROM node:18-alpine AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://user:password@postgres:5432/ecommerce
         - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
         - NEXTAUTH_URL=${NEXTAUTH_URL}
       depends_on:
         - postgres

     postgres:
       image: postgres:15-alpine
       environment:
         POSTGRES_USER: user
         POSTGRES_PASSWORD: password
         POSTGRES_DB: ecommerce
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"

   volumes:
     postgres_data:
   ```

3. **Deploy**
   ```bash
   docker-compose up -d
   ```

### Option 3: VPS (DigitalOcean, AWS, etc.)

For full control over your deployment.

#### Steps:

1. **Set up VPS**
   - Create a VPS instance
   - Install Node.js 18+
   - Install PostgreSQL
   - Configure firewall

2. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd E-Commerce-website-with-Agentic-AI
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```

5. **Run Database Migrations**
   ```bash
   npx prisma migrate deploy
   ```

6. **Build Application**
   ```bash
   npm run build
   ```

7. **Install PM2 (Process Manager)**
   ```bash
   npm install -g pm2
   ```

8. **Start Application**
   ```bash
   pm2 start npm --name "ecommerce" -- start
   pm2 save
   pm2 startup
   ```

9. **Configure Nginx (Reverse Proxy)**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. **Setup SSL with Let's Encrypt**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```

## Database Setup

### Production Database (Recommended Services)

1. **Vercel Postgres** (easiest with Vercel)
2. **Supabase** (free tier available)
3. **Neon** (serverless Postgres)
4. **Railway** (simple deployment)
5. **AWS RDS** (enterprise-grade)

### Migration Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run seed

# View database
npx prisma studio
```

## Environment Variables Checklist

### Required
- [x] `DATABASE_URL` - PostgreSQL connection string
- [x] `NEXTAUTH_SECRET` - Random secret for NextAuth (generate with `openssl rand -base64 32`)
- [x] `NEXTAUTH_URL` - Your production URL

### Authentication (OAuth)
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `FACEBOOK_CLIENT_ID`
- [ ] `FACEBOOK_CLIENT_SECRET`

### AI Features
- [x] `GEMINI_API_KEY` - Google Gemini API key

### Payment Gateways
- [x] `STRIPE_SECRET_KEY`
- [x] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_WEBHOOK_SECRET` (for webhooks)

### Email Service
- [x] `RESEND_API_KEY`
- [x] `EMAIL_FROM` - Sender email address

### Application
- [x] `NEXT_PUBLIC_APP_URL` - Your production URL
- [ ] `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)

## Post-Deployment Checklist

### Security
- [ ] Change default admin password
- [ ] Enable HTTPS/SSL
- [ ] Set strong NEXTAUTH_SECRET
- [ ] Configure CORS if needed
- [ ] Review rate limiting settings
- [ ] Set up firewall rules

### Database
- [ ] Run migrations
- [ ] Create admin user
- [ ] Seed categories
- [ ] Test database connection
- [ ] Set up automated backups

### Testing
- [ ] Test user registration
- [ ] Test product browsing
- [ ] Test add to cart
- [ ] Test checkout flow
- [ ] Test payment processing
- [ ] Test admin login
- [ ] Test product CRUD
- [ ] Test email notifications

### Performance
- [ ] Enable caching
- [ ] Configure CDN (if using)
- [ ] Optimize images
- [ ] Test page load speeds
- [ ] Monitor Core Web Vitals

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Enable analytics (Google Analytics)
- [ ] Configure uptime monitoring
- [ ] Set up log aggregation

## Stripe Webhook Setup

1. **Get Webhook Secret**
   - Go to Stripe Dashboard > Developers > Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/stripe/webhook`
   - Select events: `checkout.session.completed`, `checkout.session.expired`
   - Copy webhook signing secret

2. **Add to Environment Variables**
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

## Creating Admin User

You can create an admin user via database or API:

### Method 1: Direct Database

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'your-admin@example.com';
```

### Method 2: API Script

Create a script to register and promote user to admin.

## Monitoring & Maintenance

### Log Monitoring
```bash
# View application logs
pm2 logs ecommerce

# Monitor processes
pm2 monit
```

### Database Backups
```bash
# Backup database
pg_dump -U user -d ecommerce > backup_$(date +%Y%m%d).sql

# Restore database
psql -U user -d ecommerce < backup_20250119.sql
```

### Update Application
```bash
git pull origin main
npm install
npx prisma migrate deploy
npm run build
pm2 restart ecommerce
```

## Performance Optimization

### CDN Configuration
- Upload static assets to CDN
- Configure Next.js image optimization
- Enable browser caching

### Database Optimization
- Add indexes for frequently queried columns
- Enable connection pooling
- Configure read replicas (if needed)

### Caching Strategy
- Enable Next.js built-in caching
- Use Redis for session storage (optional)
- Implement API response caching

## Troubleshooting

### Common Issues

**Database Connection Error**
- Verify DATABASE_URL is correct
- Check database server is running
- Verify firewall allows connections

**Build Errors**
- Clear `.next` folder: `rm -rf .next`
- Delete node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

**Payment Not Working**
- Verify Stripe keys are correct
- Check webhook is configured
- Test in Stripe test mode first

**Emails Not Sending**
- Verify Resend API key
- Check EMAIL_FROM domain is verified
- Review Resend dashboard logs

## Support

For deployment issues:
1. Check application logs
2. Review environment variables
3. Test in development first
4. Check database connectivity
5. Verify all required services are running

## Scaling Considerations

When your app grows:
- Use database read replicas
- Implement Redis caching
- Configure horizontal scaling
- Use CDN for static assets
- Enable database connection pooling
- Consider serverless functions for API routes
- Implement message queues for background jobs

---

**Ready to deploy?** Follow the steps above and your e-commerce platform will be live! 🚀
