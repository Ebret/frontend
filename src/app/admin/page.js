'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

/**
 * Admin Dashboard Page
 * 
 * Main dashboard for administrators with:
 * - Key metrics
 * - Quick links to common tasks
 * - Recent activity
 * - Pending approvals
 */
const AdminDashboardPage = () => {
  // Sample metrics data
  const metrics = [
    { name: 'Total Members', value: '1,254', change: '+12%', changeType: 'increase' },
    { name: 'Active Loans', value: '487', change: '+5%', changeType: 'increase' },
    { name: 'Total Deposits', value: '₱24.5M', change: '+8%', changeType: 'increase' },
    { name: 'Loan Disbursements (MTD)', value: '₱3.2M', change: '-3%', changeType: 'decrease' },
  ];
  
  // Sample quick links
  const quickLinks = [
    { name: 'Approve Loan Applications', href: '/admin/loans/approve', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Manage Rates & Fees', href: '/admin/rates', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
    { name: 'View Reports', href: '/admin/reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Add New Member', href: '/admin/members/new', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
  ];
  
  // Sample pending approvals
  const pendingApprovals = [
    { id: 1, type: 'Loan Application', name: 'Juan Dela Cruz', amount: '₱50,000', submittedAt: '2023-06-22 10:15:30' },
    { id: 2, type: 'Rate Change', name: 'Business Loan - 2 years', amount: '15% → 14.5%', submittedAt: '2023-06-22 11:30:45' },
    { id: 3, type: 'Membership Application', name: 'Maria Garcia', amount: '-', submittedAt: '2023-06-22 09:45:22' },
    { id: 4, type: 'Withdrawal Request', name: 'Pedro Santos', amount: '₱100,000', submittedAt: '2023-06-22 14:20:15' },
    { id: 5, type: 'Fee Change', name: 'Loan Processing Fee', amount: '1% → 0.8%', submittedAt: '2023-06-21 16:10:33' },
  ];
  
  // Sample recent activity
  const recentActivity = [
    { id: 1, action: 'Loan Approved', user: 'Maria Santos', target: 'Pedro Reyes - ₱30,000', timestamp: '2023-06-22 15:45:22' },
    { id: 2, action: 'Rate Updated', user: 'Juan Dela Cruz', target: 'Time Deposit - 1 year: 4.5% → 5%', timestamp: '2023-06-22 14:30:15' },
    { id: 3, action: 'Member Added', user: 'Maria Santos', target: 'Ana Lim', timestamp: '2023-06-22 13:15:45' },
    { id: 4, action: 'Withdrawal Processed', user: 'Pedro Reyes', target: 'Juan Garcia - ₱25,000', timestamp: '2023-06-22 11:45:30' },
    { id: 5, action: 'Fee Updated', user: 'Juan Dela Cruz', target: 'ATM Withdrawal Fee: ₱10 → ₱15', timestamp: '2023-06-22 10:20:15' },
  ];
  
  return (
    <AdminLayout>
      <div className="py-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Dashboard Overview</h2>
        
        {/* Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.name} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {metric.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {metric.value}
                </dd>
                <dd className={`mt-2 text-sm font-medium ${
                  metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change} from last month
                </dd>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick Links */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900">Quick Links</h3>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <div key={link.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <Link href={link.href} className="font-medium text-gray-900 hover:text-indigo-600">
                        {link.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Two-column layout for Pending Approvals and Recent Activity */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Pending Approvals */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
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
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingApprovals.map((item) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <Link href="/admin/approvals" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all approvals <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
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
                    {recentActivity.map((item) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                <Link href="/admin/activity" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                  View all activity <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
