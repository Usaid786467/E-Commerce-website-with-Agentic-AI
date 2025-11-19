# Testing Guide

This document provides information about testing the e-commerce platform.

## Test Setup

The project uses **Jest** as the testing framework along with **React Testing Library** for component testing.

### Installation

Install the required testing dependencies:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with coverage
```bash
npm test -- --coverage
```

### Run specific test file
```bash
npm test -- utils.test.ts
```

## Test Structure

Tests are organized in the following structure:

```
src/
├── lib/
│   ├── __tests__/
│   │   ├── utils.test.ts
│   │   ├── rate-limit.test.ts
│   │   └── ...
│   └── utils.ts
├── components/
│   ├── __tests__/
│   │   ├── Button.test.tsx
│   │   └── ...
│   └── ui/
```

## Writing Tests

### Unit Tests

Unit tests focus on testing individual functions or utilities in isolation.

**Example: Testing utility functions**

```typescript
import { formatCurrency } from '../utils'

describe('formatCurrency', () => {
  it('should format PKR currency correctly', () => {
    expect(formatCurrency(1000, 'PKR')).toBe('Rs. 1,000.00')
  })
})
```

### Component Tests

Component tests use React Testing Library to test UI components.

**Example: Testing a button component**

```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### API Tests

API route tests verify that endpoints respond correctly.

**Example: Testing an API endpoint**

```typescript
import { POST } from '@/app/api/products/route'

describe('POST /api/products', () => {
  it('should create a product', async () => {
    const mockRequest = new Request('http://localhost:3000/api/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test Product' }),
    })

    const response = await POST(mockRequest)
    expect(response.status).toBe(201)
  })
})
```

## Testing Best Practices

1. **AAA Pattern**: Arrange, Act, Assert
   - Arrange: Set up test data and conditions
   - Act: Execute the code being tested
   - Assert: Verify the expected outcome

2. **Descriptive Test Names**: Use clear, descriptive test names
   ```typescript
   it('should display error message when email is invalid', () => {
     // ...
   })
   ```

3. **Test Isolation**: Each test should be independent
   - Use `beforeEach` and `afterEach` for setup and cleanup
   - Don't rely on test execution order

4. **Mock External Dependencies**: Mock API calls, database queries, etc.
   ```typescript
   jest.mock('../api-client', () => ({
     fetchProducts: jest.fn().mockResolvedValue([]),
   }))
   ```

5. **Test Edge Cases**: Include tests for:
   - Empty values
   - Null/undefined
   - Extreme values
   - Error conditions

## Mocking

### Mocking Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      pathname: '/',
    }
  },
}))
```

### Mocking NextAuth

```typescript
jest.mock('next-auth/react', () => ({
  useSession() {
    return {
      data: { user: { id: '1', email: 'test@example.com' } },
      status: 'authenticated',
    }
  },
}))
```

### Mocking Prisma

```typescript
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn(),
    },
  },
}))
```

## Coverage Goals

Aim for the following coverage metrics:

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Continuous Integration

Tests are automatically run on:
- Every commit
- Pull requests
- Before deployment

## Test Categories

### 1. Unit Tests (Priority: High)
- Utility functions
- Helper functions
- Data transformations

### 2. Integration Tests (Priority: Medium)
- API endpoints
- Service layer functions
- Database operations

### 3. Component Tests (Priority: Medium)
- UI components
- Forms
- Interactive elements

### 4. E2E Tests (Priority: Low)
- Critical user flows
- Checkout process
- Authentication flows

## Future Testing Enhancements

- [ ] Add E2E testing with Playwright
- [ ] Add visual regression testing
- [ ] Add performance testing
- [ ] Add accessibility testing
- [ ] Increase test coverage to 90%+
- [ ] Add mutation testing
- [ ] Add API contract testing

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Next.js Testing Guide](https://nextjs.org/docs/testing)

## Support

If you encounter issues with tests:
1. Check that all dependencies are installed
2. Clear Jest cache: `npm test -- --clearCache`
3. Review test error messages carefully
4. Check for outdated snapshots
