'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Calculator Navigation Component
 * 
 * Provides navigation links to different calculators in the system.
 */
const CalculatorNav = () => {
  const pathname = usePathname();
  
  const calculators = [
    {
      name: 'Loan Calculator',
      path: '/calculators/loan',
      description: 'Calculate loan payments, interest, and amortization schedules'
    },
    {
      name: 'Savings Calculator',
      path: '/calculators/savings',
      description: 'Estimate your savings growth with different interest rates'
    },
    {
      name: 'Retirement Calculator',
      path: '/calculators/retirement',
      description: 'Plan for your retirement with our retirement calculator'
    }
  ];
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-blue-600 px-6 py-4">
        <h2 className="text-xl font-semibold text-white">Financial Calculators</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {calculators.map((calculator) => {
          const isActive = pathname === calculator.path;
          
          return (
            <Link
              key={calculator.path}
              href={calculator.path}
              className={`block px-6 py-4 hover:bg-blue-50 transition-colors ${
                isActive ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="flex flex-col">
                <span className={`font-medium ${isActive ? 'text-blue-600' : 'text-gray-800'}`}>
                  {calculator.name}
                </span>
                <span className="text-sm text-gray-500 mt-1">
                  {calculator.description}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CalculatorNav;
