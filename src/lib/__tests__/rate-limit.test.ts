import {
  rateLimit,
  isRateLimited,
  getRateLimitHeaders,
  clearRateLimits,
  RateLimitPresets,
} from '../rate-limit'

describe('rateLimit', () => {
  beforeEach(() => {
    clearRateLimits()
  })

  it('should allow requests within limit', () => {
    const mockRequest = new Request('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    })

    const result = rateLimit(mockRequest, { maxRequests: 5, windowSeconds: 60 })

    expect(result.success).toBe(true)
    expect(result.limit).toBe(5)
    expect(result.remaining).toBe(4) // First request consumes 1
  })

  it('should block requests exceeding limit', () => {
    const mockRequest = new Request('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    })

    // Make 5 requests (the limit)
    for (let i = 0; i < 5; i++) {
      rateLimit(mockRequest, { maxRequests: 5, windowSeconds: 60 })
    }

    // 6th request should be blocked
    const result = rateLimit(mockRequest, { maxRequests: 5, windowSeconds: 60 })

    expect(result.success).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('should track different IPs separately', () => {
    const request1 = new Request('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    })
    const request2 = new Request('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '192.168.1.1' },
    })

    // Make 5 requests from first IP
    for (let i = 0; i < 5; i++) {
      rateLimit(request1, { maxRequests: 5, windowSeconds: 60 })
    }

    // Request from second IP should still be allowed
    const result = rateLimit(request2, { maxRequests: 5, windowSeconds: 60 })

    expect(result.success).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('should use custom identifier', () => {
    const mockRequest = new Request('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    })

    const result = rateLimit(mockRequest, {
      maxRequests: 5,
      windowSeconds: 60,
      identifier: 'custom-id',
    })

    expect(result.success).toBe(true)
  })
})

describe('isRateLimited', () => {
  beforeEach(() => {
    clearRateLimits()
  })

  it('should return false when not rate limited', () => {
    const mockRequest = new Request('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    })

    expect(isRateLimited(mockRequest, { maxRequests: 5 })).toBe(false)
  })

  it('should return true when rate limited', () => {
    const mockRequest = new Request('http://localhost:3000/api/test', {
      headers: { 'x-forwarded-for': '127.0.0.1' },
    })

    // Exhaust the limit
    for (let i = 0; i < 5; i++) {
      rateLimit(mockRequest, { maxRequests: 5, windowSeconds: 60 })
    }

    expect(isRateLimited(mockRequest, { maxRequests: 5, windowSeconds: 60 })).toBe(true)
  })
})

describe('getRateLimitHeaders', () => {
  it('should return correct headers', () => {
    const result = {
      success: true,
      limit: 100,
      remaining: 95,
      reset: 1234567890,
    }

    const headers = getRateLimitHeaders(result)

    expect(headers['X-RateLimit-Limit']).toBe('100')
    expect(headers['X-RateLimit-Remaining']).toBe('95')
    expect(headers['X-RateLimit-Reset']).toBe('1234567890')
  })
})

describe('RateLimitPresets', () => {
  it('should have auth preset', () => {
    expect(RateLimitPresets.auth).toEqual({
      maxRequests: 5,
      windowSeconds: 60,
    })
  })

  it('should have api preset', () => {
    expect(RateLimitPresets.api).toEqual({
      maxRequests: 100,
      windowSeconds: 60,
    })
  })

  it('should have public preset', () => {
    expect(RateLimitPresets.public).toEqual({
      maxRequests: 200,
      windowSeconds: 60,
    })
  })

  it('should have sensitive preset', () => {
    expect(RateLimitPresets.sensitive).toEqual({
      maxRequests: 3,
      windowSeconds: 300,
    })
  })
})
