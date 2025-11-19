'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Store,
  ArrowLeft,
} from 'lucide-react'

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-background border-r min-h-screen sticky top-0">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Admin Panel</span>
        </Link>
      </div>

      <nav className="p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  {
                    'bg-primary text-primary-foreground': isActive,
                    'text-muted-foreground hover:bg-muted hover:text-foreground':
                      !isActive,
                  }
                )}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </div>

        <div className="mt-8 pt-4 border-t">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Store
          </Link>
        </div>
      </nav>
    </aside>
  )
}
