# API Documentation

This document provides detailed information about the API endpoints used in the Credit Cooperative System.

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Audit Logging](#audit-logging)
4. [E-Wallet](#e-wallet)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Pagination](#pagination)

## Base URL

All API endpoints are relative to the base URL:

```
http://localhost:3001/api
```

For production, the base URL would be:

```
https://api.example.com/api
```

## Authentication

### Login

Authenticates a user and returns a JWT token.

```
POST /auth/login
```

#### Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

### Register

Registers a new user.

```
POST /auth/register
```

#### Request

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-01",
  "idType": "passport",
  "idNumber": "AB123456",
  "accountType": "standard"
}
```

#### Response

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
      "role": "MEMBER",
      "status": "PENDING_VERIFICATION"
    }
  }
}
```

### Verify Email

Verifies a user's email address.

```
GET /auth/verify-email/:token
```

#### Response

```json
{
  "status": "success",
  "message": "Email verified successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEMBER",
      "status": "ACTIVE"
    }
  }
}
```

### Reset Password

Sends a password reset email.

```
POST /auth/reset-password
```

#### Request

```json
{
  "email": "user@example.com"
}
```

#### Response

```json
{
  "status": "success",
  "message": "Password reset email sent"
}
```

### Change Password

Changes a user's password.

```
POST /auth/change-password
```

#### Request

```json
{
  "oldPassword": "password123",
  "newPassword": "newPassword123"
}
```

#### Response

```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

## User Management

### Get Users

Returns a list of users.

```
GET /users
```

#### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Number of users per page (default: 10)
- `search`: Search term
- `role`: Filter by role
- `status`: Filter by status

#### Response

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

### Get User by ID

Returns a user by ID.

```
GET /users/:id
```

#### Response

```json
{
  "status": "success",
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "ADMIN",
      "status": "ACTIVE",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
}
```

### Create User

Creates a new user.

```
POST /users
```

#### Request

```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "MEMBER",
  "phoneNumber": "+1234567890",
  "address": "123 Main St",
  "dateOfBirth": "1990-01-01",
  "passwordSetupMethod": "manual"
}
```

#### Response

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

### Update User

Updates a user.

```
PUT /users/:id
```

#### Request

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phoneNumber": "+0987654321",
  "address": "456 Main St"
}
```

#### Response

```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Smith",
      "role": "MEMBER",
      "status": "ACTIVE",
      "phoneNumber": "+0987654321",
      "address": "456 Main St",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    }
  }
}
```

### Change User Role

Changes a user's role.

```
PUT /users/:id/role
```

#### Request

```json
{
  "role": "ADMIN"
}
```

#### Response

```json
{
  "status": "success",
  "message": "User role changed successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "ADMIN",
      "status": "ACTIVE",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    }
  }
}
```

### Change User Status

Changes a user's status.

```
PUT /users/:id/status
```

#### Request

```json
{
  "status": "INACTIVE",
  "reason": "User request"
}
```

#### Response

```json
{
  "status": "success",
  "message": "User status changed successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "MEMBER",
      "status": "INACTIVE",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-02T00:00:00.000Z"
    }
  }
}
```

### Delete User

Deletes a user.

```
DELETE /users/:id
```

#### Response

```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

### Import Users

Imports multiple users.

```
POST /users/import
```

#### Request

```json
{
  "users": [
    {
      "email": "user1@example.com",
      "firstName": "User",
      "lastName": "One",
      "role": "MEMBER",
      "phoneNumber": "+1234567890",
      "address": "123 Main St",
      "dateOfBirth": "1990-01-01"
    },
    {
      "email": "user2@example.com",
      "firstName": "User",
      "lastName": "Two",
      "role": "MEMBER",
      "phoneNumber": "+0987654321",
      "address": "456 Main St",
      "dateOfBirth": "1991-02-02"
    }
  ],
  "passwordSetupMethod": "email"
}
```

#### Response

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
        "firstName": "User",
        "lastName": "One",
        "role": "MEMBER",
        "status": "PENDING_VERIFICATION",
        "createdAt": "2023-01-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "email": "user2@example.com",
        "firstName": "User",
        "lastName": "Two",
        "role": "MEMBER",
        "status": "PENDING_VERIFICATION",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

## Audit Logging

### Create Audit Log

Creates an audit log entry.

```
POST /audit-logs
```

#### Request

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
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}
```

