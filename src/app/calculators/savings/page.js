'use client';

import React, { useState, useEffect } from 'react';
import SavingsCalculator from '@/components/calculators/SavingsCalculator';
import SavingsGrowthChart from '@/components/calculators/SavingsGrowthChart';
import SavingsComparison from '@/components/calculators/SavingsComparison';
import CalculatorNav from '@/components/navigation/CalculatorNav';
import CalculatorHeader from '@/components/navigation/CalculatorHeader';

/**
 * Savings Calculator Page
 * 
 * This page displays the savings calculator component with additional
 * information about savings accounts and strategies.
 */
const SavingsCalculatorPage = () => {
  // State for savings parameters to pass to the chart
  const [savingsParams, setSavingsParams] = useState({
    initialDeposit: 10000,
    monthlyContribution: 1000,
    interestRate: 5,
    savingsTerm: 60
  });
  
  // Update chart parameters when calculator values change
  const updateChartParams = (params) => {
    setSavingsParams(params);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <CalculatorHeader />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Savings Calculator
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Plan your savings with our easy-to-use calculator. Estimate your future savings,
              interest earned, and visualize your savings growth over time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <CalculatorNav />
              
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Savings Tips</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Start early to maximize compound interest</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Consistently contribute to your savings each month</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Consider higher interest rate accounts for long-term savings</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Increase your contributions as your income grows</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Set specific savings goals with target dates</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <SavingsCalculator onParamsChange={updateChartParams} />
              
              <div className="mt-8">
                <SavingsGrowthChart 
                  initialDeposit={savingsParams.initialDeposit}
                  monthlyContribution={savingsParams.monthlyContribution}
                  interestRate={savingsParams.interestRate}
                  savingsTerm={savingsParams.savingsTerm}
                />
              </div>
              
              <div className="mt-16">
                <SavingsComparison />
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Savings Account Options</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Regular Savings Account</h3>
                <p className="text-gray-600">
                  Our regular savings account offers a competitive interest rate of 3-5% per annum.
                  This account is perfect for building your emergency fund or saving for short-term goals.
                  Features include unlimited deposits, ATM access, and online banking.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Time Deposit Account</h3>
                <p className="text-gray-600">
                  Our time deposit accounts offer higher interest rates of 5-7% per annum for fixed terms.
                  Choose from terms ranging from 30 days to 5 years. The longer the term, the higher the interest rate.
                  Perfect for medium to long-term savings goals.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cooperative Investment Savings</h3>
                <p className="text-gray-600">
                  Our premium investment savings account offers the highest returns of 7-10% per annum.
                  This account is ideal for long-term wealth building and requires a minimum balance.
                  Returns are tied to the cooperative's performance and are distributed as dividends.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Youth Savings Account</h3>
                <p className="text-gray-600">
                  Designed for members under 18 years old, our youth savings account offers a special
                  interest rate of 5% per annum with no minimum balance requirement. A great way to
                  teach financial responsibility and the power of compound interest.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-md border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Ready to Start Saving?</h3>
                <p className="text-green-700">
                  Our savings officers are available to help you choose the right savings account for your needs.
                  Visit our office or contact us at (02) 8123-4567 or email us at savings@cooperative.com.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready to Open an Account?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/savings/open-account" 
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-md shadow hover:bg-green-700 transition-colors"
              >
                Open a Savings Account
              </a>
              <a 
                href="/contact" 
                className="px-8 py-3 bg-white text-green-600 border border-green-600 font-semibold rounded-md hover:bg-green-50 transition-colors"
              >
                Contact a Savings Officer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsCalculatorPage;
