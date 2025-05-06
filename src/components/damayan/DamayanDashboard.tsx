'use client';

import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { Spinner } from '@/components/ui';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

// Define types for Damayan data
interface DamayanFund {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  targetAmount: number;
  contributionsCount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  beneficiary?: {
    id: string;
    name: string;
    reason: string;
  };
}

interface DamayanContribution {
  id: string;
  amount: number;
  fundId: string;
  fundName: string;
  contributorId: string;
  contributorName: string;
  createdAt: string;
}

interface DamayanAssistanceRequest {
  id: string;
  memberId: string;
  memberName: string;
  reason: string;
  requestedAmount: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

interface DamayanDashboardProps {
  isAdmin?: boolean;
}

const DamayanDashboard: React.FC<DamayanDashboardProps> = ({ isAdmin = false }) => {
  const { config } = useWhiteLabel();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'funds' | 'contributions' | 'requests'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for Damayan data
  const [funds, setFunds] = useState<DamayanFund[]>([]);
  const [contributions, setContributions] = useState<DamayanContribution[]>([]);
  const [assistanceRequests, setAssistanceRequests] = useState<DamayanAssistanceRequest[]>([]);
  const [userContributions, setUserContributions] = useState<DamayanContribution[]>([]);
  const [userRequests, setUserRequests] = useState<DamayanAssistanceRequest[]>([]);

  // Summary statistics
  const [summary, setSummary] = useState({
    totalFunds: 0,
    activeFunds: 0,
    totalContributions: 0,
    totalContributionAmount: 0,
    pendingRequests: 0,
    userTotalContributions: 0,
    userContributionAmount: 0
  });

  // Fetch Damayan data
  useEffect(() => {
    const fetchDamayanData = async () => {
      try {
        setLoading(true);

        // In a real app, these would be API calls
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        // Mock funds data
        const mockFunds: DamayanFund[] = [
          {
            id: '1',
            name: 'Medical Assistance Fund',
            description: 'Fund for members requiring medical assistance',
            totalAmount: 150000,
            targetAmount: 200000,
            contributionsCount: 75,
            status: 'ACTIVE',
            createdAt: '2023-01-15T00:00:00Z',
            updatedAt: '2023-07-01T00:00:00Z',
            beneficiary: {
              id: '101',
              name: 'Juan Dela Cruz',
              reason: 'Hospitalization due to pneumonia'
            }
          },
          {
            id: '2',
            name: 'Calamity Relief Fund',
            description: 'Emergency fund for members affected by natural disasters',
            totalAmount: 250000,
            targetAmount: 250000,
            contributionsCount: 120,
            status: 'COMPLETED',
            createdAt: '2023-02-10T00:00:00Z',
            updatedAt: '2023-06-15T00:00:00Z',
            beneficiary: {
              id: '102',
              name: 'Community Relief',
              reason: 'Typhoon damage assistance'
            }
          },
          {
            id: '3',
            name: 'Education Support Fund',
            description: 'Fund to support children of members for educational expenses',
            totalAmount: 100000,
            targetAmount: 300000,
            contributionsCount: 50,
            status: 'ACTIVE',
            createdAt: '2023-03-20T00:00:00Z',
            updatedAt: '2023-07-05T00:00:00Z'
          }
        ];

        // Mock contributions data
        const mockContributions: DamayanContribution[] = [
          {
            id: '1001',
            amount: 1000,
            fundId: '1',
            fundName: 'Medical Assistance Fund',
            contributorId: user?.id || '999',
            contributorName: `${user?.firstName} ${user?.lastName}` || 'Current User',
            createdAt: '2023-06-01T00:00:00Z'
          },
          {
            id: '1002',
            amount: 2000,
            fundId: '2',
            fundName: 'Calamity Relief Fund',
            contributorId: user?.id || '999',
            contributorName: `${user?.firstName} ${user?.lastName}` || 'Current User',
            createdAt: '2023-05-15T00:00:00Z'
          },
          {
            id: '1003',
            amount: 1500,
            fundId: '1',
            fundName: 'Medical Assistance Fund',
            contributorId: '201',
            contributorName: 'Maria Santos',
            createdAt: '2023-06-10T00:00:00Z'
          },
          {
            id: '1004',
            amount: 3000,
            fundId: '3',
            fundName: 'Education Support Fund',
            contributorId: '202',
            contributorName: 'Pedro Reyes',
            createdAt: '2023-06-20T00:00:00Z'
          },
          {
            id: '1005',
            amount: 2500,
            fundId: '2',
            fundName: 'Calamity Relief Fund',
            contributorId: '203',
            contributorName: 'Ana Gonzales',
            createdAt: '2023-05-25T00:00:00Z'
          }
        ];

        // Mock assistance requests data
        const mockRequests: DamayanAssistanceRequest[] = [
          {
            id: '2001',
            memberId: '101',
            memberName: 'Juan Dela Cruz',
            reason: 'Hospitalization due to pneumonia',
            requestedAmount: 50000,
            status: 'APPROVED',
            createdAt: '2023-05-10T00:00:00Z',
            updatedAt: '2023-05-15T00:00:00Z'
          },
          {
            id: '2002',
            memberId: user?.id || '999',
            memberName: `${user?.firstName} ${user?.lastName}` || 'Current User',
            reason: 'Medical expenses for dependent',
            requestedAmount: 30000,
            status: 'PENDING',
            createdAt: '2023-07-01T00:00:00Z',
            updatedAt: '2023-07-01T00:00:00Z'
          },
          {
            id: '2003',
            memberId: '203',
            memberName: 'Ana Gonzales',
            reason: 'Home repair after typhoon',
            requestedAmount: 40000,
            status: 'PENDING',
            createdAt: '2023-06-28T00:00:00Z',
            updatedAt: '2023-06-28T00:00:00Z'
          }
        ];

        // Set data
        setFunds(mockFunds);
        setContributions(mockContributions);
        setAssistanceRequests(mockRequests);

        // Filter user-specific data
        const userContribs = mockContributions.filter(c => c.contributorId === user?.id);
        const userReqs = mockRequests.filter(r => r.memberId === user?.id);
        setUserContributions(userContribs);
        setUserRequests(userReqs);

        // Calculate summary statistics
        setSummary({
          totalFunds: mockFunds.length,
          activeFunds: mockFunds.filter(f => f.status === 'ACTIVE').length,
          totalContributions: mockContributions.length,
          totalContributionAmount: mockContributions.reduce((sum, c) => sum + c.amount, 0),
          pendingRequests: mockRequests.filter(r => r.status === 'PENDING').length,
          userTotalContributions: userContribs.length,
          userContributionAmount: userContribs.reduce((sum, c) => sum + c.amount, 0)
        });

        setError(null);
      } catch (err) {
        console.error('Error fetching Damayan data:', err);
        setError('Failed to load Damayan data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDamayanData();
  }, [user]);

  // Handle tab change
  const handleTabChange = (tab: 'overview' | 'funds' | 'contributions' | 'requests') => {
    setActiveTab(tab);
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
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Dashboard Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Damayan Dashboard</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Mutual aid program for cooperative members
        </p>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => handleTabChange('overview')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={activeTab === 'overview' ? { borderColor: config?.primaryColor, color: config?.primaryColor } : {}}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabChange('funds')}
            className={`ml-8 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'funds'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={activeTab === 'funds' ? { borderColor: config?.primaryColor, color: config?.primaryColor } : {}}
          >
            Funds
          </button>
          <button
            onClick={() => handleTabChange('contributions')}
            className={`ml-8 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'contributions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={activeTab === 'contributions' ? { borderColor: config?.primaryColor, color: config?.primaryColor } : {}}
          >
            Contributions
          </button>
          <button
            onClick={() => handleTabChange('requests')}
            className={`ml-8 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            style={activeTab === 'requests' ? { borderColor: config?.primaryColor, color: config?.primaryColor } : {}}
          >
            Assistance Requests
          </button>
        </nav>
      </div>

      {/* Dashboard Content */}
      <div className="px-4 py-5 sm:p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              The Damayan program is a mutual aid initiative where members contribute to help fellow members in need.
              This dashboard provides an overview of the program's funds, contributions, and assistance requests.
            </p>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Active Funds</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.activeFunds}</p>
                <p className="text-sm text-gray-500 mt-1">
                  of {summary.totalFunds} total funds
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Total Contributions</p>
                <p className="text-2xl font-semibold text-gray-900">{formatNumber(summary.totalContributions)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(summary.totalContributionAmount)} total amount
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Pending Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.pendingRequests}</p>
                <p className="text-sm text-gray-500 mt-1">
                  awaiting approval
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500">Your Contributions</p>
                <p className="text-2xl font-semibold text-gray-900">{formatNumber(summary.userTotalContributions)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(summary.userContributionAmount)} total amount
                </p>
              </div>
            </div>

            {/* More overview content will be added in the next phase */}
          </div>
        )}

        {/* Funds Tab */}
        {activeTab === 'funds' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Active Funds</h3>
              {isAdmin && (
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                >
                  Create New Fund
                </button>
              )}
            </div>

            {funds.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No funds available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  There are no active Damayan funds at the moment.
                </p>
                {isAdmin && (
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Create a new fund
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {funds.map((fund) => (
                  <div key={fund.id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{fund.name}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{fund.description}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          fund.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : fund.status === 'COMPLETED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {fund.status}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Current Amount</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            {formatCurrency(fund.totalAmount)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Target Amount</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            {formatCurrency(fund.targetAmount)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contributions</dt>
                          <dd className="mt-1 text-lg font-semibold text-gray-900">
                            {fund.contributionsCount}
                          </dd>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {Math.round((fund.totalAmount / fund.targetAmount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className="h-2.5 rounded-full"
                            style={{
                              width: `${Math.min((fund.totalAmount / fund.targetAmount) * 100, 100)}%`,
                              backgroundColor: config?.primaryColor || '#3b82f6'
                            }}
                          ></div>
                        </div>
                      </div>

                      {fund.beneficiary && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900">Beneficiary Information</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            <span className="font-medium">Name:</span> {fund.beneficiary.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            <span className="font-medium">Reason:</span> {fund.beneficiary.reason}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end space-x-4">
                        <button
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View Details
                        </button>
                        {fund.status === 'ACTIVE' && (
                          <button
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                          >
                            Contribute
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contributions Tab */}
        {activeTab === 'contributions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Contributions</h3>
              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                    isAdmin ? 'bg-gray-100 text-gray-900' : 'bg-blue-100 text-blue-800'
                  }`}
                  onClick={() => {}}
                  style={!isAdmin ? { backgroundColor: `${config?.primaryColor}20`, color: config?.primaryColor } : {}}
                >
                  My Contributions
                </button>
                {isAdmin && (
                  <button
                    className={`px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-800`}
                    onClick={() => {}}
                    style={{ backgroundColor: `${config?.primaryColor}20`, color: config?.primaryColor }}
                  >
                    All Contributions
                  </button>
                )}
              </div>
            </div>

            {isAdmin ? (
              // Admin view - all contributions
              <div>
                {contributions.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No contributions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are no contributions to any Damayan funds yet.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contributor
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fund
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {contributions.map((contribution) => (
                          <tr key={contribution.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{contribution.contributorName}</div>
                              <div className="text-sm text-gray-500">ID: {contribution.contributorId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{contribution.fundName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatCurrency(contribution.amount)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(contribution.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button
                                className="text-blue-600 hover:text-blue-900"
                                style={{ color: config?.primaryColor }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              // Member view - user's contributions
              <div>
                {userContributions.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No contributions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't made any contributions to Damayan funds yet.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                      >
                        Make a contribution
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 flex-1 md:flex md:justify-between">
                          <p className="text-sm text-blue-700">
                            You have contributed a total of {formatCurrency(summary.userContributionAmount)} to Damayan funds.
                          </p>
                          <p className="mt-3 text-sm md:mt-0 md:ml-6">
                            <button
                              className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                              style={{ color: config?.primaryColor }}
                            >
                              Make another contribution <span aria-hidden="true">&rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {userContributions.map((contribution) => (
                          <li key={contribution.id}>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-600 truncate" style={{ color: config?.primaryColor }}>
                                  {contribution.fundName}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {formatCurrency(contribution.amount)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Contributed on {new Date(contribution.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <button className="font-medium text-blue-600 hover:text-blue-500" style={{ color: config?.primaryColor }}>
                                    View receipt
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Assistance Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Assistance Requests</h3>
              {!isAdmin && (
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                >
                  Request Assistance
                </button>
              )}
            </div>

            {isAdmin ? (
              // Admin view - all requests
              <div>
                {assistanceRequests.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m-6-8h6M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No assistance requests</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      There are no assistance requests from members yet.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 flex space-x-2">
                      <button
                        className="px-3 py-1.5 text-sm font-medium rounded-md bg-blue-100 text-blue-800"
                        style={{ backgroundColor: `${config?.primaryColor}20`, color: config?.primaryColor }}
                      >
                        All Requests
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100"
                      >
                        Pending
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100"
                      >
                        Approved
                      </button>
                      <button
                        className="px-3 py-1.5 text-sm font-medium rounded-md text-gray-700 bg-gray-100"
                      >
                        Rejected
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Member
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reason
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                              <span className="sr-only">Actions</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {assistanceRequests.map((request) => (
                            <tr key={request.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{request.memberName}</div>
                                <div className="text-sm text-gray-500">ID: {request.memberId}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 line-clamp-2">{request.reason}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{formatCurrency(request.requestedAmount)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    request.status === 'APPROVED'
                                      ? 'bg-green-100 text-green-800'
                                      : request.status === 'REJECTED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {request.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  className="text-blue-600 hover:text-blue-900 mr-4"
                                  style={{ color: config?.primaryColor }}
                                >
                                  View
                                </button>
                                {request.status === 'PENDING' && (
                                  <>
                                    <button
                                      className="text-green-600 hover:text-green-900 mr-4"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Member view - user's requests
              <div>
                {userRequests.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m-6-8h6M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No assistance requests</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't made any assistance requests yet.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                      >
                        Request assistance
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {userRequests.map((request) => (
                          <li key={request.id}>
                            <div className="px-4 py-4 sm:px-6">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-blue-600 truncate" style={{ color: config?.primaryColor }}>
                                  Request for {formatCurrency(request.requestedAmount)}
                                </p>
                                <div className="ml-2 flex-shrink-0 flex">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                      request.status === 'APPROVED'
                                        ? 'bg-green-100 text-green-800'
                                        : request.status === 'REJECTED'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                    }`}
                                  >
                                    {request.status}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  {request.reason}
                                </p>
                              </div>
                              <div className="mt-2 sm:flex sm:justify-between">
                                <div className="sm:flex">
                                  <p className="flex items-center text-sm text-gray-500">
                                    <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    Requested on {new Date(request.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                  <button className="font-medium text-blue-600 hover:text-blue-500" style={{ color: config?.primaryColor }}>
                                    View details
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900">About Assistance Requests</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        Assistance requests are reviewed by the cooperative's management.
                        The approval process typically takes 3-5 business days.
                        You will be notified once a decision has been made on your request.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DamayanDashboard;
