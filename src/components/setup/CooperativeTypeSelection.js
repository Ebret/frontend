'use client';

import React from 'react';
import { FiCreditCard, FiShoppingBag, FiCheck } from 'react-icons/fi';

/**
 * Cooperative Type Selection Component
 * 
 * Allows selection between Credit Cooperative and Multi-Purpose Cooperative
 * 
 * @param {Object} props
 * @param {string} props.selectedType - Currently selected cooperative type
 * @param {Function} props.onSelect - Function to call when a type is selected
 */
const CooperativeTypeSelection = ({ selectedType, onSelect }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Cooperative Type</h3>
      <p className="text-sm text-gray-500 mb-6">
        Choose the type of cooperative you want to set up. This will determine the features and modules available in your system.
      </p>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Credit Cooperative */}
        <div
          className={`relative rounded-lg border ${
            selectedType === 'CREDIT'
              ? 'border-blue-500 ring-2 ring-blue-500'
              : 'border-gray-300'
          } bg-white p-4 shadow-sm focus:outline-none cursor-pointer`}
          onClick={() => onSelect('CREDIT')}
        >
          <div className="flex items-start">
            <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
              selectedType === 'CREDIT' ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
              <FiCreditCard className={`h-6 w-6 ${
                selectedType === 'CREDIT' ? 'text-white' : 'text-gray-600'
              }`} />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">Credit Cooperative</h4>
              <p className="mt-1 text-xs text-gray-500">
                Focused on providing financial services, loans, and savings products to members.
              </p>
            </div>
          </div>
          
          {selectedType === 'CREDIT' && (
            <div className="absolute top-3 right-3">
              <FiCheck className="h-5 w-5 text-blue-500" />
            </div>
          )}
          
          <div className="mt-4">
            <h5 className="text-xs font-medium text-gray-700 mb-2">Key Features:</h5>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Loan Management</li>
              <li>• Savings & Deposits</li>
              <li>• Share Capital Management</li>
              <li>• Damayan Fund</li>
              <li>• Financial Reports</li>
            </ul>
          </div>
        </div>
        
        {/* Multi-Purpose Cooperative */}
        <div
          className={`relative rounded-lg border ${
            selectedType === 'MULTI_PURPOSE'
              ? 'border-blue-500 ring-2 ring-blue-500'
              : 'border-gray-300'
          } bg-white p-4 shadow-sm focus:outline-none cursor-pointer`}
          onClick={() => onSelect('MULTI_PURPOSE')}
        >
          <div className="flex items-start">
            <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
              selectedType === 'MULTI_PURPOSE' ? 'bg-blue-500' : 'bg-gray-100'
            }`}>
              <FiShoppingBag className={`h-6 w-6 ${
                selectedType === 'MULTI_PURPOSE' ? 'text-white' : 'text-gray-600'
              }`} />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">Multi-Purpose Cooperative</h4>
              <p className="mt-1 text-xs text-gray-500">
                Combines financial services with consumer, producer, or marketing activities.
              </p>
            </div>
          </div>
          
          {selectedType === 'MULTI_PURPOSE' && (
            <div className="absolute top-3 right-3">
              <FiCheck className="h-5 w-5 text-blue-500" />
            </div>
          )}
          
          <div className="mt-4">
            <h5 className="text-xs font-medium text-gray-700 mb-2">Key Features:</h5>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• All Credit Cooperative Features</li>
              <li>• Inventory Management</li>
              <li>• Point of Sale</li>
              <li>• Consumer Goods</li>
              <li>• Marketing Services</li>
              <li>• Production Management</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Important Note:</h4>
        <p className="text-xs text-gray-500">
          While you can change the cooperative type later, it's recommended to select the appropriate type now to ensure proper system configuration. Changing the type later may require additional setup.
        </p>
      </div>
    </div>
  );
};

export default CooperativeTypeSelection;
