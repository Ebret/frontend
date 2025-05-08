'use client';

import React, { useState } from 'react';
import RetirementCalculator from '@/components/calculators/RetirementCalculator';
import RetirementProjectionChart from '@/components/calculators/RetirementProjectionChart';
import RetirementReadinessGauge from '@/components/calculators/RetirementReadinessGauge';
import CalculatorNav from '@/components/navigation/CalculatorNav';
import CalculatorHeader from '@/components/navigation/CalculatorHeader';

/**
 * Retirement Calculator Page
 * 
 * This page displays the retirement calculator component with additional
 * information about retirement planning and strategies.
 */
const RetirementCalculatorPage = () => {
  // State for retirement parameters to pass to the chart
  const [retirementParams, setRetirementParams] = useState({
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 85,
    currentSavings: 100000,
    monthlyContribution: 5000,
    annualReturnRate: 7,
    inflationRate: 4,
    desiredMonthlyIncome: 50000
  });
  
  // State for retirement calculation results
  const [calculationResults, setCalculationResults] = useState({
    projectedSavings: 0,
    requiredSavings: 0
  });
  
  // Update chart parameters when calculator values change
  const updateChartParams = (params) => {
    setRetirementParams(params);
  };
  
  // Update calculation results
  const updateCalculationResults = (results) => {
    setCalculationResults(results);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <CalculatorHeader />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Retirement Calculator
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Plan your retirement with our easy-to-use calculator. Estimate your future retirement savings,
              required monthly contributions, and visualize your retirement readiness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="md:col-span-1">
              <CalculatorNav />
              
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Retirement Planning Tips</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Start saving for retirement as early as possible</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Maximize your SSS contributions for higher benefits</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Consider diversifying your retirement investments</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Increase your savings rate as your income grows</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-indigo-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Review and adjust your retirement plan annually</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <RetirementReadinessGauge 
                  projectedSavings={calculationResults.projectedSavings}
                  requiredSavings={calculationResults.requiredSavings}
                />
              </div>
            </div>
            
            {/* Main Content */}
            <div className="md:col-span-3">
              <RetirementCalculator 
                onParamsChange={updateChartParams}
                onCalculationResults={updateCalculationResults}
              />
              
              <div className="mt-8">
                <RetirementProjectionChart 
                  currentAge={retirementParams.currentAge}
                  retirementAge={retirementParams.retirementAge}
                  lifeExpectancy={retirementParams.lifeExpectancy}
                  currentSavings={retirementParams.currentSavings}
                  monthlyContribution={retirementParams.monthlyContribution}
                  annualReturnRate={retirementParams.annualReturnRate}
                  inflationRate={retirementParams.inflationRate}
                  desiredMonthlyIncome={retirementParams.desiredMonthlyIncome}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-16 bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Retirement Planning Options</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cooperative Retirement Fund</h3>
                <p className="text-gray-600">
                  Our cooperative retirement fund offers a secure way to save for retirement with competitive returns.
                  Members can contribute regularly and benefit from the cooperative's investment expertise.
                  The fund targets annual returns of 7-9% and offers tax advantages for long-term savers.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personal Retirement Account (PRA)</h3>
                <p className="text-gray-600">
                  Our Personal Retirement Account allows you to save for retirement with flexible contribution options.
                  You can choose from various investment strategies based on your risk tolerance and time horizon.
                  PRAs offer potential returns of 5-10% annually depending on your chosen investment mix.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Retirement Income Fund</h3>
                <p className="text-gray-600">
                  Designed for members approaching or in retirement, our Retirement Income Fund focuses on
                  generating stable monthly income while preserving capital. The fund invests in a mix of
                  fixed-income securities and dividend-paying investments to provide reliable income.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">SSS Pension Maximization</h3>
                <p className="text-gray-600">
                  We offer guidance on maximizing your SSS pension benefits through strategic contribution planning.
                  Our retirement specialists can help you understand how to optimize your contributions to receive
                  the highest possible monthly pension when you retire.
                </p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-md border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-800 mb-2">Ready to Start Planning?</h3>
                <p className="text-indigo-700">
                  Our retirement planning specialists are available to help you create a personalized retirement strategy.
                  Visit our office or contact us at (02) 8123-4567 or email us at retirement@cooperative.com.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready to Secure Your Future?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/retirement/open-account" 
                className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow hover:bg-indigo-700 transition-colors"
              >
                Open a Retirement Account
              </a>
              <a 
                href="/contact" 
                className="px-8 py-3 bg-white text-indigo-600 border border-indigo-600 font-semibold rounded-md hover:bg-indigo-50 transition-colors"
              >
                Schedule a Consultation
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculatorPage;
