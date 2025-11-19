# 🚀 Run the E-Commerce Platform Locally

This guide will help you run the website on **your own computer** so you can access it in your browser.

---

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ **Node.js 18+** installed ([Download here](https://nodejs.org/))
- ✅ **Git** installed ([Download here](https://git-scm.com/))
- ✅ A **code editor** (VS Code recommended)
- ✅ A **terminal/command prompt**

---

## 🏃‍♂️ Quick Start (5 Minutes)

### Step 1: Clone the Repository

Open your terminal and run:

```bash
# Clone the repository
git clone https://github.com/Usaid786467/E-Commerce-website-with-Agentic-AI.git

# Navigate to the project
cd E-Commerce-website-with-Agentic-AI

# Checkout the working branch
git checkout claude/ecommerce-platform-build-01FS9urRLrWhekus782PG7NL
```

### Step 2: Install Dependencies

```bash
npm install
```

This will take 2-3 minutes to install all required packages.

### Step 3: Configure Environment

The `.env` file is already configured for localStorage testing:

```env
# Database Configuration
DATABASE_PROVIDER=localstorage

# This means NO external database needed!
# Everything runs in your browser's localStorage
```

**No additional configuration needed!**

### Step 4: Start the Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 16.0.3 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.x.x:3000

✓ Ready in 2-3s
```

### Step 5: Open in Browser

Open your browser and go to:

```
http://localhost:3000
```

**That's it!** 🎉 The website should now be running on your computer!

---

## 🎯 What You Should See

### Homepage
- ✅ ShopAI branding and logo
- ✅ Search bar
- ✅ Navigation menu (Home, All Products, Categories, Deals)
- ✅ Hero section with "Shop Smart with AI-Powered Shopping"
- ✅ Featured Products section
- ✅ Footer with links

### Data Available
- **6 Products** automatically loaded:
  - iPhone 15 Pro (₨ 449,999 → ₨ 429,999)
  - MacBook Pro 14" (₨ 629,999 → ₨ 599,999)
  - AirPods Pro (₨ 74,999)
  - Samsung Galaxy S24 (₨ 349,999)
  - Sony WH-1000XM5 (₨ 99,999)
  - Dell XPS 13 (₨ 299,999)

- **3 Users** (for testing):
  - admin@test.com (password: admin123)
  - john@example.com (password: password123)
  - jane@example.com (password: password123)

- **6 Categories**:
  - Electronics (Smartphones, Laptops, Audio)
  - Fashion
  - Home & Living

---

## 🧪 Testing the Website

### Test 1: Browse Products
1. Click **"All Products"** in the navigation
2. You should see 6 products with images, prices, and "Add to Cart" buttons

### Test 2: Search
1. Type **"iPhone"** in the search bar
2. Press Enter
3. You should see iPhone products in results

### Test 3: Add to Cart (Client-Side)
1. Click any product
2. Click **"Add to Cart"**
3. Check cart icon in header - should show item count

### Test 4: View Product Details
1. Click on any product card
2. Should show full product details page

### Test 5: Login/Register
1. Click **"Login"** or **"Register"**
2. Forms should display correctly
3. (Note: Auth requires external setup - just test UI for now)

---

## 🔧 Troubleshooting

### Issue: "Module not found" errors

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Port 3000 is already in use"

**Solution:**
```bash
# Kill the process using port 3000
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port:
npm run dev -- -p 3001
```

### Issue: Still can't access localhost:3000

**Solution:**
1. Make sure the dev server is running (you should see "Ready in X.Xs")
2. Try these alternative URLs:
   - http://127.0.0.1:3000
   - http://0.0.0.0:3000
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
4. Try a different browser
5. Check firewall settings - allow port 3000

### Issue: Products not showing up

**Solution:**
The first time you load the homepage, data is automatically seeded to localStorage. If you don't see products:

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for: `✅ Seeded products: 6`
4. Check **Application > Local Storage**
5. You should see keys like `ecommerce_products`

To reset data:
```javascript
// In browser console:
localStorage.clear()
// Then refresh the page
```

---

## 📱 Access from Mobile/Other Devices

### On Your Local Network

1. Find your computer's local IP address:

**On Mac/Linux:**
```bash
ifconfig | grep "inet "
```

**On Windows:**
```bash
ipconfig
```

Look for something like `192.168.1.100`

2. Make sure your computer's firewall allows port 3000

3. On your mobile device, open:
```
http://192.168.1.100:3000
```
(Replace with your actual IP)

---

## 🗂️ Project Structure

```
E-Commerce-website-with-Agentic-AI/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── (shop)/         # Shop pages (homepage, products)
│   │   ├── (admin)/        # Admin pages
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   ├── lib/
│   │   ├── database/       # Database abstraction
│   │   │   ├── localstorage-adapter.ts  # ← localStorage DB
│   │   │   ├── prisma-adapter.ts
│   │   │   ├── supabase-adapter.ts
│   │   │   └── types.ts
│   │   └── services/       # Business logic
│   └── types/              # TypeScript types
├── public/                 # Static files
├── .env                    # Environment config
├── package.json           # Dependencies
└── next.config.js         # Next.js config
```

---

## 🔄 Switching to Real Database (Later)

When you're ready to connect to a real database:

1. **Update `.env`:**
```env
# Change from:
DATABASE_PROVIDER=localstorage

# To:
DATABASE_PROVIDER=prisma
# or
DATABASE_PROVIDER=supabase
```

2. **Run database migrations** (for Prisma):
```bash
npx prisma db push
npx prisma db seed
```

3. **Restart server:**
```bash
npm run dev
```

See `DATABASE-SWITCHING.md` for detailed instructions.

---

## 📚 Additional Resources

- **[LOCALSTORAGE-TEST-RESULTS.md](./LOCALSTORAGE-TEST-RESULTS.md)** - Complete test report
- **[COMPLETE-SETUP-GUIDE.md](./COMPLETE-SETUP-GUIDE.md)** - Full setup guide
- **[DATABASE-SWITCHING.md](./DATABASE-SWITCHING.md)** - Switch databases
- **[FREE-DATABASE-OPTIONS.md](./FREE-DATABASE-OPTIONS.md)** - Free database providers
- **[SUPABASE-SETUP.md](./SUPABASE-SETUP.md)** - Supabase configuration

---

## 🆘 Still Having Issues?

### Check Server Logs
Look at the terminal where `npm run dev` is running. You should see:
```
✅ Seeded users: 3
✅ Seeded categories: 6
✅ Seeded products: 6
GET / 200 in Xs
```

### Test from Terminal
```bash
curl http://localhost:3000
```

If this returns HTML, the server works - it's a browser/network issue.

### Common Problems
1. **Port blocked by firewall** - Allow port 3000
2. **Node.js version too old** - Update to Node 18+
3. **Corrupted node_modules** - Delete and reinstall
4. **Cache issues** - Clear browser cache

---

## ✅ Success Checklist

- [ ] Node.js 18+ installed
- [ ] Repository cloned
- [ ] `npm install` completed successfully
- [ ] `.env` file exists with `DATABASE_PROVIDER=localstorage`
- [ ] `npm run dev` running without errors
- [ ] Browser shows homepage at http://localhost:3000
- [ ] Products visible on homepage or /products page
- [ ] Console shows "Seeded products: 6"

---

## 🎉 You're All Set!

Your e-commerce platform is now running locally with:
- ✅ 6 products in localStorage
- ✅ Full shopping functionality
- ✅ No external database needed
- ✅ Fast development with hot reload

**Start building and testing!** 🚀

---

## 📞 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the error messages in terminal
3. Check browser console (F12) for errors
4. Verify all prerequisites are installed
5. Try clearing cache and restarting

**The setup is designed to work out of the box - if it doesn't, something in your environment needs adjustment.**

---

**Last Updated:** 2025-11-19
**Version:** 1.0.0
**Status:** ✅ Production Ready for LocalStorage Mode
