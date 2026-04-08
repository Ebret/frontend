# Credit Cooperative System API Documentation

This document provides comprehensive documentation for the Credit Cooperative System API.

## Base URL

All API endpoints are relative to the base URL:

- Development: `http://localhost:3001/api/v1`
- Staging: `https://staging-api.cooperativesystem.com/api/v1`
- Production: `https://api.cooperativesystem.com/api/v1`

## Authentication

Most API endpoints require authentication. The API uses JWT (JSON Web Token) for authentication.

### Obtaining a Token

```
POST /auth/login
```

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "MEMBER"
  }
}
```

### Using the Token

Include the token in the Authorization header of your requests:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of a request.

### Error Response Format

```json
{
  "status": "error",
  "message": "Error message",
  "errorId": "err_1234567890",
  "timestamp": "2023-01-01T00:00:00.000Z"
}
```

### Common Error Codes

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation error
- `500 Internal Server Error`: Server error

## Rate Limiting

The API implements rate limiting to prevent abuse. The default limits are:

- 100 requests per 15-minute window for authenticated users
- 50 requests per 15-minute window for unauthenticated users

Rate limit information is included in the response headers:

- `X-RateLimit-Limit`: Maximum number of requests allowed in the window
- `X-RateLimit-Remaining`: Number of requests remaining in the current window
- `X-RateLimit-Reset`: Time when the current window resets (Unix timestamp)

## API Endpoints

### User Management

#### Get Current User

```
GET /users/me
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "MEMBER",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Update User Profile

```
PATCH /users/me
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+1234567890",
    "address": "123 Main St",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Change Password

```
POST /users/change-password
```

**Request Body:**

```json
{
  "currentPassword": "password123",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

### Loan Management

#### Apply for Loan

```
POST /loans/apply
```

**Request Body:**

```json
{
  "amount": 10000,
  "term": 12,
  "purpose": "Home renovation",
  "collateral": "Car title",
  "collateralValue": 15000
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "loan_123",
    "amount": 10000,
    "term": 12,
    "purpose": "Home renovation",
    "status": "PENDING",
    "referenceNumber": "LOAN-2023-0042",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Loan Details

```
GET /loans/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "loan_123",
    "amount": 10000,
    "term": 12,
    "purpose": "Home renovation",
    "status": "APPROVED",
    "referenceNumber": "LOAN-2023-0042",
    "interestRate": 12,
    "monthlyPayment": 888.49,
    "totalInterest": 661.88,
    "totalPayment": 10661.88,
    "disbursementDate": "2023-01-15T00:00:00.000Z",
    "firstPaymentDate": "2023-02-15T00:00:00.000Z",
    "lastPaymentDate": "2024-01-15T00:00:00.000Z",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-10T00:00:00.000Z"
  }
}
```

#### Get User Loans

```
GET /loans
```

**Query Parameters:**

- `status`: Filter by status (PENDING, APPROVED, REJECTED, ACTIVE, COMPLETED)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**

```json
{
  "status": "success",
  "data": {
    "loans": [
      {
        "id": "loan_123",
        "amount": 10000,
        "term": 12,
        "purpose": "Home renovation",
        "status": "APPROVED",
        "referenceNumber": "LOAN-2023-0042",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

### E-Wallet

#### Get Wallet Balance

```
GET /wallet/balance
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "balance": 5000,
    "currency": "PHP",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Get Transaction History

```
GET /wallet/transactions
```

**Query Parameters:**

- `type`: Filter by type (DEPOSIT, WITHDRAWAL, TRANSFER, PAYMENT)
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**

```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": "txn_123",
        "type": "DEPOSIT",
        "amount": 1000,
        "currency": "PHP",
        "description": "Bank deposit",
        "status": "COMPLETED",
        "createdAt": "2023-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

#### Transfer Funds

```
POST /wallet/transfer
```

**Request Body:**

```json
{
  "recipientId": "user_456",
  "amount": 500,
  "description": "Repayment"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "transactionId": "txn_789",
    "amount": 500,
    "recipientId": "user_456",
    "description": "Repayment",
    "status": "COMPLETED",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### Damayan Fund

#### Get Damayan Status

```
GET /damayan/status
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "totalFund": 250000,
    "memberCount": 500,
    "activeClaims": 2,
    "userContribution": 500,
    "userStatus": "ACTIVE",
    "lastContribution": "2023-01-01T00:00:00.000Z"
  }
}
```

#### Submit Assistance Request

```
POST /damayan/request
```

**Request Body:**

```json
{
  "reason": "Medical emergency",
  "amount": 10000,
  "documents": ["doc_123", "doc_456"],
  "additionalInfo": "Hospital admission for surgery"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "requestId": "req_123",
    "status": "PENDING",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## Webhooks

The API provides webhooks for real-time notifications of events. To use webhooks, register a webhook URL:

```
POST /webhooks
```

**Request Body:**

```json
{
  "url": "https://example.com/webhook",
  "events": ["loan.approved", "transaction.completed"],
  "secret": "your_webhook_secret"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "wh_123",
    "url": "https://example.com/webhook",
    "events": ["loan.approved", "transaction.completed"],
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

## API Versioning

The API uses URL versioning (e.g., `/api/v1/`). When a new version is released, the old version will be maintained for a deprecation period before being removed.

## Support

For API support, please contact:

- Email: api-support@cooperativesystem.com
- Documentation: https://docs.cooperativesystem.com
