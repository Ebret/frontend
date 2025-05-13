'use client';

import React from 'react';
import { FiDatabase, FiDollarSign, FiClock, FiTrendingUp } from 'react-icons/fi';

/**
 * Deposit Metrics Component
 * 
 * Displays key metrics for deposits:
 * - Total deposits
 * - Savings deposits
 * - Time deposits
 * - Maturing deposits
 * 
 * @param {Object} metrics - Object containing deposit metrics
 */
const DepositMetrics = ({ metrics }) => {
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
      {/* Total Deposits */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <FiDatabase className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Deposits</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.totalAmount)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-blue-700">{metrics.totalDeposits} accounts</span>
          </div>
        </div>
      </div>
      
      {/* Savings Deposits */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Savings Deposits</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.savingsAmount)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-green-700">{metrics.savingsDeposits} accounts</span>
          </div>
        </div>
      </div>
      
      {/* Time Deposits */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <FiClock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Time Deposits</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.timeDepositAmount)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-purple-700">{metrics.timeDeposits} accounts</span>
          </div>
        </div>
      </div>
      
      {/* Maturing Soon */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <FiClock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Maturing Soon</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.maturingSoonAmount)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-yellow-700">{metrics.maturingSoon} accounts in 30 days</span>
          </div>
        </div>
      </div>
      
      {/* Deposit Growth */}
      <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Deposit Growth</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-semibold text-gray-900">+12.5%</span>
              <span className="ml-2 text-sm text-gray-500">year-to-date growth</span>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <FiTrendingUp className="mr-1 h-3 w-3" />
                +2.3% from last month
              </span>
            </div>
          </div>
          
          {/* Growth chart (placeholder) */}
          <div className="h-16 flex items-end space-x-1">
            {[18.5, 19.2, 19.8, 20.5, 21.2, 21.8, 22.3, 22.8, 23.5, 24.2, 24.8, 25.5].map((value, index) => (
              <div 
                key={index}
                className="bg-blue-500 rounded-t w-full"
                style={{ height: `${(value / 30) * 100}%` }}
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
      
      {/* Deposit Mix */}
      <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Deposit Mix</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-semibold text-gray-900">
                {metrics.totalAmount > 0 
                  ? ((metrics.timeDepositAmount / metrics.totalAmount) * 100).toFixed(1) 
                  : 0}%
              </span>
              <span className="ml-2 text-sm text-gray-500">time deposits</span>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Target: 40%
              </span>
            </div>
          </div>
          
          {/* Deposit mix visualization */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Savings
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  {metrics.totalAmount > 0 
                    ? ((metrics.savingsAmount / metrics.totalAmount) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${metrics.totalAmount > 0 ? (metrics.savingsAmount / metrics.totalAmount) * 100 : 0}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
            
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                  Time Deposits
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-purple-600">
                  {metrics.totalAmount > 0 
                    ? ((metrics.timeDepositAmount / metrics.totalAmount) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${metrics.totalAmount > 0 ? (metrics.timeDepositAmount / metrics.totalAmount) * 100 : 0}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
              ></div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>
              {metrics.totalAmount > 0 && (metrics.timeDepositAmount / metrics.totalAmount) < 0.4 
                ? "Increase time deposits to improve stability and net interest margin."
                : "Good deposit mix with strong time deposit base."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositMetrics;
