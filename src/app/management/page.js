'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiUsers, FiDollarSign, FiDatabase, FiBox, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';
import Link from 'next/link';

/**
 * Management Dashboard
 * 
 * Unified dashboard for Admin, GM, and Manager roles with:
 * - Key performance indicators
 * - Quick access to main management functions
 * - Pending approvals and tasks
 * - System health indicators
 */
const ManagementDashboard = () => {
  // State for user role (would come from auth context in a real app)
  const [userRole, setUserRole] = useState('admin');
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    kpis: {},
    pendingApprovals: [],
    recentActivities: [],
    alerts: []
  });
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/management/dashboard');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = {
          kpis: {
            totalMembers: 1245,
            activeLoans: 487,
            totalDeposits: 24500000,
            collateralValue: 35750000,
            pendingApprovals: 12,
            atRiskLoans: 18,
            upcomingMaturities: 24
          },
          pendingApprovals: [
            { id: 1, type: 'loan', name: 'Juan Dela Cruz', amount: 50000, submittedAt: '2023-06-22T10:15:30Z', priority: 'high' },
            { id: 2, type: 'collateral', name: 'Property Verification', amount: 1500000, submittedAt: '2023-06-22T11:30:45Z', priority: 'medium' },
            { id: 3, type: 'member', name: 'Maria Garcia', amount: null, submittedAt: '2023-06-22T09:45:22Z', priority: 'low' },
            { id: 4, type: 'withdrawal', name: 'Pedro Santos', amount: 100000, submittedAt: '2023-06-22T14:20:15Z', priority: 'high' },
            { id: 5, type: 'rate_change', name: 'Loan Processing Fee', amount: null, submittedAt: '2023-06-21T16:10:33Z', priority: 'medium' }
          ],
          recentActivities: [
            { id: 1, action: 'Loan Approved', user: 'Maria Santos', target: 'Pedro Reyes - ₱30,000', timestamp: '2023-06-22T15:45:22Z' },
            { id: 2, action: 'Rate Updated', user: 'Juan Dela Cruz', target: 'Time Deposit - 1 year: 4.5% → 5%', timestamp: '2023-06-22T14:30:15Z' },
            { id: 3, action: 'Member Added', user: 'Maria Santos', target: 'Ana Lim', timestamp: '2023-06-22T13:15:45Z' },
            { id: 4, action: 'Collateral Verified', user: 'Pedro Reyes', target: 'Commercial Property - ₱2,500,000', timestamp: '2023-06-22T11:45:30Z' },
            { id: 5, action: 'Deposit Matured', user: 'System', target: 'Juan Garcia - ₱100,000', timestamp: '2023-06-22T10:20:15Z' }
          ],
          alerts: [
            { id: 1, type: 'risk', message: 'Loan delinquency rate increased by 2% this month', level: 'warning' },
            { id: 2, type: 'compliance', message: 'Quarterly compliance report due in 5 days', level: 'info' },
            { id: 3, type: 'system', message: 'Database backup completed successfully', level: 'success' },
            { id: 4, type: 'security', message: '3 failed login attempts for admin account', level: 'danger' }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-PH', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get alert badge class
  const getAlertBadgeClass = (level) => {
    switch (level) {
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Quick access links based on user role
  const getQuickAccessLinks = () => {
    const commonLinks = [
      { name: 'Member Management', href: '/management/members', icon: FiUsers, description: 'Manage member accounts and information' },
      { name: 'Loan Management', href: '/management/loans', icon: FiDollarSign, description: 'Process and manage loan applications' },
      { name: 'Deposit Management', href: '/management/deposits', icon: FiDatabase, description: 'Manage savings and time deposits' },
      { name: 'Collateral Management', href: '/management/collateral', icon: FiBox, description: 'Track and verify collateral items' }
    ];
    
    // Add role-specific links
    if (userRole === 'admin') {
      return [
        ...commonLinks,
        { name: 'System Settings', href: '/admin/settings', icon: FiClock, description: 'Configure system parameters and settings' }
      ];
    } else if (userRole === 'gm') {
      return [
        ...commonLinks,
        { name: 'Performance Reports', href: '/management/reports', icon: FiCheckCircle, description: 'View detailed performance metrics' }
      ];
    } else {
      return commonLinks;
    }
  };
  
  return (
    <AdminLayout>
      <div className="py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Management Dashboard</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                      <FiUsers className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                        <dd className="text-lg font-semibold text-gray-900">{dashboardData.kpis.totalMembers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/management/members" className="font-medium text-blue-700 hover:text-blue-900">View all members</Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                      <FiDollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Loans</dt>
                        <dd className="text-lg font-semibold text-gray-900">{dashboardData.kpis.activeLoans}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/management/loans" className="font-medium text-blue-700 hover:text-blue-900">View all loans</Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                      <FiDatabase className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Deposits</dt>
                        <dd className="text-lg font-semibold text-gray-900">{formatCurrency(dashboardData.kpis.totalDeposits)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/management/deposits" className="font-medium text-blue-700 hover:text-blue-900">View all deposits</Link>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                      <FiBox className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Collateral Value</dt>
                        <dd className="text-lg font-semibold text-gray-900">{formatCurrency(dashboardData.kpis.collateralValue)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <Link href="/management/collateral" className="font-medium text-blue-700 hover:text-blue-900">View all collateral</Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Access Links */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Access</h3>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {getQuickAccessLinks().map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                          <link.icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <h4 className="text-base font-medium text-gray-900">{link.name}</h4>
                          <p className="mt-1 text-sm text-gray-500">{link.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Two-column layout for Pending Approvals and Recent Activity */}
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {/* Pending Approvals */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Items requiring your attention
                    </p>
                  </div>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {dashboardData.pendingApprovals.length} pending
                  </span>
                </div>
                <div className="border-t border-gray-200">
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
                            Priority
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {dashboardData.pendingApprovals.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.name}
                              {item.amount && ` - ${formatCurrency(item.amount)}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(item.priority)}`}>
                                {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(item.submittedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <Link href="/management/approvals" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                      View all approvals <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Latest actions in the system
                  </p>
                </div>
                <div className="border-t border-gray-200">
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
                        {dashboardData.recentActivities.map((item) => (
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
                              {formatDate(item.timestamp)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                    <Link href="/management/activity" className="text-sm font-medium text-blue-700 hover:text-blue-900">
                      View all activity <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* System Alerts */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Alerts</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                  {dashboardData.alerts.map((alert) => (
                    <li key={alert.id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                            alert.level === 'danger' ? 'bg-red-100' :
                            alert.level === 'warning' ? 'bg-yellow-100' :
                            alert.level === 'info' ? 'bg-blue-100' : 'bg-green-100'
                          }`}>
                            <FiAlertTriangle className={`h-5 w-5 ${
                              alert.level === 'danger' ? 'text-red-600' :
                              alert.level === 'warning' ? 'text-yellow-600' :
                              alert.level === 'info' ? 'text-blue-600' : 'text-green-600'
                            }`} />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                            <p className="text-sm text-gray-500">{alert.type.replace(/\b\w/g, l => l.toUpperCase())} Alert</p>
                          </div>
                        </div>
                        <div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getAlertBadgeClass(alert.level)}`}>
                            {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManagementDashboard;
