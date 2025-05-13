'use client';

import React, { useState } from 'react';
import { FiAlertTriangle, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

/**
 * Loan Risk Scoring Component
 * 
 * Visualizes risk scores for loans:
 * - Risk score distribution
 * - Risk factors
 * - Risk trends
 * 
 * @param {Array} loans - Array of loan objects
 */
const LoanRiskScoring = ({ loans }) => {
  // State for selected risk level
  const [selectedRiskLevel, setSelectedRiskLevel] = useState('all');
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate risk distribution
  const calculateRiskDistribution = () => {
    const distribution = {
      low: { count: 0, amount: 0 },
      medium: { count: 0, amount: 0 },
      high: { count: 0, amount: 0 }
    };
    
    loans.forEach(loan => {
      if (distribution[loan.riskLevel]) {
        distribution[loan.riskLevel].count++;
        distribution[loan.riskLevel].amount += loan.amount;
      }
    });
    
    return {
      low: {
        count: distribution.low.count,
        amount: distribution.low.amount,
        percentage: loans.length > 0 ? (distribution.low.count / loans.length) * 100 : 0
      },
      medium: {
        count: distribution.medium.count,
        amount: distribution.medium.amount,
        percentage: loans.length > 0 ? (distribution.medium.count / loans.length) * 100 : 0
      },
      high: {
        count: distribution.high.count,
        amount: distribution.high.amount,
        percentage: loans.length > 0 ? (distribution.high.count / loans.length) * 100 : 0
      }
    };
  };
  
  // Get risk factors for a specific risk level
  const getRiskFactors = (riskLevel) => {
    // In a real app, these would be calculated from actual loan data
    switch (riskLevel) {
      case 'low':
        return [
          { name: 'Payment History', score: 95, trend: 'up' },
          { name: 'Loan-to-Value Ratio', score: 90, trend: 'stable' },
          { name: 'Credit Score', score: 88, trend: 'up' },
          { name: 'Income Stability', score: 92, trend: 'stable' }
        ];
      case 'medium':
        return [
          { name: 'Payment History', score: 75, trend: 'down' },
          { name: 'Loan-to-Value Ratio', score: 65, trend: 'stable' },
          { name: 'Credit Score', score: 70, trend: 'up' },
          { name: 'Income Stability', score: 68, trend: 'down' }
        ];
      case 'high':
        return [
          { name: 'Payment History', score: 45, trend: 'down' },
          { name: 'Loan-to-Value Ratio', score: 85, trend: 'down' },
          { name: 'Credit Score', score: 52, trend: 'stable' },
          { name: 'Income Stability', score: 40, trend: 'down' }
        ];
      default:
        return [
          { name: 'Payment History', score: 78, trend: 'stable' },
          { name: 'Loan-to-Value Ratio', score: 80, trend: 'stable' },
          { name: 'Credit Score', score: 75, trend: 'up' },
          { name: 'Income Stability', score: 72, trend: 'stable' }
        ];
    }
  };
  
  // Get risk level label
  const getRiskLevelLabel = (level) => {
    switch (level) {
      case 'low':
        return 'Low Risk';
      case 'medium':
        return 'Medium Risk';
      case 'high':
        return 'High Risk';
      default:
        return 'All Risks';
    }
  };
  
  // Get risk level color
  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <FiTrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <FiTrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };
  
  // Get score color
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const riskDistribution = calculateRiskDistribution();
  const riskFactors = getRiskFactors(selectedRiskLevel);
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <FiAlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Risk Scoring
          </h3>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {/* Risk Level Tabs */}
        <div className="flex space-x-2 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRiskLevel('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              selectedRiskLevel === 'all'
                ? 'bg-gray-100 text-gray-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            All Risks
          </button>
          <button
            type="button"
            onClick={() => setSelectedRiskLevel('low')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              selectedRiskLevel === 'low'
                ? 'bg-green-100 text-green-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Low Risk ({riskDistribution.low.count})
          </button>
          <button
            type="button"
            onClick={() => setSelectedRiskLevel('medium')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              selectedRiskLevel === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Medium Risk ({riskDistribution.medium.count})
          </button>
          <button
            type="button"
            onClick={() => setSelectedRiskLevel('high')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              selectedRiskLevel === 'high'
                ? 'bg-red-100 text-red-800'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            High Risk ({riskDistribution.high.count})
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risk Distribution */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Risk Distribution
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Low Risk</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {riskDistribution.low.count} loans ({riskDistribution.low.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div style={{ width: `${riskDistribution.low.percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                </div>
                <div className="text-xs text-right mt-1 text-gray-500">
                  {formatCurrency(riskDistribution.low.amount)}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">Medium Risk</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {riskDistribution.medium.count} loans ({riskDistribution.medium.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div style={{ width: `${riskDistribution.medium.percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
                </div>
                <div className="text-xs text-right mt-1 text-gray-500">
                  {formatCurrency(riskDistribution.medium.amount)}
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-700">High Risk</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {riskDistribution.high.count} loans ({riskDistribution.high.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div style={{ width: `${riskDistribution.high.percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
                </div>
                <div className="text-xs text-right mt-1 text-gray-500">
                  {formatCurrency(riskDistribution.high.amount)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Risk Factors */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Risk Factors for {getRiskLevelLabel(selectedRiskLevel)}
            </h4>
            
            <div className="space-y-4">
              {riskFactors.map((factor) => (
                <div key={factor.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{factor.name}</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium ${getScoreColor(factor.score)}`}>
                        {factor.score}
                      </span>
                      <div className="ml-2">
                        {getTrendIcon(factor.trend)}
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${factor.score}%` }} 
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        factor.score >= 80 ? 'bg-green-500' : 
                        factor.score >= 60 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Risk Mitigation Recommendations */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Risk Mitigation Recommendations
              </h4>
              
              <ul className="space-y-2 text-sm text-gray-700">
                {selectedRiskLevel === 'high' && (
                  <>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-red-500 mr-2">•</span>
                      <span>Implement stricter collection procedures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-red-500 mr-2">•</span>
                      <span>Review collateral valuation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-red-500 mr-2">•</span>
                      <span>Consider restructuring options</span>
                    </li>
                  </>
                )}
                
                {selectedRiskLevel === 'medium' && (
                  <>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-yellow-500 mr-2">•</span>
                      <span>Increase monitoring frequency</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-yellow-500 mr-2">•</span>
                      <span>Verify income stability</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-yellow-500 mr-2">•</span>
                      <span>Send payment reminders</span>
                    </li>
                  </>
                )}
                
                {selectedRiskLevel === 'low' && (
                  <>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 mr-2">•</span>
                      <span>Maintain standard monitoring</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-green-500 mr-2">•</span>
                      <span>Consider for additional products</span>
                    </li>
                  </>
                )}
                
                {selectedRiskLevel === 'all' && (
                  <>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-blue-500 mr-2">•</span>
                      <span>Prioritize high-risk loans for review</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-blue-500 mr-2">•</span>
                      <span>Implement early warning system</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 text-blue-500 mr-2">•</span>
                      <span>Review risk scoring model quarterly</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanRiskScoring;
