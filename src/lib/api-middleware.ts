/**
 * API Middleware Utilities
 * Helper functions for API route protection
 */

import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getRateLimitHeaders, RateLimitOptions } from './rate-limit'

/**
 * Apply rate limiting to an API route
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: RateLimitOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const rateLimitResult = rateLimit(request, options)

    // If rate limit exceeded, return 429 Too Many Requests
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          retryAfter: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      )
    }

    // Call the handler and add rate limit headers to the response
    const response = await handler(request)

    // Add rate limit headers to successful responses
    const headers = new Headers(response.headers)
    Object.entries(getRateLimitHeaders(rateLimitResult)).forEach(
      ([key, value]) => {
        headers.set(key, value)
      }
    )

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

/**
 * CORS middleware for API routes
 */
export function withCors(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    origin?: string | string[]
    methods?: string[]
    allowedHeaders?: string[]
    credentials?: boolean
  } = {}
) {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders = ['Content-Type', 'Authorization'],
    credentials = true,
  } = options

  return async (request: NextRequest): Promise<NextResponse> => {
    // Handle preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': Array.isArray(origin)
            ? origin[0]
            : origin,
          'Access-Control-Allow-Methods': methods.join(', '),
          'Access-Control-Allow-Headers': allowedHeaders.join(', '),
          ...(credentials && {
            'Access-Control-Allow-Credentials': 'true',
          }),
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    // Call the handler
    const response = await handler(request)

    // Add CORS headers to response
    const headers = new Headers(response.headers)
    headers.set(
      'Access-Control-Allow-Origin',
      Array.isArray(origin) ? origin[0] : origin
    )
    if (credentials) {
      headers.set('Access-Control-Allow-Credentials', 'true')
    }

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    })
  }
}

/**
 * Combine multiple middleware functions
 */
export function composeMiddleware(
  ...middlewares: Array<
    (
      handler: (request: NextRequest) => Promise<NextResponse>
    ) => (request: NextRequest) => Promise<NextResponse>
  >
) {
  return (handler: (request: NextRequest) => Promise<NextResponse>) => {
    return middlewares.reduceRight(
      (composed, middleware) => middleware(composed),
      handler
    )
  }
}

/**
 * Request validation middleware
 */
export function withValidation<T>(
  handler: (request: NextRequest, body: T) => Promise<NextResponse>,
  validate: (body: unknown) => body is T
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.json()

      if (!validate(body)) {
        return NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        )
      }

      return handler(request, body)
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }
  }
}

/**
 * Error handling middleware
 */
export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request)
    } catch (error) {
      console.error('API Error:', error)

      return NextResponse.json(
        {
          error: 'Internal server error',
          message:
            process.env.NODE_ENV === 'development'
              ? error instanceof Error
                ? error.message
                : 'Unknown error'
              : undefined,
        },
        { status: 500 }
      )
    }
  }
}

/**
 * Request logging middleware
 */
export function withLogging(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const start = Date.now()
    const method = request.method
    const url = request.url

    console.log(`[API] ${method} ${url} - Started`)

    try {
      const response = await handler(request)
      const duration = Date.now() - start

      console.log(
        `[API] ${method} ${url} - ${response.status} (${duration}ms)`
      )

      return response
    } catch (error) {
      const duration = Date.now() - start
      console.error(
        `[API] ${method} ${url} - Error (${duration}ms)`,
        error
      )
      throw error
    }
  }
}
