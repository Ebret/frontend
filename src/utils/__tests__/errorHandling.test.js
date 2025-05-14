import {
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
} from '../errorHandling';

describe('Error Handling Utilities', () => {
  describe('Custom Error Classes', () => {
    test('ApiError has correct properties', () => {
      const error = new ApiError('API error message', 500, { detail: 'Error details' });
      
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe('API error message');
      expect(error.status).toBe(500);
      expect(error.data).toEqual({ detail: 'Error details' });
    });
    
    test('NetworkError has correct properties', () => {
      const error = new NetworkError();
      
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Network error occurred');
      
      const customError = new NetworkError('Custom network error');
      expect(customError.message).toBe('Custom network error');
    });
    
    test('ValidationError has correct properties', () => {
      const errors = {
        email: ['Email is required', 'Email is invalid'],
        password: 'Password is too short',
      };
      
      const error = new ValidationError('Validation failed', errors);
      
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('Validation failed');
      expect(error.errors).toEqual(errors);
    });
    
    test('AuthenticationError has correct properties', () => {
      const error = new AuthenticationError();
      
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('Authentication failed');
      
      const customError = new AuthenticationError('Custom auth error');
      expect(customError.message).toBe('Custom auth error');
    });
    
    test('AuthorizationError has correct properties', () => {
      const error = new AuthorizationError();
      
      expect(error.name).toBe('AuthorizationError');
      expect(error.message).toBe('You do not have permission to perform this action');
      
      const customError = new AuthorizationError('Custom auth error');
      expect(customError.message).toBe('Custom auth error');
    });
    
    test('NotFoundError has correct properties', () => {
      const error = new NotFoundError();
      
      expect(error.name).toBe('NotFoundError');
      expect(error.message).toBe('Resource not found');
      
      const customError = new NotFoundError('Custom not found error');
      expect(customError.message).toBe('Custom not found error');
    });
  });
  
  describe('handleApiResponse', () => {
    test('returns response when response is ok', async () => {
      const response = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: 'test' }),
      };
      
      const result = await handleApiResponse(response);
      
      expect(result).toBe(response);
      expect(response.json).not.toHaveBeenCalled();
    });
    
    test('throws ApiError when response is not ok', async () => {
      const response = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockResolvedValue({ message: 'Server error' }),
      };
      
      await expect(handleApiResponse(response)).rejects.toThrow(ApiError);
      await expect(handleApiResponse(response)).rejects.toThrow('Server error');
      
      const error = await handleApiResponse(response).catch(e => e);
      expect(error.status).toBe(500);
      expect(error.data).toEqual({ message: 'Server error' });
    });
    
    test('throws AuthenticationError when status is 401', async () => {
      const response = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn().mockResolvedValue({ message: 'Unauthorized' }),
      };
      
      await expect(handleApiResponse(response)).rejects.toThrow(AuthenticationError);
      await expect(handleApiResponse(response)).rejects.toThrow('Unauthorized');
    });
    
    test('throws AuthorizationError when status is 403', async () => {
      const response = {
        ok: false,
        status: 403,
        statusText: 'Forbidden',
        json: jest.fn().mockResolvedValue({ message: 'Forbidden' }),
      };
      
      await expect(handleApiResponse(response)).rejects.toThrow(AuthorizationError);
      await expect(handleApiResponse(response)).rejects.toThrow('Forbidden');
    });
    
    test('throws NotFoundError when status is 404', async () => {
      const response = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn().mockResolvedValue({ message: 'Not Found' }),
      };
      
      await expect(handleApiResponse(response)).rejects.toThrow(NotFoundError);
      await expect(handleApiResponse(response)).rejects.toThrow('Not Found');
    });
    
    test('throws ValidationError when status is 422', async () => {
      const errors = {
        email: ['Email is required'],
        password: 'Password is too short',
      };
      
      const response = {
        ok: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        json: jest.fn().mockResolvedValue({
          message: 'Validation failed',
          errors,
        }),
      };
      
      await expect(handleApiResponse(response)).rejects.toThrow(ValidationError);
      await expect(handleApiResponse(response)).rejects.toThrow('Validation failed');
      
      const error = await handleApiResponse(response).catch(e => e);
      expect(error.errors).toEqual(errors);
    });
    
    test('handles json parsing errors', async () => {
      const response = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      
      await expect(handleApiResponse(response)).rejects.toThrow(ApiError);
      await expect(handleApiResponse(response)).rejects.toThrow('API error: 500 Internal Server Error');
    });
  });
  
  describe('withErrorHandling', () => {
    test('returns function result when no error occurs', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const wrappedFn = withErrorHandling(fn);
      
      const result = await wrappedFn('arg1', 'arg2');
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
    });
    
    test('calls onError when an error occurs', async () => {
      const error = new Error('Test error');
      const fn = jest.fn().mockRejectedValue(error);
      const onError = jest.fn();
      
      const wrappedFn = withErrorHandling(fn, { onError });
      
      await expect(wrappedFn()).rejects.toThrow('Test error');
      expect(onError).toHaveBeenCalledWith(error);
    });
    
    test('calls onNetworkError when a NetworkError occurs', async () => {
      const error = new NetworkError('Network error');
      const fn = jest.fn().mockRejectedValue(error);
      const onNetworkError = jest.fn();
      
      const wrappedFn = withErrorHandling(fn, { onNetworkError });
      
      await expect(wrappedFn()).rejects.toThrow('Network error');
      expect(onNetworkError).toHaveBeenCalledWith(error);
    });
    
    test('calls onAuthError when an AuthenticationError occurs', async () => {
      const error = new AuthenticationError('Auth error');
      const fn = jest.fn().mockRejectedValue(error);
      const onAuthError = jest.fn();
      
      const wrappedFn = withErrorHandling(fn, { onAuthError });
      
      await expect(wrappedFn()).rejects.toThrow('Auth error');
      expect(onAuthError).toHaveBeenCalledWith(error);
    });
    
    test('calls onValidationError when a ValidationError occurs', async () => {
      const error = new ValidationError('Validation error');
      const fn = jest.fn().mockRejectedValue(error);
      const onValidationError = jest.fn();
      
      const wrappedFn = withErrorHandling(fn, { onValidationError });
      
      await expect(wrappedFn()).rejects.toThrow('Validation error');
      expect(onValidationError).toHaveBeenCalledWith(error);
    });
  });
  
  describe('formatValidationErrors', () => {
    test('formats array of error messages to first message', () => {
      const errors = {
        email: ['Email is required', 'Email is invalid'],
        password: ['Password is too short'],
      };
      
      const formattedErrors = formatValidationErrors(errors);
      
      expect(formattedErrors).toEqual({
        email: 'Email is required',
        password: 'Password is too short',
      });
    });
    
    test('keeps string error messages as is', () => {
      const errors = {
        email: 'Email is required',
        password: 'Password is too short',
      };
      
      const formattedErrors = formatValidationErrors(errors);
      
      expect(formattedErrors).toEqual(errors);
    });
    
    test('handles mixed array and string error messages', () => {
      const errors = {
        email: ['Email is required', 'Email is invalid'],
        password: 'Password is too short',
      };
      
      const formattedErrors = formatValidationErrors(errors);
      
      expect(formattedErrors).toEqual({
        email: 'Email is required',
        password: 'Password is too short',
      });
    });
  });
  
  describe('getUserFriendlyErrorMessage', () => {
    test('returns friendly message for NetworkError', () => {
      const error = new NetworkError();
      const message = getUserFriendlyErrorMessage(error);
      
      expect(message).toBe('Unable to connect to the server. Please check your internet connection and try again.');
    });
    
    test('returns friendly message for AuthenticationError', () => {
      const error = new AuthenticationError();
      const message = getUserFriendlyErrorMessage(error);
      
      expect(message).toBe('Your session has expired. Please sign in again.');
    });
    
    test('returns friendly message for AuthorizationError', () => {
      const error = new AuthorizationError();
      const message = getUserFriendlyErrorMessage(error);
      
      expect(message).toBe('You do not have permission to perform this action.');
    });
    
    test('returns friendly message for NotFoundError', () => {
      const error = new NotFoundError();
      const message = getUserFriendlyErrorMessage(error);
      
      expect(message).toBe('The requested resource could not be found.');
    });
    
    test('returns friendly message for ValidationError', () => {
      const error = new ValidationError('Validation failed');
      const message = getUserFriendlyErrorMessage(error);
      
      expect(message).toBe('Please correct the errors in the form and try again.');
    });
    
    test('returns error message for ApiError', () => {
      const error = new ApiError('Custom API error');
      const message = getUserFriendlyErrorMessage(error);
      
      expect(message).toBe('Custom API error');
    });
    
    test('returns default message for unknown error', () => {
      const error = new Error('Unknown error');
      const message = getUserFriendlyErrorMessage(error);
      
      expect(message).toBe('An unexpected error occurred. Please try again later.');
    });
  });
  
  describe('logError', () => {
    const originalConsoleError = console.error;
    const mockConsoleError = jest.fn();
    
    beforeEach(() => {
      console.error = mockConsoleError;
      window.errorTrackingService = undefined;
    });
    
    afterEach(() => {
      console.error = originalConsoleError;
    });
    
    test('logs error to console', () => {
      const error = new Error('Test error');
      
      logError(error);
      
      expect(mockConsoleError).toHaveBeenCalledWith('Error:', error);
    });
    
    test('logs error with context to console', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'test' };
      
      logError(error, context);
      
      expect(mockConsoleError).toHaveBeenCalledWith('Error:', error);
      expect(mockConsoleError).toHaveBeenCalledWith('Error Context:', context);
    });
    
    test('logs error to error tracking service if available', () => {
      const error = new Error('Test error');
      const context = { userId: '123', action: 'test' };
      
      window.errorTrackingService = {
        captureException: jest.fn(),
      };
      
      logError(error, context);
      
      expect(window.errorTrackingService.captureException).toHaveBeenCalledWith(error, {
        extra: context,
      });
    });
  });
});
