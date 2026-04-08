# Credit Cooperative System - Backend

This is the backend API for the Credit Cooperative System, a modular, white-label solution for credit cooperatives.

## Features

- RESTful API design
- Role-based access control
- Real-time notifications with WebSockets
- Comprehensive audit logging
- Secure authentication with JWT
- Database migrations and seeding
- Comprehensive test coverage

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- PostgreSQL 13.x or higher

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with the following variables:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/credit_coop_db?schema=public"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="1d"
JWT_REFRESH_SECRET="your-refresh-secret-key"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run database migrations:

```bash
npx prisma migrate dev
```

6. Seed the database:

```bash
npm run prisma:seed
```

### Running the Development Server

```bash
npm run dev
```

The API will be available at [http://localhost:5000](http://localhost:5000).

## Testing

### Unit Tests

Run unit tests with:

```bash
npm run test:unit
```

### Integration Tests

Run integration tests with:

```bash
npm run test:integration
```

### End-to-End Tests

Run end-to-end tests with:

```bash
npm run test:e2e
```

### Test Coverage

Generate a test coverage report with:

```bash
npm run test:coverage
```

## Test-Driven Development

We follow Test-Driven Development (TDD) principles:

1. Write a failing test that defines the expected behavior
2. Implement the feature to make the test pass
3. Refactor the code while ensuring tests continue to pass

See the [Testing Guide](../docs/testing-guide.md) for more details.

## API Documentation

API documentation is available at [http://localhost:5000/api-docs](http://localhost:5000/api-docs) when the server is running.

## Project Structure

- `src/controllers`: API route handlers
- `src/middleware`: Express middleware
- `src/models`: Database models and schemas
- `src/routes`: API route definitions
- `src/services`: Business logic
- `src/utils`: Helper functions
- `tests`: Test files

## Database Schema

The database schema is defined in `prisma/schema.prisma`. Key models include:

- User
- Cooperative
- Loan
- LoanProduct
- SavingsAccount
- Transaction
- AuditLog
- Notification

## License

This project is licensed under the MIT License - see the LICENSE file for details.
