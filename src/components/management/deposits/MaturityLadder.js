'use client';

import React, { useState } from 'react';
import { FiCalendar } from 'react-icons/fi';

/**
 * Maturity Ladder Component
 * 
 * Visualizes deposit maturities over time:
 * - Monthly maturity distribution
 * - Quarterly maturity distribution
 * - Annual maturity distribution
 * 
 * @param {Array} deposits - Array of deposit objects
 */
const MaturityLadder = ({ deposits }) => {
  // State for time period
  const [timePeriod, setTimePeriod] = useState('monthly');
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short'
    });
  };
  
  // Calculate monthly maturity ladder
  const calculateMonthlyMaturityLadder = () => {
    const today = new Date();
    const ladder = [];
    
    // Create 12 months of buckets
    for (let i = 0; i < 12; i++) {
      const month = new Date(today);
      month.setMonth(today.getMonth() + i);
      
      ladder.push({
        label: month.toLocaleDateString('en-PH', { month: 'short', year: 'numeric' }),
        startDate: new Date(month.getFullYear(), month.getMonth(), 1),
        endDate: new Date(month.getFullYear(), month.getMonth() + 1, 0),
        amount: 0,
        count: 0,
        deposits: []
      });
    }
    
    // Add deposits to buckets
    deposits.forEach(deposit => {
      if (!deposit.maturityDate) return;
      
      const maturityDate = new Date(deposit.maturityDate);
      
      // Find the appropriate bucket
      const bucket = ladder.find(b => 
        maturityDate >= b.startDate && 
        maturityDate <= b.endDate
      );
      
      if (bucket) {
        bucket.amount += deposit.amount;
        bucket.count++;
        bucket.deposits.push(deposit);
      }
    });
    
    return ladder;
  };
  
  // Calculate quarterly maturity ladder
  const calculateQuarterlyMaturityLadder = () => {
    const today = new Date();
    const ladder = [];
    
    // Create 8 quarters of buckets
    for (let i = 0; i < 8; i++) {
      const quarter = new Date(today);
      quarter.setMonth(today.getMonth() + i * 3);
      
      const quarterNumber = Math.floor(quarter.getMonth() / 3) + 1;
      
      ladder.push({
        label: `Q${quarterNumber} ${quarter.getFullYear()}`,
        startDate: new Date(quarter.getFullYear(), Math.floor(quarter.getMonth() / 3) * 3, 1),
        endDate: new Date(quarter.getFullYear(), Math.floor(quarter.getMonth() / 3) * 3 + 3, 0),
        amount: 0,
        count: 0,
        deposits: []
      });
    }
    
    // Add deposits to buckets
    deposits.forEach(deposit => {
      if (!deposit.maturityDate) return;
      
      const maturityDate = new Date(deposit.maturityDate);
      
      // Find the appropriate bucket
      const bucket = ladder.find(b => 
        maturityDate >= b.startDate && 
        maturityDate <= b.endDate
      );
      
      if (bucket) {
        bucket.amount += deposit.amount;
        bucket.count++;
        bucket.deposits.push(deposit);
      }
    });
    
    return ladder;
  };
  
  // Calculate annual maturity ladder
  const calculateAnnualMaturityLadder = () => {
    const today = new Date();
    const ladder = [];
    
    // Create 5 years of buckets
    for (let i = 0; i < 5; i++) {
      const year = new Date(today);
      year.setFullYear(today.getFullYear() + i);
      
      ladder.push({
        label: year.getFullYear().toString(),
        startDate: new Date(year.getFullYear(), 0, 1),
        endDate: new Date(year.getFullYear(), 11, 31),
        amount: 0,
        count: 0,
        deposits: []
      });
    }
    
    // Add deposits to buckets
    deposits.forEach(deposit => {
      if (!deposit.maturityDate) return;
      
      const maturityDate = new Date(deposit.maturityDate);
      
      // Find the appropriate bucket
      const bucket = ladder.find(b => 
        maturityDate >= b.startDate && 
        maturityDate <= b.endDate
      );
      
      if (bucket) {
        bucket.amount += deposit.amount;
        bucket.count++;
        bucket.deposits.push(deposit);
      }
    });
    
    return ladder;
  };
  
  // Get active ladder data
  const getActiveLadderData = () => {
    switch (timePeriod) {
      case 'monthly':
        return calculateMonthlyMaturityLadder();
      case 'quarterly':
        return calculateQuarterlyMaturityLadder();
      case 'annual':
        return calculateAnnualMaturityLadder();
      default:
        return [];
    }
  };
  
  const ladderData = getActiveLadderData();
  
  // Calculate max amount for scaling
  const maxAmount = Math.max(...ladderData.map(bucket => bucket.amount), 1);
  
  // Calculate total maturing amount
  const totalMaturingAmount = ladderData.reduce((sum, bucket) => sum + bucket.amount, 0);
  
  // Calculate total maturing count
  const totalMaturingCount = ladderData.reduce((sum, bucket) => sum + bucket.count, 0);
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <FiCalendar className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Maturity Ladder
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setTimePeriod('monthly')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              timePeriod === 'monthly'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setTimePeriod('quarterly')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              timePeriod === 'quarterly'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Quarterly
          </button>
          <button
            type="button"
            onClick={() => setTimePeriod('annual')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              timePeriod === 'annual'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Annual
          </button>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium text-gray-500">Total Maturing:</span>
              <span className="ml-2 text-lg font-semibold text-gray-900">{formatCurrency(totalMaturingAmount)}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Accounts:</span>
              <span className="ml-2 text-lg font-semibold text-gray-900">{totalMaturingCount}</span>
            </div>
          </div>
        </div>
        
        {/* Maturity Ladder Chart */}
        <div className="mt-6">
          <div className="flex items-end space-x-2 h-64">
            {ladderData.map((bucket, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div className="text-xs text-gray-500 mb-1">
                  {formatCurrency(bucket.amount)}
                </div>
                <div 
                  className="bg-blue-500 rounded-t w-full relative group"
                  style={{ 
                    height: `${bucket.amount > 0 ? Math.max((bucket.amount / maxAmount) * 100, 5) : 0}%`,
                    minHeight: bucket.amount > 0 ? '20px' : '0'
                  }}
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                    {bucket.count} deposits
                  </div>
                </div>
                <div className="text-xs font-medium text-gray-700 mt-2 w-full text-center truncate" title={bucket.label}>
                  {bucket.label}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Maturity Details */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Maturities</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Accounts
                  </th>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    % of Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ladderData.map((bucket, index) => (
                  <tr key={index} className={bucket.count > 0 ? 'hover:bg-gray-50' : ''}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {bucket.label}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(bucket.amount)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {bucket.count}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {totalMaturingAmount > 0 
                        ? ((bucket.amount / totalMaturingAmount) * 100).toFixed(1) + '%'
                        : '0%'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaturityLadder;
