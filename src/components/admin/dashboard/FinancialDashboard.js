'use client';

import React, { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiBarChart2, FiPieChart, FiCalendar, FiInfo } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * Financial Dashboard Component
 * 
 * Provides a dashboard for financial metrics and KPIs
 * 
 * @param {Object} props
 * @param {Object} props.financialData - Financial data to display
 * @param {string} props.period - Time period for the data (daily, weekly, monthly, yearly)
 * @param {Function} props.onPeriodChange - Function to call when period changes
 */
const FinancialDashboard = ({ 
  financialData = {
    revenue: {
      total: 0,
      previousPeriod: 0,
      byCategory: {},
    },
    expenses: {
      total: 0,
      previousPeriod: 0,
      byCategory: {},
    },
    profit: {
      total: 0,
      previousPeriod: 0,
    },
    transactions: {
      count: 0,
      previousPeriod: 0,
      byPaymentMethod: {},
    },
    topProducts: [],
  }, 
  period = 'monthly',
  onPeriodChange
}) => {
  const { cooperativeType, isLoading } = useCooperative();
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  // Calculate percentage change
  const calculatePercentageChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };
  
  // Get period label
  const getPeriodLabel = () => {
    switch (period) {
      case 'daily':
        return 'Today vs Yesterday';
      case 'weekly':
        return 'This Week vs Last Week';
      case 'monthly':
        return 'This Month vs Last Month';
      case 'yearly':
        return 'This Year vs Last Year';
      default:
        return '';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not a multi-purpose cooperative
  if (cooperativeType !== 'MULTI_PURPOSE') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Financial dashboard is only available for Multi-Purpose Cooperatives. Please contact your administrator to change your cooperative type.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  const revenueChange = calculatePercentageChange(financialData.revenue.total, financialData.revenue.previousPeriod);
  const expensesChange = calculatePercentageChange(financialData.expenses.total, financialData.expenses.previousPeriod);
  const profitChange = calculatePercentageChange(financialData.profit.total, financialData.profit.previousPeriod);
  const transactionsChange = calculatePercentageChange(financialData.transactions.count, financialData.transactions.previousPeriod);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Financial Overview</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Period:</span>
          <select
            value={period}
            onChange={(e) => onPeriodChange && onPeriodChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <FiDollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(financialData.revenue.total)}
                    </div>
                    <div className="flex items-center text-sm">
                      {revenueChange >= 0 ? (
                        <FiTrendingUp className="text-green-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <FiTrendingDown className="text-red-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                      )}
                      <span className={revenueChange >= 0 ? 'text-green-700' : 'text-red-700'}>
                        {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(2)}%
                      </span>
                      <span className="text-gray-500 ml-1.5">vs previous {period}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Expenses Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <FiDollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(financialData.expenses.total)}
                    </div>
                    <div className="flex items-center text-sm">
                      {expensesChange <= 0 ? (
                        <FiTrendingDown className="text-green-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <FiTrendingUp className="text-red-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                      )}
                      <span className={expensesChange <= 0 ? 'text-green-700' : 'text-red-700'}>
                        {expensesChange >= 0 ? '+' : ''}{expensesChange.toFixed(2)}%
                      </span>
                      <span className="text-gray-500 ml-1.5">vs previous {period}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profit Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <FiDollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Net Profit</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatCurrency(financialData.profit.total)}
                    </div>
                    <div className="flex items-center text-sm">
                      {profitChange >= 0 ? (
                        <FiTrendingUp className="text-green-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <FiTrendingDown className="text-red-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                      )}
                      <span className={profitChange >= 0 ? 'text-green-700' : 'text-red-700'}>
                        {profitChange >= 0 ? '+' : ''}{profitChange.toFixed(2)}%
                      </span>
                      <span className="text-gray-500 ml-1.5">vs previous {period}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transactions Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <FiBarChart2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Transactions</dt>
                  <dd>
                    <div className="text-lg font-semibold text-gray-900">
                      {financialData.transactions.count.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm">
                      {transactionsChange >= 0 ? (
                        <FiTrendingUp className="text-green-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                      ) : (
                        <FiTrendingDown className="text-red-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                      )}
                      <span className={transactionsChange >= 0 ? 'text-green-700' : 'text-red-700'}>
                        {transactionsChange >= 0 ? '+' : ''}{transactionsChange.toFixed(2)}%
                      </span>
                      <span className="text-gray-500 ml-1.5">vs previous {period}</span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Revenue by Category */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">Revenue by Category</h4>
            
            {Object.keys(financialData.revenue.byCategory).length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {Object.entries(financialData.revenue.byCategory)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => (
                    <li key={category} className="py-3">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium text-gray-900">{category}</p>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</p>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(amount / financialData.revenue.total) * 100}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Top Products */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h4 className="text-base font-medium text-gray-900 mb-4">Top Selling Products</h4>
            
            {financialData.topProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No data available.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {financialData.topProducts.map((product) => (
                  <li key={product.id} className="py-3">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {product.quantity} units sold
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h4 className="text-base font-medium text-gray-900 mb-4">Transactions by Payment Method</h4>
          
          {Object.keys(financialData.transactions.byPaymentMethod).length === 0 ? (
            <p className="text-sm text-gray-500">No data available.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {Object.entries(financialData.transactions.byPaymentMethod).map(([method, count]) => (
                <div key={method} className="bg-gray-50 overflow-hidden rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {method === 'Cash' && <FiDollarSign className="h-5 w-5 text-green-500" />}
                      {method === 'Credit Card' && <FiDollarSign className="h-5 w-5 text-blue-500" />}
                      {method === 'Mobile Payment' && <FiDollarSign className="h-5 w-5 text-purple-500" />}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{method}</p>
                      <p className="text-sm text-gray-500">{count} transactions</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        method === 'Cash' ? 'bg-green-500' : 
                        method === 'Credit Card' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${(count / financialData.transactions.count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-right">
        <p>
          <FiCalendar className="inline-block mr-1" />
          {getPeriodLabel()}
        </p>
      </div>
    </div>
  );
};

export default FinancialDashboard;
