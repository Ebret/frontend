# Credit Cooperative System - Frontend

This is the frontend for the Credit Cooperative System, a modular, white-label solution for credit cooperatives.

## Features

- Role-based access control
- Real-time dashboard updates
- Mobile support (PWA, responsive UI)
- Document management
- Multi-factor authentication
- Self-service portal
- Advanced analytics and reporting

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_COOPERATIVE_NAME="Your Cooperative Name"
NEXT_PUBLIC_PRIMARY_COLOR="#3B82F6"
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Testing

### Unit Tests

Run unit tests with:

```bash
npm test
```

### Integration Tests

Run integration tests with:

```bash
npm run test:integration
```

### End-to-End Tests

Run end-to-end tests with:

```bash
npm run cypress
```

Or run them in headless mode:

```bash
npm run cypress:run
```

### Test Coverage

Generate a test coverage report with:

```bash
npm run test:coverage
```

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment. The pipeline:

1. Runs all tests on every pull request
2. Ensures code quality with linting
3. Generates test coverage reports
4. Prevents merging if tests fail

The configuration is in `.github/workflows/test-pipeline.yml`.

## Project Structure

- `src/app`: Next.js app router pages
- `src/components`: Reusable React components
- `src/contexts`: React context providers
- `src/hooks`: Custom React hooks
- `src/lib`: Utility functions and API clients
- `src/utils`: Helper functions

## Test-Driven Development

We follow Test-Driven Development (TDD) principles:

1. Write a failing test that defines the expected behavior
2. Implement the feature to make the test pass
3. Refactor the code while ensuring tests continue to pass

See the [Testing Guide](../docs/testing-guide.md) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
