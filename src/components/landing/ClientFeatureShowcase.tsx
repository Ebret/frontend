'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the FeatureShowcase component on the client side
const FeatureShowcase = dynamic(() => import('@/components/landing/FeatureShowcase'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      <div className="h-16 bg-gray-200"></div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    </div>
  )
});

const ClientFeatureShowcase = () => {
  return <FeatureShowcase />;
};

export default ClientFeatureShowcase;
