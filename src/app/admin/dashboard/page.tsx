'use client';

import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/AdminSidebar';
import { Permission } from '@/lib/roles';
import EnhancedAdminDashboard from '@/components/dashboard/EnhancedAdminDashboard';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardType, setDashboardType] = useState('basic'); // 'basic' or 'enhanced'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.getDashboardSummary();
        setDashboardData(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <Layout sidebar={<AdminSidebar />}>
        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // If enhanced dashboard is selected, render it directly
  if (dashboardType === 'enhanced') {
    return (
      <ProtectedRoute>
        <EnhancedAdminDashboard />
      </ProtectedRoute>
    );
  }

  // Otherwise, render the basic dashboard
  return (
    <ProtectedRoute>
      <Layout sidebar={<AdminSidebar />}>
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Admin Dashboard</h1>
              <button
                onClick={() => setDashboardType(dashboardType === 'basic' ? 'enhanced' : 'basic')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Switch to {dashboardType === 'basic' ? 'Enhanced' : 'Basic'} Dashboard
              </button>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              {error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
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
              ) : (
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900">System Overview</h2>

                  <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {/* System Health Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                            <svg
                              className="h-6 w-6 text-green-600"
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
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                System Status
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">Healthy</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View system logs
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Active Users Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                            <svg
                              className="h-6 w-6 text-blue-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Active Users
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">42</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View all users
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* System Alerts Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                            <svg
                              className="h-6 w-6 text-yellow-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                System Alerts
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">2</div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View all alerts
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h2 className="mt-8 text-lg font-medium text-gray-900">Business Overview</h2>

                  <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Members Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Members
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {dashboardData?.totalMembers || 0}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View all members
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Active Loans Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Active Loans
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {dashboardData?.activeLoans || 0}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View all loans
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Total Savings Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Savings
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          ₱{(dashboardData?.totalSavingsBalance || 0).toLocaleString()}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View financial reports
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Pending Applications Card */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Pending Applications
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          {dashboardData?.pendingApplications || 0}
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-4 sm:px-6">
                        <div className="text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            View applications
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Recent Activity */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Recent Activity
                        </h3>
                      </div>
                      <div className="border-t border-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flow-root">
                            <ul className="-mb-8">
                              {(dashboardData?.recentActivity || []).map((activity: any, activityIdx: number) => (
                                <li key={activity.id}>
                                  <div className="relative pb-8">
                                    {activityIdx !== (dashboardData?.recentActivity || []).length - 1 ? (
                                      <span
                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                      />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                      <div>
                                        <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                          <svg
                                            className="h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                          </svg>
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            {activity.description}{' '}
                                            <a href="#" className="font-medium text-gray-900">
                                              {activity.subject}
                                            </a>
                                          </p>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                          <time dateTime={activity.datetime}>{activity.time}</time>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* System Changes */}
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Recent System Changes
                        </h3>
                      </div>
                      <div className="border-t border-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                          <div className="flow-root">
                            <ul className="-mb-8">
                              {(dashboardData?.recentChanges || []).map((change: any, changeIdx: number) => (
                                <li key={change.id}>
                                  <div className="relative pb-8">
                                    {changeIdx !== (dashboardData?.recentChanges || []).length - 1 ? (
                                      <span
                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                      />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                      <div>
                                        <span className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                          <svg
                                            className="h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            {change.description}{' '}
                                            <a href="#" className="font-medium text-gray-900">
                                              {change.component}
                                            </a>
                                          </p>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                          <time dateTime={change.datetime}>{change.time}</time>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminDashboardPage;
