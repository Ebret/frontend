import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { formatApiError } from '@/utils/frontendErrorHandler';

/**
 * Custom hook for handling API requests with loading, error, and success states
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Options for the hook
 * @returns {Object} - The hook state and functions
 */
const useApi = (apiFunction, options = {}) => {
  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
    loadingMessage = 'Loading...',
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);
        setIsLoading(false);

        if (showSuccessToast) {
          toast.success(successMessage);
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        setError(err);
        setIsLoading(false);

        if (showErrorToast) {
          toast.error(formatApiError(err) || errorMessage);
        }

        if (onError) {
          onError(err);
        }

        throw err;
      }
    },
    [
      apiFunction,
      onSuccess,
      onError,
      showSuccessToast,
      showErrorToast,
      successMessage,
      errorMessage,
    ]
  );

  const reset = useCallback(() => {
    setData(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    data,
    isLoading,
    error,
    execute,
    reset,
  };
};

export default useApi;
