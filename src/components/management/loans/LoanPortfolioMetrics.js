'use client';

import React from 'react';
import { FiDollarSign, FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

/**
 * Loan Portfolio Metrics Component
 * 
 * Displays key metrics for the loan portfolio:
 * - Total loans
 * - Active loans
 * - Outstanding amount
 * - Overdue loans
 * 
 * @param {Object} metrics - Object containing loan metrics
 */
const LoanPortfolioMetrics = ({ metrics }) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Loan Amount */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Loan Amount</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.totalAmount)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-blue-700">{metrics.totalLoans} total loans</span>
          </div>
        </div>
      </div>
      
      {/* Outstanding Amount */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Outstanding Amount</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.outstandingAmount)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-green-700">{metrics.activeLoans} active loans</span>
          </div>
        </div>
      </div>
      
      {/* Pending Loans */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <FiClock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Pending Approval</dt>
                <dd className="text-lg font-semibold text-gray-900">{metrics.pendingLoans}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-yellow-700">Awaiting review</span>
          </div>
        </div>
      </div>
      
      {/* Overdue Loans */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <FiAlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Overdue Loans</dt>
                <dd className="text-lg font-semibold text-gray-900">{metrics.overdueLoans}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-red-700">Requires attention</span>
          </div>
        </div>
      </div>
      
      {/* Loan Performance */}
      <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Loan Performance</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-semibold text-gray-900">98.2%</span>
              <span className="ml-2 text-sm text-gray-500">on-time payment rate</span>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                +1.5% from last month
              </span>
            </div>
          </div>
          
          {/* Performance chart (placeholder) */}
          <div className="h-16 flex items-end space-x-1">
            {[95, 96, 94, 95, 97, 96, 97, 98, 97, 96, 97, 98.2].map((value, index) => (
              <div 
                key={index}
                className="bg-blue-500 rounded-t w-full"
                style={{ height: `${((value - 90) / 10) * 100}%` }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </div>
      </div>
      
      {/* Risk Distribution */}
      <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Risk Distribution</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-semibold text-gray-900">{metrics.highRiskLoans}</span>
              <span className="ml-2 text-sm text-gray-500">high risk loans</span>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {((metrics.highRiskLoans / metrics.totalLoans) * 100).toFixed(1)}% of portfolio
              </span>
            </div>
          </div>
          
          {/* Risk distribution chart */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Low Risk
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  60%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: '60%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
            </div>
            
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                  Medium Risk
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-yellow-600">
                  30%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: '30%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
            </div>
            
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                  High Risk
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-red-600">
                  10%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: '10%' }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPortfolioMetrics;
