'use client';

import React, { useState } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

/**
 * Deposit Filters Component
 * 
 * Provides advanced filtering options for deposit management:
 * - Type filter
 * - Status filter
 * - Amount range filter
 * - Maturity range filter
 * 
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when a filter changes
 * @param {Function} onSaveFilter - Callback to save the current filter set
 */
const DepositFilters = ({ filters, onFilterChange, onSaveFilter }) => {
  // State for filter name when saving
  const [filterName, setFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  // Handle save filter
  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    
    onSaveFilter(filterName);
    setFilterName('');
    setShowSaveDialog(false);
  };
  
  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Deposit Type
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Types</option>
            <option value="savings">Savings</option>
            <option value="time_deposit">Time Deposit</option>
          </select>
        </div>
        
        {/* Status Filter */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="dormant">Dormant</option>
            <option value="matured">Matured</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        
        {/* Amount Range Filter */}
        <div>
          <label htmlFor="amountRange" className="block text-sm font-medium text-gray-700">
            Amount Range
          </label>
          <select
            id="amountRange"
            name="amountRange"
            value={filters.amountRange}
            onChange={(e) => onFilterChange('amountRange', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Any Amount</option>
            <option value="small">Small (< ₱50,000)</option>
            <option value="medium">Medium (₱50,000 - ₱200,000)</option>
            <option value="large">Large (> ₱200,000)</option>
          </select>
        </div>
        
        {/* Maturity Range Filter */}
        <div>
          <label htmlFor="maturityRange" className="block text-sm font-medium text-gray-700">
            Maturity Range
          </label>
          <select
            id="maturityRange"
            name="maturityRange"
            value={filters.maturityRange}
            onChange={(e) => onFilterChange('maturityRange', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Any Maturity</option>
            <option value="next30">Next 30 Days</option>
            <option value="next90">Next 90 Days</option>
            <option value="next365">Next Year</option>
          </select>
        </div>
      </div>
      
      {/* Advanced Filters (expandable in future) */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Advanced Filters</span>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowSaveDialog(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSave className="mr-2 h-4 w-4 text-gray-500" />
              Save Filter
            </button>
          </div>
        </div>
        
        {/* Save Filter Dialog */}
        {showSaveDialog && (
          <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-blue-900">Save Current Filter</h4>
              <button
                type="button"
                onClick={() => setShowSaveDialog(false)}
                className="text-blue-500 hover:text-blue-700"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Enter filter name"
                className="flex-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
              <button
                type="button"
                onClick={handleSaveFilter}
                disabled={!filterName.trim()}
                className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        )}
        
        {/* Additional Advanced Filters (commented out for future expansion) */}
        {/* 
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
              Interest Rate
            </label>
            <select
              id="interestRate"
              name="interestRate"
              value={filters.interestRate || ''}
              onChange={(e) => onFilterChange('interestRate', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any Rate</option>
              <option value="low">Low (< 2%)</option>
              <option value="medium">Medium (2% - 4%)</option>
              <option value="high">High (> 4%)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="openDate" className="block text-sm font-medium text-gray-700">
              Open Date
            </label>
            <select
              id="openDate"
              name="openDate"
              value={filters.openDate || ''}
              onChange={(e) => onFilterChange('openDate', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any Date</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="last365">Last Year</option>
              <option value="older">Older than 1 Year</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
              Product
            </label>
            <select
              id="productId"
              name="productId"
              value={filters.productId || ''}
              onChange={(e) => onFilterChange('productId', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any Product</option>
              <option value="P001">Regular Savings</option>
              <option value="P002">High-Yield Savings</option>
              <option value="P003">1-Year Time Deposit</option>
              <option value="P004">6-Month Time Deposit</option>
              <option value="P005">2-Year Time Deposit</option>
            </select>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default DepositFilters;
