'use client';

import React from 'react';
import Layout from '@/components/Layout';
import CurrencyConverter from '@/components/CurrencyConverter';

const CurrencyConverterPage: React.FC = () => {
  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Currency Converter</h1>
            <p className="mt-2 text-sm text-gray-600">
              Convert Philippine Peso (₱) to other currencies
            </p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="max-w-md mx-auto">
                <CurrencyConverter />
              </div>
              
              <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">About Currency Conversion</h2>
                <p className="text-gray-600 mb-4">
                  This currency converter allows you to convert Philippine Peso (₱) to various other currencies.
                  The exchange rates used are approximate and for informational purposes only.
                </p>
                <p className="text-gray-600 mb-4">
                  For official exchange rates, please consult with your bank or financial institution.
                  Exchange rates fluctuate constantly and may vary from the rates shown here.
                </p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        The exchange rates used in this converter are approximate and updated periodically.
                        For the most accurate rates, please check with your bank or a currency exchange service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default CurrencyConverterPage;
