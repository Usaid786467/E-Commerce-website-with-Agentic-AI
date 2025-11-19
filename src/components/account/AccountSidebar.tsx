'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  MapPin,
  Heart,
  Settings,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Card } from '@/components/ui/card'

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/account',
    icon: LayoutDashboard,
  },
  {
    title: 'Orders',
    href: '/account/orders',
    icon: ShoppingBag,
  },
  {
    title: 'Profile',
    href: '/account/profile',
    icon: User,
  },
  {
    title: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    title: 'Wishlist',
    href: '/account/wishlist',
    icon: Heart,
  },
  {
    title: 'Settings',
    href: '/account/settings',
    icon: Settings,
  },
]

export function AccountSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <Card className="p-4 sticky top-4">
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                {
                  'bg-primary text-primary-foreground': isActive,
                  'text-muted-foreground hover:bg-muted hover:text-foreground': !isActive,
                }
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </nav>
    </Card>
  )
}
