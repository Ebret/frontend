'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the PricingCalculator component on the client side
const PricingCalculator = dynamic(() => import('@/components/landing/PricingCalculator'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded-full w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg space-y-6">
            <div className="text-center space-y-1">
              <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

const ClientPricingCalculator = () => {
  return <PricingCalculator />;
};

export default ClientPricingCalculator;
