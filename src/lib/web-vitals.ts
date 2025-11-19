/**
 * Web Vitals Reporter
 * Automatically tracks Core Web Vitals (CWV) metrics
 */

import { analytics } from './analytics'

export function reportWebVitals(metric: any) {
  // Track all web vitals to analytics
  analytics.trackWebVitals({
    name: metric.name,
    value: metric.value,
    rating: metric.rating || 'good',
  })

  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
    })
  }
}
