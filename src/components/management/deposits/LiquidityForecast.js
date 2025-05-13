'use client';

import React, { useState } from 'react';
import { FiTrendingUp, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

/**
 * Liquidity Forecast Component
 * 
 * Forecasts deposit liquidity:
 * - Projected inflows and outflows
 * - Liquidity ratios
 * - Stress testing scenarios
 * 
 * @param {Array} deposits - Array of deposit objects
 */
const LiquidityForecast = ({ deposits }) => {
  // State for forecast period
  const [forecastPeriod, setForecastPeriod] = useState('3months');
  
  // State for stress scenario
  const [stressScenario, setStressScenario] = useState('normal');
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };
  
  // Calculate total deposit amount
  const totalDepositAmount = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  
  // Calculate savings amount
  const savingsAmount = deposits
    .filter(deposit => deposit.type === 'savings')
    .reduce((sum, deposit) => sum + deposit.amount, 0);
  
  // Calculate time deposit amount
  const timeDepositAmount = deposits
    .filter(deposit => deposit.type === 'time_deposit')
    .reduce((sum, deposit) => sum + deposit.amount, 0);
  
  // Calculate maturing amount in next 30 days
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const maturingAmount30Days = deposits
    .filter(deposit => 
      deposit.maturityDate && 
      new Date(deposit.maturityDate) <= thirtyDaysFromNow
    )
    .reduce((sum, deposit) => sum + deposit.amount, 0);
  
  // Calculate maturing amount in next 90 days
  const ninetyDaysFromNow = new Date();
  ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
  
  const maturingAmount90Days = deposits
    .filter(deposit => 
      deposit.maturityDate && 
      new Date(deposit.maturityDate) <= ninetyDaysFromNow
    )
    .reduce((sum, deposit) => sum + deposit.amount, 0);
  
  // Calculate forecast data
  const calculateForecastData = () => {
    // Define withdrawal rates based on stress scenario
    let savingsWithdrawalRate, timeDepositRenewalRate;
    
    switch (stressScenario) {
      case 'mild':
        savingsWithdrawalRate = 0.15; // 15% withdrawal
        timeDepositRenewalRate = 0.7; // 70% renewal
        break;
      case 'severe':
        savingsWithdrawalRate = 0.3; // 30% withdrawal
        timeDepositRenewalRate = 0.5; // 50% renewal
        break;
      default: // normal
        savingsWithdrawalRate = 0.05; // 5% withdrawal
        timeDepositRenewalRate = 0.85; // 85% renewal
    }
    
    // Define forecast periods in days
    let forecastDays;
    switch (forecastPeriod) {
      case '1month':
        forecastDays = 30;
        break;
      case '6months':
        forecastDays = 180;
        break;
      case '12months':
        forecastDays = 365;
        break;
      default: // 3months
        forecastDays = 90;
    }
    
    // Calculate maturing amount in forecast period
    const forecastDate = new Date();
    forecastDate.setDate(forecastDate.getDate() + forecastDays);
    
    const maturingAmountForecast = deposits
      .filter(deposit => 
        deposit.maturityDate && 
        new Date(deposit.maturityDate) <= forecastDate
      )
      .reduce((sum, deposit) => sum + deposit.amount, 0);
    
    // Calculate expected outflows
    const expectedSavingsOutflow = savingsAmount * savingsWithdrawalRate;
    const expectedTimeDepositOutflow = maturingAmountForecast * (1 - timeDepositRenewalRate);
    const totalExpectedOutflow = expectedSavingsOutflow + expectedTimeDepositOutflow;
    
    // Calculate expected inflows (simplified)
    const expectedInflows = totalDepositAmount * 0.1; // Assume 10% growth
    
    // Calculate net flow
    const netFlow = expectedInflows - totalExpectedOutflow;
    
    // Calculate liquidity ratio
    const liquidityRatio = (savingsAmount + expectedInflows) / totalExpectedOutflow;
    
    return {
      expectedSavingsOutflow,
      expectedTimeDepositOutflow,
      totalExpectedOutflow,
      expectedInflows,
      netFlow,
      liquidityRatio,
      maturingAmountForecast
    };
  };
  
  const forecastData = calculateForecastData();
  
  // Get liquidity status
  const getLiquidityStatus = () => {
    if (forecastData.liquidityRatio >= 2.0) {
      return {
        status: 'Strong',
        color: 'text-green-600',
        icon: <FiCheckCircle className="h-5 w-5" />,
        message: 'Liquidity position is strong with sufficient buffer for stress scenarios.'
      };
    } else if (forecastData.liquidityRatio >= 1.2) {
      return {
        status: 'Adequate',
        color: 'text-yellow-600',
        icon: <FiCheckCircle className="h-5 w-5" />,
        message: 'Liquidity position is adequate but could be improved.'
      };
    } else {
      return {
        status: 'Weak',
        color: 'text-red-600',
        icon: <FiAlertTriangle className="h-5 w-5" />,
        message: 'Liquidity position is weak. Consider strategies to improve liquidity.'
      };
    }
  };
  
  const liquidityStatus = getLiquidityStatus();
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <FiTrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Liquidity Forecast
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(e.target.value)}
            className="block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="1month">1 Month</option>
            <option value="3months">3 Months</option>
            <option value="6months">6 Months</option>
            <option value="12months">12 Months</option>
          </select>
          
          <select
            value={stressScenario}
            onChange={(e) => setStressScenario(e.target.value)}
            className="block w-full pl-3 pr-10 py-1.5 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="normal">Normal Scenario</option>
            <option value="mild">Mild Stress</option>
            <option value="severe">Severe Stress</option>
          </select>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Liquidity Status */}
        <div className="mb-6 bg-gray-50 rounded-md p-4">
          <div className="flex items-center">
            <div className={`mr-3 ${liquidityStatus.color}`}>
              {liquidityStatus.icon}
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Liquidity Status: <span className={liquidityStatus.color}>{liquidityStatus.status}</span>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {liquidityStatus.message}
              </p>
            </div>
          </div>
        </div>
        
        {/* Forecast Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-md p-3">
            <div className="text-sm text-gray-500">Expected Outflows</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(forecastData.totalExpectedOutflow)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatPercentage((forecastData.totalExpectedOutflow / totalDepositAmount) * 100)} of total deposits
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-md p-3">
            <div className="text-sm text-gray-500">Expected Inflows</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatCurrency(forecastData.expectedInflows)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {formatPercentage((forecastData.expectedInflows / totalDepositAmount) * 100)} of total deposits
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-md p-3">
            <div className="text-sm text-gray-500">Net Flow</div>
            <div className={`text-lg font-semibold ${forecastData.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(forecastData.netFlow)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {forecastData.netFlow >= 0 ? 'Positive cash flow' : 'Negative cash flow'}
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-md p-3">
            <div className="text-sm text-gray-500">Liquidity Ratio</div>
            <div className={`text-lg font-semibold ${
              forecastData.liquidityRatio >= 2.0 ? 'text-green-600' : 
              forecastData.liquidityRatio >= 1.2 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {forecastData.liquidityRatio.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Target: &gt; 2.0
            </div>
          </div>
        </div>
        
        {/* Detailed Forecast */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Forecast</h4>
          
          <div className="bg-gray-50 rounded-md p-4">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Maturing Time Deposits</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(forecastData.maturingAmountForecast)}</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${(forecastData.maturingAmountForecast / timeDepositAmount) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Expected Time Deposit Outflow</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(forecastData.expectedTimeDepositOutflow)}</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${(forecastData.expectedTimeDepositOutflow / forecastData.maturingAmountForecast) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Expected Savings Outflow</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(forecastData.expectedSavingsOutflow)}</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${(forecastData.expectedSavingsOutflow / savingsAmount) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Expected Inflows</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(forecastData.expectedInflows)}</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${(forecastData.expectedInflows / totalDepositAmount) * 100}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendations</h4>
          
          <ul className="space-y-2 text-sm text-gray-600">
            {forecastData.netFlow < 0 && (
              <li className="flex items-start">
                <span className="h-5 w-5 text-red-500 mr-2">•</span>
                <span>Implement deposit retention strategies to address negative cash flow.</span>
              </li>
            )}
            
            {forecastData.liquidityRatio < 1.2 && (
              <li className="flex items-start">
                <span className="h-5 w-5 text-red-500 mr-2">•</span>
                <span>Increase liquidity buffer by promoting more liquid deposit products.</span>
              </li>
            )}
            
            {(forecastData.expectedTimeDepositOutflow / forecastData.maturingAmountForecast) > 0.3 && (
              <li className="flex items-start">
                <span className="h-5 w-5 text-yellow-500 mr-2">•</span>
                <span>Improve time deposit renewal rates with competitive rates and incentives.</span>
              </li>
            )}
            
            {(forecastData.expectedSavingsOutflow / savingsAmount) > 0.1 && (
              <li className="flex items-start">
                <span className="h-5 w-5 text-yellow-500 mr-2">•</span>
                <span>Reduce savings outflow by enhancing customer retention programs.</span>
              </li>
            )}
            
            {(timeDepositAmount / totalDepositAmount) < 0.4 && (
              <li className="flex items-start">
                <span className="h-5 w-5 text-blue-500 mr-2">•</span>
                <span>Increase proportion of time deposits to improve stability.</span>
              </li>
            )}
            
            {forecastData.liquidityRatio >= 2.0 && forecastData.netFlow >= 0 && (
              <li className="flex items-start">
                <span className="h-5 w-5 text-green-500 mr-2">•</span>
                <span>Maintain current deposit mix and growth strategies.</span>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LiquidityForecast;
