/**
 * Error handling utilities for the application
 */

/**
 * Custom error classes
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network error occurred') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends Error {
  constructor(message, errors = {}) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'You do not have permission to perform this action') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

/**
 * Handle API response errors
 * 
 * @param {Response} response - Fetch API response
 * @returns {Promise<Response>} - The response if it's ok, otherwise throws an error
 * @throws {ApiError} - If the response is not ok
 * @throws {NetworkError} - If there's a network error
 * @throws {AuthenticationError} - If the response status is 401
 * @throws {AuthorizationError} - If the response status is 403
 * @throws {NotFoundError} - If the response status is 404
 * @throws {ValidationError} - If the response status is 422
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    let errorData = null;
    
    try {
      errorData = await response.json();
    } catch (error) {
      // If we can't parse the error response, just use the status text
      errorData = { message: response.statusText };
    }
    
    const errorMessage = errorData.message || `API error: ${response.status} ${response.statusText}`;
    
    // Handle specific error types based on status code
    switch (response.status) {
      case 401:
        throw new AuthenticationError(errorMessage);
      case 403:
        throw new AuthorizationError(errorMessage);
      case 404:
        throw new NotFoundError(errorMessage);
      case 422:
        throw new ValidationError(errorMessage, errorData.errors || {});
      default:
        throw new ApiError(errorMessage, response.status, errorData);
    }
  }
  
  return response;
};

/**
 * Wrap an async function with error handling
 * 
 * @param {Function} fn - The async function to wrap
 * @param {Object} options - Options for error handling
 * @param {Function} options.onError - Function to call when an error occurs
 * @param {Function} options.onNetworkError - Function to call when a network error occurs
 * @param {Function} options.onAuthError - Function to call when an authentication error occurs
 * @param {Function} options.onValidationError - Function to call when a validation error occurs
 * @returns {Function} - The wrapped function
 */
export const withErrorHandling = (fn, options = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      // Handle specific error types
      if (error instanceof NetworkError && options.onNetworkError) {
        options.onNetworkError(error);
      } else if (error instanceof AuthenticationError && options.onAuthError) {
        options.onAuthError(error);
      } else if (error instanceof ValidationError && options.onValidationError) {
        options.onValidationError(error);
      } else if (options.onError) {
        options.onError(error);
      }
      
      // Re-throw the error for the caller to handle if needed
      throw error;
    }
  };
};

/**
 * Format validation errors into a user-friendly object
 * 
 * @param {Object} errors - Validation errors object
 * @returns {Object} - Formatted errors object
 */
export const formatValidationErrors = (errors) => {
  const formattedErrors = {};
  
  for (const [field, messages] of Object.entries(errors)) {
    formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages;
  }
  
  return formattedErrors;
};

/**
 * Get a user-friendly error message based on the error type
 * 
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyErrorMessage = (error) => {
  if (error instanceof NetworkError) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }
  
  if (error instanceof AuthenticationError) {
    return 'Your session has expired. Please sign in again.';
  }
  
  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error instanceof NotFoundError) {
    return 'The requested resource could not be found.';
  }
  
  if (error instanceof ValidationError) {
    return 'Please correct the errors in the form and try again.';
  }
  
  if (error instanceof ApiError) {
    return error.message || 'An error occurred while communicating with the server.';
  }
  
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Log an error to the console and optionally to an error tracking service
 * 
 * @param {Error} error - The error object
 * @param {Object} context - Additional context for the error
 */
export const logError = (error, context = {}) => {
  console.error('Error:', error);
  
  if (context && Object.keys(context).length > 0) {
    console.error('Error Context:', context);
  }
  
  // If we have an error tracking service, log the error there
  if (window.errorTrackingService) {
    window.errorTrackingService.captureException(error, { extra: context });
  }
};

export default {
  ApiError,
  NetworkError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  handleApiResponse,
  withErrorHandling,
  formatValidationErrors,
  getUserFriendlyErrorMessage,
  logError,
};
