'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import LoanRatesForm from '@/components/admin/rates/LoanRatesForm';
import SavingsRatesForm from '@/components/admin/rates/SavingsRatesForm';
import RetirementRatesForm from '@/components/admin/rates/RetirementRatesForm';
import FeesForm from '@/components/admin/rates/FeesForm';
import RateHistoryLog from '@/components/admin/rates/RateHistoryLog';

/**
 * Rates and Fees Management Page
 * 
 * This page allows administrators to manage all rates and fees in the system:
 * - Loan interest rates
 * - Savings interest rates
 * - Retirement fund rates
 * - Processing fees
 * - Service fees
 * - Penalties
 */
const RatesAndFeesPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('loans');
  
  // Tabs for different rate categories
  const tabs = [
    { id: 'loans', name: 'Loan Rates' },
    { id: 'savings', name: 'Savings Rates' },
    { id: 'retirement', name: 'Retirement Rates' },
    { id: 'fees', name: 'Fees & Charges' },
    { id: 'history', name: 'Change History' },
  ];
  
  // Function to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'loans':
        return <LoanRatesForm />;
      case 'savings':
        return <SavingsRatesForm />;
      case 'retirement':
        return <RetirementRatesForm />;
      case 'fees':
        return <FeesForm />;
      case 'history':
        return <RateHistoryLog />;
      default:
        return <LoanRatesForm />;
    }
  };
  
  return (
    <AdminLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Rates and Fees Management</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configure interest rates, fees, and charges for all financial products.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="px-4 py-5 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
      
      {/* Help section */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              Changes to rates and fees will be logged and require approval before taking effect.
              New rates will apply to new applications only, unless otherwise specified.
            </p>
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a href="/admin/help/rates" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RatesAndFeesPage;
