'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart-store'
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  LogOut,
  Settings,
  Package,
} from 'lucide-react'

export function Header() {
  const { data: session } = useSession()
  const { itemsCount, toggleCart } = useCartStore()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="container-wide flex items-center justify-between py-2 text-sm">
          <div className="flex items-center gap-4">
            <span>Free Shipping on orders over PKR 2,000</span>
          </div>
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span>Welcome, {session.user?.name}</span>
                <button
                  onClick={() => signOut()}
                  className="hover:underline flex items-center gap-1"
                >
                  <LogOut className="h-3 w-3" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  Login
                </Link>
                <span>|</span>
                <Link href="/register" className="hover:underline">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container-wide">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold font-heading bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              ShopAI
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/account/orders">
                <Button variant="ghost" size="icon">
                  <Package className="h-5 w-5" />
                </Button>
              </Link>
            ) : null}

            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {itemsCount}
                </Badge>
              )}
            </Button>

            {session ? (
              <Link href="/account/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t">
        <div className="container-wide">
          <nav className="flex items-center gap-6 py-3 text-sm font-medium">
            <Link
              href="/"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/categories"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/deals"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Deals
            </Link>
            <Link
              href="/new-arrivals"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              New Arrivals
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
