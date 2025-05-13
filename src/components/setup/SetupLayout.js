'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Setup Layout Component
 * 
 * Layout for the setup wizard pages
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Page content
 */
const SetupLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <div className="flex justify-center">
          <div className="h-12 w-12 relative">
            <Image
              src="/logo.png"
              alt="Cooperative System Logo"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Cooperative System Setup
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Configure your cooperative system to get started
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Cooperative System. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SetupLayout;
