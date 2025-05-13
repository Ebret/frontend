'use client';

import React from 'react';
import { FiUsers, FiUserCheck, FiUserX, FiAlertTriangle } from 'react-icons/fi';

/**
 * Member Health Metrics Component
 * 
 * Displays key health metrics for member management:
 * - Total members
 * - Active members
 * - Inactive members
 * - At-risk members
 * 
 * @param {Object} metrics - Object containing member metrics
 */
const MemberHealthMetrics = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Members */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <FiUsers className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                <dd className="text-lg font-semibold text-gray-900">{metrics.total}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-blue-700">100% of membership</span>
          </div>
        </div>
      </div>
      
      {/* Active Members */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <FiUserCheck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Members</dt>
                <dd className="text-lg font-semibold text-gray-900">{metrics.active}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-green-700">{metrics.activePercentage.toFixed(1)}% of total</span>
          </div>
        </div>
      </div>
      
      {/* Inactive Members */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-gray-500 rounded-md p-3">
              <FiUserX className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Inactive Members</dt>
                <dd className="text-lg font-semibold text-gray-900">{metrics.inactive}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-gray-700">{metrics.inactivePercentage.toFixed(1)}% of total</span>
          </div>
        </div>
      </div>
      
      {/* At-Risk Members */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <FiAlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">At-Risk Members</dt>
                <dd className="text-lg font-semibold text-gray-900">{metrics.atRisk}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-red-700">{metrics.atRiskPercentage.toFixed(1)}% of total</span>
          </div>
        </div>
      </div>
      
      {/* Health Score Distribution */}
      <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Member Health Distribution</h3>
        </div>
        <div className="p-5">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Healthy
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  {metrics.activePercentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: `${metrics.activePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
            </div>
            
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                  Inactive
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {metrics.inactivePercentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: `${metrics.inactivePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-500"></div>
            </div>
            
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                  At Risk
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-red-600">
                  {metrics.atRiskPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div style={{ width: `${metrics.atRiskPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Member Growth */}
      <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Member Growth</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-lg font-semibold text-gray-900">+28</span>
              <span className="ml-2 text-sm text-gray-500">new members this month</span>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                +12% from last month
              </span>
            </div>
          </div>
          
          {/* Simplified growth chart (placeholder) */}
          <div className="h-16 flex items-end space-x-1">
            {[25, 30, 22, 18, 28, 35, 30, 28, 32, 30, 35, 40].map((value, index) => (
              <div 
                key={index}
                className="bg-blue-500 rounded-t w-full"
                style={{ height: `${(value / 40) * 100}%` }}
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
    </div>
  );
};

export default MemberHealthMetrics;
