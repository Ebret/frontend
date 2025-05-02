# Audit Logging System

This document provides detailed information about the audit logging system in the Credit Cooperative System.

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture](#architecture)
3. [Audit Action Types](#audit-action-types)
4. [API](#api)
5. [Components](#components)
6. [Integration](#integration)
7. [Offline Support](#offline-support)
8. [Testing](#testing)

## Introduction

The audit logging system provides a comprehensive record of user actions within the Credit Cooperative System. It tracks who performed each action, when it was performed, and what specific changes were made. This information is essential for security, compliance, and troubleshooting purposes.

## Architecture

The audit logging system consists of several components:

1. **Audit Logger**: A utility for creating and managing audit logs
2. **Audit Log API**: Endpoints for storing and retrieving audit logs
3. **Audit Log Viewer**: A component for viewing and filtering audit logs
4. **Audit Log Initializer**: A component for initializing the audit log system

### Flow

1. User performs an action (e.g., creates a user)
2. The action is intercepted by the audit logger
3. The audit logger creates an audit log entry
4. The audit log entry is sent to the API
5. If the API call fails, the log is stored locally for later retry
6. Administrators can view audit logs using the Audit Log Viewer

## Audit Action Types

The audit logging system tracks various types of actions:

| Action Type | Description |
|-------------|-------------|
| `USER_CREATED` | A user was created |
| `USER_UPDATED` | A user's information was updated |
| `USER_DELETED` | A user was deleted |
| `USER_ROLE_CHANGED` | A user's role was changed |
| `USER_STATUS_CHANGED` | A user's status was changed |
| `USER_PASSWORD_RESET` | A user's password was reset |
| `USER_LOGIN` | A user logged in |
| `USER_LOGOUT` | A user logged out |
| `USER_LOCKED` | A user account was locked |
| `USER_UNLOCKED` | A user account was unlocked |
| `BULK_USERS_IMPORTED` | Multiple users were imported |
| `PERMISSION_CHANGED` | A permission was changed |
| `SECURITY_SETTING_CHANGED` | A security setting was changed |

## API

### Create Audit Log

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
  },
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
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
    },
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  }
}
```

### Get Audit Logs

```
GET /api/audit-logs
```

Query Parameters:
- `page`: Page number (default: 1)
- `limit`: Number of logs per page (default: 10)
- `actionType`: Filter by action type
- `userId`: Filter by target user ID
- `startDate`: Filter by start date
- `endDate`: Filter by end date
- `search`: Search term

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

## Components

### AuditLogViewer

The `AuditLogViewer` component displays audit logs with filtering and pagination.

#### Props

| Prop | Type | Description |
|------|------|-------------|
| `initialLogs` | `AuditLogEntry[]` | Optional initial logs to display |
| `userId` | `number` | Optional user ID to filter logs by |
| `actionTypes` | `AuditActionType[]` | Optional action types to filter logs by |
| `limit` | `number` | Optional limit of logs per page (default: 50) |

#### Usage

```tsx
import AuditLogViewer from '@/components/admin/AuditLogViewer';

// Display all logs
<AuditLogViewer />

// Display logs for a specific user
<AuditLogViewer userId={1} />

// Display specific types of logs
<AuditLogViewer actionTypes={['USER_CREATED', 'USER_UPDATED']} />
```

#### Features

- Displays audit logs in a table format
- Supports filtering by action type, date range, and search term
- Provides pagination for large log volumes
- Renders different log types with appropriate formatting
- Includes search functionality

### AuditLogInitializer

The `AuditLogInitializer` component initializes the audit log system and sets up the retry mechanism for failed logs.

#### Usage

```tsx
import AuditLogInitializer from '@/app/AuditLogInitializer';

// In your app layout
<AuditLogInitializer />
```

## Integration

### User Creation

The audit logging system is integrated into the user creation process:

```tsx
// In the user creation form
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Create the user
    const response = await api.createUser(userData);
    
    // Log the user creation
    if (currentUser) {
      await logUserCreation(
        {
          id: currentUser.id,
          email: currentUser.email,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
        },
        {
          id: response.data.user.id,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role as UserRole,
        },
        passwordOption as 'manual' | 'import' | 'invitation'
      );
    }
    
    // Show success message
    setSuccess('User created successfully');
  } catch (error) {
    setError('Failed to create user');
  }
};
```

### Bulk User Import

The audit logging system is integrated into the bulk user import process:

```tsx
// In the bulk user import component
const handleImport = async (users: any[]) => {
  try {
    // Import the users
    const response = await api.importUsers(users);
    
    // Count users by role
    const userRoles: Record<UserRole, number> = Object.values(UserRole).reduce((acc, role) => {
      acc[role as UserRole] = 0;
      return acc;
    }, {} as Record<UserRole, number>);
    
    users.forEach(user => {
      if (user.role && userRoles[user.role as UserRole] !== undefined) {
        userRoles[user.role as UserRole]++;
      }
    });
    
    // Log the bulk import
    if (currentUser) {
      await logBulkUserImport(
        {
          id: currentUser.id,
          email: currentUser.email,
          name: `${currentUser.firstName} ${currentUser.lastName}`,
        },
        {
          totalCount: users.length,
          successCount: response.data.successCount || users.length,
          failureCount: response.data.failureCount || 0,
          passwordSetupMethod: users[0].passwordSetupMethod || 'email',
          userRoles,
        }
      );
    }
    
    // Show success message
    setSuccess(`Successfully imported ${users.length} users`);
  } catch (error) {
    setError('Failed to import users');
  }
};
```

## Offline Support

The audit logging system includes offline support to ensure that no audit events are lost due to network issues:

1. When an audit log fails to be sent to the API, it is stored in localStorage
2. The `AuditLogInitializer` component sets up a retry mechanism
3. Failed logs are retried periodically (every 5 minutes)
4. When a retry succeeds, the log is removed from localStorage

```tsx
// Store failed logs in localStorage
const failedLogs = JSON.parse(localStorage.getItem('failedAuditLogs') || '[]');
failedLogs.push({
  actionType,
  performedBy,
  timestamp: new Date().toISOString(),
  details,
  targetUser,
});
localStorage.setItem('failedAuditLogs', JSON.stringify(failedLogs));

// Retry failed logs
const retryFailedAuditLogs = async (): Promise<void> => {
  const failedLogs = JSON.parse(localStorage.getItem('failedAuditLogs') || '[]');
  if (failedLogs.length === 0) return;
  
  const successfulRetries: number[] = [];
  
  for (let i = 0; i < failedLogs.length; i++) {
    const log = failedLogs[i];
    try {
      await api.createAuditLog({
        ...log,
        retried: true,
      });
      successfulRetries.push(i);
    } catch (error) {
      console.error('Failed to retry audit log:', error);
    }
  }
  
  // Remove successful retries
  const updatedFailedLogs = failedLogs.filter((_, index) => !successfulRetries.includes(index));
  localStorage.setItem('failedAuditLogs', JSON.stringify(updatedFailedLogs));
};
```

## Testing

The audit logging system includes comprehensive unit and integration tests:

### Unit Tests

- Tests for the `logAuditEvent` function
- Tests for specialized logging functions (`logUserCreation`, `logBulkUserImport`, etc.)
- Tests for the retry mechanism
- Tests for the `AuditLogInitializer` component

### Integration Tests

- Tests for the API client's audit log methods
- Tests for the integration of audit logging into user management
- Tests for the offline support mechanism
