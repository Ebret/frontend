'use client';

import React, { useState } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

/**
 * Member Filters Component
 * 
 * Provides advanced filtering options for member management:
 * - Status filter
 * - Membership type filter
 * - Join date range filter
 * - Product usage filter
 * - Credit score filter
 * 
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when a filter changes
 * @param {Function} onSaveFilter - Callback to save the current filter set
 */
const MemberFilters = ({ filters, onFilterChange, onSaveFilter }) => {
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <option value="inactive">Inactive</option>
            <option value="at_risk">At Risk</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        
        {/* Membership Type Filter */}
        <div>
          <label htmlFor="membershipType" className="block text-sm font-medium text-gray-700">
            Membership Type
          </label>
          <select
            id="membershipType"
            name="membershipType"
            value={filters.membershipType}
            onChange={(e) => onFilterChange('membershipType', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Types</option>
            <option value="regular">Regular</option>
            <option value="premium">Premium</option>
            <option value="senior">Senior</option>
            <option value="youth">Youth</option>
          </select>
        </div>
        
        {/* Join Date Range Filter */}
        <div>
          <label htmlFor="joinDateRange" className="block text-sm font-medium text-gray-700">
            Join Date
          </label>
          <select
            id="joinDateRange"
            name="joinDateRange"
            value={filters.joinDateRange}
            onChange={(e) => onFilterChange('joinDateRange', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Time</option>
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="last365">Last Year</option>
          </select>
        </div>
        
        {/* Product Usage Filter */}
        <div>
          <label htmlFor="productUsage" className="block text-sm font-medium text-gray-700">
            Product Usage
          </label>
          <select
            id="productUsage"
            name="productUsage"
            value={filters.productUsage}
            onChange={(e) => onFilterChange('productUsage', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Any Products</option>
            <option value="savings">Savings Account</option>
            <option value="loan">Loan</option>
            <option value="time_deposit">Time Deposit</option>
            <option value="insurance">Insurance</option>
            <option value="investment">Investment</option>
          </select>
        </div>
        
        {/* Credit Score Filter */}
        <div>
          <label htmlFor="creditScore" className="block text-sm font-medium text-gray-700">
            Credit Score
          </label>
          <select
            id="creditScore"
            name="creditScore"
            value={filters.creditScore}
            onChange={(e) => onFilterChange('creditScore', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Scores</option>
            <option value="high">High (80+)</option>
            <option value="medium">Medium (60-79)</option>
            <option value="low">Low (Below 60)</option>
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
            <label htmlFor="lastActivity" className="block text-sm font-medium text-gray-700">
              Last Activity
            </label>
            <select
              id="lastActivity"
              name="lastActivity"
              value={filters.lastActivity || ''}
              onChange={(e) => onFilterChange('lastActivity', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any Time</option>
              <option value="last7">Last 7 Days</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="inactive90">Inactive (90+ Days)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="savingsBalance" className="block text-sm font-medium text-gray-700">
              Savings Balance
            </label>
            <select
              id="savingsBalance"
              name="savingsBalance"
              value={filters.savingsBalance || ''}
              onChange={(e) => onFilterChange('savingsBalance', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any Balance</option>
              <option value="low">Low (< ₱10,000)</option>
              <option value="medium">Medium (₱10,000 - ₱100,000)</option>
              <option value="high">High (> ₱100,000)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="loanStatus" className="block text-sm font-medium text-gray-700">
              Loan Status
            </label>
            <select
              id="loanStatus"
              name="loanStatus"
              value={filters.loanStatus || ''}
              onChange={(e) => onFilterChange('loanStatus', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any Status</option>
              <option value="active">Has Active Loan</option>
              <option value="none">No Active Loans</option>
              <option value="overdue">Has Overdue Loan</option>
            </select>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default MemberFilters;
