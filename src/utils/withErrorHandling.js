import React, { useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import NetworkErrorFallback from '@/components/NetworkErrorFallback';
import { isNetworkError } from '@/utils/frontendErrorHandler';

/**
 * Higher-order component that adds error handling to a component
 * @param {React.Component} Component - The component to wrap
 * @param {Object} options - Options for error handling
 * @returns {React.Component} - The wrapped component
 */
const withErrorHandling = (Component, options = {}) => {
  const {
    showErrorDetails = process.env.NODE_ENV === 'development',
    fallbackComponent = null,
  } = options;

  const WithErrorHandling = (props) => {
    const [key, setKey] = useState(0);

    const handleReset = () => {
      // Reset the error boundary by changing the key
      setKey(prevKey => prevKey + 1);
    };

    const renderFallback = ({ error, resetErrorBoundary }) => {
      // Use custom fallback if provided
      if (fallbackComponent) {
        return React.createElement(fallbackComponent, {
          error,
          resetErrorBoundary,
        });
      }

      // Use network error fallback for network errors
      if (isNetworkError(error)) {
        return <NetworkErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />;
      }

      // Default to standard error boundary UI
      return null;
    };

    return (
      <ErrorBoundary
        key={key}
        showDetails={showErrorDetails}
        FallbackComponent={renderFallback}
        onReset={handleReset}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  // Set display name for debugging
  const componentName = Component.displayName || Component.name || 'Component';
  WithErrorHandling.displayName = `withErrorHandling(${componentName})`;

  return WithErrorHandling;
};

export default withErrorHandling;
