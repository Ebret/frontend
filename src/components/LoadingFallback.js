import React from 'react';
import { Spinner } from '@/components/ui';

const LoadingFallback = ({ message = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Spinner size="md" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingFallback;
