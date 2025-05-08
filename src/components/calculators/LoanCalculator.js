'use client';

import React, { useState, useEffect } from 'react';
import PaymentBreakdownChart from './PaymentBreakdownChart';

/**
 * Loan Calculator Component
 *
 * A comprehensive loan calculator that allows users to calculate:
 * - Monthly payments
 * - Total payment amount
 * - Total interest paid
 * - Amortization schedule
 */
const LoanCalculator = () => {
  // State for loan parameters
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTerm, setLoanTerm] = useState(12);
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [processingFee, setProcessingFee] = useState(1);
  const [insuranceFee, setInsuranceFee] = useState(0.5);

  // State for calculation results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [processingFeeAmount, setProcessingFeeAmount] = useState(0);
  const [insuranceFeeAmount, setInsuranceFeeAmount] = useState(0);
  const [netLoanAmount, setNetLoanAmount] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  // State for UI
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAmortizationSchedule, setShowAmortizationSchedule] = useState(false);

  // Calculate loan details when parameters change
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, paymentFrequency, processingFee, insuranceFee]);

  // Handle loan amount input change
  const handleLoanAmountChange = (e) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setLoanAmount(value);
    } else {
      setLoanAmount(0);
    }
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

  // Calculate loan details
  const calculateLoan = () => {
    setIsCalculating(true);

    // Calculate fees
    const processingFeeAmt = (loanAmount * processingFee) / 100;
    const insuranceFeeAmt = (loanAmount * insuranceFee) / 100;
    const netAmount = loanAmount - processingFeeAmt - insuranceFeeAmt;

    // Calculate monthly interest rate (annual rate / 12 / 100)
    const monthlyInterestRate = interestRate / 12 / 100;

    // Calculate monthly payment using the formula: P = L[i(1+i)^n]/[(1+i)^n-1]
    // Where:
    // P = Monthly payment
    // L = Loan amount
    // i = Monthly interest rate
    // n = Number of payments (loan term in months)
    const monthlyPmt = loanAmount *
      (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);

    // Calculate total payment and interest
    const totalPmt = monthlyPmt * loanTerm;
    const totalInt = totalPmt - loanAmount;

    // Generate amortization schedule
    const schedule = [];
    let remainingBalance = loanAmount;

    for (let month = 1; month <= loanTerm; month++) {
      const interestPayment = remainingBalance * monthlyInterestRate;
      const principalPayment = monthlyPmt - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        month,
        payment: monthlyPmt,
        principalPayment,
        interestPayment,
        remainingBalance: remainingBalance > 0 ? remainingBalance : 0
      });
    }

    // Update state with calculated values
    setMonthlyPayment(monthlyPmt);
    setTotalPayment(totalPmt);
    setTotalInterest(totalInt);
    setProcessingFeeAmount(processingFeeAmt);
    setInsuranceFeeAmount(insuranceFeeAmt);
    setNetLoanAmount(netAmount);
    setAmortizationSchedule(schedule);

    setIsCalculating(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount (₱)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input
                type="text"
                id="loanAmount"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                value={loanAmount.toLocaleString()}
                onChange={handleLoanAmountChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Interest Rate (%)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                id="interestRate"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                value={interestRate}
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
                step="0.1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="loanTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Loan Term (months)
            </label>
            <input
              type="number"
              id="loanTerm"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={loanTerm}
              onChange={(e) => setLoanTerm(parseInt(e.target.value) || 0)}
              min="1"
              max="360"
            />
          </div>

          <div>
            <label htmlFor="processingFee" className="block text-sm font-medium text-gray-700 mb-1">
              Processing Fee (%)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                id="processingFee"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                value={processingFee}
                onChange={(e) => setProcessingFee(parseFloat(e.target.value) || 0)}
                min="0"
                max="10"
                step="0.1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="insuranceFee" className="block text-sm font-medium text-gray-700 mb-1">
              Insurance Fee (%)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                id="insuranceFee"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                value={insuranceFee}
                onChange={(e) => setInsuranceFee(parseFloat(e.target.value) || 0)}
                min="0"
                max="10"
                step="0.1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Loan Amount:</span>
              <span className="font-medium">{formatCurrency(loanAmount)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Processing Fee:</span>
              <span className="font-medium">{formatCurrency(processingFeeAmount)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Insurance Fee:</span>
              <span className="font-medium">{formatCurrency(insuranceFeeAmount)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Net Loan Amount:</span>
              <span className="font-medium">{formatCurrency(netLoanAmount)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Monthly Payment:</span>
              <span className="text-xl font-bold text-blue-600">{formatCurrency(monthlyPayment)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Total Payment:</span>
              <span className="font-medium">{formatCurrency(totalPayment)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Interest:</span>
              <span className="font-medium">{formatCurrency(totalInterest)}</span>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => setShowAmortizationSchedule(!showAmortizationSchedule)}
          >
            {showAmortizationSchedule ? 'Hide' : 'Show'} Amortization Schedule
          </button>
        </div>
      </div>

      {/* Payment Breakdown Chart */}
      <div className="mt-8">
        <PaymentBreakdownChart
          loanAmount={loanAmount}
          totalInterest={totalInterest}
          processingFee={processingFeeAmount}
          insuranceFee={insuranceFeeAmount}
        />
      </div>

      {/* Amortization Schedule */}
      {showAmortizationSchedule && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Amortization Schedule</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remaining Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {amortizationSchedule.map((row) => (
                  <tr key={row.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.payment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.principalPayment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.interestPayment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.remainingBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanCalculator;
