'use client';

import React from 'react';
import { FiCheckCircle, FiCreditCard, FiShoppingBag } from 'react-icons/fi';

/**
 * Setup Complete Component
 * 
 * Displayed when the setup process is complete
 * 
 * @param {Object} props
 * @param {string} props.cooperativeType - The selected cooperative type
 */
const SetupComplete = ({ cooperativeType }) => {
  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <FiCheckCircle className="h-6 w-6 text-green-600" />
      </div>
      
      <h3 className="mt-3 text-lg font-medium text-gray-900">Setup Complete!</h3>
      <p className="mt-2 text-sm text-gray-500">
        Your cooperative system has been successfully initialized.
      </p>
      
      <div className="mt-6 bg-gray-50 rounded-md p-4 text-left">
        <h4 className="text-sm font-medium text-gray-700 mb-2">System Configuration:</h4>
        <div className="flex items-center mb-4">
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${
            cooperativeType === 'CREDIT' ? 'bg-blue-500' : 'bg-green-500'
          }`}>
            {cooperativeType === 'CREDIT' ? (
              <FiCreditCard className="h-4 w-4 text-white" />
            ) : (
              <FiShoppingBag className="h-4 w-4 text-white" />
            )}
          </div>
          <div className="ml-3">
            <h5 className="text-sm font-medium text-gray-900">
              {cooperativeType === 'CREDIT' ? 'Credit Cooperative' : 'Multi-Purpose Cooperative'}
            </h5>
            <p className="text-xs text-gray-500">
              {cooperativeType === 'CREDIT'
                ? 'Financial services, loans, and savings products'
                : 'Financial services plus consumer, producer, and marketing activities'}
            </p>
          </div>
        </div>
        
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Modules:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li className="flex items-center">
            <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
            User Management
          </li>
          <li className="flex items-center">
            <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Loan Management
          </li>
          <li className="flex items-center">
            <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Savings & Deposits
          </li>
          <li className="flex items-center">
            <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Share Capital Management
          </li>
          <li className="flex items-center">
            <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
            Damayan Fund
          </li>
          
          {cooperativeType === 'MULTI_PURPOSE' && (
            <>
              <li className="flex items-center">
                <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Inventory Management
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Point of Sale
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Consumer Goods
              </li>
              <li className="flex items-center">
                <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Marketing Services
              </li>
            </>
          )}
        </ul>
      </div>
      
      <div className="mt-6">
        <p className="text-sm text-gray-500">
          You can now log in with your admin account to start using the system.
        </p>
      </div>
    </div>
  );
};

export default SetupComplete;
