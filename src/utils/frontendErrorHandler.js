/**
 * Format API error messages for display
 * @param {Error} error - The error object
 * @returns {string} - Formatted error message
 */
export const formatApiError = (error) => {
  // Network error
  if (!error.response) {
    return 'Network error. Please check your connection and try again.';
  }

  // Get response data
  const { response } = error;
  
  // Check if response has data
  if (!response.data) {
    return `Error: ${response.status} ${response.statusText}`;
  }
  
  // Handle different error formats
  if (response.data.message) {
    return response.data.message;
  }
  
  if (response.data.error) {
    return response.data.error;
  }
  
  if (response.data.errors) {
    // Handle validation errors
    const errors = response.data.errors;
    
    if (typeof errors === 'object') {
      // Return first error message
      const firstError = Object.values(errors)[0];
      return Array.isArray(firstError) ? firstError[0] : firstError;
    }
    
    return errors;
  }
  
  // Default error message
  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Log error to console with additional context
 * @param {Error} error - The error object
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);
  
  // Additional logging for API errors
  if (error.response) {
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
  }
};

/**
 * Check if error is a network error
 * @param {Error} error - The error object
 * @returns {boolean} - True if network error
 */
export const isNetworkError = (error) => {
  return (
    error.isNetworkError ||
    !error.response ||
    error.message === 'Network Error' ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('Network request failed')
  );
};

/**
 * Check if error is an authentication error
 * @param {Error} error - The error object
 * @returns {boolean} - True if authentication error
 */
export const isAuthError = (error) => {
  return error.response && error.response.status === 401;
};

/**
 * Check if error is a permission error
 * @param {Error} error - The error object
 * @returns {boolean} - True if permission error
 */
export const isPermissionError = (error) => {
  return error.response && error.response.status === 403;
};

/**
 * Check if error is a validation error
 * @param {Error} error - The error object
 * @returns {boolean} - True if validation error
 */
export const isValidationError = (error) => {
  return (
    error.response &&
    (error.response.status === 422 || error.response.status === 400) &&
    error.response.data &&
    error.response.data.errors
  );
};

/**
 * Get validation errors from error object
 * @param {Error} error - The error object
 * @returns {Object|null} - Validation errors or null
 */
export const getValidationErrors = (error) => {
  if (isValidationError(error)) {
    return error.response.data.errors;
  }
  
  return null;
};
