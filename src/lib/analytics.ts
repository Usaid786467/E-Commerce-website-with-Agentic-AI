/**
 * Analytics and Performance Monitoring
 * Track page views, events, and performance metrics
 */

interface PageViewData {
  path: string
  title: string
  referrer?: string
  timestamp: number
}

interface EventData {
  category: string
  action: string
  label?: string
  value?: number
  timestamp: number
}

interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  timestamp: number
}

class Analytics {
  private isProduction = process.env.NODE_ENV === 'production'
  private analyticsId = process.env.NEXT_PUBLIC_GA_ID

  /**
   * Track page view
   */
  pageView(data: Omit<PageViewData, 'timestamp'>) {
    const pageViewData: PageViewData = {
      ...data,
      timestamp: Date.now(),
    }

    if (this.isProduction && this.analyticsId) {
      // Send to Google Analytics if configured
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('config', this.analyticsId, {
          page_path: data.path,
          page_title: data.title,
        })
      }
    } else {
      console.log('[Analytics] Page View:', pageViewData)
    }
  }

  /**
   * Track custom event
   */
  event(data: Omit<EventData, 'timestamp'>) {
    const eventData: EventData = {
      ...data,
      timestamp: Date.now(),
    }

    if (this.isProduction && this.analyticsId) {
      // Send to Google Analytics if configured
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', data.action, {
          event_category: data.category,
          event_label: data.label,
          value: data.value,
        })
      }
    } else {
      console.log('[Analytics] Event:', eventData)
    }
  }

  /**
   * Track e-commerce events
   */
  trackAddToCart(product: { id: string; name: string; price: number; quantity: number }) {
    this.event({
      category: 'Ecommerce',
      action: 'add_to_cart',
      label: product.name,
      value: product.price * product.quantity,
    })

    if (this.isProduction && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'add_to_cart', {
        currency: 'PKR',
        value: product.price * product.quantity,
        items: [
          {
            item_id: product.id,
            item_name: product.name,
            price: product.price,
            quantity: product.quantity,
          },
        ],
      })
    }
  }

  trackRemoveFromCart(product: { id: string; name: string; price: number; quantity: number }) {
    this.event({
      category: 'Ecommerce',
      action: 'remove_from_cart',
      label: product.name,
      value: product.price * product.quantity,
    })
  }

  trackPurchase(order: {
    orderId: string
    total: number
    items: Array<{ id: string; name: string; price: number; quantity: number }>
  }) {
    this.event({
      category: 'Ecommerce',
      action: 'purchase',
      label: order.orderId,
      value: order.total,
    })

    if (this.isProduction && typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: order.orderId,
        value: order.total,
        currency: 'PKR',
        items: order.items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      })
    }
  }

  trackSearch(query: string, resultCount: number) {
    this.event({
      category: 'Search',
      action: 'search',
      label: query,
      value: resultCount,
    })
  }

  /**
   * Track Core Web Vitals
   */
  trackWebVitals(metric: { name: string; value: number; rating: string }) {
    const performanceMetric: PerformanceMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating as any,
      timestamp: Date.now(),
    }

    if (this.isProduction && this.analyticsId) {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          non_interaction: true,
        })
      }
    } else {
      console.log('[Analytics] Web Vital:', performanceMetric)
    }
  }

  /**
   * Track API performance
   */
  trackAPICall(endpoint: string, duration: number, status: number) {
    const rating =
      duration < 500 ? 'good' : duration < 1000 ? 'needs-improvement' : 'poor'

    this.event({
      category: 'API Performance',
      action: endpoint,
      label: `${status}`,
      value: duration,
    })

    if (!this.isProduction) {
      console.log(`[Analytics] API Call: ${endpoint} - ${duration}ms (${status})`)
    }
  }
}

export const analytics = new Analytics()

/**
 * Measure API call performance
 */
export async function measureAPICall<T>(
  endpoint: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now()
  let status = 200

  try {
    const result = await fn()
    return result
  } catch (error) {
    status = error instanceof Error ? 500 : 400
    throw error
  } finally {
    const duration = performance.now() - start
    analytics.trackAPICall(endpoint, duration, status)
  }
}

/**
 * Measure function execution time
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  const start = performance.now()

  try {
    const result = fn()
    return result
  } finally {
    const duration = performance.now() - start
    const rating =
      duration < 100 ? 'good' : duration < 300 ? 'needs-improvement' : 'poor'

    analytics.trackWebVitals({
      name,
      value: duration,
      rating,
    })
  }
}
