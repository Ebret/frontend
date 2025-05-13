'use client';

import React, { useState } from 'react';
import { FiSave, FiX } from 'react-icons/fi';

/**
 * Loan Filters Component
 * 
 * Provides advanced filtering options for loan management:
 * - Status filter
 * - Loan type filter
 * - Date range filter
 * - Amount range filter
 * - Risk level filter
 * 
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when a filter changes
 * @param {Function} onSaveFilter - Callback to save the current filter set
 */
const LoanFilters = ({ filters, onFilterChange, onSaveFilter }) => {
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
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        {/* Loan Type Filter */}
        <div>
          <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
            Loan Type
          </label>
          <select
            id="loanType"
            name="loanType"
            value={filters.loanType}
            onChange={(e) => onFilterChange('loanType', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Types</option>
            <option value="personal">Personal</option>
            <option value="business">Business</option>
            <option value="housing">Housing</option>
            <option value="education">Education</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
        
        {/* Date Range Filter */}
        <div>
          <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700">
            Approval Date
          </label>
          <select
            id="dateRange"
            name="dateRange"
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Time</option>
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="last365">Last Year</option>
          </select>
        </div>
        
        {/* Amount Range Filter */}
        <div>
          <label htmlFor="amountRange" className="block text-sm font-medium text-gray-700">
            Loan Amount
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
        
        {/* Risk Level Filter */}
        <div>
          <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700">
            Risk Level
          </label>
          <select
            id="riskLevel"
            name="riskLevel"
            value={filters.riskLevel}
            onChange={(e) => onFilterChange('riskLevel', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
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
            <label htmlFor="collateral" className="block text-sm font-medium text-gray-700">
              Collateral
            </label>
            <select
              id="collateral"
              name="collateral"
              value={filters.collateral || ''}
              onChange={(e) => onFilterChange('collateral', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any</option>
              <option value="with">With Collateral</option>
              <option value="without">Without Collateral</option>
            </select>
          </div>
          
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
              <option value="low">Low (< 10%)</option>
              <option value="medium">Medium (10% - 15%)</option>
              <option value="high">High (> 15%)</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700">
              Loan Term
            </label>
            <select
              id="term"
              name="term"
              value={filters.term || ''}
              onChange={(e) => onFilterChange('term', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Any Term</option>
              <option value="short">Short (≤ 12 months)</option>
              <option value="medium">Medium (13-36 months)</option>
              <option value="long">Long (> 36 months)</option>
            </select>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default LoanFilters;
