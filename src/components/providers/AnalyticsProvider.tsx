'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { analytics } from '@/lib/analytics'

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Track page view on route change
    analytics.pageView({
      path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
      title: document.title,
      referrer: document.referrer,
    })
  }, [pathname, searchParams])

  return <>{children}</>
}
