import React from 'react';

const NetworkErrorFallback = ({ error, resetErrorBoundary }) => {
  const isNetworkError = error?.message?.includes('network') || 
                         error?.message?.includes('Failed to fetch') ||
                         error?.message?.includes('Network request failed');

  return (
    <div className="bg-white shadow-md rounded-lg p-6 my-4">
      <div className="flex items-center justify-center mb-4">
        <svg className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
        {isNetworkError ? 'Network Error' : 'Something went wrong'}
      </h2>
      <p className="text-gray-600 text-center mb-4">
        {isNetworkError 
          ? 'Unable to connect to the server. Please check your internet connection and try again.'
          : 'We encountered an error while loading this content. Please try again later.'}
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Try Again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default NetworkErrorFallback;
