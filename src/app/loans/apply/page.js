'use client';

import React, { useState, useEffect } from 'react';
import FixedDepositSummary from '@/components/deposits/FixedDepositSummary';
import LoanLimitCalculator from '@/components/loans/LoanLimitCalculator';
import CollateralForm from '@/components/loans/CollateralForm';

/**
 * Loan Application Page
 * 
 * This page allows members to apply for loans with:
 * - Loan limit calculation based on fixed deposits
 * - Optional collateral information
 * - Loan application form
 */
const LoanApplicationPage = () => {
  // Sample member data (would come from API in real app)
  const [memberData, setMemberData] = useState({
    id: 'M12345',
    name: 'Juan Dela Cruz',
    memberSince: '2020-01-15',
    creditScore: 720,
    fixedDeposits: [
      {
        id: 'FD001',
        accountNumber: 'FD-2023-001',
        amount: 50000,
        interestRate: 5.0,
        term: '1 year',
        startDate: '2023-01-15',
        maturityDate: '2024-01-15',
        status: 'Active'
      },
      {
        id: 'FD002',
        accountNumber: 'FD-2023-002',
        amount: 100000,
        interestRate: 5.5,
        term: '2 years',
        startDate: '2023-03-10',
        maturityDate: '2025-03-10',
        status: 'Active'
      }
    ]
  });
  
  // State for loan application
  const [loanApplication, setLoanApplication] = useState({
    loanType: '',
    amount: '',
    term: '',
    purpose: '',
    hasCollateral: false,
    collateralData: null,
    maxLoanAmount: 0
  });
  
  // State for collateral data
  const [collateralData, setCollateralData] = useState({
    hasCollateral: false
  });
  
  // State for loan limit calculation
  const [loanLimitData, setLoanLimitData] = useState({
    maxLoanAmount: 0,
    fixedDepositLimit: 0,
    collateralLimit: 0
  });
  
  // Available loan types
  const loanTypes = [
    { id: 'regular', name: 'Regular Loan' },
    { id: 'emergency', name: 'Emergency Loan' },
    { id: 'business', name: 'Business Loan' },
    { id: 'salary', name: 'Salary Loan' },
    { id: 'housing', name: 'Housing Loan' }
  ];
  
  // Available loan terms
  const loanTerms = [
    { id: '6', name: '6 months' },
    { id: '12', name: '1 year' },
    { id: '24', name: '2 years' },
    { id: '36', name: '3 years' },
    { id: '60', name: '5 years' }
  ];
  
  // Handle loan application input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoanApplication({
      ...loanApplication,
      [name]: value
    });
  };
  
  // Handle collateral data change
  const handleCollateralChange = (data) => {
    setCollateralData(data);
    setLoanApplication({
      ...loanApplication,
      hasCollateral: data.hasCollateral,
      collateralData: data
    });
  };
  
  // Handle loan limit calculation
  const handleLoanLimitCalculated = (data) => {
    setLoanLimitData(data);
    setLoanApplication({
      ...loanApplication,
      maxLoanAmount: data.maxLoanAmount
    });
  };
  
  // Handle loan application submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate loan amount against maximum
    if (parseFloat(loanApplication.amount) > loanLimitData.maxLoanAmount) {
      alert(`Loan amount exceeds your maximum eligible amount of ₱${loanLimitData.maxLoanAmount.toLocaleString()}`);
      return;
    }
    
    // Here you would submit the loan application to the API
    console.log('Submitting loan application:', loanApplication);
    alert('Loan application submitted successfully!');
  };
  
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Loan Application
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Apply for a loan based on your fixed deposits or with additional collateral.
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Fixed Deposit Summary */}
          <FixedDepositSummary 
            deposits={memberData.fixedDeposits} 
            options={{ showLoanEligibility: true, showActions: false }}
          />
          
          {/* Loan Limit Calculator */}
          <LoanLimitCalculator 
            memberData={memberData}
            collateralData={collateralData}
            onLimitCalculated={handleLoanLimitCalculated}
          />
          
          {/* Collateral Form */}
          <CollateralForm 
            onCollateralChange={handleCollateralChange}
          />
          
          {/* Loan Application Form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Loan Details</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Provide details about the loan you are applying for.
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
                      Loan Type
                    </label>
                    <select
                      id="loanType"
                      name="loanType"
                      value={loanApplication.loanType}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Loan Type</option>
                      {loanTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Loan Amount (₱)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₱</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={loanApplication.amount}
                        onChange={handleInputChange}
                        required
                        min="1000"
                        max={loanLimitData.maxLoanAmount}
                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">
                          Max: {formatCurrency(loanLimitData.maxLoanAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                      Loan Term
                    </label>
                    <select
                      id="term"
                      name="term"
                      value={loanApplication.term}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select Loan Term</option>
                      {loanTerms.map(term => (
                        <option key={term.id} value={term.id}>{term.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-6">
                    <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                      Loan Purpose
                    </label>
                    <textarea
                      id="purpose"
                      name="purpose"
                      rows="3"
                      value={loanApplication.purpose}
                      onChange={handleInputChange}
                      required
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="Describe the purpose of this loan"
                    ></textarea>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationPage;
