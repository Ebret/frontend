'use client';

import React, { useState, useEffect } from 'react';

/**
 * Retirement Calculator Component
 *
 * A comprehensive retirement calculator that allows users to calculate:
 * - Required retirement savings
 * - Monthly contributions needed
 * - Projected retirement income
 * - Impact of different retirement ages and contribution amounts
 *
 * @param {Function} onParamsChange - Callback function to update parent component with current parameters
 * @param {Function} onCalculationResults - Callback function to update parent component with calculation results
 */
const RetirementCalculator = ({ onParamsChange, onCalculationResults }) => {
  // State for retirement parameters
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState(100000);
  const [monthlyContribution, setMonthlyContribution] = useState(5000);
  const [annualReturnRate, setAnnualReturnRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(4);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState(50000);
  const [salaryIncreaseRate, setSalaryIncreaseRate] = useState(3);
  const [sssMonthlyBenefit, setSssMonthlyBenefit] = useState(10000);

  // State for calculation results
  const [totalRetirementSavings, setTotalRetirementSavings] = useState(0);
  const [requiredRetirementSavings, setRequiredRetirementSavings] = useState(0);
  const [monthlyRetirementIncome, setMonthlyRetirementIncome] = useState(0);
  const [savingsGap, setSavingsGap] = useState(0);
  const [additionalMonthlyContribution, setAdditionalMonthlyContribution] = useState(0);
  const [retirementProjection, setRetirementProjection] = useState([]);

  // State for UI
  const [isCalculating, setIsCalculating] = useState(false);
  const [showRetirementProjection, setShowRetirementProjection] = useState(false);

  // Calculate retirement details when parameters change
  useEffect(() => {
    calculateRetirement();

    // Update parent component with current parameters
    if (onParamsChange) {
      onParamsChange({
        currentAge,
        retirementAge,
        lifeExpectancy,
        currentSavings,
        monthlyContribution,
        annualReturnRate,
        inflationRate,
        desiredMonthlyIncome
      });
    }
  }, [
    currentAge,
    retirementAge,
    lifeExpectancy,
    currentSavings,
    monthlyContribution,
    annualReturnRate,
    inflationRate,
    desiredMonthlyIncome,
    salaryIncreaseRate,
    sssMonthlyBenefit,
    onParamsChange
  ]);

  // Handle current savings input change
  const handleCurrentSavingsChange = (e) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setCurrentSavings(value);
    } else {
      setCurrentSavings(0);
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

  // Handle desired monthly income input change
  const handleDesiredMonthlyIncomeChange = (e) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setDesiredMonthlyIncome(value);
    } else {
      setDesiredMonthlyIncome(0);
    }
  };

  // Handle SSS monthly benefit input change
  const handleSssMonthlyBenefitChange = (e) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setSssMonthlyBenefit(value);
    } else {
      setSssMonthlyBenefit(0);
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

  // Calculate retirement details
  const calculateRetirement = () => {
    setIsCalculating(true);

    // Calculate years until retirement
    const yearsUntilRetirement = retirementAge - currentAge;

    // Calculate years in retirement
    const yearsInRetirement = lifeExpectancy - retirementAge;

    // Calculate future value of current savings at retirement
    const futureValueOfCurrentSavings = currentSavings * Math.pow(1 + annualReturnRate / 100, yearsUntilRetirement);

    // Calculate future value of monthly contributions at retirement
    let futureValueOfContributions = 0;
    let monthlyContributionAmount = monthlyContribution;

    // For each year until retirement, calculate the future value of contributions with salary increases
    for (let year = 1; year <= yearsUntilRetirement; year++) {
      // If not the first year, increase the monthly contribution based on salary increase rate
      if (year > 1) {
        monthlyContributionAmount *= (1 + salaryIncreaseRate / 100);
      }

      // Calculate annual contribution for this year
      const annualContribution = monthlyContributionAmount * 12;

      // Calculate future value of this year's contributions at retirement
      const yearsToGrow = yearsUntilRetirement - year;
      const futureValueOfYearContribution = annualContribution * Math.pow(1 + annualReturnRate / 100, yearsToGrow);

      // Add to total
      futureValueOfContributions += futureValueOfYearContribution;
    }

    // Calculate total retirement savings
    const totalSavings = futureValueOfCurrentSavings + futureValueOfContributions;

    // Calculate inflation-adjusted desired monthly income at retirement
    const inflationAdjustedMonthlyIncome = desiredMonthlyIncome * Math.pow(1 + inflationRate / 100, yearsUntilRetirement);

    // Calculate SSS monthly benefit adjusted for inflation
    const inflationAdjustedSssBenefit = sssMonthlyBenefit * Math.pow(1 + inflationRate / 100, yearsUntilRetirement);

    // Calculate required monthly income from savings (after SSS benefit)
    const requiredMonthlyIncomeFromSavings = inflationAdjustedMonthlyIncome - inflationAdjustedSssBenefit;

    // Calculate required retirement savings
    // Using the 4% rule (a common rule of thumb in retirement planning)
    // This assumes a 4% withdrawal rate per year, which is 0.33% per month
    const requiredSavings = requiredMonthlyIncomeFromSavings * 12 / 0.04;

    // Calculate monthly retirement income from savings
    const monthlyIncomeFromSavings = (totalSavings * 0.04) / 12;
    const totalMonthlyIncome = monthlyIncomeFromSavings + inflationAdjustedSssBenefit;

    // Calculate savings gap
    const gap = requiredSavings - totalSavings;

    // Calculate additional monthly contribution needed to close the gap
    let additionalContribution = 0;
    if (gap > 0) {
      // PMT formula: r * P / (1 - (1 + r)^-n)
      // where r is monthly interest rate, P is principal (gap), n is number of months
      const monthlyRate = annualReturnRate / 100 / 12;
      const months = yearsUntilRetirement * 12;
      additionalContribution = (monthlyRate * gap) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    // Generate retirement projection
    const projection = [];
    let projectedSavings = totalSavings;
    let remainingYears = yearsInRetirement;

    // Calculate withdrawal rate adjusted for inflation during retirement
    // This assumes that withdrawals increase with inflation
    const realReturnRate = (1 + annualReturnRate / 100) / (1 + inflationRate / 100) - 1;
    const annualWithdrawalAmount = inflationAdjustedMonthlyIncome * 12;

    // Project retirement savings for each year in retirement
    for (let year = 0; year <= yearsInRetirement; year++) {
      if (year === 0) {
        projection.push({
          age: retirementAge,
          savings: projectedSavings,
          withdrawal: 0,
          income: totalMonthlyIncome
        });
        continue;
      }

      // Calculate withdrawal for the year
      const withdrawal = annualWithdrawalAmount;

      // Calculate investment returns for the year
      const returns = (projectedSavings - withdrawal / 2) * annualReturnRate / 100;

      // Update projected savings
      projectedSavings = projectedSavings - withdrawal + returns;

      // Ensure savings don't go below zero
      projectedSavings = Math.max(0, projectedSavings);

      // Add to projection
      projection.push({
        age: retirementAge + year,
        savings: projectedSavings,
        withdrawal: withdrawal,
        income: totalMonthlyIncome
      });

      // If savings are depleted, break
      if (projectedSavings <= 0) {
        remainingYears = yearsInRetirement - year;
        break;
      }
    }

    // Update state with calculated values
    setTotalRetirementSavings(totalSavings);
    setRequiredRetirementSavings(requiredSavings);
    setMonthlyRetirementIncome(totalMonthlyIncome);
    setSavingsGap(gap);
    setAdditionalMonthlyContribution(additionalContribution);
    setRetirementProjection(projection);

    // Update parent component with calculation results
    if (onCalculationResults) {
      onCalculationResults({
        projectedSavings: totalSavings,
        requiredSavings: requiredSavings
      });
    }

    setIsCalculating(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Retirement Calculator</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="currentAge" className="block text-sm font-medium text-gray-700 mb-1">
                Current Age
              </label>
              <input
                type="number"
                id="currentAge"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={currentAge}
                onChange={(e) => setCurrentAge(parseInt(e.target.value) || 0)}
                min="18"
                max="80"
              />
            </div>

            <div>
              <label htmlFor="retirementAge" className="block text-sm font-medium text-gray-700 mb-1">
                Retirement Age
              </label>
              <input
                type="number"
                id="retirementAge"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                value={retirementAge}
                onChange={(e) => setRetirementAge(parseInt(e.target.value) || 0)}
                min={currentAge + 1}
                max="100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="lifeExpectancy" className="block text-sm font-medium text-gray-700 mb-1">
              Life Expectancy
            </label>
            <input
              type="number"
              id="lifeExpectancy"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={lifeExpectancy}
              onChange={(e) => setLifeExpectancy(parseInt(e.target.value) || 0)}
              min={retirementAge + 1}
              max="120"
            />
          </div>

          <div>
            <label htmlFor="currentSavings" className="block text-sm font-medium text-gray-700 mb-1">
              Current Retirement Savings (₱)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input
                type="text"
                id="currentSavings"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                value={currentSavings.toLocaleString()}
                onChange={handleCurrentSavingsChange}
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
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                value={monthlyContribution.toLocaleString()}
                onChange={handleMonthlyContributionChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="desiredMonthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Desired Monthly Income in Retirement (₱)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input
                type="text"
                id="desiredMonthlyIncome"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                value={desiredMonthlyIncome.toLocaleString()}
                onChange={handleDesiredMonthlyIncomeChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="sssMonthlyBenefit" className="block text-sm font-medium text-gray-700 mb-1">
              Expected SSS Monthly Benefit (₱)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₱</span>
              </div>
              <input
                type="text"
                id="sssMonthlyBenefit"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                value={sssMonthlyBenefit.toLocaleString()}
                onChange={handleSssMonthlyBenefitChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="annualReturnRate" className="block text-sm font-medium text-gray-700 mb-1">
                Annual Return Rate (%)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  id="annualReturnRate"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                  value={annualReturnRate}
                  onChange={(e) => setAnnualReturnRate(parseFloat(e.target.value) || 0)}
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
              <label htmlFor="inflationRate" className="block text-sm font-medium text-gray-700 mb-1">
                Inflation Rate (%)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  id="inflationRate"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="15"
                  step="0.1"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="salaryIncreaseRate" className="block text-sm font-medium text-gray-700 mb-1">
              Annual Salary Increase Rate (%)
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <input
                type="number"
                id="salaryIncreaseRate"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                value={salaryIncreaseRate}
                onChange={(e) => setSalaryIncreaseRate(parseFloat(e.target.value) || 0)}
                min="0"
                max="15"
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Retirement Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Years Until Retirement:</span>
              <span className="font-medium">{retirementAge - currentAge} years</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Years in Retirement:</span>
              <span className="font-medium">{lifeExpectancy - retirementAge} years</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Projected Retirement Savings:</span>
              <span className="font-medium">{formatCurrency(totalRetirementSavings)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Required Retirement Savings:</span>
              <span className="font-medium">{formatCurrency(requiredRetirementSavings)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Monthly Retirement Income:</span>
              <span className="text-xl font-bold text-indigo-600">{formatCurrency(monthlyRetirementIncome)}</span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-200 pb-2">
              <span className="text-gray-600">Retirement Savings Gap:</span>
              <span className={`font-medium ${savingsGap > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(savingsGap)}
              </span>
            </div>

            {savingsGap > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Additional Monthly Contribution Needed:</span>
                <span className="font-medium text-red-600">{formatCurrency(additionalMonthlyContribution)}</span>
              </div>
            )}
          </div>

          <button
            className="mt-6 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setShowRetirementProjection(!showRetirementProjection)}
          >
            {showRetirementProjection ? 'Hide' : 'Show'} Retirement Projection
          </button>
        </div>
      </div>

      {/* Retirement Projection */}
      {showRetirementProjection && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Retirement Projection</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Savings Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Withdrawal
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monthly Income
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {retirementProjection.map((row, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.age}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.savings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(row.withdrawal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(row.income)}
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

export default RetirementCalculator;
