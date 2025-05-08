'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the SuccessStories component on the client side
const SuccessStories = dynamic(() => import('@/components/landing/SuccessStories'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg h-64"></div>
        </div>
      </div>
    </div>
  )
});

const ClientSuccessStories = () => {
  return <SuccessStories />;
};

export default ClientSuccessStories;
