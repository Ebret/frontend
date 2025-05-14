'use client';

import React, { useState, lazy, Suspense } from 'react';
import {
  FiUsers,
  FiDollarSign,
  FiCreditCard,
  FiCalendar,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiPieChart,
  FiShoppingBag,
  FiPackage,
  FiShoppingCart
} from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';
import { useScreenSize } from '@/components/common/ResponsiveWrapper';

// Dynamically import the FinancialDashboard component
const FinancialDashboard = lazy(() => import('./FinancialDashboard'));

/**
 * UnifiedDashboard Component
 *
 * A dashboard that adapts to the cooperative type (Credit or Multi-Purpose)
 *
 * @param {Object} props
 * @param {Object} props.metrics - Key metrics to display
 * @param {Object} props.financialData - Financial data for Multi-Purpose cooperatives
 * @param {string} props.financialPeriod - Time period for financial data
 * @param {Function} props.onFinancialPeriodChange - Function to call when financial period changes
 * @param {Array} props.pendingApprovals - List of pending approvals
 * @param {Array} props.recentActivity - List of recent activity
 */
const UnifiedDashboard = ({
  metrics = {
    members: { value: 0, change: '0%', changeType: 'neutral' },
    loans: { value: 0, change: '0%', changeType: 'neutral' },
    deposits: { value: 0, change: '0%', changeType: 'neutral' },
    disbursements: { value: 0, change: '0%', changeType: 'neutral' },
  },
  financialData = {
    revenue: { total: 0, previousPeriod: 0, byCategory: {} },
    expenses: { total: 0, previousPeriod: 0, byCategory: {} },
    profit: { total: 0, previousPeriod: 0 },
    transactions: { count: 0, previousPeriod: 0, byPaymentMethod: {} },
    topProducts: [],
  },
  financialPeriod = 'monthly',
  onFinancialPeriodChange,
  pendingApprovals = [],
  recentActivity = [],
}) => {
  const { cooperativeType, isLoading } = useCooperative();
  const screenSize = useScreenSize();

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-label="Loading dashboard">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            aria-current={activeTab === 'overview' ? 'page' : undefined}
          >
            Overview
          </button>

          {cooperativeType === 'MULTI_PURPOSE' && (
            <button
              onClick={() => setActiveTab('financial')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'financial'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              aria-current={activeTab === 'financial' ? 'page' : undefined}
            >
              Financial
            </button>
          )}

          <button
            onClick={() => setActiveTab('approvals')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'approvals'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            aria-current={activeTab === 'approvals' ? 'page' : undefined}
          >
            Approvals
          </button>

          <button
            onClick={() => setActiveTab('activity')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'activity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            aria-current={activeTab === 'activity' ? 'page' : undefined}
          >
            Activity
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h3>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Members Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <FiUsers className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">
                          {metrics.members.value}
                        </div>
                        <div className="flex items-center text-sm">
                          {metrics.members.changeType === 'increase' ? (
                            <FiTrendingUp className="text-green-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                          ) : metrics.members.changeType === 'decrease' ? (
                            <FiTrendingDown className="text-red-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                          ) : null}
                          <span className={
                            metrics.members.changeType === 'increase' ? 'text-green-700' :
                            metrics.members.changeType === 'decrease' ? 'text-red-700' :
                            'text-gray-500'
                          }>
                            {metrics.members.change}
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Loans Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                    <FiCreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Active Loans</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">
                          {metrics.loans.value}
                        </div>
                        <div className="flex items-center text-sm">
                          {metrics.loans.changeType === 'increase' ? (
                            <FiTrendingUp className="text-green-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                          ) : metrics.loans.changeType === 'decrease' ? (
                            <FiTrendingDown className="text-red-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                          ) : null}
                          <span className={
                            metrics.loans.changeType === 'increase' ? 'text-green-700' :
                            metrics.loans.changeType === 'decrease' ? 'text-red-700' :
                            'text-gray-500'
                          }>
                            {metrics.loans.change}
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Deposits Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <FiDollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Deposits</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">
                          {metrics.deposits.value}
                        </div>
                        <div className="flex items-center text-sm">
                          {metrics.deposits.changeType === 'increase' ? (
                            <FiTrendingUp className="text-green-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                          ) : metrics.deposits.changeType === 'decrease' ? (
                            <FiTrendingDown className="text-red-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                          ) : null}
                          <span className={
                            metrics.deposits.changeType === 'increase' ? 'text-green-700' :
                            metrics.deposits.changeType === 'decrease' ? 'text-red-700' :
                            'text-gray-500'
                          }>
                            {metrics.deposits.change}
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Disbursements Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                    <FiCalendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Loan Disbursements (MTD)</dt>
                      <dd>
                        <div className="text-lg font-semibold text-gray-900">
                          {metrics.disbursements.value}
                        </div>
                        <div className="flex items-center text-sm">
                          {metrics.disbursements.changeType === 'increase' ? (
                            <FiTrendingUp className="text-green-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                          ) : metrics.disbursements.changeType === 'decrease' ? (
                            <FiTrendingDown className="text-red-500 mr-1.5 h-4 w-4 flex-shrink-0" />
                          ) : null}
                          <span className={
                            metrics.disbursements.changeType === 'increase' ? 'text-green-700' :
                            metrics.disbursements.changeType === 'decrease' ? 'text-red-700' :
                            'text-gray-500'
                          }>
                            {metrics.disbursements.change}
                          </span>
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Purpose specific metrics */}
          {cooperativeType === 'MULTI_PURPOSE' && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Multi-Purpose Metrics</h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Sales Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <FiShoppingCart className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Monthly Sales</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {formatCurrency(financialData.revenue.total)}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inventory Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <FiPackage className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Inventory Value</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {formatCurrency(1245000)}
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
                      <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <FiTrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Monthly Profit</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {formatCurrency(financialData.profit.total)}
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
                          <dd className="text-lg font-semibold text-gray-900">
                            {financialData.transactions.count.toLocaleString()}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Financial Tab (Multi-Purpose only) */}
      {activeTab === 'financial' && cooperativeType === 'MULTI_PURPOSE' && (
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        }>
          <FinancialDashboard
            financialData={financialData}
            period={financialPeriod}
            onPeriodChange={onFinancialPeriodChange}
          />
        </Suspense>
      )}

      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Approvals</h3>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingApprovals.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No pending approvals found.
                      </td>
                    </tr>
                  ) : (
                    pendingApprovals.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.submittedAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-hidden overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivity.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                        No recent activity found.
                      </td>
                    </tr>
                  ) : (
                    recentActivity.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.action}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.user}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.target}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.timestamp}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedDashboard;
