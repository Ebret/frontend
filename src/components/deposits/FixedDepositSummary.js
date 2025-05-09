'use client';

import React from 'react';

/**
 * Fixed Deposit Summary Component
 * 
 * Displays a summary of a member's fixed deposits with details about
 * each deposit, total balance, and loan eligibility.
 * 
 * @param {Array} deposits - Array of fixed deposit objects
 * @param {Object} options - Display options
 */
const FixedDepositSummary = ({ deposits = [], options = {} }) => {
  // Default options
  const {
    showLoanEligibility = true,
    showActions = true,
    compact = false,
    loanMultiplier = 2
  } = options;
  
  // Calculate total deposit amount
  const totalDeposits = deposits.reduce((total, deposit) => total + deposit.amount, 0);
  
  // Calculate loan eligibility
  const loanEligibility = totalDeposits * loanMultiplier;
  
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-PH', options);
  };
  
  // Calculate days remaining until maturity
  const calculateDaysRemaining = (maturityDate) => {
    const today = new Date();
    const maturity = new Date(maturityDate);
    const diffTime = maturity - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Get status class based on deposit status
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Maturing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Matured':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Render compact view
  if (compact) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Fixed Deposits</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {deposits.length} active {deposits.length === 1 ? 'deposit' : 'deposits'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeposits)}</div>
            {showLoanEligibility && (
              <div className="text-sm text-gray-500">
                Loan eligibility: {formatCurrency(loanEligibility)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Fixed Deposits</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Your active fixed deposits and their details.
        </p>
      </div>
      
      {deposits.length > 0 ? (
        <>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Maturity Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {showActions && (
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deposits.map((deposit) => (
                    <tr key={deposit.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {deposit.accountNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(deposit.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deposit.interestRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {deposit.term}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{formatDate(deposit.maturityDate)}</div>
                        <div className="text-xs text-gray-400">
                          {calculateDaysRemaining(deposit.maturityDate)} days remaining
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(deposit.status)}`}>
                          {deposit.status}
                        </span>
                      </td>
                      {showActions && (
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href={`/deposits/${deposit.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                            View
                          </a>
                          {deposit.status === 'Matured' && (
                            <a href={`/deposits/${deposit.id}/renew`} className="text-green-600 hover:text-green-900">
                              Renew
                            </a>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Total Fixed Deposits</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Sum of all your active fixed deposits.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalDeposits)}</div>
              </div>
            </div>
            
            {showLoanEligibility && (
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-blue-800">Loan Eligibility</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Based on your fixed deposits, you are eligible for a loan of up to <strong>{formatCurrency(loanEligibility)}</strong> without additional collateral.
                      </p>
                    </div>
                    <div className="mt-4">
                      <div className="-mx-2 -my-1.5 flex">
                        <a href="/loans/apply" className="bg-blue-600 px-3 py-1.5 rounded-md text-sm font-medium text-white hover:bg-blue-700">
                          Apply for a Loan
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No fixed deposits</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have any active fixed deposits.
          </p>
          <div className="mt-6">
            <a
              href="/deposits/new"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Open a Fixed Deposit
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FixedDepositSummary;
