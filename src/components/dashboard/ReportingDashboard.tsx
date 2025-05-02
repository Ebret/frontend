'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { api } from '@/lib/api';

// Mock data for charts (in a real app, this would come from the API)
const mockLoanData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Loan Disbursements',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      backgroundColor: '#4299E1',
    },
    {
      label: 'Loan Repayments',
      data: [8000, 12000, 14000, 15000, 18000, 22000],
      backgroundColor: '#48BB78',
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
    },
    {
      label: 'Withdrawals',
      data: [15000, 18000, 20000, 22000, 25000, 28000],
      backgroundColor: '#F56565',
    },
  ],
};

const mockMembershipData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  data: [120, 135, 150, 165, 180, 200],
};

const mockLoanStatusData = {
  labels: ['Pending', 'Approved', 'Disbursed', 'Active', 'Paid', 'Defaulted'],
  data: [15, 10, 8, 45, 20, 2],
  backgroundColor: ['#ECC94B', '#4299E1', '#48BB78', '#805AD5', '#38B2AC', '#F56565'],
};

interface DashboardSummary {
  totalMembers: number;
  activeMembers: number;
  totalLoans: number;
  activeLoans: number;
  totalLoanAmount: number;
  totalSavings: number;
  totalAccounts: number;
  pendingApplications: number;
}

const ReportingDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { config } = useWhiteLabel();

  const [summary, setSummary] = useState<DashboardSummary>({
    totalMembers: 0,
    activeMembers: 0,
    totalLoans: 0,
    activeLoans: 0,
    totalLoanAmount: 0,
    totalSavings: 0,
    totalAccounts: 0,
    pendingApplications: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dateRange, setDateRange] = useState('month'); // 'week', 'month', 'quarter', 'year'

  // Fetch dashboard summary on component mount
  useEffect(() => {
    const fetchDashboardSummary = async () => {
      try {
        setIsLoading(true);

        // In a real app, this would be an API call
        // const response = await api.getDashboardSummary();
        // setSummary(response.data.summary);

        // Mock data for demonstration
        setSummary({
          totalMembers: 250,
          activeMembers: 220,
          totalLoans: 180,
          activeLoans: 120,
          totalLoanAmount: 1250000,
          totalSavings: 2500000,
          totalAccounts: 350,
          pendingApplications: 15,
        });

        setIsLoading(false);
      } catch (err: any) {
        setError('Failed to fetch dashboard data. Please try again later.');
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardSummary();
    }
  }, [isAuthenticated]);

  // Handle date range change
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // In a real app, this would trigger a new API call with the selected date range
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

  if (isLoading) {
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
        <h2 className="text-2xl font-bold" style={{ color: config.primaryColor }}>
          Dashboard & Reports
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

          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: config.primaryColor }}
          >
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: `${config.primaryColor}20` }}>
              <svg
                className="h-6 w-6"
                style={{ color: config.primaryColor }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 truncate">Total Members</p>
              <p className="text-lg font-semibold text-gray-900">{summary.totalMembers}</p>
              <p className="text-xs text-gray-500">
                {Math.round((summary.activeMembers / summary.totalMembers) * 100)}% active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: `${config.primaryColor}20` }}>
              <svg
                className="h-6 w-6"
                style={{ color: config.primaryColor }}
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
              <p className="text-lg font-semibold text-gray-900">{summary.totalLoans}</p>
              <p className="text-xs text-gray-500">
                {formatCurrency(summary.totalLoanAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: `${config.primaryColor}20` }}>
              <svg
                className="h-6 w-6"
                style={{ color: config.primaryColor }}
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
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(summary.totalSavings)}</p>
              <p className="text-xs text-gray-500">
                {summary.totalAccounts} accounts
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md" style={{ backgroundColor: `${config.primaryColor}20` }}>
              <svg
                className="h-6 w-6"
                style={{ color: config.primaryColor }}
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
              <p className="text-lg font-semibold text-gray-900">{summary.pendingApplications}</p>
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
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">
              [Chart: Loan Disbursements vs Repayments over time]
            </p>
            {/* In a real app, this would be a Chart.js or similar component */}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Savings Activity</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">
              [Chart: Deposits vs Withdrawals over time]
            </p>
            {/* In a real app, this would be a Chart.js or similar component */}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Membership Growth</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">
              [Chart: Member growth over time]
            </p>
            {/* In a real app, this would be a Chart.js or similar component */}
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Loan Status Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">
              [Chart: Pie chart of loan statuses]
            </p>
            {/* In a real app, this would be a Chart.js or similar component */}
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
                  Member
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
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
              {/* Mock data - in a real app, this would come from the API */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  John Doe
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Loan Application
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $5,000.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Pending
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Jane Smith
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Savings Deposit
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $1,000.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Robert Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Loan Payment
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $750.00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Completed
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button
            className="text-sm font-medium"
            style={{ color: config.primaryColor }}
          >
            View All Activity
          </button>
        </div>
      </div>

      {/* Report Generation */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h4 className="font-medium text-gray-900">Financial Statement</h4>
            <p className="text-sm text-gray-500 mt-1">
              Generate income statement, balance sheet, and cash flow reports.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h4 className="font-medium text-gray-900">Loan Portfolio</h4>
            <p className="text-sm text-gray-500 mt-1">
              Analyze loan performance, delinquency rates, and risk assessment.
            </p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
            <h4 className="font-medium text-gray-900">Member Activity</h4>
            <p className="text-sm text-gray-500 mt-1">
              Track member engagement, product usage, and retention metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingDashboard;
