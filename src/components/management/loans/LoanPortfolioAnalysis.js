'use client';

import React, { useState } from 'react';
import { FiPieChart, FiBarChart2, FiCalendar } from 'react-icons/fi';

/**
 * Loan Portfolio Analysis Component
 * 
 * Provides detailed analysis of the loan portfolio:
 * - Distribution by loan type
 * - Distribution by amount
 * - Distribution by term
 * 
 * @param {Array} loans - Array of loan objects
 */
const LoanPortfolioAnalysis = ({ loans }) => {
  // State for active analysis view
  const [activeAnalysis, setActiveAnalysis] = useState('type');
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate loan type distribution
  const getLoanTypeDistribution = () => {
    const distribution = {};
    
    loans.forEach(loan => {
      const type = loan.loanType;
      if (!distribution[type]) {
        distribution[type] = {
          count: 0,
          amount: 0
        };
      }
      
      distribution[type].count++;
      distribution[type].amount += loan.amount;
    });
    
    return Object.entries(distribution).map(([type, data]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count: data.count,
      amount: data.amount,
      percentage: (data.count / loans.length) * 100
    }));
  };
  
  // Calculate loan amount distribution
  const getLoanAmountDistribution = () => {
    const distribution = {
      'Small (<₱50k)': { count: 0, amount: 0 },
      'Medium (₱50k-₱200k)': { count: 0, amount: 0 },
      'Large (>₱200k)': { count: 0, amount: 0 }
    };
    
    loans.forEach(loan => {
      if (loan.amount < 50000) {
        distribution['Small (<₱50k)'].count++;
        distribution['Small (<₱50k)'].amount += loan.amount;
      } else if (loan.amount < 200000) {
        distribution['Medium (₱50k-₱200k)'].count++;
        distribution['Medium (₱50k-₱200k)'].amount += loan.amount;
      } else {
        distribution['Large (>₱200k)'].count++;
        distribution['Large (>₱200k)'].amount += loan.amount;
      }
    });
    
    return Object.entries(distribution).map(([range, data]) => ({
      name: range,
      count: data.count,
      amount: data.amount,
      percentage: (data.count / loans.length) * 100
    }));
  };
  
  // Calculate loan term distribution
  const getLoanTermDistribution = () => {
    const distribution = {
      'Short (≤12 months)': { count: 0, amount: 0 },
      'Medium (13-36 months)': { count: 0, amount: 0 },
      'Long (>36 months)': { count: 0, amount: 0 }
    };
    
    loans.forEach(loan => {
      if (loan.term <= 12) {
        distribution['Short (≤12 months)'].count++;
        distribution['Short (≤12 months)'].amount += loan.amount;
      } else if (loan.term <= 36) {
        distribution['Medium (13-36 months)'].count++;
        distribution['Medium (13-36 months)'].amount += loan.amount;
      } else {
        distribution['Long (>36 months)'].count++;
        distribution['Long (>36 months)'].amount += loan.amount;
      }
    });
    
    return Object.entries(distribution).map(([range, data]) => ({
      name: range,
      count: data.count,
      amount: data.amount,
      percentage: (data.count / loans.length) * 100
    }));
  };
  
  // Get active analysis data
  const getActiveAnalysisData = () => {
    switch (activeAnalysis) {
      case 'type':
        return getLoanTypeDistribution();
      case 'amount':
        return getLoanAmountDistribution();
      case 'term':
        return getLoanTermDistribution();
      default:
        return [];
    }
  };
  
  // Get segment color
  const getSegmentColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    
    return colors[index % colors.length];
  };
  
  // Get analysis icon
  const getAnalysisIcon = () => {
    switch (activeAnalysis) {
      case 'type':
        return <FiPieChart className="h-5 w-5" />;
      case 'amount':
        return <FiBarChart2 className="h-5 w-5" />;
      case 'term':
        return <FiCalendar className="h-5 w-5" />;
      default:
        return <FiPieChart className="h-5 w-5" />;
    }
  };
  
  // Calculate total amount for active analysis
  const calculateTotalAmount = () => {
    const data = getActiveAnalysisData();
    return data.reduce((total, item) => total + item.amount, 0);
  };
  
  const analysisData = getActiveAnalysisData();
  const totalAmount = calculateTotalAmount();
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            {getAnalysisIcon()}
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Loan Portfolio Analysis
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveAnalysis('type')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeAnalysis === 'type'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            By Type
          </button>
          <button
            type="button"
            onClick={() => setActiveAnalysis('amount')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeAnalysis === 'amount'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            By Amount
          </button>
          <button
            type="button"
            onClick={() => setActiveAnalysis('term')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeAnalysis === 'term'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            By Term
          </button>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col md:flex-row">
          {/* Pie Chart */}
          <div className="flex-1 flex justify-center items-center">
            <div className="relative w-48 h-48">
              {/* Simplified pie chart visualization */}
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {analysisData.map((segment, index, array) => {
                  // Calculate the segment's position in the pie
                  let startAngle = 0;
                  for (let i = 0; i < index; i++) {
                    startAngle += (array[i].percentage / 100) * 360;
                  }
                  
                  const endAngle = startAngle + (segment.percentage / 100) * 360;
                  
                  // Convert angles to radians
                  const startRad = (startAngle - 90) * Math.PI / 180;
                  const endRad = (endAngle - 90) * Math.PI / 180;
                  
                  // Calculate the SVG path
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);
                  
                  // Determine if the arc should be drawn as a large arc
                  const largeArcFlag = segment.percentage > 50 ? 1 : 0;
                  
                  // Create the SVG path
                  const path = `
                    M 50 50
                    L ${x1} ${y1}
                    A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                    Z
                  `;
                  
                  return (
                    <path
                      key={segment.name}
                      d={path}
                      className={getSegmentColor(index).replace('bg-', 'fill-')}
                    />
                  );
                })}
                <circle cx="50" cy="50" r="25" fill="white" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-500">Total</div>
                  <div className="text-lg font-semibold text-gray-900">{loans.length}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="md:w-64 mt-6 md:mt-0 md:ml-6 flex flex-col justify-center">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              Distribution by {activeAnalysis.charAt(0).toUpperCase() + activeAnalysis.slice(1)}
            </h4>
            <div className="space-y-3">
              {analysisData.map((segment, index) => (
                <div key={segment.name} className="flex items-center">
                  <div className={`h-3 w-3 ${getSegmentColor(index)} rounded-full mr-2`}></div>
                  <div className="text-sm text-gray-700 flex-1">{segment.name}</div>
                  <div className="text-sm font-medium text-gray-900">{segment.count}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Amount Distribution
              </h4>
              <div className="space-y-2">
                {analysisData.map((segment, index) => (
                  <div key={`amount-${segment.name}`} className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">{segment.name}</div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(segment.amount)}
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-900">Total</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPortfolioAnalysis;
