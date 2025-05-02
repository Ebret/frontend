# Credit Cooperative System Documentation

This documentation provides a comprehensive guide to the Credit Cooperative System, including its architecture, components, and usage.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Components](#components)
5. [API Documentation](#api-documentation)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Performance Optimization](#performance-optimization)

## Introduction

The Credit Cooperative System is a modular, white-label solution designed for credit cooperatives. It provides a comprehensive set of features for managing members, accounts, loans, and other cooperative operations.

### Key Features

- **User Management**: Comprehensive user management with role-based access control
- **E-Wallet**: Secure digital wallet for members
- **Data Privacy**: Full compliance with the Philippines Data Privacy Act of 2012 (RA 10173)
- **White-Label**: Customizable branding and theming
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: WebSocket integration for real-time notifications and dashboard updates

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/credit-cooperative-system.git
   cd credit-cooperative-system
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Architecture

The Credit Cooperative System follows a modern, component-based architecture using Next.js for the frontend and a RESTful API for the backend.

### Frontend Architecture

- **Framework**: Next.js 15.x
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **API Communication**: Fetch API with custom client
- **Authentication**: JWT-based authentication
- **Real-time Updates**: WebSockets

### Backend Architecture

- **API**: RESTful API
- **Authentication**: JWT-based authentication
- **Database**: PostgreSQL with Supabase
- **Caching**: Redis
- **File Storage**: Supabase Storage

## Components

The system is built using a component-based architecture, with reusable components organized by functionality.

### Core Components

- **Layout**: Main layout components for the application
- **Auth**: Authentication-related components
- **Admin**: Administrative components
- **Member**: Member-facing components
- **E-Wallet**: E-Wallet components
- **Common**: Shared components used throughout the application

### Data Privacy Components

The system includes several components for ensuring compliance with the Philippines Data Privacy Act:

- **DataPrivacyAgreement**: Modal component for displaying the data privacy agreement
- **EWalletDataPrivacyAgreement**: Specialized version for the E-Wallet
- **DataPrivacyFooter**: Footer component with privacy information and links

### Form Components

- **FormValidation**: Utility for validating form inputs
- **RoleSelector**: Component for selecting user roles
- **UserOnboardingOptions**: Component for managing user onboarding options

### Audit Components

- **AuditLogViewer**: Component for viewing audit logs
- **AuditLogInitializer**: Component for initializing the audit log system

## API Documentation

The Credit Cooperative System uses a RESTful API for communication between the frontend and backend.

### Authentication

#### Login

```
POST /api/auth/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "ADMIN"
    }
  }
}
```

#### Register

```
POST /api/auth/register
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response:
```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEMBER"
    }
  }
}
```

### User Management

#### Get Users

```
GET /api/users
```

Response:
```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "ADMIN",
        "status": "ACTIVE",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

#### Create User

```
POST /api/users
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "MEMBER"
}
```

Response:
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEMBER",
      "status": "PENDING_VERIFICATION",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

#### Import Users

```
POST /api/users/import
```

Request:
```json
{
  "users": [
    {
      "email": "user1@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEMBER"
    },
    {
      "email": "user2@example.com",
      "firstName": "Jane",
      "lastName": "Doe",
      "role": "MEMBER"
    }
  ]
}
```

Response:
```json
{
  "status": "success",
  "message": "Successfully imported 2 users",
  "data": {
    "importedCount": 2,
    "successCount": 2,
    "failureCount": 0,
    "users": [
      {
        "id": 1,
        "email": "user1@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "MEMBER",
        "status": "PENDING_VERIFICATION",
        "createdAt": "2023-01-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "email": "user2@example.com",
        "firstName": "Jane",
        "lastName": "Doe",
        "role": "MEMBER",
        "status": "PENDING_VERIFICATION",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

### Audit Logs

#### Create Audit Log

```
POST /api/audit-logs
```

Request:
```json
{
  "actionType": "USER_CREATED",
  "performedBy": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User"
  },
  "timestamp": "2023-01-01T00:00:00.000Z",
  "targetUser": {
    "id": 2,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "details": {
    "creationMethod": "manual",
    "userRole": "MEMBER"
  }
}
```

Response:
```json
{
  "status": "success",
  "message": "Audit log created successfully",
  "data": {
    "id": 1,
    "actionType": "USER_CREATED",
    "performedBy": {
      "id": 1,
      "email": "admin@example.com",
      "name": "Admin User"
    },
    "timestamp": "2023-01-01T00:00:00.000Z",
    "targetUser": {
      "id": 2,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "details": {
      "creationMethod": "manual",
      "userRole": "MEMBER"
    }
  }
}
```

#### Get Audit Logs

```
GET /api/audit-logs
```

Response:
```json
{
  "status": "success",
  "message": "Audit logs retrieved successfully",
  "data": {
    "logs": [
      {
        "id": 1,
        "actionType": "USER_CREATED",
        "performedBy": {
          "id": 1,
          "email": "admin@example.com",
          "name": "Admin User"
        },
        "timestamp": "2023-01-01T00:00:00.000Z",
        "targetUser": {
          "id": 2,
          "email": "user@example.com",
          "name": "John Doe"
        },
        "details": {
          "creationMethod": "manual",
          "userRole": "MEMBER"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

## Testing

The Credit Cooperative System includes comprehensive testing at multiple levels:

### Unit Tests

Unit tests are written using Jest and React Testing Library. They test individual components and functions in isolation.

To run unit tests:

```bash
npm test
```

### Integration Tests

Integration tests verify that different parts of the system work together correctly. They test the interaction between components and the API.

To run integration tests:

```bash
npm run test:integration
```

### End-to-End Tests

End-to-end tests simulate user interactions with the application to ensure that the entire system works correctly from the user's perspective.

To run end-to-end tests:

```bash
npm run test:e2e
```

## Deployment

The Credit Cooperative System can be deployed using various methods:

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

### CI/CD Pipeline

The system includes a CI/CD pipeline using GitHub Actions:

1. **Build**: Builds the application
2. **Test**: Runs unit, integration, and end-to-end tests
3. **Deploy**: Deploys the application to the production environment

### Environment Variables

The following environment variables are required for deployment:

- `NEXT_PUBLIC_API_URL`: URL of the API server
- `NEXT_PUBLIC_WEBSOCKET_URL`: URL of the WebSocket server
- `NEXT_PUBLIC_SUPABASE_URL`: URL of the Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key

## Performance Optimization

The Credit Cooperative System includes several performance optimizations:

### Bundle Size Optimization

- **Code Splitting**: The application uses code splitting to reduce the initial bundle size
- **Tree Shaking**: Unused code is removed during the build process
- **Dynamic Imports**: Components are loaded dynamically when needed

### Caching

- **API Caching**: API responses are cached to reduce server load
- **Static Generation**: Static pages are generated at build time
- **Incremental Static Regeneration**: Static pages are regenerated periodically

### Lazy Loading

- **Image Optimization**: Images are optimized and lazy-loaded
- **Component Lazy Loading**: Components are loaded only when needed

### Monitoring

- **Performance Monitoring**: The application includes performance monitoring
- **Error Tracking**: Errors are tracked and reported
- **Analytics**: User behavior is analyzed to identify performance bottlenecks
