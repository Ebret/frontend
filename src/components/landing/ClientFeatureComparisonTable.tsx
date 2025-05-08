'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the FeatureComparisonTable component on the client side
const FeatureComparisonTable = dynamic(() => import('@/components/landing/FeatureComparisonTable'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="flex flex-wrap justify-center mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-md mx-2 mb-2"></div>
          ))}
        </div>
        <div className="h-40 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

const ClientFeatureComparisonTable = () => {
  return <FeatureComparisonTable />;
};

export default ClientFeatureComparisonTable;
