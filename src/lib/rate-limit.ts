/**
 * Rate Limiting Utility
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitOptions {
  /**
   * Maximum number of requests allowed within the window
   */
  maxRequests?: number
  /**
   * Time window in seconds
   */
  windowSeconds?: number
  /**
   * Custom identifier (defaults to IP address)
   */
  identifier?: string
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

/**
 * Rate limit a request
 */
export function rateLimit(
  request: Request,
  options: RateLimitOptions = {}
): RateLimitResult {
  const {
    maxRequests = 100, // Default: 100 requests
    windowSeconds = 60, // Default: per minute
    identifier,
  } = options

  // Get identifier (IP address or custom identifier)
  const headers = new Headers(request.headers)
  const ip =
    identifier ||
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    'unknown'

  const key = `${ip}:${request.url}`
  const now = Date.now()
  const windowMs = windowSeconds * 1000

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key)

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries()
  }

  // If entry doesn't exist or has expired, create a new one
  if (!entry || now > entry.resetTime) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
    }
    rateLimitStore.set(key, entry)
  }

  // Increment request count
  entry.count++

  const remaining = Math.max(0, maxRequests - entry.count)
  const success = entry.count <= maxRequests

  return {
    success,
    limit: maxRequests,
    remaining,
    reset: Math.ceil(entry.resetTime / 1000),
  }
}

/**
 * Check if a request is rate limited
 */
export function isRateLimited(
  request: Request,
  options: RateLimitOptions = {}
): boolean {
  const result = rateLimit(request, options)
  return !result.success
}

/**
 * Get rate limit headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toString(),
  }
}

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  const keysToDelete: string[] = []

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  })

  keysToDelete.forEach((key) => rateLimitStore.delete(key))
}

/**
 * Clear all rate limit entries (useful for testing)
 */
export function clearRateLimits(): void {
  rateLimitStore.clear()
}

/**
 * Rate limit presets
 */
export const RateLimitPresets = {
  // Strict rate limit for authentication endpoints
  auth: {
    maxRequests: 5,
    windowSeconds: 60, // 5 requests per minute
  },
  // Standard rate limit for API endpoints
  api: {
    maxRequests: 100,
    windowSeconds: 60, // 100 requests per minute
  },
  // Lenient rate limit for public endpoints
  public: {
    maxRequests: 200,
    windowSeconds: 60, // 200 requests per minute
  },
  // Very strict rate limit for sensitive operations
  sensitive: {
    maxRequests: 3,
    windowSeconds: 300, // 3 requests per 5 minutes
  },
} as const
