'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the FAQSection component on the client side
const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-0"></div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-40 mx-auto"></div>
        </div>
      </div>
    </div>
  )
});

const ClientFAQSection = () => {
  return <FAQSection />;
};

export default ClientFAQSection;
