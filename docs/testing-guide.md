# Testing Guide for Credit Cooperative System

This guide outlines the testing approach and best practices for the Credit Cooperative System project.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Test-Driven Development (TDD)](#test-driven-development-tdd)
3. [Types of Tests](#types-of-tests)
4. [Testing Tools](#testing-tools)
5. [Writing Tests](#writing-tests)
6. [Running Tests](#running-tests)
7. [CI/CD Integration](#cicd-integration)
8. [Mocking Dependencies](#mocking-dependencies)
9. [Test Coverage](#test-coverage)
10. [Troubleshooting](#troubleshooting)

## Testing Philosophy

Our testing approach follows these principles:

- **Test-Driven Development (TDD)**: Write tests before implementing features
- **Comprehensive Coverage**: Aim for high test coverage across all components
- **Realistic Testing**: Tests should reflect real-world usage scenarios
- **Maintainable Tests**: Tests should be easy to understand and maintain
- **Fast Feedback**: Tests should run quickly to provide immediate feedback

## Test-Driven Development (TDD)

We follow the TDD approach for new features:

1. **Write a failing test** that defines the expected behavior
2. **Implement the feature** to make the test pass
3. **Refactor the code** while ensuring tests continue to pass

### TDD Example

Here's an example of the TDD workflow for a new component:

1. Write a test for the component:
   ```typescript
   // CurrencyConverter.test.tsx
   it('converts Philippine Peso to US Dollar correctly', () => {
     render(<CurrencyConverter />);
     
     // Enter an amount in PHP
     const amountInput = screen.getByLabelText('Amount (₱)');
     fireEvent.change(amountInput, { target: { value: '1000' } });
     
     // Select USD as the target currency
     const currencySelect = screen.getByLabelText('Convert to');
     fireEvent.change(currencySelect, { target: { value: 'USD' } });
     
     // Click the convert button
     const convertButton = screen.getByRole('button', { name: 'Convert' });
     fireEvent.click(convertButton);
     
     // Check if the conversion result is displayed correctly
     expect(screen.getByText(/Converted Amount: \$18.00/)).toBeInTheDocument();
   });
   ```

2. Implement the component to make the test pass:
   ```typescript
   // CurrencyConverter.tsx
   const handleConvert = () => {
     // Validate input
     const numericAmount = parseFloat(amount);
     if (isNaN(numericAmount)) {
       setError('Please enter a valid number');
       return;
     }

     // Find the selected currency
     const selectedCurrency = currencyOptions.find(
       (currency) => currency.value === targetCurrency
     );

     // Convert the amount
     const converted = numericAmount * selectedCurrency.rate;

     // Format the converted amount
     setConvertedAmount(formatCurrency(converted, targetCurrency));
   };
   ```

3. Refactor as needed while ensuring tests continue to pass.

## Types of Tests

We use several types of tests:

### Unit Tests

- Test individual components and functions in isolation
- Focus on a single unit of functionality
- Mock external dependencies
- Located in `__tests__` directories next to the code being tested
- File naming: `ComponentName.test.tsx` or `functionName.test.ts`

### Integration Tests

- Test how multiple components or functions work together
- Verify interactions between different parts of the system
- May involve real API calls or database interactions
- Located in `__tests__` directories with `.integration.test.tsx` suffix
- File naming: `ComponentName.integration.test.tsx`

### End-to-End (E2E) Tests

- Test the entire application from the user's perspective
- Simulate real user interactions
- Run against a fully deployed application
- Located in `cypress/e2e` directory
- File naming: `feature-name.cy.js`

## Testing Tools

We use the following testing tools:

### Frontend Testing

- **Jest**: Test runner and assertion library
- **React Testing Library**: Testing React components
- **Cypress**: End-to-end testing

### Backend Testing

- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertions for API testing

## Writing Tests

### Frontend Component Tests

```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    render(<MyComponent />);
    fireEvent.click(screen.getByRole('button', { name: 'Click Me' }));
    expect(screen.getByText('Button Clicked')).toBeInTheDocument();
  });
});
```

### Backend API Tests

```javascript
const request = require('supertest');
const app = require('../../src/server');

describe('Auth API', () => {
  it('should login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

### E2E Tests

```javascript
describe('Login Flow', () => {
  it('should login successfully with valid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('admin@kacooperatiba.com');
    cy.get('input[name="password"]').type('Password123!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## Running Tests

### Frontend Tests

```bash
# Run all frontend tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Run E2E tests
npm run cypress
```

### Backend Tests

```bash
# Run all backend tests
cd backend
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

## CI/CD Integration

We use GitHub Actions for continuous integration and deployment. The CI/CD pipeline:

1. Runs all tests on every pull request
2. Ensures code quality with linting
3. Generates test coverage reports
4. Prevents merging if tests fail

The configuration is in `.github/workflows/test-pipeline.yml`.

## Mocking Dependencies

### Mocking Prisma

We use a centralized Prisma mock for backend tests:

```javascript
// tests/mocks/prisma.mock.js
const mockPrismaClient = {
  user: {
    findMany: jest.fn(),
    create: jest.fn(),
    // ...other methods
  },
  // ...other models
};

module.exports = {
  PrismaClient: jest.fn(() => mockPrismaClient),
  mockPrismaClient,
};
```

Usage in tests:

```javascript
// Import the mock
const { mockPrismaClient } = require('../mocks/prisma.mock');

// Mock the Prisma client
jest.mock('@prisma/client', () => require('../mocks/prisma.mock'));

// Set up mock return values
mockPrismaClient.user.findMany.mockResolvedValue([
  { id: 1, name: 'Test User' },
]);
```

### Mocking API Calls

We use MSW (Mock Service Worker) for frontend API mocks:

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Set up mock server
const server = setupServer(
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { id: 1, name: 'Test User' },
      ])
    );
  })
);

// Start the server before tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close the server after all tests
afterAll(() => server.close());
```

## Test Coverage

We aim for high test coverage:

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

To generate a coverage report:

```bash
# Frontend coverage
npm run test:coverage

# Backend coverage
cd backend
npm run test:coverage
```

Coverage reports are available in the `coverage` directory.

## Troubleshooting

### Common Issues

1. **Tests failing due to async operations**:
   - Use `async/await` or `waitFor` from React Testing Library
   - Ensure promises are properly resolved

2. **Component not rendering as expected**:
   - Check if the component depends on context providers
   - Wrap the component in the necessary providers during testing

3. **Mock not working**:
   - Ensure the mock is set up before the module is imported
   - Check if the mock path is correct

### Debugging Tests

- Use `console.log` or `debug()` from React Testing Library
- Run tests with `--verbose` flag for more detailed output
- Use the `--watch` flag to run tests in watch mode

```bash
# Debug a specific test
npm test -- MyComponent.test.tsx --watch
```