#### Response

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
    },
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  }
}
```

### Get Audit Logs

Returns a list of audit logs.

```
GET /audit-logs
```

#### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Number of logs per page (default: 10)
- `actionType`: Filter by action type
- `userId`: Filter by target user ID
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `search`: Search term

#### Response

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
        },
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
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

## E-Wallet

### Create E-Wallet

Creates an e-wallet for a user.

```
POST /e-wallets
```

#### Request

```json
{
  "userId": 1,
  "initialBalance": 0
}
```

#### Response

```json
{
  "status": "success",
  "message": "E-Wallet created successfully",
  "data": {
    "walletId": "WALLET-123456",
    "userId": 1,
    "balance": 0,
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get E-Wallet

Returns an e-wallet by ID.

```
GET /e-wallets/:id
```

#### Response

```json
{
  "status": "success",
  "message": "E-Wallet retrieved successfully",
  "data": {
    "walletId": "WALLET-123456",
    "userId": 1,
    "balance": 100.50,
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

### Get User E-Wallet

Returns a user's e-wallet.

```
GET /users/:id/e-wallet
```

#### Response

```json
{
  "status": "success",
  "message": "E-Wallet retrieved successfully",
  "data": {
    "walletId": "WALLET-123456",
    "userId": 1,
    "balance": 100.50,
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

### Deposit

Deposits funds into an e-wallet.

```
POST /e-wallets/:id/deposit
```

#### Request

```json
{
  "amount": 100.50,
  "description": "Salary deposit"
}
```

#### Response

```json
{
  "status": "success",
  "message": "Deposit successful",
  "data": {
    "transactionId": "TXN-123456",
    "walletId": "WALLET-123456",
    "amount": 100.50,
    "type": "DEPOSIT",
    "description": "Salary deposit",
    "balance": 200.50,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Withdraw

Withdraws funds from an e-wallet.

```
POST /e-wallets/:id/withdraw
```

#### Request

```json
{
  "amount": 50.25,
  "description": "ATM withdrawal"
}
```

#### Response

```json
{
  "status": "success",
  "message": "Withdrawal successful",
  "data": {
    "transactionId": "TXN-123457",
    "walletId": "WALLET-123456",
    "amount": 50.25,
    "type": "WITHDRAWAL",
    "description": "ATM withdrawal",
    "balance": 150.25,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Transfer

Transfers funds from one e-wallet to another.

```
POST /e-wallets/:id/transfer
```

#### Request

```json
{
  "recipientWalletId": "WALLET-654321",
  "amount": 25.75,
  "description": "Fund transfer"
}
```

#### Response

```json
{
  "status": "success",
  "message": "Transfer successful",
  "data": {
    "transactionId": "TXN-123458",
    "walletId": "WALLET-123456",
    "recipientWalletId": "WALLET-654321",
    "amount": 25.75,
    "type": "TRANSFER",
    "description": "Fund transfer",
    "balance": 124.50,
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Get Transactions

Returns a list of transactions for an e-wallet.

```
GET /e-wallets/:id/transactions
```

#### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Number of transactions per page (default: 10)
- `type`: Filter by transaction type (DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT)
- `startDate`: Filter by start date
- `endDate`: Filter by end date

#### Response

```json
{
  "status": "success",
  "message": "Transactions retrieved successfully",
  "data": {
    "transactions": [
      {
        "transactionId": "TXN-123456",
        "walletId": "WALLET-123456",
        "amount": 100.50,
        "type": "DEPOSIT",
        "description": "Salary deposit",
        "balance": 200.50,
        "createdAt": "2023-01-01T00:00:00.000Z"
      },
      {
        "transactionId": "TXN-123457",
        "walletId": "WALLET-123456",
        "amount": 50.25,
        "type": "WITHDRAWAL",
        "description": "ATM withdrawal",
        "balance": 150.25,
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

### Update E-Wallet Settings

Updates e-wallet settings.

```
PUT /e-wallets/:id/settings
```

#### Request

```json
{
  "dailyLimit": 1000,
  "transactionNotifications": true,
  "securityLevel": "high"
}
```

#### Response

```json
{
  "status": "success",
  "message": "E-Wallet settings updated successfully",
  "data": {
    "walletId": "WALLET-123456",
    "userId": 1,
    "settings": {
      "dailyLimit": 1000,
      "transactionNotifications": true,
      "securityLevel": "high"
    },
    "updatedAt": "2023-01-02T00:00:00.000Z"
  }
}
```

## Error Handling

All API endpoints return a consistent error format:

```json
{
  "status": "error",
  "message": "Error message",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource already exists
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

## Rate Limiting

The API implements rate limiting to prevent abuse. The rate limits are:

- `60` requests per minute for authenticated users
- `20` requests per minute for unauthenticated users

Rate limit information is included in the response headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed per minute
- `X-RateLimit-Remaining`: Number of requests remaining in the current minute
- `X-RateLimit-Reset`: Time in seconds until the rate limit resets

When the rate limit is exceeded, the API returns a `429 Too Many Requests` error:

```json
{
  "status": "error",
  "message": "Rate limit exceeded. Please try again in 30 seconds."
}
```

## Pagination

All endpoints that return lists of resources support pagination. The pagination parameters are:

- `page`: Page number (default: 1)
- `limit`: Number of items per page (default: 10, max: 100)

The response includes pagination information:

```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```
