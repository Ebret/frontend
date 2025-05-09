'use client';

import React, { useState, useEffect } from 'react';

/**
 * Loan Limit Calculator Component
 * 
 * Calculates the maximum loan amount a member is eligible for based on:
 * - Fixed deposit balances (up to 2x the balance)
 * - Collateral value (up to a percentage of the value)
 * - Member's credit standing
 * - System-wide loan limits
 * 
 * @param {Object} memberData - Data about the member applying for the loan
 * @param {Object} collateralData - Data about any collateral being offered
 * @param {Function} onLimitCalculated - Callback when limit is calculated
 */
const LoanLimitCalculator = ({ memberData, collateralData, onLimitCalculated }) => {
  // State for calculation results
  const [calculationResults, setCalculationResults] = useState({
    maxLoanAmount: 0,
    fixedDepositLimit: 0,
    collateralLimit: 0,
    limitingFactor: '',
    hasCollateral: false,
    totalFixedDeposits: 0,
    collateralValue: 0,
    collateralPercentage: 70, // Default percentage of collateral value that can be borrowed
    fixedDepositMultiplier: 2, // Default multiplier for fixed deposits
    systemMaximum: 1000000, // System-wide maximum loan amount
  });
  
  // State for showing detailed breakdown
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate loan limits when member or collateral data changes
  useEffect(() => {
    calculateLoanLimits();
  }, [memberData, collateralData]);
  
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Calculate loan limits based on fixed deposits and collateral
  const calculateLoanLimits = () => {
    // Default values if data is missing
    const fixedDeposits = memberData?.fixedDeposits || [];
    const hasCollateral = collateralData?.hasCollateral || false;
    const collateralValue = collateralData?.value || 0;
    
    // Calculate total fixed deposit balance
    const totalFixedDeposits = fixedDeposits.reduce((total, deposit) => total + deposit.amount, 0);
    
    // Calculate limit based on fixed deposits (2x the balance)
    const fixedDepositLimit = totalFixedDeposits * calculationResults.fixedDepositMultiplier;
    
    // Calculate limit based on collateral (70% of value by default)
    const collateralLimit = hasCollateral ? collateralValue * (calculationResults.collateralPercentage / 100) : 0;
    
    // Determine the maximum loan amount
    let maxLoanAmount;
    let limitingFactor;
    
    if (hasCollateral) {
      // If collateral is provided, use the higher of the two limits
      maxLoanAmount = Math.max(fixedDepositLimit, collateralLimit);
      limitingFactor = maxLoanAmount === fixedDepositLimit ? 'Fixed Deposits' : 'Collateral';
    } else {
      // If no collateral, use fixed deposit limit
      maxLoanAmount = fixedDepositLimit;
      limitingFactor = 'Fixed Deposits';
    }
    
    // Ensure the loan amount doesn't exceed the system maximum
    if (maxLoanAmount > calculationResults.systemMaximum) {
      maxLoanAmount = calculationResults.systemMaximum;
      limitingFactor = 'System Maximum';
    }
    
    // Update calculation results
    const results = {
      ...calculationResults,
      maxLoanAmount,
      fixedDepositLimit,
      collateralLimit,
      limitingFactor,
      hasCollateral,
      totalFixedDeposits,
      collateralValue
    };
    
    setCalculationResults(results);
    
    // Call the callback with the results
    if (onLimitCalculated) {
      onLimitCalculated(results);
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Loan Limit Calculation</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Maximum loan amount based on fixed deposits and collateral.
          </p>
        </div>
        <div>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(calculationResults.maxLoanAmount)}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Maximum Loan Amount</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(calculationResults.maxLoanAmount)}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Limiting factor: {calculationResults.limitingFactor}
          </div>
        </div>
        
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
        
        {showDetails && (
          <div className="mt-4 space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Fixed Deposit Calculation</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Total Fixed Deposits</span>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {formatCurrency(calculationResults.totalFixedDeposits)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Multiplier</span>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {calculationResults.fixedDepositMultiplier}x
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-gray-500">Loan Limit from Fixed Deposits</span>
                  <div className="mt-1 text-sm font-medium text-gray-900">
                    {formatCurrency(calculationResults.fixedDepositLimit)}
                  </div>
                </div>
              </div>
            </div>
            
            {calculationResults.hasCollateral && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Collateral Calculation</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Collateral Value</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {formatCurrency(calculationResults.collateralValue)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Collateral Percentage</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {calculationResults.collateralPercentage}%
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm text-gray-500">Loan Limit from Collateral</span>
                    <div className="mt-1 text-sm font-medium text-gray-900">
                      {formatCurrency(calculationResults.collateralLimit)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-700 mb-2">System Limits</h4>
              <div>
                <span className="text-sm text-gray-500">Maximum Loan Amount</span>
                <div className="mt-1 text-sm font-medium text-gray-900">
                  {formatCurrency(calculationResults.systemMaximum)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
        <div className="text-sm">
          <span className="font-medium text-gray-900">Note:</span>{' '}
          <span className="text-gray-500">
            {calculationResults.hasCollateral 
              ? 'With collateral, your loan limit is the higher of 2x your fixed deposit balance or 70% of your collateral value.'
              : 'Without collateral, your loan limit is 2x your fixed deposit balance.'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoanLimitCalculator;
