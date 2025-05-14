'use client';

import React from 'react';
import { 
  FiAlertTriangle, 
  FiAlertCircle, 
  FiRefreshCw, 
  FiWifiOff, 
  FiLock, 
  FiSearch, 
  FiLoader 
} from 'react-icons/fi';

/**
 * ErrorFallback Component
 * 
 * A fallback UI to display when an error occurs
 * 
 * @param {Object} props
 * @param {Error} props.error - The error that occurred
 * @param {Function} props.resetErrorBoundary - Function to reset the error boundary
 * @param {string} props.title - Custom title
 * @param {string} props.message - Custom message
 * @param {string} props.buttonText - Custom button text
 * @param {boolean} props.showReset - Whether to show the reset button
 */
export const ErrorFallback = ({
  error,
  resetErrorBoundary,
  title = 'Something went wrong',
  message = 'We\'ve encountered an error and are working to fix the problem.',
  buttonText = 'Try again',
  showReset = true,
}) => {
  return (
    <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="flex-shrink-0 flex justify-center">
            <FiAlertTriangle className="h-12 w-12 text-red-500" aria-hidden="true" />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-base text-gray-500">
              {message}
            </p>
            <div className="mt-6">
              {showReset && resetErrorBoundary && (
                <button
                  type="button"
                  onClick={resetErrorBoundary}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FiRefreshCw className="mr-2 -ml-1 h-4 w-4" />
                  {buttonText}
                </button>
              )}
            </div>
            
            {process.env.NODE_ENV !== 'production' && error && (
              <div className="mt-6">
                <details className="text-left whitespace-pre-wrap text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
                  <summary className="text-indigo-600 cursor-pointer">Error details</summary>
                  <p className="mt-2 font-mono">{error.toString()}</p>
                  {error.stack && (
                    <p className="mt-2 font-mono">{error.stack}</p>
                  )}
                </details>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * NetworkErrorFallback Component
 * 
 * A fallback UI to display when a network error occurs
 * 
 * @param {Object} props
 * @param {Function} props.onRetry - Function to retry the network request
 * @param {string} props.title - Custom title
 * @param {string} props.message - Custom message
 * @param {string} props.buttonText - Custom button text
 */
export const NetworkErrorFallback = ({
  onRetry,
  title = 'Network error',
  message = 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.',
  buttonText = 'Retry',
}) => {
  return (
    <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="flex-shrink-0 flex justify-center">
            <FiWifiOff className="h-12 w-12 text-yellow-500" aria-hidden="true" />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-base text-gray-500">
              {message}
            </p>
            <div className="mt-6">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiRefreshCw className="mr-2 -ml-1 h-4 w-4" />
                {buttonText}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * NotFoundFallback Component
 * 
 * A fallback UI to display when a resource is not found
 * 
 * @param {Object} props
 * @param {string} props.title - Custom title
 * @param {string} props.message - Custom message
 * @param {string} props.buttonText - Custom button text
 * @param {string} props.buttonHref - Custom button href
 */
export const NotFoundFallback = ({
  title = 'Page not found',
  message = 'Sorry, we couldn\'t find the page you\'re looking for.',
  buttonText = 'Go back home',
  buttonHref = '/',
}) => {
  return (
    <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="flex-shrink-0 flex justify-center">
            <FiSearch className="h-12 w-12 text-gray-400" aria-hidden="true" />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-base text-gray-500">
              {message}
            </p>
            <div className="mt-6">
              <a
                href={buttonHref}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {buttonText}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * UnauthorizedFallback Component
 * 
 * A fallback UI to display when a user is not authorized to access a resource
 * 
 * @param {Object} props
 * @param {string} props.title - Custom title
 * @param {string} props.message - Custom message
 * @param {string} props.buttonText - Custom button text
 * @param {string} props.buttonHref - Custom button href
 */
export const UnauthorizedFallback = ({
  title = 'Access denied',
  message = 'Sorry, you don\'t have permission to access this page.',
  buttonText = 'Go back',
  buttonHref = '/',
}) => {
  return (
    <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          <div className="flex-shrink-0 flex justify-center">
            <FiLock className="h-12 w-12 text-red-500" aria-hidden="true" />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-base text-gray-500">
              {message}
            </p>
            <div className="mt-6">
              <a
                href={buttonHref}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {buttonText}
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * LoadingFallback Component
 * 
 * A fallback UI to display while content is loading
 * 
 * @param {Object} props
 * @param {string} props.message - Custom message
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.fullPage - Whether to display as a full page
 */
export const LoadingFallback = ({
  message = 'Loading...',
  className = '',
  fullPage = false,
}) => {
  if (fullPage) {
    return (
      <div className="min-h-full flex items-center justify-center bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <FiLoader className="mx-auto h-12 w-12 text-indigo-500 animate-spin" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-medium text-gray-900">{message}</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <FiLoader className="h-6 w-6 text-indigo-500 animate-spin mr-2" aria-hidden="true" />
      <span className="text-gray-700">{message}</span>
    </div>
  );
};

/**
 * EmptyStateFallback Component
 * 
 * A fallback UI to display when there is no content to show
 * 
 * @param {Object} props
 * @param {string} props.title - Custom title
 * @param {string} props.message - Custom message
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {string} props.buttonText - Custom button text
 * @param {Function} props.onAction - Function to call when the button is clicked
 * @param {string} props.className - Additional CSS classes
 */
export const EmptyStateFallback = ({
  title = 'No items found',
  message = 'Get started by creating a new item.',
  icon = <FiAlertCircle className="h-12 w-12 text-gray-400" />,
  buttonText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="flex justify-center">
        {icon}
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      {buttonText && onAction && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {buttonText}
          </button>
        </div>
      )}
    </div>
  );
};
