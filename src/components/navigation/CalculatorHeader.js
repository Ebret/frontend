'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Calculator Header Component
 * 
 * Provides a header with navigation for calculator pages.
 */
const CalculatorHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-blue-600 text-2xl font-bold">Coop</span>
              <span className="text-gray-800 text-2xl font-bold">Calc</span>
            </Link>
          </div>
          
          <nav className="flex space-x-8">
            <Link 
              href="/calculators/loan" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Loan
            </Link>
            <Link 
              href="/calculators/savings" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Savings
            </Link>
            <Link 
              href="/calculators/retirement" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Retirement
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Back to Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default CalculatorHeader;
