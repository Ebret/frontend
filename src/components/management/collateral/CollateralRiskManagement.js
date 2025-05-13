'use client';

import React, { useState } from 'react';
import { FiAlertTriangle, FiShield, FiBarChart2, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

/**
 * Collateral Risk Management Component
 * 
 * Provides tools for managing collateral risk:
 * - Risk scoring
 * - Risk factors
 * - Risk mitigation
 * 
 * @param {Array} collaterals - Array of collateral objects
 */
const CollateralRiskManagement = ({ collaterals }) => {
  // State for selected collateral
  const [selectedCollateral, setSelectedCollateral] = useState(null);
  
  // State for risk view
  const [riskView, setRiskView] = useState('portfolio');
  
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
  
  // Calculate risk distribution
  const calculateRiskDistribution = () => {
    const distribution = {
      low: { count: 0, value: 0 },
      medium: { count: 0, value: 0 },
      high: { count: 0, value: 0 }
    };
    
    collaterals.forEach(collateral => {
      if (distribution[collateral.riskLevel]) {
        distribution[collateral.riskLevel].count++;
        distribution[collateral.riskLevel].value += collateral.estimatedValue;
      }
    });
    
    const totalValue = collaterals.reduce((sum, collateral) => sum + collateral.estimatedValue, 0);
    
    return {
      low: {
        count: distribution.low.count,
        value: distribution.low.value,
        percentage: totalValue > 0 ? (distribution.low.value / totalValue) * 100 : 0
      },
      medium: {
        count: distribution.medium.count,
        value: distribution.medium.value,
        percentage: totalValue > 0 ? (distribution.medium.value / totalValue) * 100 : 0
      },
      high: {
        count: distribution.high.count,
        value: distribution.high.value,
        percentage: totalValue > 0 ? (distribution.high.value / totalValue) * 100 : 0
      }
    };
  };
  
  // Get risk factors for a specific collateral
  const getRiskFactors = (collateral) => {
    if (!collateral) return [];
    
    // In a real app, these would be calculated based on actual collateral data
    switch (collateral.type) {
      case 'real_estate':
        return [
          { name: 'Market Volatility', score: 25, trend: 'stable' },
          { name: 'Location Risk', score: 15, trend: 'down' },
          { name: 'Property Condition', score: 10, trend: 'stable' },
          { name: 'Title Issues', score: 5, trend: 'stable' }
        ];
      case 'vehicle':
        return [
          { name: 'Depreciation', score: 40, trend: 'up' },
          { name: 'Market Demand', score: 30, trend: 'stable' },
          { name: 'Vehicle Condition', score: 20, trend: 'stable' },
          { name: 'Insurance Coverage', score: 15, trend: 'down' }
        ];
      case 'equipment':
        return [
          { name: 'Obsolescence Risk', score: 35, trend: 'up' },
          { name: 'Maintenance Status', score: 25, trend: 'stable' },
          { name: 'Market Demand', score: 20, trend: 'down' },
          { name: 'Specialized Nature', score: 15, trend: 'stable' }
        ];
      case 'investment':
        return [
          { name: 'Market Risk', score: 30, trend: 'up' },
          { name: 'Liquidity Risk', score: 20, trend: 'stable' },
          { name: 'Counterparty Risk', score: 15, trend: 'down' },
          { name: 'Interest Rate Risk', score: 10, trend: 'up' }
        ];
      default:
        return [
          { name: 'General Market Risk', score: 25, trend: 'stable' },
          { name: 'Valuation Accuracy', score: 20, trend: 'stable' },
          { name: 'Documentation Risk', score: 15, trend: 'stable' },
          { name: 'Liquidity Risk', score: 15, trend: 'stable' }
        ];
    }
  };
  
  // Get high risk collaterals
  const getHighRiskCollaterals = () => {
    return collaterals
      .filter(collateral => collateral.riskLevel === 'high')
      .sort((a, b) => b.riskScore - a.riskScore);
  };
  
  // Get risk level badge class
  const getRiskLevelBadgeClass = (riskLevel) => {
    switch (riskLevel) {
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
  
  // Get risk mitigation recommendations
  const getRiskMitigationRecommendations = (collateral) => {
    if (!collateral) return [];
    
    // In a real app, these would be generated based on actual risk factors
    switch (collateral.riskLevel) {
      case 'high':
        return [
          'Increase monitoring frequency to monthly',
          'Request updated appraisal immediately',
          'Verify insurance coverage and ensure it is adequate',
          'Consider requesting additional collateral'
        ];
      case 'medium':
        return [
          'Schedule next appraisal within 6 months',
          'Verify documentation is complete and up-to-date',
          'Monitor market conditions for the collateral type',
          'Ensure maintenance requirements are being met'
        ];
      case 'low':
        return [
          'Maintain standard annual appraisal schedule',
          'Verify insurance coverage at renewal',
          'Periodic documentation review'
        ];
      default:
        return [
          'Conduct standard risk assessment',
          'Verify documentation completeness',
          'Ensure regular appraisal schedule is maintained'
        ];
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <FiTrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <FiTrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };
  
  const riskDistribution = calculateRiskDistribution();
  const highRiskCollaterals = getHighRiskCollaterals();
  const riskFactors = getRiskFactors(selectedCollateral);
  const mitigationRecommendations = getRiskMitigationRecommendations(selectedCollateral);
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <FiShield className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Collateral Risk Management
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setRiskView('portfolio')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              riskView === 'portfolio'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Portfolio View
          </button>
          <button
            type="button"
            onClick={() => setRiskView('individual')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              riskView === 'individual'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Individual View
          </button>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          {riskView === 'portfolio' ? (
            <div>
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Risk Distribution</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">Low Risk</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {riskDistribution.low.count} items ({formatPercentage(riskDistribution.low.percentage)})
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ width: `${riskDistribution.low.percentage}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                        ></div>
                      </div>
                      <div className="text-xs text-right mt-1 text-gray-500">
                        {formatCurrency(riskDistribution.low.value)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">Medium Risk</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {riskDistribution.medium.count} items ({formatPercentage(riskDistribution.medium.percentage)})
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ width: `${riskDistribution.medium.percentage}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                        ></div>
                      </div>
                      <div className="text-xs text-right mt-1 text-gray-500">
                        {formatCurrency(riskDistribution.medium.value)}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-700">High Risk</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {riskDistribution.high.count} items ({formatPercentage(riskDistribution.high.percentage)})
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ width: `${riskDistribution.high.percentage}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"
                        ></div>
                      </div>
                      <div className="text-xs text-right mt-1 text-gray-500">
                        {formatCurrency(riskDistribution.high.value)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">High Risk Collateral</h4>
                {highRiskCollaterals.length === 0 ? (
                  <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-500">
                    No high risk collateral items found.
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-md p-4">
                    <ul className="divide-y divide-gray-200">
                      {highRiskCollaterals.slice(0, 3).map(collateral => (
                        <li key={collateral.id} className="py-3 flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{collateral.description}</div>
                            <div className="text-xs text-gray-500">
                              {collateral.memberName} | {formatCurrency(collateral.estimatedValue)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-red-600">
                              Risk Score: {collateral.riskScore}
                            </span>
                            <button
                              type="button"
                              className="ml-3 inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => {
                                setSelectedCollateral(collateral);
                                setRiskView('individual');
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    {highRiskCollaterals.length > 3 && (
                      <div className="mt-3 text-center">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View All ({highRiskCollaterals.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Portfolio Risk Metrics</h4>
                <div className="bg-gray-50 rounded-md p-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Average LTV Ratio</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPercentage(collaterals.reduce((sum, c) => sum + c.loanToValue, 0) / collaterals.length * 100)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Target: &lt; 70%
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500">High Risk Exposure</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatPercentage(riskDistribution.high.percentage)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Target: &lt; 15%
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500">Documentation Compliance</div>
                    <div className="text-lg font-semibold text-gray-900">
                      92.5%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Target: &gt; 95%
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-500">Appraisal Currency</div>
                    <div className="text-lg font-semibold text-gray-900">
                      85.7%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Target: &gt; 90%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Select Collateral for Risk Assessment</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <select
                    value={selectedCollateral ? selectedCollateral.id : ''}
                    onChange={(e) => {
                      const selected = collaterals.find(c => c.id === e.target.value);
                      setSelectedCollateral(selected || null);
                    }}
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a collateral item</option>
                    {collaterals.map(collateral => (
                      <option key={collateral.id} value={collateral.id}>
                        {collateral.description} ({collateral.memberName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {selectedCollateral ? (
                <div>
                  <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">{selectedCollateral.description}</h5>
                        <p className="text-xs text-gray-500">
                          {selectedCollateral.type.charAt(0).toUpperCase() + selectedCollateral.type.slice(1)} | 
                          Owner: {selectedCollateral.memberName}
                        </p>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelBadgeClass(selectedCollateral.riskLevel)}`}>
                        {selectedCollateral.riskLevel.charAt(0).toUpperCase() + selectedCollateral.riskLevel.slice(1)} Risk
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Risk Score</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {selectedCollateral.riskScore}/100
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Loan-to-Value Ratio</div>
                        <div className="text-lg font-semibold text-gray-900">
                          {(selectedCollateral.loanToValue * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h6 className="text-xs font-medium text-gray-700 mb-2">Risk Factors</h6>
                      <div className="space-y-3">
                        {riskFactors.map((factor, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-700">{factor.name}</span>
                                {factor.trend !== 'stable' && (
                                  <div className="ml-2">
                                    {getTrendIcon(factor.trend)}
                                  </div>
                                )}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {factor.score}
                              </span>
                            </div>
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                              <div 
                                style={{ width: `${factor.score}%` }} 
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                                  factor.score < 20 ? 'bg-green-500' : 
                                  factor.score < 40 ? 'bg-green-400' : 
                                  factor.score < 60 ? 'bg-yellow-500' : 
                                  factor.score < 80 ? 'bg-orange-500' : 
                                  'bg-red-500'
                                }`}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-md p-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-3">Risk Mitigation Recommendations</h5>
                    <ul className="space-y-2">
                      {mitigationRecommendations.map((recommendation, index) => (
                        <li key={index} className="flex items-start">
                          <span className={`h-5 w-5 mr-2 ${
                            selectedCollateral.riskLevel === 'high' ? 'text-red-500' :
                            selectedCollateral.riskLevel === 'medium' ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>•</span>
                          <span className="text-sm text-gray-700">{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Apply Recommendations
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-md p-8 text-center">
                  <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Collateral Selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a collateral item to view detailed risk assessment and mitigation recommendations.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollateralRiskManagement;
