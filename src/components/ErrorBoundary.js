'use client';

import React, { Component } from 'react';
import { toast } from 'react-hot-toast';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });

    // Show a toast notification
    toast.error('Something went wrong. Please try again later.');
  }

  render() {
    if (this.state.hasError) {
      // Render fallback UI
      return (
        <div className="bg-white shadow-md rounded-lg p-6 my-4">
          <div className="flex items-center justify-center mb-4">
            <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">Something went wrong</h2>
          <p className="text-gray-600 text-center mb-4">
            We're sorry, but there was an error loading this component.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                window.location.reload();
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try Again
            </button>
          </div>
          {this.props.showDetails && this.state.error && (
            <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto text-xs">
              <details>
                <summary className="cursor-pointer text-sm font-medium text-gray-700">Error Details</summary>
                <pre className="mt-2 text-red-600">{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 text-gray-700">{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
