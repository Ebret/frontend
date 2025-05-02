'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { useAuth } from '@/contexts/AuthContext';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for charts (in a real app, this would come from the API)
const mockLoanData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Loan Disbursements',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      backgroundColor: '#4299E1',
      borderColor: '#4299E1',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Loan Repayments',
      data: [8000, 12000, 14000, 15000, 18000, 22000],
      backgroundColor: '#48BB78',
      borderColor: '#48BB78',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

const mockSavingsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Deposits',
      data: [25000, 30000, 35000, 40000, 45000, 50000],
      backgroundColor: '#4299E1',
      borderColor: '#4299E1',
      borderWidth: 2,
      tension: 0.4,
    },
    {
      label: 'Withdrawals',
      data: [15000, 18000, 20000, 22000, 25000, 28000],
      backgroundColor: '#F56565',
      borderColor: '#F56565',
      borderWidth: 2,
      tension: 0.4,
    },
  ],
};

const mockMembershipData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'New Members',
      data: [15, 20, 25, 18, 30, 22],
      backgroundColor: '#805AD5',
      borderColor: '#805AD5',
      borderWidth: 2,
    },
  ],
};

const mockLoanStatusData = {
  labels: ['Pending', 'Approved', 'Disbursed', 'Active', 'Paid', 'Defaulted'],
  datasets: [
    {
      data: [15, 10, 8, 45, 20, 2],
      backgroundColor: ['#ECC94B', '#4299E1', '#48BB78', '#805AD5', '#38B2AC', '#F56565'],
      borderWidth: 1,
    },
  ],
};

const RealTimeDashboard: React.FC = () => {
  const { summary, adminSummary, loading, error, fetchDashboardSummary, fetchAdminDashboardSummary } = useDashboard();
  const { config } = useWhiteLabel();
  const { user } = useAuth();

  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30); // seconds

  // Auto-refresh dashboard data
  useEffect(() => {
    if (!refreshInterval) return;

    const intervalId = setInterval(() => {
      fetchDashboardSummary();

      if (user?.role === 'ADMIN') {
        fetchAdminDashboardSummary();
      }
    }, refreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [refreshInterval, fetchDashboardSummary, fetchAdminDashboardSummary, user?.role]);

  // Handle date range change
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // In a real app, this would trigger a new API call with the selected date range
  };

  // Handle refresh interval change
  const handleRefreshIntervalChange = (interval: string) => {
    setRefreshInterval(interval === 'off' ? null : parseInt(interval, 10));
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).replace('PHP', '₱');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold" style={{ color: config?.primaryColor }}>
          Real-Time Dashboard
        </h2>

        <div className="flex space-x-2">
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={refreshInterval?.toString() || 'off'}
            onChange={(e) => handleRefreshIntervalChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="off">Auto-refresh Off</option>
            <option value="10">Refresh every 10s</option>
            <option value="30">Refresh every 30s</option>
            <option value="60">Refresh every 1m</option>
            <option value="300">Refresh every 5m</option>
          </select>

          <button
            onClick={() => {
              fetchDashboardSummary();
              if (user?.role === 'ADMIN') {
                fetchAdminDashboardSummary();
              }
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: config?.primaryColor }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: `${config?.primaryColor}20` }}>
              <svg
                className="h-6 w-6"
                style={{ color: config?.primaryColor }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Total Loans</p>
              <p className="text-lg font-semibold text-gray-900">
                {summary?.activeLoans || adminSummary?.activeLoans || 0}
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(summary?.totalLoanAmount || adminSummary?.totalLoanAmount || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: `${config?.primaryColor}20` }}>
              <svg
                className="h-6 w-6"
                style={{ color: config?.primaryColor }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Total Savings</p>
              <p className="text-lg font-semibold text-gray-900">
                {summary?.savingsAccounts || adminSummary?.totalAccounts || 0} accounts
              </p>
              <p className="text-xs text-gray-500">
                {formatCurrency(summary?.totalSavingsBalance || adminSummary?.totalSavings || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: `${config?.primaryColor}20` }}>
              <svg
                className="h-6 w-6"
                style={{ color: config?.primaryColor }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Total Payments</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(summary?.totalPayments || 0)}
              </p>
              <p className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: `${config?.primaryColor}20` }}>
              <svg
                className="h-6 w-6"
                style={{ color: config?.primaryColor }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Pending Applications</p>
              <p className="text-lg font-semibold text-gray-900">
                {summary?.pendingApplications || adminSummary?.pendingApplications || 0}
              </p>
              <p className="text-xs text-gray-500">
                Awaiting review
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Activity</h3>
          <div className="h-64">
            <Line
              data={mockLoanData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Activity</h3>
          <div className="h-64">
            <Line
              data={mockSavingsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Growth</h3>
          <div className="h-64">
            <Bar
              data={mockMembershipData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Status Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-3/4 h-full">
              <Doughnut
                data={mockLoanStatusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary?.recentTransactions && summary.recentTransactions.length > 0 ? (
                summary.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.transactionType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Status */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Real-time Status</h3>
          <div className="flex items-center">
            <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm text-gray-500">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-500">Active Users</h4>
              <span className="text-xs text-gray-400">Last minute</span>
            </div>
            <p className="text-2xl font-bold mt-2" style={{ color: config?.primaryColor }}>
              {adminSummary?.activeMembers || 42}
            </p>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              <span>+5% from last hour</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-500">System Load</h4>
              <span className="text-xs text-gray-400">CPU/Memory</span>
            </div>
            <p className="text-2xl font-bold mt-2" style={{ color: config?.primaryColor }}>
              23% / 45%
            </p>
            <div className="mt-2 text-xs text-green-600 flex items-center">
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Normal operation</span>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium text-gray-500">API Response Time</h4>
              <span className="text-xs text-gray-400">Avg. last 5 min</span>
            </div>
            <p className="text-2xl font-bold mt-2" style={{ color: config?.primaryColor }}>
              187 ms
            </p>
            <div className="mt-2 text-xs text-yellow-600 flex items-center">
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span>+12% from baseline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
