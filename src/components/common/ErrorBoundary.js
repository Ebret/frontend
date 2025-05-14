'use client';

import React, { Component } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

/**
 * ErrorBoundary Component
 * 
 * A component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to be rendered
 * @param {React.ReactNode} props.fallback - Custom fallback UI to display when an error occurs
 * @param {Function} props.onError - Function to be called when an error occurs
 * @param {boolean} props.showReset - Whether to show the reset button
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({ errorInfo });
    
    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetErrorBoundary);
      }
      
      // Otherwise, use the default fallback UI
      return (
        <div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
          <div className="mx-auto max-w-max">
            <main className="sm:flex">
              <div className="flex-shrink-0 flex justify-center">
                <FiAlertTriangle className="h-12 w-12 text-red-500" aria-hidden="true" />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">Something went wrong</h1>
                <p className="mt-2 text-base text-gray-500">
                  We've encountered an error and are working to fix the problem.
                </p>
                <div className="mt-6">
                  {this.props.showReset !== false && (
                    <button
                      type="button"
                      onClick={this.resetErrorBoundary}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiRefreshCw className="mr-2 -ml-1 h-4 w-4" />
                      Try again
                    </button>
                  )}
                </div>
                
                {process.env.NODE_ENV !== 'production' && (
                  <div className="mt-6">
                    <details className="text-left whitespace-pre-wrap text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
                      <summary className="text-indigo-600 cursor-pointer">Error details</summary>
                      <p className="mt-2 font-mono">{this.state.error && this.state.error.toString()}</p>
                      <p className="mt-2 font-mono">{this.state.errorInfo && this.state.errorInfo.componentStack}</p>
                    </details>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * withErrorBoundary HOC
 * 
 * A higher-order component that wraps a component with an ErrorBoundary
 * 
 * @param {React.Component} Component - The component to wrap
 * @param {Object} errorBoundaryProps - Props to pass to the ErrorBoundary
 * @returns {React.Component} - The wrapped component
 */
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component';
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;
