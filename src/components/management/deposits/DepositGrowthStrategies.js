'use client';

import React, { useState } from 'react';
import { FiTrendingUp, FiTarget, FiBarChart2, FiCheckCircle, FiClock } from 'react-icons/fi';

/**
 * Deposit Growth Strategies Component
 * 
 * Provides tools for implementing deposit growth strategies:
 * - Growth targets
 * - Campaign management
 * - Product recommendations
 * - Performance tracking
 * 
 * @param {Array} deposits - Array of deposit objects
 */
const DepositGrowthStrategies = ({ deposits }) => {
  // State for active strategy
  const [activeStrategy, setActiveStrategy] = useState('targets');
  
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
  
  // Calculate growth targets
  const calculateGrowthTargets = () => {
    // In a real app, these would be fetched from the backend
    return {
      monthly: {
        target: totalDepositAmount * 0.05, // 5% monthly growth
        achieved: totalDepositAmount * 0.03, // 3% achieved so far
        progress: 60, // 60% of target achieved
        remaining: totalDepositAmount * 0.02, // 2% remaining
        daysLeft: 12 // 12 days left in the month
      },
      quarterly: {
        target: totalDepositAmount * 0.15, // 15% quarterly growth
        achieved: totalDepositAmount * 0.08, // 8% achieved so far
        progress: 53, // 53% of target achieved
        remaining: totalDepositAmount * 0.07, // 7% remaining
        daysLeft: 42 // 42 days left in the quarter
      },
      annual: {
        target: totalDepositAmount * 0.5, // 50% annual growth
        achieved: totalDepositAmount * 0.22, // 22% achieved so far
        progress: 44, // 44% of target achieved
        remaining: totalDepositAmount * 0.28, // 28% remaining
        daysLeft: 215 // 215 days left in the year
      }
    };
  };
  
  // Get active campaigns
  const getActiveCampaigns = () => {
    // In a real app, these would be fetched from the backend
    return [
      {
        id: 'C001',
        name: 'Time Deposit Promotion',
        description: 'Special rate for new time deposits above ₱100,000',
        startDate: '2023-05-01',
        endDate: '2023-07-31',
        targetAmount: 5000000,
        currentAmount: 2500000,
        progress: 50,
        status: 'active'
      },
      {
        id: 'C002',
        name: 'Member Referral Program',
        description: 'Rewards for members who refer new depositors',
        startDate: '2023-04-15',
        endDate: '2023-10-15',
        targetAmount: 3000000,
        currentAmount: 1200000,
        progress: 40,
        status: 'active'
      },
      {
        id: 'C003',
        name: 'Youth Savings Drive',
        description: 'Special incentives for youth savings accounts',
        startDate: '2023-06-01',
        endDate: '2023-08-31',
        targetAmount: 1000000,
        currentAmount: 250000,
        progress: 25,
        status: 'active'
      }
    ];
  };
  
  // Get product recommendations
  const getProductRecommendations = () => {
    // In a real app, these would be calculated based on deposit data
    return [
      {
        id: 'R001',
        title: 'Increase Time Deposit Rates',
        description: 'Increase rates for 1-year time deposits to attract more long-term funds',
        impact: 'high',
        effort: 'medium',
        timeframe: 'immediate',
        potentialGrowth: 15000000
      },
      {
        id: 'R002',
        title: 'Launch High-Yield Savings Plus',
        description: 'New tier for high-yield savings with better rates for balances above ₱500,000',
        impact: 'medium',
        effort: 'high',
        timeframe: '1 month',
        potentialGrowth: 10000000
      },
      {
        id: 'R003',
        title: 'Dormant Account Reactivation',
        description: 'Campaign to reactivate dormant accounts with incentives',
        impact: 'medium',
        effort: 'low',
        timeframe: '2 weeks',
        potentialGrowth: 5000000
      }
    ];
  };
  
  // Get performance metrics
  const getPerformanceMetrics = () => {
    // In a real app, these would be calculated from historical data
    return {
      growth: [
        { period: 'Jan', value: 2.5 },
        { period: 'Feb', value: 3.1 },
        { period: 'Mar', value: 2.8 },
        { period: 'Apr', value: 3.5 },
        { period: 'May', value: 4.2 },
        { period: 'Jun', value: 3.9 }
      ],
      retention: [
        { period: 'Jan', value: 95.2 },
        { period: 'Feb', value: 94.8 },
        { period: 'Mar', value: 95.5 },
        { period: 'Apr', value: 96.1 },
        { period: 'May', value: 96.5 },
        { period: 'Jun', value: 97.0 }
      ],
      acquisition: [
        { period: 'Jan', value: 42 },
        { period: 'Feb', value: 38 },
        { period: 'Mar', value: 45 },
        { period: 'Apr', value: 52 },
        { period: 'May', value: 58 },
        { period: 'Jun', value: 63 }
      ]
    };
  };
  
  const growthTargets = calculateGrowthTargets();
  const activeCampaigns = getActiveCampaigns();
  const productRecommendations = getProductRecommendations();
  const performanceMetrics = getPerformanceMetrics();
  
  // Get impact badge class
  const getImpactBadgeClass = (impact) => {
    switch (impact) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <FiTrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Deposit Growth Strategies
          </h3>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        {/* Strategy Tabs */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setActiveStrategy('targets')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeStrategy === 'targets'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiTarget className="inline-block mr-1.5 h-4 w-4" />
              Growth Targets
            </button>
            <button
              type="button"
              onClick={() => setActiveStrategy('campaigns')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeStrategy === 'campaigns'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiBarChart2 className="inline-block mr-1.5 h-4 w-4" />
              Active Campaigns
            </button>
            <button
              type="button"
              onClick={() => setActiveStrategy('recommendations')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeStrategy === 'recommendations'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiCheckCircle className="inline-block mr-1.5 h-4 w-4" />
              Recommendations
            </button>
            <button
              type="button"
              onClick={() => setActiveStrategy('performance')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                activeStrategy === 'performance'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FiClock className="inline-block mr-1.5 h-4 w-4" />
              Performance
            </button>
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-6">
          {/* Growth Targets */}
          {activeStrategy === 'targets' && (
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Growth Targets</h4>
                <p className="text-sm text-gray-500">
                  Track progress towards deposit growth targets across different time periods.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Monthly Target */}
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Monthly Target</h5>
                      <p className="text-xs text-gray-500">
                        {growthTargets.monthly.daysLeft} days remaining
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(growthTargets.monthly.target)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPercentage(5)} of current deposits
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-1 text-xs text-gray-500">
                      <span>Progress: {formatPercentage(growthTargets.monthly.progress)}</span>
                      <span>{formatCurrency(growthTargets.monthly.achieved)} / {formatCurrency(growthTargets.monthly.target)}</span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${growthTargets.monthly.progress}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium">Remaining: </span>
                    {formatCurrency(growthTargets.monthly.remaining)} 
                    <span className="ml-2">
                      ({formatCurrency(growthTargets.monthly.remaining / growthTargets.monthly.daysLeft)} per day)
                    </span>
                  </div>
                </div>
                
                {/* Quarterly Target */}
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Quarterly Target</h5>
                      <p className="text-xs text-gray-500">
                        {growthTargets.quarterly.daysLeft} days remaining
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(growthTargets.quarterly.target)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPercentage(15)} of current deposits
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-1 text-xs text-gray-500">
                      <span>Progress: {formatPercentage(growthTargets.quarterly.progress)}</span>
                      <span>{formatCurrency(growthTargets.quarterly.achieved)} / {formatCurrency(growthTargets.quarterly.target)}</span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${growthTargets.quarterly.progress}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium">Remaining: </span>
                    {formatCurrency(growthTargets.quarterly.remaining)} 
                    <span className="ml-2">
                      ({formatCurrency(growthTargets.quarterly.remaining / growthTargets.quarterly.daysLeft)} per day)
                    </span>
                  </div>
                </div>
                
                {/* Annual Target */}
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Annual Target</h5>
                      <p className="text-xs text-gray-500">
                        {growthTargets.annual.daysLeft} days remaining
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(growthTargets.annual.target)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatPercentage(50)} of current deposits
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between mb-1 text-xs text-gray-500">
                      <span>Progress: {formatPercentage(growthTargets.annual.progress)}</span>
                      <span>{formatCurrency(growthTargets.annual.achieved)} / {formatCurrency(growthTargets.annual.target)}</span>
                    </div>
                    <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                      <div 
                        style={{ width: `${growthTargets.annual.progress}%` }} 
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium">Remaining: </span>
                    {formatCurrency(growthTargets.annual.remaining)} 
                    <span className="ml-2">
                      ({formatCurrency(growthTargets.annual.remaining / growthTargets.annual.daysLeft)} per day)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Active Campaigns */}
          {activeStrategy === 'campaigns' && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Active Campaigns</h4>
                  <p className="text-sm text-gray-500">
                    Current deposit growth campaigns and their performance.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  New Campaign
                </button>
              </div>
              
              <div className="space-y-6">
                {activeCampaigns.map((campaign) => (
                  <div key={campaign.id} className="bg-gray-50 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">{campaign.name}</h5>
                        <p className="text-xs text-gray-500">
                          {campaign.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(campaign.targetAmount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mb-1 text-xs text-gray-500">
                        <span>Progress: {formatPercentage(campaign.progress)}</span>
                        <span>{formatCurrency(campaign.currentAmount)} / {formatCurrency(campaign.targetAmount)}</span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ width: `${campaign.progress}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit Campaign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Recommendations */}
          {activeStrategy === 'recommendations' && (
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Product Recommendations</h4>
                <p className="text-sm text-gray-500">
                  Strategic recommendations to accelerate deposit growth.
                </p>
              </div>
              
              <div className="space-y-6">
                {productRecommendations.map((recommendation) => (
                  <div key={recommendation.id} className="bg-gray-50 rounded-md p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">{recommendation.title}</h5>
                        <p className="text-xs text-gray-500 mt-1">
                          {recommendation.description}
                        </p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getImpactBadgeClass(recommendation.impact)}`}>
                          {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} Impact
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Effort: </span>
                        <span className="font-medium text-gray-900">{recommendation.effort.charAt(0).toUpperCase() + recommendation.effort.slice(1)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Timeframe: </span>
                        <span className="font-medium text-gray-900">{recommendation.timeframe}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Potential Growth: </span>
                        <span className="font-medium text-gray-900">{formatCurrency(recommendation.potentialGrowth)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Analysis
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Implement
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Performance */}
          {activeStrategy === 'performance' && (
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h4>
                <p className="text-sm text-gray-500">
                  Historical performance of deposit growth initiatives.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Growth Rate */}
                <div className="bg-gray-50 rounded-md p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Monthly Growth Rate (%)</h5>
                  
                  <div className="h-40 flex items-end space-x-2">
                    {performanceMetrics.growth.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-blue-500 rounded-t w-full"
                          style={{ height: `${(item.value / 5) * 100}%` }}
                        ></div>
                        <div className="text-xs font-medium text-gray-700 mt-2">
                          {item.period}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium">Average: </span>
                    {formatPercentage(performanceMetrics.growth.reduce((sum, item) => sum + item.value, 0) / performanceMetrics.growth.length)}
                    <span className="ml-4 font-medium">Trend: </span>
                    <span className="text-green-600">Positive</span>
                  </div>
                </div>
                
                {/* Retention Rate */}
                <div className="bg-gray-50 rounded-md p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">Deposit Retention Rate (%)</h5>
                  
                  <div className="h-40 flex items-end space-x-2">
                    {performanceMetrics.retention.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-green-500 rounded-t w-full"
                          style={{ height: `${((item.value - 90) / 10) * 100}%` }}
                        ></div>
                        <div className="text-xs font-medium text-gray-700 mt-2">
                          {item.period}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium">Average: </span>
                    {formatPercentage(performanceMetrics.retention.reduce((sum, item) => sum + item.value, 0) / performanceMetrics.retention.length)}
                    <span className="ml-4 font-medium">Trend: </span>
                    <span className="text-green-600">Positive</span>
                  </div>
                </div>
                
                {/* New Account Acquisition */}
                <div className="bg-gray-50 rounded-md p-4">
                  <h5 className="text-sm font-medium text-gray-900 mb-3">New Account Acquisition</h5>
                  
                  <div className="h-40 flex items-end space-x-2">
                    {performanceMetrics.acquisition.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-purple-500 rounded-t w-full"
                          style={{ height: `${(item.value / 70) * 100}%` }}
                        ></div>
                        <div className="text-xs font-medium text-gray-700 mt-2">
                          {item.period}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-3 text-xs text-gray-600">
                    <span className="font-medium">Average: </span>
                    {(performanceMetrics.acquisition.reduce((sum, item) => sum + item.value, 0) / performanceMetrics.acquisition.length).toFixed(0)} accounts per month
                    <span className="ml-4 font-medium">Trend: </span>
                    <span className="text-green-600">Positive</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositGrowthStrategies;
