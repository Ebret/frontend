# Utility Documentation

This document provides an overview of the utility functions and modules in the Credit Cooperative System.

## Table of Contents

1. [API Utilities](#api-utilities)
2. [Caching Utilities](#caching-utilities)
3. [Error Handling Utilities](#error-handling-utilities)

## API Utilities

The API utilities provide functions for making API requests with caching support.

### Functions

#### `fetchApi(url, options, cacheOptions)`

Makes an API request with optional caching.

**Parameters:**
- `url` (string): The API URL
- `options` (object, optional): Fetch options
- `cacheOptions` (object, optional): Cache options
  - `useCache` (boolean): Whether to use cache (default: true for GET requests)
  - `ttl` (number): Time to live in milliseconds (default: 5 minutes)
  - `useLocalStorage` (boolean): Whether to use localStorage (default: false)

**Returns:**
- Promise that resolves to the API response

**Example:**
```javascript
import { fetchApi } from '@/utils/api';

// Simple GET request
const data = await fetchApi('/api/users');

// POST request with data
const newUser = await fetchApi('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'John Doe' }),
});

// GET request with custom cache options
const cachedData = await fetchApi('/api/users', {}, {
  ttl: 60 * 1000, // 1 minute
  useLocalStorage: true,
});
```

#### `get(url, options, cacheOptions)`

Makes a GET request with optional caching.

**Parameters:**
- `url` (string): The API URL
- `options` (object, optional): Fetch options
- `cacheOptions` (object, optional): Cache options

**Returns:**
- Promise that resolves to the API response

**Example:**
```javascript
import { get } from '@/utils/api';

const users = await get('/api/users');
```

#### `post(url, data, options)`

Makes a POST request.

**Parameters:**
- `url` (string): The API URL
- `data` (object): The request body
- `options` (object, optional): Fetch options

**Returns:**
- Promise that resolves to the API response

**Example:**
```javascript
import { post } from '@/utils/api';

const newUser = await post('/api/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

#### `put(url, data, options)`

Makes a PUT request.

**Parameters:**
- `url` (string): The API URL
- `data` (object): The request body
- `options` (object, optional): Fetch options

**Returns:**
- Promise that resolves to the API response

**Example:**
```javascript
import { put } from '@/utils/api';

const updatedUser = await put('/api/users/123', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

#### `patch(url, data, options)`

Makes a PATCH request.

**Parameters:**
- `url` (string): The API URL
- `data` (object): The request body
- `options` (object, optional): Fetch options

**Returns:**
- Promise that resolves to the API response

**Example:**
```javascript
import { patch } from '@/utils/api';

const updatedUser = await patch('/api/users/123', {
  name: 'John Doe',
});
```

#### `del(url, options)`

Makes a DELETE request.

**Parameters:**
- `url` (string): The API URL
- `options` (object, optional): Fetch options

**Returns:**
- Promise that resolves to the API response

**Example:**
```javascript
import { del } from '@/utils/api';

await del('/api/users/123');
```

## Caching Utilities

The caching utilities provide functions for caching data in memory and localStorage.

### Functions

#### `setMemoryCache(key, value, ttl)`

Sets a value in the memory cache with optional TTL.

**Parameters:**
- `key` (string): The cache key
- `value` (any): The value to cache
- `ttl` (number, optional): Time to live in milliseconds

**Example:**
```javascript
import { setMemoryCache } from '@/utils/cache';

setMemoryCache('users', users, 5 * 60 * 1000); // Cache for 5 minutes
```

#### `getMemoryCache(key)`

Gets a value from the memory cache.

**Parameters:**
- `key` (string): The cache key

**Returns:**
- The cached value or null if not found or expired

**Example:**
```javascript
import { getMemoryCache } from '@/utils/cache';

const cachedUsers = getMemoryCache('users');
```

#### `clearMemoryCache(keyPrefix)`

Clears the memory cache.

**Parameters:**
- `keyPrefix` (string, optional): Prefix to clear only keys starting with this prefix

**Example:**
```javascript
import { clearMemoryCache } from '@/utils/cache';

// Clear all cache
clearMemoryCache();

// Clear only user-related cache
clearMemoryCache('user:');
```

#### `setLocalStorageCache(key, value, ttl)`

Sets a value in localStorage with optional TTL.

**Parameters:**
- `key` (string): The cache key
- `value` (any): The value to cache
- `ttl` (number, optional): Time to live in milliseconds

**Example:**
```javascript
import { setLocalStorageCache } from '@/utils/cache';

setLocalStorageCache('user-preferences', preferences, 7 * 24 * 60 * 60 * 1000); // Cache for 7 days
```

#### `getLocalStorageCache(key)`

Gets a value from localStorage.

**Parameters:**
- `key` (string): The cache key

**Returns:**
- The cached value or null if not found or expired

**Example:**
```javascript
import { getLocalStorageCache } from '@/utils/cache';

const cachedPreferences = getLocalStorageCache('user-preferences');
```

#### `clearLocalStorageCache(keyPrefix)`

Clears localStorage cache.

**Parameters:**
- `keyPrefix` (string, optional): Prefix to clear only keys starting with this prefix

**Example:**
```javascript
import { clearLocalStorageCache } from '@/utils/cache';

// Clear all localStorage
clearLocalStorageCache();

// Clear only user-related localStorage
clearLocalStorageCache('user-');
```

#### `cacheFn(fn, cacheKey, options, ...args)`

Caches a function call result.

**Parameters:**
- `fn` (Function): The function to cache
- `cacheKey` (string): The cache key
- `options` (object, optional): Cache options
  - `ttl` (number): Time to live in milliseconds
  - `useLocalStorage` (boolean): Whether to use localStorage (default: false)
- `args` (any): Arguments to pass to the function

**Returns:**
- Promise that resolves to the function result

**Example:**
```javascript
import { cacheFn } from '@/utils/cache';

const fetchUsers = async () => {
  const response = await fetch('/api/users');
  return response.json();
};

const users = await cacheFn(fetchUsers, 'users', { ttl: 5 * 60 * 1000 });
```

#### `createCachedFn(fn, keyFn, options)`

Creates a cached version of a function.

**Parameters:**
- `fn` (Function): The function to cache
- `keyFn` (Function): Function to generate cache key from arguments
- `options` (object, optional): Cache options
  - `ttl` (number): Time to live in milliseconds
  - `useLocalStorage` (boolean): Whether to use localStorage (default: false)

**Returns:**
- The cached function

**Example:**
```javascript
import { createCachedFn } from '@/utils/cache';

const fetchUser = async (id) => {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
};

const cachedFetchUser = createCachedFn(
  fetchUser,
  (id) => `user:${id}`,
  { ttl: 5 * 60 * 1000 }
);

const user = await cachedFetchUser(123);
```

## Error Handling Utilities

The error handling utilities provide functions and classes for handling API errors.

### Error Classes

#### `ApiError`

Error thrown when an API request fails.

**Properties:**
- `name` (string): 'ApiError'
- `message` (string): Error message
- `status` (number): HTTP status code
- `data` (object): Error data from the API

**Example:**
```javascript
import { ApiError } from '@/utils/errorHandling';

throw new ApiError('API error message', 500, { detail: 'Error details' });
```

#### `NetworkError`

Error thrown when a network request fails.

**Properties:**
- `name` (string): 'NetworkError'
- `message` (string): Error message

**Example:**
```javascript
import { NetworkError } from '@/utils/errorHandling';

throw new NetworkError('Network error occurred');
```

#### `ValidationError`

Error thrown when validation fails.

**Properties:**
- `name` (string): 'ValidationError'
- `message` (string): Error message
- `errors` (object): Validation errors

**Example:**
```javascript
import { ValidationError } from '@/utils/errorHandling';

throw new ValidationError('Validation failed', {
  email: ['Email is required', 'Email is invalid'],
  password: 'Password is too short',
});
```

#### `AuthenticationError`

Error thrown when authentication fails.

**Properties:**
- `name` (string): 'AuthenticationError'
- `message` (string): Error message

**Example:**
```javascript
import { AuthenticationError } from '@/utils/errorHandling';

throw new AuthenticationError('Authentication failed');
```

#### `AuthorizationError`

Error thrown when authorization fails.

**Properties:**
- `name` (string): 'AuthorizationError'
- `message` (string): Error message

**Example:**
```javascript
import { AuthorizationError } from '@/utils/errorHandling';

throw new AuthorizationError('You do not have permission to perform this action');
```

#### `NotFoundError`

Error thrown when a resource is not found.

**Properties:**
- `name` (string): 'NotFoundError'
- `message` (string): Error message

**Example:**
```javascript
import { NotFoundError } from '@/utils/errorHandling';

throw new NotFoundError('Resource not found');
```

### Functions

#### `handleApiResponse(response)`

Handles API response errors.

**Parameters:**
- `response` (Response): Fetch API response

**Returns:**
- Promise that resolves to the response if it's ok, otherwise throws an error

**Example:**
```javascript
import { handleApiResponse } from '@/utils/errorHandling';

const fetchData = async () => {
  const response = await fetch('/api/data');
  await handleApiResponse(response);
  return response.json();
};
```

#### `withErrorHandling(fn, options)`

Wraps an async function with error handling.

**Parameters:**
- `fn` (Function): The async function to wrap
- `options` (object, optional): Options for error handling
  - `onError` (Function): Function to call when an error occurs
  - `onNetworkError` (Function): Function to call when a network error occurs
  - `onAuthError` (Function): Function to call when an authentication error occurs
  - `onValidationError` (Function): Function to call when a validation error occurs

**Returns:**
- The wrapped function

**Example:**
```javascript
import { withErrorHandling } from '@/utils/errorHandling';

const fetchData = async () => {
  const response = await fetch('/api/data');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

const fetchDataWithErrorHandling = withErrorHandling(fetchData, {
  onError: (error) => {
    console.error('Error fetching data:', error);
  },
  onNetworkError: (error) => {
    console.error('Network error:', error);
    // Show network error message
  },
});

try {
  const data = await fetchDataWithErrorHandling();
  // Use data
} catch (error) {
  // Handle error
}
```

#### `formatValidationErrors(errors)`

Formats validation errors into a user-friendly object.

**Parameters:**
- `errors` (object): Validation errors object

**Returns:**
- Formatted errors object

**Example:**
```javascript
import { formatValidationErrors } from '@/utils/errorHandling';

const errors = {
  email: ['Email is required', 'Email is invalid'],
  password: ['Password is too short'],
};

const formattedErrors = formatValidationErrors(errors);
// { email: 'Email is required', password: 'Password is too short' }
```

#### `getUserFriendlyErrorMessage(error)`

Gets a user-friendly error message based on the error type.

**Parameters:**
- `error` (Error): The error object

**Returns:**
- User-friendly error message

**Example:**
```javascript
import { getUserFriendlyErrorMessage } from '@/utils/errorHandling';

try {
  // Code that might throw an error
} catch (error) {
  const message = getUserFriendlyErrorMessage(error);
  // Show message to user
}
```

#### `logError(error, context)`

Logs an error to the console and optionally to an error tracking service.

**Parameters:**
- `error` (Error): The error object
- `context` (object, optional): Additional context for the error

**Example:**
```javascript
import { logError } from '@/utils/errorHandling';

try {
  // Code that might throw an error
} catch (error) {
  logError(error, { userId: '123', action: 'fetchData' });
}
```
