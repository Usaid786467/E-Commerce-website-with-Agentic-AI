import {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  slugify,
  truncateText,
  calculateDiscountedPrice,
  calculateDiscountPercentage,
} from '../utils'

describe('formatCurrency', () => {
  it('should format PKR currency correctly', () => {
    expect(formatCurrency(1000, 'PKR')).toBe('Rs. 1,000.00')
    expect(formatCurrency(1234.56, 'PKR')).toBe('Rs. 1,234.56')
  })

  it('should format USD currency correctly', () => {
    expect(formatCurrency(1000, 'USD')).toBe('$1,000.00')
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
  })

  it('should handle zero and negative values', () => {
    expect(formatCurrency(0, 'PKR')).toBe('Rs. 0.00')
    expect(formatCurrency(-100, 'PKR')).toBe('-Rs. 100.00')
  })
})

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-15T10:30:00Z')
    const formatted = formatDate(date)
    expect(formatted).toContain('Jan')
    expect(formatted).toContain('15')
    expect(formatted).toContain('2024')
  })

  it('should handle date strings', () => {
    const formatted = formatDate('2024-01-15')
    expect(formatted).toBeTruthy()
  })
})

describe('slugify', () => {
  it('should convert text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
    expect(slugify('Product Name 123')).toBe('product-name-123')
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
  })

  it('should handle special characters', () => {
    expect(slugify('Product @ $100')).toBe('product-100')
    expect(slugify('Test & Product')).toBe('test-product')
  })

  it('should handle empty strings', () => {
    expect(slugify('')).toBe('')
    expect(slugify('   ')).toBe('')
  })
})

describe('truncateText', () => {
  it('should truncate long text', () => {
    const longText = 'This is a very long text that needs to be truncated'
    expect(truncateText(longText, 20)).toBe('This is a very lo...')
  })

  it('should not truncate short text', () => {
    const shortText = 'Short text'
    expect(truncateText(shortText, 20)).toBe('Short text')
  })

  it('should handle exact length', () => {
    const text = 'Exactly twenty chars'
    expect(truncateText(text, 20)).toBe('Exactly twenty chars')
  })
})

describe('calculateDiscountedPrice', () => {
  it('should calculate percentage discount correctly', () => {
    expect(calculateDiscountedPrice(100, 10, 'percentage')).toBe(90)
    expect(calculateDiscountedPrice(200, 25, 'percentage')).toBe(150)
    expect(calculateDiscountedPrice(50, 50, 'percentage')).toBe(25)
  })

  it('should calculate fixed discount correctly', () => {
    expect(calculateDiscountedPrice(100, 10, 'fixed')).toBe(90)
    expect(calculateDiscountedPrice(200, 50, 'fixed')).toBe(150)
  })

  it('should not allow negative prices', () => {
    expect(calculateDiscountedPrice(50, 100, 'fixed')).toBe(0)
    expect(calculateDiscountedPrice(50, 200, 'percentage')).toBe(0)
  })

  it('should handle zero discount', () => {
    expect(calculateDiscountedPrice(100, 0, 'percentage')).toBe(100)
    expect(calculateDiscountedPrice(100, 0, 'fixed')).toBe(100)
  })
})

describe('calculateDiscountPercentage', () => {
  it('should calculate discount percentage correctly', () => {
    expect(calculateDiscountPercentage(100, 80)).toBe(20)
    expect(calculateDiscountPercentage(200, 150)).toBe(25)
    expect(calculateDiscountPercentage(50, 25)).toBe(50)
  })

  it('should handle no discount', () => {
    expect(calculateDiscountPercentage(100, 100)).toBe(0)
  })

  it('should handle zero original price', () => {
    expect(calculateDiscountPercentage(0, 0)).toBe(0)
  })

  it('should round to 2 decimal places', () => {
    expect(calculateDiscountPercentage(100, 66.666)).toBe(33.33)
  })
})
