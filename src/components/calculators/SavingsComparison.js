'use client';

import React, { useState } from 'react';

/**
 * Savings Comparison Component
 * 
 * Allows users to compare different savings strategies side by side
 * to make informed decisions.
 */
const SavingsComparison = () => {
  // State for savings options
  const [savingsOptions, setSavingsOptions] = useState([
    {
      id: 1,
      name: 'Regular Savings',
      initialDeposit: 10000,
      monthlyContribution: 1000,
      interestRate: 5,
      term: 60, // 5 years in months
      futureValue: 0,
      totalContributions: 0,
      totalInterest: 0
    },
    {
      id: 2,
      name: 'High Interest Savings',
      initialDeposit: 10000,
      monthlyContribution: 1000,
      interestRate: 7,
      term: 60, // 5 years in months
      futureValue: 0,
      totalContributions: 0,
      totalInterest: 0
    }
  ]);
  
  // State for UI
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Handle input change for a savings option
  const handleInputChange = (id, field, value) => {
    setSavingsOptions(prevOptions => 
      prevOptions.map(option => 
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };
  
  // Calculate savings details for all options
  const calculateAllSavings = () => {
    setIsCalculating(true);
    
    const updatedOptions = savingsOptions.map(option => {
      // Calculate total contributions
      const totalContrib = option.initialDeposit + (option.monthlyContribution * option.term);
      
      // Calculate future value
      let balance = option.initialDeposit;
      let totalInterestEarned = 0;
      
      // For each month in the term
      for (let month = 1; month <= option.term; month++) {
        // Calculate interest for this month
        const monthlyInterest = balance * (option.interestRate / 100 / 12);
        
        // Add monthly contribution
        balance += option.monthlyContribution;
        
        // Add interest
        balance += monthlyInterest;
        
        // Track total interest earned
        totalInterestEarned += monthlyInterest;
      }
      
      return {
        ...option,
        futureValue: balance,
        totalContributions: totalContrib,
        totalInterest: totalInterestEarned
      };
    });
    
    setSavingsOptions(updatedOptions);
    setIsCalculating(false);
  };
  
  // Add a new savings option
  const addSavingsOption = () => {
    const newId = Math.max(...savingsOptions.map(option => option.id)) + 1;
    
    setSavingsOptions([
      ...savingsOptions,
      {
        id: newId,
        name: `Savings Option ${newId}`,
        initialDeposit: 10000,
        monthlyContribution: 1000,
        interestRate: 5,
        term: 60,
        futureValue: 0,
        totalContributions: 0,
        totalInterest: 0
      }
    ]);
  };
  
  // Remove a savings option
  const removeSavingsOption = (id) => {
    if (savingsOptions.length <= 1) return;
    setSavingsOptions(savingsOptions.filter(option => option.id !== id));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Savings Comparison</h2>
        <button
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          onClick={calculateAllSavings}
        >
          Calculate All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Savings Details
              </th>
              {savingsOptions.map(option => (
                <th key={option.id} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-green-500 text-sm font-medium text-gray-700 w-full"
                      value={option.name}
                      onChange={(e) => handleInputChange(option.id, 'name', e.target.value)}
                    />
                    {savingsOptions.length > 1 && (
                      <button
                        className="ml-2 text-gray-400 hover:text-red-500"
                        onClick={() => removeSavingsOption(option.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <button
                  className="text-green-600 hover:text-green-800 font-bold text-lg"
                  onClick={addSavingsOption}
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Initial Deposit */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Initial Deposit (₱)
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={option.initialDeposit}
                    onChange={(e) => handleInputChange(option.id, 'initialDeposit', parseFloat(e.target.value) || 0)}
                  />
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Monthly Contribution */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Monthly Contribution (₱)
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={option.monthlyContribution}
                    onChange={(e) => handleInputChange(option.id, 'monthlyContribution', parseFloat(e.target.value) || 0)}
                  />
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Interest Rate */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Interest Rate (% p.a.)
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={option.interestRate}
                    onChange={(e) => handleInputChange(option.id, 'interestRate', parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Savings Term */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Savings Term (months)
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                    value={option.term}
                    onChange={(e) => handleInputChange(option.id, 'term', parseInt(e.target.value) || 0)}
                  />
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Results Section */}
            <tr className="bg-gray-50">
              <td colSpan={savingsOptions.length + 2} className="px-4 py-2 text-sm font-bold text-gray-700">
                Results
              </td>
            </tr>
            
            {/* Future Value */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Future Value
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm font-bold text-green-600">
                  {formatCurrency(option.futureValue)}
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Total Contributions */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Total Contributions
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  {formatCurrency(option.totalContributions)}
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Total Interest */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Total Interest Earned
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-green-600">
                  {formatCurrency(option.totalInterest)}
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Interest as % of Total */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Interest as % of Total
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  {option.totalContributions > 0 
                    ? ((option.totalInterest / (option.totalContributions + option.totalInterest)) * 100).toFixed(1) 
                    : 0}%
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Return on Investment */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Return on Investment
              </td>
              {savingsOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  {option.totalContributions > 0 
                    ? ((option.totalInterest / option.totalContributions) * 100).toFixed(1) 
                    : 0}%
                </td>
              ))}
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SavingsComparison;
