'use client';

import React, { useState } from 'react';

/**
 * Loan Comparison Component
 * 
 * Allows users to compare different loan options side by side
 * to make informed decisions.
 */
const LoanComparison = () => {
  // State for loan options
  const [loanOptions, setLoanOptions] = useState([
    {
      id: 1,
      name: 'Regular Loan',
      amount: 100000,
      interestRate: 12,
      term: 12,
      processingFee: 1,
      insuranceFee: 0.5,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      netAmount: 0
    },
    {
      id: 2,
      name: 'Salary Loan',
      amount: 100000,
      interestRate: 10,
      term: 12,
      processingFee: 0.5,
      insuranceFee: 0.5,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      netAmount: 0
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
  
  // Handle input change for a loan option
  const handleInputChange = (id, field, value) => {
    setLoanOptions(prevOptions => 
      prevOptions.map(option => 
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };
  
  // Calculate loan details for all options
  const calculateAllLoans = () => {
    setIsCalculating(true);
    
    const updatedOptions = loanOptions.map(option => {
      // Calculate fees
      const processingFeeAmt = (option.amount * option.processingFee) / 100;
      const insuranceFeeAmt = (option.amount * option.insuranceFee) / 100;
      const netAmount = option.amount - processingFeeAmt - insuranceFeeAmt;
      
      // Calculate monthly interest rate (annual rate / 12 / 100)
      const monthlyInterestRate = option.interestRate / 12 / 100;
      
      // Calculate monthly payment
      const monthlyPmt = option.amount * 
        (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, option.term)) / 
        (Math.pow(1 + monthlyInterestRate, option.term) - 1);
      
      // Calculate total payment and interest
      const totalPmt = monthlyPmt * option.term;
      const totalInt = totalPmt - option.amount;
      
      return {
        ...option,
        monthlyPayment: monthlyPmt,
        totalPayment: totalPmt,
        totalInterest: totalInt,
        netAmount: netAmount
      };
    });
    
    setLoanOptions(updatedOptions);
    setIsCalculating(false);
  };
  
  // Add a new loan option
  const addLoanOption = () => {
    const newId = Math.max(...loanOptions.map(option => option.id)) + 1;
    
    setLoanOptions([
      ...loanOptions,
      {
        id: newId,
        name: `Loan Option ${newId}`,
        amount: 100000,
        interestRate: 12,
        term: 12,
        processingFee: 1,
        insuranceFee: 0.5,
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        netAmount: 0
      }
    ]);
  };
  
  // Remove a loan option
  const removeLoanOption = (id) => {
    if (loanOptions.length <= 1) return;
    setLoanOptions(loanOptions.filter(option => option.id !== id));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Loan Comparison</h2>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={calculateAllLoans}
        >
          Calculate All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loan Details
              </th>
              {loanOptions.map(option => (
                <th key={option.id} scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      className="border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 text-sm font-medium text-gray-700 w-full"
                      value={option.name}
                      onChange={(e) => handleInputChange(option.id, 'name', e.target.value)}
                    />
                    {loanOptions.length > 1 && (
                      <button
                        className="ml-2 text-gray-400 hover:text-red-500"
                        onClick={() => removeLoanOption(option.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <button
                  className="text-blue-600 hover:text-blue-800 font-bold text-lg"
                  onClick={addLoanOption}
                >
                  +
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Loan Amount */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Loan Amount (₱)
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={option.amount}
                    onChange={(e) => handleInputChange(option.id, 'amount', parseFloat(e.target.value) || 0)}
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
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={option.interestRate}
                    onChange={(e) => handleInputChange(option.id, 'interestRate', parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Loan Term */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Loan Term (months)
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={option.term}
                    onChange={(e) => handleInputChange(option.id, 'term', parseInt(e.target.value) || 0)}
                  />
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Processing Fee */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Processing Fee (%)
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={option.processingFee}
                    onChange={(e) => handleInputChange(option.id, 'processingFee', parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Insurance Fee */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Insurance Fee (%)
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  <input
                    type="number"
                    className="border border-gray-300 rounded-md px-3 py-1 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={option.insuranceFee}
                    onChange={(e) => handleInputChange(option.id, 'insuranceFee', parseFloat(e.target.value) || 0)}
                    step="0.1"
                  />
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Results Section */}
            <tr className="bg-gray-50">
              <td colSpan={loanOptions.length + 2} className="px-4 py-2 text-sm font-bold text-gray-700">
                Results
              </td>
            </tr>
            
            {/* Monthly Payment */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Monthly Payment
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm font-bold text-blue-600">
                  {formatCurrency(option.monthlyPayment)}
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Net Loan Amount */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Net Loan Amount
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  {formatCurrency(option.netAmount)}
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Total Payment */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Total Payment
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  {formatCurrency(option.totalPayment)}
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Total Interest */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Total Interest
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  {formatCurrency(option.totalInterest)}
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Processing Fee Amount */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Processing Fee Amount
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  {formatCurrency((option.amount * option.processingFee) / 100)}
                </td>
              ))}
              <td></td>
            </tr>
            
            {/* Insurance Fee Amount */}
            <tr>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                Insurance Fee Amount
              </td>
              {loanOptions.map(option => (
                <td key={option.id} className="px-4 py-3 text-sm text-gray-500">
                  {formatCurrency((option.amount * option.insuranceFee) / 100)}
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

export default LoanComparison;
