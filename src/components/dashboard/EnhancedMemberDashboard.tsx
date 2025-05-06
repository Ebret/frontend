'use client';

import React, { useState, useEffect } from 'react';
import { useDashboard } from '@/contexts/DashboardContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import { Spinner } from '@/components/ui';

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

const EnhancedMemberDashboard: React.FC = () => {
  const { summary, loading, error, fetchDashboardSummary } = useDashboard();
  const { config } = useWhiteLabel();
  const { user } = useAuth();

  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'quarter', 'year'
  const [refreshInterval, setRefreshInterval] = useState<number | null>(30); // seconds
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'loans', 'savings', 'transactions'

  // Auto-refresh dashboard data
  useEffect(() => {
    if (!refreshInterval) return;

    const intervalId = setInterval(() => {
      fetchDashboardSummary();
    }, refreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [refreshInterval, fetchDashboardSummary]);

  // Handle date range change
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // In a real app, this would trigger a new data fetch with the selected range
    fetchDashboardSummary();
  };

  // Handle refresh interval change
  const handleRefreshIntervalChange = (interval: string) => {
    setRefreshInterval(interval === 'off' ? null : parseInt(interval, 10));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: config?.primaryColor || '#3b82f6' }}>
            Welcome back, {user?.firstName || 'Member'}!
          </h2>
          <p className="text-gray-600 mt-1">
            Here's an overview of your financial status and recent activities
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>

          <select
            value={refreshInterval?.toString() || 'off'}
            onChange={(e) => handleRefreshIntervalChange(e.target.value)}
            className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="off">Auto-refresh Off</option>
            <option value="10">Refresh every 10s</option>
            <option value="30">Refresh every 30s</option>
            <option value="60">Refresh every 1m</option>
            <option value="300">Refresh every 5m</option>
          </select>

          <button
            onClick={() => fetchDashboardSummary()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
          >
            <svg
              className="h-4 w-4 mr-1.5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? `border-${config?.primaryColorName || 'blue'}-500 text-${
                    config?.primaryColorName || 'blue'
                  }-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'loans'
                ? `border-${config?.primaryColorName || 'blue'}-500 text-${
                    config?.primaryColorName || 'blue'
                  }-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Loans
          </button>
          <button
            onClick={() => setActiveTab('savings')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'savings'
                ? `border-${config?.primaryColorName || 'blue'}-500 text-${
                    config?.primaryColorName || 'blue'
                  }-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Savings
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? `border-${config?.primaryColorName || 'blue'}-500 text-${
                    config?.primaryColorName || 'blue'
                  }-600`
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transactions
          </button>
        </nav>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Loans Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div
                    className="flex-shrink-0 p-3 rounded-md"
                    style={{ backgroundColor: `${config?.primaryColor}20` || 'rgba(59, 130, 246, 0.2)' }}
                  >
                    <svg
                      className="h-6 w-6"
                      style={{ color: config?.primaryColor || '#3b82f6' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m-6-8h6M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 truncate">Active Loans</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {summary?.activeLoans || 0} of {summary?.totalLoans || 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="absolute h-full rounded-full transition-all duration-500 ease-in-out"
                      style={{
                        width: `${
                          summary?.totalLoans
                            ? Math.round((summary.activeLoans / summary.totalLoans) * 100)
                            : 0
                        }%`,
                        backgroundColor: config?.primaryColor || '#3b82f6',
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a
                  href="/loans"
                  className="text-sm font-medium"
                  style={{ color: config?.primaryColor || '#3b82f6' }}
                >
                  View all loans
                </a>
              </div>
            </div>

            {/* Total Savings Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div
                    className="flex-shrink-0 p-3 rounded-md"
                    style={{ backgroundColor: `${config?.primaryColor}20` || 'rgba(59, 130, 246, 0.2)' }}
                  >
                    <svg
                      className="h-6 w-6"
                      style={{ color: config?.primaryColor || '#3b82f6' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 truncate">Total Savings</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatCurrency(summary?.totalSavings || 0)}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm text-gray-500">
                    {summary?.savingsAccounts || 0} active accounts
                  </span>
                  {summary?.savingsGrowth && summary.savingsGrowth > 0 ? (
                    <span className="ml-auto flex items-center text-green-600 text-sm">
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
                      {summary.savingsGrowth}%
                    </span>
                  ) : summary?.savingsGrowth && summary.savingsGrowth < 0 ? (
                    <span className="ml-auto flex items-center text-red-600 text-sm">
                      <svg
                        className="h-4 w-4 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586V7a1 1 0 112 0v5a1 1 0 01-1 1h-5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {Math.abs(summary.savingsGrowth)}%
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a
                  href="/savings"
                  className="text-sm font-medium"
                  style={{ color: config?.primaryColor || '#3b82f6' }}
                >
                  View all savings
                </a>
              </div>
            </div>

            {/* Next Payment Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div
                    className="flex-shrink-0 p-3 rounded-md"
                    style={{ backgroundColor: `${config?.primaryColor}20` || 'rgba(59, 130, 246, 0.2)' }}
                  >
                    <svg
                      className="h-6 w-6"
                      style={{ color: config?.primaryColor || '#3b82f6' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 truncate">Next Payment Due</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {summary?.nextPaymentDue
                        ? new Date(summary.nextPaymentDue).toLocaleDateString()
                        : 'No payments due'}
                    </p>
                  </div>
                </div>
                {summary?.nextPaymentAmount && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Amount due:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(summary.nextPaymentAmount)}
                      </span>
                    </div>
                    {summary?.daysUntilNextPayment !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Days remaining:</span>
                          <span
                            className={`text-sm font-medium ${
                              summary.daysUntilNextPayment <= 3
                                ? 'text-red-600'
                                : summary.daysUntilNextPayment <= 7
                                ? 'text-yellow-600'
                                : 'text-green-600'
                            }`}
                          >
                            {summary.daysUntilNextPayment}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a
                  href="/payments"
                  className="text-sm font-medium"
                  style={{ color: config?.primaryColor || '#3b82f6' }}
                >
                  Make a payment
                </a>
              </div>
            </div>

            {/* Credit Score Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div
                    className="flex-shrink-0 p-3 rounded-md"
                    style={{ backgroundColor: `${config?.primaryColor}20` || 'rgba(59, 130, 246, 0.2)' }}
                  >
                    <svg
                      className="h-6 w-6"
                      style={{ color: config?.primaryColor || '#3b82f6' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 truncate">Credit Score</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {summary?.creditScore || 'N/A'}
                    </p>
                  </div>
                </div>
                {summary?.creditScore && (
                  <div className="mt-4">
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full rounded-full transition-all duration-500 ease-in-out"
                        style={{
                          width: `${(summary.creditScore / 850) * 100}%`,
                          backgroundColor:
                            summary.creditScore >= 700
                              ? '#10B981' // green
                              : summary.creditScore >= 600
                              ? '#F59E0B' // yellow
                              : '#EF4444', // red
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Poor</span>
                      <span className="text-xs text-gray-500">Good</span>
                      <span className="text-xs text-gray-500">Excellent</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <a
                  href="/credit-score"
                  className="text-sm font-medium"
                  style={{ color: config?.primaryColor || '#3b82f6' }}
                >
                  View details
                </a>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Loan Balance Chart */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Balance Trend</h3>
                <div className="h-64">
                  <Line
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        {
                          label: 'Loan Balance',
                          data: [125000, 120000, 115000, 110000, 105000, 100000],
                          borderColor: config?.primaryColor || '#3b82f6',
                          backgroundColor: `${config?.primaryColor}20` || 'rgba(59, 130, 246, 0.2)',
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-PH', {
                                  style: 'currency',
                                  currency: 'PHP',
                                }).format(context.parsed.y);
                              }
                              return label;
                            },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: false,
                          ticks: {
                            callback: function (value) {
                              return new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                                notation: 'compact',
                              }).format(value as number);
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Savings Growth Chart */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Growth</h3>
                <div className="h-64">
                  <Line
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        {
                          label: 'Savings Balance',
                          data: [50000, 75000, 100000, 125000, 175000, 250000],
                          borderColor: '#10b981', // green
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          tension: 0.3,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-PH', {
                                  style: 'currency',
                                  currency: 'PHP',
                                }).format(context.parsed.y);
                              }
                              return label;
                            },
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function (value) {
                              return new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                                notation: 'compact',
                              }).format(value as number);
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Payment History Chart */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
                <div className="h-64">
                  <Doughnut
                    data={{
                      labels: ['On Time', 'Late', 'Missed'],
                      datasets: [
                        {
                          data: [
                            summary?.paymentHistory?.onTime || 24,
                            summary?.paymentHistory?.late || 2,
                            summary?.paymentHistory?.missed || 0,
                          ],
                          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                          borderColor: ['#10b981', '#f59e0b', '#ef4444'],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || '';
                              const value = context.raw as number;
                              const total = (context.dataset.data as number[]).reduce(
                                (acc, curr) => acc + curr,
                                0
                              );
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${value} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Loan Utilization Chart */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Utilization</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="w-3/4 h-full flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48">
                      <Doughnut
                        data={{
                          labels: ['Used', 'Available'],
                          datasets: [
                            {
                              data: [
                                summary?.loanUtilization || 0.6,
                                summary?.loanUtilization ? 1 - summary.loanUtilization : 0.4,
                              ],
                              backgroundColor: [config?.primaryColor || '#3b82f6', '#e5e7eb'],
                              borderColor: ['transparent', 'transparent'],
                              borderWidth: 1,
                              cutout: '75%',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: true,
                          plugins: {
                            legend: {
                              display: false,
                            },
                            tooltip: {
                              callbacks: {
                                label: function (context) {
                                  const label = context.label || '';
                                  const value = context.raw as number;
                                  const percentage = Math.round(value * 100);
                                  return `${label}: ${percentage}%`;
                                },
                              },
                            },
                          },
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-3xl font-bold" style={{ color: config?.primaryColor || '#3b82f6' }}>
                          {Math.round((summary?.loanUtilization || 0.6) * 100)}%
                        </span>
                        <span className="text-sm text-gray-500">Utilized</span>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Used Credit</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(summary?.loanBalance || 75000)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-500">Available Credit</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatCurrency(summary?.availableCredit || 50000)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions Section */}
          <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                <a
                  href="/transactions"
                  className="text-sm font-medium"
                  style={{ color: config?.primaryColor || '#3b82f6' }}
                >
                  View All
                </a>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary?.recentTransactions?.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.transactionType === 'DEPOSIT'
                                ? 'bg-green-100 text-green-800'
                                : transaction.transactionType === 'WITHDRAWAL'
                                ? 'bg-red-100 text-red-800'
                                : transaction.transactionType === 'LOAN_PAYMENT'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {transaction.transactionType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          <span
                            className={
                              transaction.transactionType === 'DEPOSIT'
                                ? 'text-green-600'
                                : transaction.transactionType === 'WITHDRAWAL' ||
                                  transaction.transactionType === 'LOAN_PAYMENT'
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }
                          >
                            {transaction.transactionType === 'DEPOSIT'
                              ? '+'
                              : transaction.transactionType === 'WITHDRAWAL' ||
                                transaction.transactionType === 'LOAN_PAYMENT'
                              ? '-'
                              : ''}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loans Tab Content */}
      {activeTab === 'loans' && (
        <div className="space-y-6">
          {/* Loan Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Loan Balance</h3>
                <p className="text-3xl font-bold" style={{ color: config?.primaryColor || '#3b82f6' }}>
                  {formatCurrency(summary?.loanBalance || 75000)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Across {summary?.activeLoans || 2} active loans
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Next Payment</h3>
                <p className="text-3xl font-bold" style={{ color: config?.primaryColor || '#3b82f6' }}>
                  {formatCurrency(summary?.nextPaymentAmount || 5000)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Due on {summary?.nextPaymentDue ? new Date(summary.nextPaymentDue).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Interest Paid</h3>
                <p className="text-3xl font-bold" style={{ color: config?.primaryColor || '#3b82f6' }}>
                  {formatCurrency(summary?.interestPaid || 12500)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Principal paid: {formatCurrency(summary?.principalPaid || 25000)}
                </p>
              </div>
            </div>
          </div>

          {/* Active Loans Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Active Loans</h3>
              <div className="space-y-6">
                {/* Loan 1 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Personal Loan</h4>
                      <p className="text-sm text-gray-500">Started on Jan 15, 2023</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(35000)}</p>
                      <p className="text-sm text-gray-500">Remaining balance</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>3/12 payments</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full rounded-full transition-all duration-500 ease-in-out"
                        style={{
                          width: `${(3 / 12) * 100}%`,
                          backgroundColor: config?.primaryColor || '#3b82f6',
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Original Amount</p>
                      <p className="text-base font-medium text-gray-900">{formatCurrency(50000)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-base font-medium text-gray-900">12.00%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Payment</p>
                      <p className="text-base font-medium text-gray-900">{formatCurrency(5000)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                    >
                      Make Payment
                    </button>
                  </div>
                </div>

                {/* Loan 2 */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Business Loan</h4>
                      <p className="text-sm text-gray-500">Started on Jun 1, 2022</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(40000)}</p>
                      <p className="text-sm text-gray-500">Remaining balance</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>16/24 payments</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full rounded-full transition-all duration-500 ease-in-out"
                        style={{
                          width: `${(16 / 24) * 100}%`,
                          backgroundColor: config?.primaryColor || '#3b82f6',
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Original Amount</p>
                      <p className="text-base font-medium text-gray-900">{formatCurrency(100000)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-base font-medium text-gray-900">10.00%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Next Payment</p>
                      <p className="text-base font-medium text-gray-900">{formatCurrency(4500)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                    >
                      Make Payment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loan History Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Loan History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Loan Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Start Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        End Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Personal Loan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(50000)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jan 15, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jan 15, 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Business Loan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(100000)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jun 1, 2022
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jun 1, 2024
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Emergency Loan</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(25000)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Dec 1, 2022
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Jun 1, 2023
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Paid
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Apply for Loan Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Apply for a New Loan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-300">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Personal Loan</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    For personal expenses, education, or home improvements
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Up to ₱100,000
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      12% interest rate
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Up to 24 months term
                    </li>
                  </ul>
                  <button
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                  >
                    Apply Now
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-300">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Business Loan</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    For business expansion, equipment, or working capital
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Up to ₱500,000
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      10% interest rate
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Up to 36 months term
                    </li>
                  </ul>
                  <button
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                  >
                    Apply Now
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all duration-300">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Emergency Loan</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    For medical emergencies, calamities, or urgent needs
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Up to ₱50,000
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      8% interest rate
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Up to 12 months term
                    </li>
                  </ul>
                  <button
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Savings Tab Content */}
      {activeTab === 'savings' && (
        <div className="space-y-6">
          {/* Savings Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Savings</h3>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(summary?.totalSavingsBalance || 250000)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Across {summary?.savingsAccounts || 2} accounts
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Interest Earned (YTD)</h3>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(5625)}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-gray-500">Growth rate:</span>
                  <span className="text-sm text-green-600 ml-1 flex items-center">
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
                    {summary?.savingsGrowth || 2.5}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Next Maturity Date</h3>
                <p className="text-3xl font-bold" style={{ color: config?.primaryColor || '#3b82f6' }}>
                  {new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Time Deposit Account
                </p>
              </div>
            </div>
          </div>

          {/* Savings Accounts Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Savings Accounts</h3>
              <div className="space-y-6">
                {/* Regular Savings Account */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Regular Savings</h4>
                      <p className="text-sm text-gray-500">Account #: 1234567890</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(75000)}</p>
                      <p className="text-sm text-gray-500">Current balance</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-base font-medium text-gray-900">2.50% p.a.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Transaction</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Interest Earned (YTD)</p>
                      <p className="text-base font-medium text-gray-900">{formatCurrency(1875)}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Deposit
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Withdraw
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                    >
                      View Transactions
                    </button>
                  </div>
                </div>

                {/* Time Deposit Account */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">Time Deposit</h4>
                      <p className="text-sm text-gray-500">Account #: 0987654321</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <p className="text-lg font-semibold text-gray-900">{formatCurrency(50000)}</p>
                      <p className="text-sm text-gray-500">Current balance</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Interest Rate</p>
                      <p className="text-base font-medium text-gray-900">4.50% p.a.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Maturity Date</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                      <span>Time to maturity</span>
                      <span>30/180 days</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-full rounded-full transition-all duration-500 ease-in-out bg-green-500"
                        style={{
                          width: `${(30 / 180) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 justify-end">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details
                    </button>
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                    >
                      Renew at Maturity
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Growth Chart */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Growth</h3>
              <div className="h-80">
                <Line
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                    datasets: [
                      {
                        label: 'Regular Savings',
                        data: [50000, 55000, 60000, 62500, 65000, 70000, 72500, 75000, 80000, 85000, 90000, 95000],
                        borderColor: '#10b981', // green
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.3,
                        fill: true,
                      },
                      {
                        label: 'Time Deposit',
                        data: [0, 0, 0, 0, 0, 50000, 50000, 50000, 50000, 50000, 50000, 50000],
                        borderColor: '#3b82f6', // blue
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.3,
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top',
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                              label += ': ';
                            }
                            if (context.parsed.y !== null) {
                              label += new Intl.NumberFormat('en-PH', {
                                style: 'currency',
                                currency: 'PHP',
                              }).format(context.parsed.y);
                            }
                            return label;
                          },
                        },
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function (value) {
                            return new Intl.NumberFormat('en-PH', {
                              style: 'currency',
                              currency: 'PHP',
                              notation: 'compact',
                            }).format(value as number);
                          },
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Open New Account Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Open a New Savings Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all duration-300">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Regular Savings</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Flexible savings account with easy access to your funds
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      2.50% interest rate
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      No minimum balance
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Unlimited withdrawals
                    </li>
                  </ul>
                  <button
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Open Account
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all duration-300">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Time Deposit</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Higher interest rates for fixed-term deposits
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Up to 4.50% interest rate
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Terms: 30, 90, 180, 360 days
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Minimum deposit: ₱10,000
                    </li>
                  </ul>
                  <button
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Open Account
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:border-green-500 hover:shadow-md transition-all duration-300">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Special Savings</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Goal-based savings for specific purposes
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-4">
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      3.00% interest rate
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Set savings goals
                    </li>
                    <li className="flex items-center">
                      <svg
                        className="h-4 w-4 text-green-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Automatic savings plans
                    </li>
                  </ul>
                  <button
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Open Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab Content */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Transactions Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Transactions</h3>
                <p className="text-3xl font-bold" style={{ color: config?.primaryColor || '#3b82f6' }}>
                  {summary?.recentTransactions?.length || 7}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  In the last 30 days
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Deposits</h3>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(10000)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  In the last 30 days
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Total Withdrawals</h3>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(5500)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  In the last 30 days
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Filters */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Transactions</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="transaction-type" className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <select
                    id="transaction-type"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue="all"
                  >
                    <option value="all">All Types</option>
                    <option value="DEPOSIT">Deposits</option>
                    <option value="WITHDRAWAL">Withdrawals</option>
                    <option value="LOAN_PAYMENT">Loan Payments</option>
                    <option value="TRANSFER">Transfers</option>
                    <option value="FEE">Fees</option>
                    <option value="INTEREST">Interest</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
                    Account
                  </label>
                  <select
                    id="account"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue="all"
                  >
                    <option value="all">All Accounts</option>
                    <option value="1">Regular Savings</option>
                    <option value="2">Time Deposit</option>
                    <option value="3">Personal Loan</option>
                    <option value="4">Business Loan</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    id="date-from"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    id="date-to"
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Account
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary?.recentTransactions?.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {transaction.transactionType === 'LOAN_PAYMENT' ? 'Personal Loan' : 'Regular Savings'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.transactionType === 'DEPOSIT'
                                ? 'bg-green-100 text-green-800'
                                : transaction.transactionType === 'WITHDRAWAL'
                                ? 'bg-red-100 text-red-800'
                                : transaction.transactionType === 'LOAN_PAYMENT'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {transaction.transactionType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                          <span
                            className={
                              transaction.transactionType === 'DEPOSIT'
                                ? 'text-green-600'
                                : transaction.transactionType === 'WITHDRAWAL' ||
                                  transaction.transactionType === 'LOAN_PAYMENT'
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }
                          >
                            {transaction.transactionType === 'DEPOSIT'
                              ? '+'
                              : transaction.transactionType === 'WITHDRAWAL' ||
                                transaction.transactionType === 'LOAN_PAYMENT'
                              ? '-'
                              : ''}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="View details"
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            title="Download receipt"
                          >
                            <svg
                              className="h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to{' '}
                      <span className="font-medium">{summary?.recentTransactions?.length || 7}</span> of{' '}
                      <span className="font-medium">20</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        aria-current="page"
                        className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        1
                      </button>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        2
                      </button>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hidden md:inline-flex relative items-center px-4 py-2 border text-sm font-medium">
                        3
                      </button>
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                      <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                        8
                      </button>
                      <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Analytics */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Analytics</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transaction Types Chart */}
                <div className="h-80">
                  <h4 className="text-base font-medium text-gray-700 mb-2">Transaction Types</h4>
                  <Doughnut
                    data={{
                      labels: ['Deposits', 'Withdrawals', 'Loan Payments', 'Transfers', 'Fees', 'Interest'],
                      datasets: [
                        {
                          data: [10000, 5500, 5000, 2500, 300, 156.25],
                          backgroundColor: [
                            '#10b981', // green
                            '#ef4444', // red
                            '#3b82f6', // blue
                            '#8b5cf6', // purple
                            '#f59e0b', // amber
                            '#6366f1', // indigo
                          ],
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              const label = context.label || '';
                              const value = context.raw as number;
                              const total = (context.dataset.data as number[]).reduce(
                                (acc, curr) => acc + curr,
                                0
                              );
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                {/* Monthly Transactions Chart */}
                <div className="h-80">
                  <h4 className="text-base font-medium text-gray-700 mb-2">Monthly Transactions</h4>
                  <Bar
                    data={{
                      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                      datasets: [
                        {
                          label: 'Deposits',
                          data: [8000, 12000, 9000, 11000, 10000, 10000],
                          backgroundColor: '#10b981', // green
                        },
                        {
                          label: 'Withdrawals',
                          data: [4000, 6000, 5000, 7000, 5500, 5500],
                          backgroundColor: '#ef4444', // red
                        },
                        {
                          label: 'Loan Payments',
                          data: [5000, 5000, 5000, 5000, 5000, 5000],
                          backgroundColor: '#3b82f6', // blue
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        tooltip: {
                          callbacks: {
                            label: function (context) {
                              let label = context.dataset.label || '';
                              if (label) {
                                label += ': ';
                              }
                              if (context.parsed.y !== null) {
                                label += formatCurrency(context.parsed.y);
                              }
                              return label;
                            },
                          },
                        },
                      },
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: false,
                          ticks: {
                            callback: function (value) {
                              return formatCurrency(value as number, {
                                notation: 'compact',
                                compactDisplay: 'short',
                              });
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Export Transactions</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-5 w-5 mr-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export as PDF
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-5 w-5 mr-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export as CSV
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-5 w-5 mr-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export as Excel
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="h-5 w-5 mr-2 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print Statement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMemberDashboard;
