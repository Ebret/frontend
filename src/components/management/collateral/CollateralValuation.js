'use client';

import React, { useState } from 'react';
import { FiDollarSign, FiCalendar, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

/**
 * Collateral Valuation Component
 * 
 * Provides tools for valuing collateral:
 * - Valuation history
 * - Appraisal scheduling
 * - Value trends
 * 
 * @param {Array} collaterals - Array of collateral objects
 */
const CollateralValuation = ({ collaterals }) => {
  // State for selected collateral
  const [selectedCollateral, setSelectedCollateral] = useState(null);
  
  // State for valuation method
  const [valuationMethod, setValuationMethod] = useState('market');
  
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
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate days until next appraisal
  const calculateDaysUntilNextAppraisal = (nextAppraisalDate) => {
    if (!nextAppraisalDate) return null;
    
    const today = new Date();
    const appraisalDate = new Date(nextAppraisalDate);
    const diffTime = appraisalDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Get appraisal status class
  const getAppraisalStatusClass = (daysUntil) => {
    if (daysUntil === null) return 'text-gray-500';
    if (daysUntil < 0) return 'text-red-600';
    if (daysUntil <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Get appraisal status text
  const getAppraisalStatusText = (daysUntil) => {
    if (daysUntil === null) return 'Not Scheduled';
    if (daysUntil < 0) return `Overdue by ${Math.abs(daysUntil)} days`;
    if (daysUntil === 0) return 'Due Today';
    return `Due in ${daysUntil} days`;
  };
  
  // Calculate valuation by method
  const calculateValuation = (collateral) => {
    if (!collateral) return null;
    
    const baseValue = collateral.estimatedValue;
    
    switch (valuationMethod) {
      case 'market':
        // Market value is the base estimated value
        return {
          value: baseValue,
          change: 0,
          description: 'Current market value based on recent appraisal'
        };
      case 'liquidation':
        // Liquidation value is typically 70-80% of market value
        const liquidationValue = baseValue * 0.75;
        return {
          value: liquidationValue,
          change: -25,
          description: 'Estimated value in forced sale conditions'
        };
      case 'replacement':
        // Replacement value is typically 110-120% of market value
        const replacementValue = baseValue * 1.15;
        return {
          value: replacementValue,
          change: 15,
          description: 'Cost to replace the collateral with similar asset'
        };
      case 'income':
        // Income approach - simplified for demonstration
        const incomeValue = baseValue * 1.05;
        return {
          value: incomeValue,
          change: 5,
          description: 'Value based on potential income generation'
        };
      default:
        return {
          value: baseValue,
          change: 0,
          description: 'Current market value'
        };
    }
  };
  
  // Get collaterals due for appraisal
  const getCollateralsDueForAppraisal = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return collaterals.filter(collateral => 
      collateral.nextAppraisalDate && 
      new Date(collateral.nextAppraisalDate) <= thirtyDaysFromNow
    ).sort((a, b) => new Date(a.nextAppraisalDate) - new Date(b.nextAppraisalDate));
  };
  
  // Get historical valuation data
  const getHistoricalValuationData = () => {
    // In a real app, this would be fetched from the backend
    return [
      { date: '2022-07', value: 12500000 },
      { date: '2022-10', value: 12800000 },
      { date: '2023-01', value: 13200000 },
      { date: '2023-04', value: 13500000 },
      { date: '2023-07', value: 13750000 }
    ];
  };
  
  const collateralsDueForAppraisal = getCollateralsDueForAppraisal();
  const historicalValuationData = getHistoricalValuationData();
  const valuation = calculateValuation(selectedCollateral);
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <FiDollarSign className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Collateral Valuation
          </h3>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          {/* Valuation Methods */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Valuation Methods</h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setValuationMethod('market')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  valuationMethod === 'market'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Market Value
              </button>
              <button
                type="button"
                onClick={() => setValuationMethod('liquidation')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  valuationMethod === 'liquidation'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Liquidation Value
              </button>
              <button
                type="button"
                onClick={() => setValuationMethod('replacement')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  valuationMethod === 'replacement'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Replacement Value
              </button>
              <button
                type="button"
                onClick={() => setValuationMethod('income')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                  valuationMethod === 'income'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Income Approach
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Collateral Selection and Valuation */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Select Collateral for Valuation</h4>
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <select
                  value={selectedCollateral ? selectedCollateral.id : ''}
                  onChange={(e) => {
                    const selected = collaterals.find(c => c.id === e.target.value);
                    setSelectedCollateral(selected || null);
                  }}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Select a collateral item</option>
                  {collaterals.map(collateral => (
                    <option key={collateral.id} value={collateral.id}>
                      {collateral.description} ({collateral.memberName})
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedCollateral && (
                <div className="bg-white border border-gray-200 rounded-md p-4">
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-900">{selectedCollateral.description}</h5>
                    <p className="text-xs text-gray-500">
                      {selectedCollateral.type.charAt(0).toUpperCase() + selectedCollateral.type.slice(1)} | 
                      Owner: {selectedCollateral.memberName}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">Last Appraisal</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(selectedCollateral.appraisalDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Next Appraisal</div>
                      <div className={`text-sm font-medium ${getAppraisalStatusClass(calculateDaysUntilNextAppraisal(selectedCollateral.nextAppraisalDate))}`}>
                        {formatDate(selectedCollateral.nextAppraisalDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Market Value</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(selectedCollateral.estimatedValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Loan-to-Value Ratio</div>
                      <div className="text-sm font-medium text-gray-900">
                        {(selectedCollateral.loanToValue * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{valuationMethod.charAt(0).toUpperCase() + valuationMethod.slice(1)} Valuation</div>
                        <div className="text-xs text-gray-500">{valuation.description}</div>
                      </div>
                      <div className="flex items-center">
                        <div className={`text-sm font-medium ${valuation.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {valuation.change >= 0 ? '+' : ''}{valuation.change}%
                        </div>
                        {valuation.change !== 0 && (
                          <div className="ml-1">
                            {valuation.change > 0 ? (
                              <FiTrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <FiTrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xl font-semibold text-gray-900">
                      {formatCurrency(valuation.value)}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Schedule Appraisal
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Value
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Appraisal Schedule and Historical Valuation */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Upcoming Appraisals</h4>
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                {collateralsDueForAppraisal.length === 0 ? (
                  <p className="text-sm text-gray-500">No appraisals due in the next 30 days.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {collateralsDueForAppraisal.slice(0, 3).map(collateral => {
                      const daysUntil = calculateDaysUntilNextAppraisal(collateral.nextAppraisalDate);
                      return (
                        <li key={collateral.id} className="py-3 flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{collateral.description}</div>
                            <div className="text-xs text-gray-500">{collateral.memberName}</div>
                          </div>
                          <div className="flex items-center">
                            <div className={`text-sm font-medium ${getAppraisalStatusClass(daysUntil)}`}>
                              {getAppraisalStatusText(daysUntil)}
                            </div>
                            <button
                              type="button"
                              className="ml-3 inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => setSelectedCollateral(collateral)}
                            >
                              <FiCalendar className="mr-1 h-3 w-3" />
                              Schedule
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {collateralsDueForAppraisal.length > 3 && (
                  <div className="mt-3 text-center">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All ({collateralsDueForAppraisal.length})
                    </button>
                  </div>
                )}
              </div>
              
              <h4 className="text-sm font-medium text-gray-700 mb-2">Historical Valuation Trend</h4>
              <div className="bg-gray-50 rounded-md p-4">
                <div className="h-40 flex items-end space-x-2">
                  {historicalValuationData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-blue-500 rounded-t w-full"
                        style={{ height: `${(data.value / 15000000) * 100}%` }}
                      ></div>
                      <div className="text-xs font-medium text-gray-700 mt-2">
                        {new Date(data.date).toLocaleDateString('en-PH', { month: 'short', year: '2-digit' })}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 text-xs text-gray-600">
                  <span className="font-medium">Total Portfolio Growth: </span>
                  {((historicalValuationData[historicalValuationData.length - 1].value / historicalValuationData[0].value - 1) * 100).toFixed(1)}%
                  <span className="ml-4 font-medium">Trend: </span>
                  <span className="text-green-600">Positive</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollateralValuation;
