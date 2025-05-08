'use client';

import React, { useState, useEffect } from 'react';

/**
 * Savings Calculator Component
 *
 * A comprehensive savings calculator that allows users to calculate:
 * - Future value of savings
 * - Interest earned
 * - Growth over time
 * - Impact of different interest rates and contribution amounts
 *
 * @param {Function} onParamsChange - Callback function to update parent component with current parameters
 */
const SavingsCalculator = ({ onParamsChange }) => {
  // State for savings parameters
  const [initialDeposit, setInitialDeposit] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [interestRate, setInterestRate] = useState(5);
  const [savingsTerm, setSavingsTerm] = useState(60); // 5 years in months
  const [compoundingFrequency, setCompoundingFrequency] = useState('monthly');

  // State for calculation results
  const [futureValue, setFutureValue] = useState(0);
  const [totalContributions, setTotalContributions] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [savingsSchedule, setSavingsSchedule] = useState([]);

  // State for UI
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSavingsSchedule, setShowSavingsSchedule] = useState(false);

  // Calculate savings details when parameters change
  useEffect(() => {
    calculateSavings();

    // Update parent component with current parameters
    if (onParamsChange) {
      onParamsChange({
        initialDeposit,
        monthlyContribution,
        interestRate,
        savingsTerm
      });
    }
  }, [initialDeposit, monthlyContribution, interestRate, savingsTerm, compoundingFrequency, onParamsChange]);

  // Handle initial deposit input change
  const handleInitialDepositChange = (e) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setInitialDeposit(value);
    } else {
      setInitialDeposit(0);
    }
  };

  // Handle monthly contribution input change
  const handleMonthlyContributionChange = (e) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setMonthlyContribution(value);
    } else {
      setMonthlyContribution(0);
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

  // Calculate savings growth
  const calculateSavings = () => {
    setIsCalculating(true);

    // Determine number of compounds per year
    let compoundsPerYear;
    switch (compoundingFrequency) {
      case 'daily':
        compoundsPerYear = 365;
        break;
      case 'weekly':
        compoundsPerYear = 52;
        break;
      case 'monthly':
        compoundsPerYear = 12;
        break;
      case 'quarterly':
        compoundsPerYear = 4;
        break;
      case 'semi-annually':
        compoundsPerYear = 2;
        break;
      case 'annually':
        compoundsPerYear = 1;
        break;
      default:
        compoundsPerYear = 12;
    }

    // Calculate periodic interest rate
    const periodicRate = interestRate / 100 / compoundsPerYear;

    // Calculate total number of compounds over the term
    const totalCompounds = (savingsTerm / 12) * compoundsPerYear;

    // Calculate number of contributions per year (assuming monthly contributions)
    const contributionsPerYear = 12;

    // Calculate total contributions
    const totalContrib = initialDeposit + (monthlyContribution * savingsTerm);

    // Generate savings schedule
    const schedule = [];
    let balance = initialDeposit;
    let totalInterestEarned = 0;

    // For each month in the term
    for (let month = 1; month <= savingsTerm; month++) {
      // Calculate interest for this month (simplified for monthly compounding)
      const monthlyInterest = balance * (interestRate / 100 / 12);

      // Add monthly contribution
      balance += monthlyContribution;

      // Add interest
      balance += monthlyInterest;

      // Track total interest earned
      totalInterestEarned += monthlyInterest;

      // Add to schedule (for every 6 months or the last month)
      if (month % 6 === 0 || month === savingsTerm) {
        schedule.push({
          month,
          balance,
          contribution: month * monthlyContribution + initialDeposit,
          interestEarned: totalInterestEarned
        });
      }
    }

    // Update state with calculated values
    setFutureValue(balance);
    setTotalContributions(totalContrib);
    setTotalInterest(totalInterestEarned);
    setSavingsSchedule(schedule);

    setIsCalculating(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Savings Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label htmlFor="initialDeposit" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Deposit (₱)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input
                type="text"
                id="initialDeposit"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                value={initialDeposit.toLocaleString()}
                onChange={handleInitialDepositChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="monthlyContribution" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Contribution (₱)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input
                type="text"
                id="monthlyContribution"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                value={monthlyContribution.toLocaleString()}
                onChange={handleMonthlyContributionChange}
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
                max="20"
                step="0.1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="savingsTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Savings Term (months)
            </label>
            <input
              type="number"
              id="savingsTerm"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={savingsTerm}
              onChange={(e) => setSavingsTerm(parseInt(e.target.value) || 0)}
              min="1"
              max="600"
            />
          </div>

          <div>
            <label htmlFor="compoundingFrequency" className="block text-sm font-medium text-gray-700 mb-1">
              Compounding Frequency
            </label>
            <select
              id="compoundingFrequency"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={compoundingFrequency}
              onChange={(e) => setCompoundingFrequency(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semi-annually">Semi-annually</option>
              <option value="annually">Annually</option>
            </select>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Savings Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Initial Deposit:</span>
              <span className="font-medium">{formatCurrency(initialDeposit)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Monthly Contribution:</span>
              <span className="font-medium">{formatCurrency(monthlyContribution)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Total Contributions:</span>
              <span className="font-medium">{formatCurrency(totalContributions)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Total Interest Earned:</span>
              <span className="font-medium text-green-600">{formatCurrency(totalInterest)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Future Value:</span>
              <span className="text-xl font-bold text-green-600">{formatCurrency(futureValue)}</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Interest as % of Total:</span>
                <span className="font-medium">
                  {totalContributions > 0 ? ((totalInterest / (totalContributions + totalInterest)) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </div>

          <button
            className="mt-6 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={() => setShowSavingsSchedule(!showSavingsSchedule)}
          >
            {showSavingsSchedule ? 'Hide' : 'Show'} Savings Schedule
          </button>
        </div>
      </div>

      {/* Savings Schedule */}
      {showSavingsSchedule && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Savings Growth Schedule</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Contributions
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Earned
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {savingsSchedule.map((row) => (
                  <tr key={row.month}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.contribution)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatCurrency(row.interestEarned)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(row.balance)}
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

export default SavingsCalculator;
