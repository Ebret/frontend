'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';
import UnifiedDashboard from '@/components/admin/dashboard/UnifiedDashboard';
import { useCooperative } from '@/contexts/CooperativeContext';

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
  const { cooperativeType, isLoading: isCooperativeLoading } = useCooperative();
  const [financialPeriod, setFinancialPeriod] = useState('monthly');
  const [financialData, setFinancialData] = useState({
    revenue: {
      total: 0,
      previousPeriod: 0,
      byCategory: {},
    },
    expenses: {
      total: 0,
      previousPeriod: 0,
      byCategory: {},
    },
    profit: {
      total: 0,
      previousPeriod: 0,
    },
    transactions: {
      count: 0,
      previousPeriod: 0,
      byPaymentMethod: {},
    },
    topProducts: [],
  });

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

  // Fetch financial data
  useEffect(() => {
    const fetchFinancialData = async () => {
      // In a real app, this would be an API call
      // For now, we'll use mock data

      // Mock data for different periods
      const mockData = {
        monthly: {
          revenue: {
            total: 1250000,
            previousPeriod: 1150000,
            byCategory: {
              'Grocery': 625000,
              'Appliances': 312500,
              'Electronics': 187500,
              'Clothing': 125000,
            },
          },
          expenses: {
            total: 875000,
            previousPeriod: 805000,
            byCategory: {
              'Cost of Goods': 700000,
              'Salaries': 100000,
              'Utilities': 50000,
              'Rent': 25000,
            },
          },
          profit: {
            total: 375000,
            previousPeriod: 345000,
          },
          transactions: {
            count: 3250,
            previousPeriod: 3000,
            byPaymentMethod: {
              'Cash': 1950,
              'Credit Card': 975,
              'Mobile Payment': 325,
            },
          },
          topProducts: [
            { id: 1, name: 'Rice (25kg)', quantity: 500, revenue: 625000 },
            { id: 2, name: 'Cooking Oil (1L)', quantity: 1200, revenue: 144000 },
            { id: 3, name: 'Sugar (1kg)', quantity: 800, revenue: 52000 },
            { id: 4, name: 'Electric Fan', quantity: 50, revenue: 75000 },
            { id: 5, name: 'Rice Cooker', quantity: 30, revenue: 75000 },
          ],
        },
        weekly: {
          revenue: {
            total: 312500,
            previousPeriod: 287500,
            byCategory: {
              'Grocery': 156250,
              'Appliances': 78125,
              'Electronics': 46875,
              'Clothing': 31250,
            },
          },
          expenses: {
            total: 218750,
            previousPeriod: 201250,
            byCategory: {
              'Cost of Goods': 175000,
              'Salaries': 25000,
              'Utilities': 12500,
              'Rent': 6250,
            },
          },
          profit: {
            total: 93750,
            previousPeriod: 86250,
          },
          transactions: {
            count: 812,
            previousPeriod: 750,
            byPaymentMethod: {
              'Cash': 487,
              'Credit Card': 244,
              'Mobile Payment': 81,
            },
          },
          topProducts: [
            { id: 1, name: 'Rice (25kg)', quantity: 125, revenue: 156250 },
            { id: 2, name: 'Cooking Oil (1L)', quantity: 300, revenue: 36000 },
            { id: 3, name: 'Sugar (1kg)', quantity: 200, revenue: 13000 },
            { id: 4, name: 'Electric Fan', quantity: 12, revenue: 18000 },
            { id: 5, name: 'Rice Cooker', quantity: 7, revenue: 17500 },
          ],
        },
        daily: {
          revenue: {
            total: 44643,
            previousPeriod: 41071,
            byCategory: {
              'Grocery': 22321,
              'Appliances': 11161,
              'Electronics': 6696,
              'Clothing': 4464,
            },
          },
          expenses: {
            total: 31250,
            previousPeriod: 28750,
            byCategory: {
              'Cost of Goods': 25000,
              'Salaries': 3571,
              'Utilities': 1786,
              'Rent': 893,
            },
          },
          profit: {
            total: 13393,
            previousPeriod: 12321,
          },
          transactions: {
            count: 116,
            previousPeriod: 107,
            byPaymentMethod: {
              'Cash': 70,
              'Credit Card': 35,
              'Mobile Payment': 11,
            },
          },
          topProducts: [
            { id: 1, name: 'Rice (25kg)', quantity: 18, revenue: 22500 },
            { id: 2, name: 'Cooking Oil (1L)', quantity: 43, revenue: 5160 },
            { id: 3, name: 'Sugar (1kg)', quantity: 28, revenue: 1820 },
            { id: 4, name: 'Electric Fan', quantity: 2, revenue: 3000 },
            { id: 5, name: 'Rice Cooker', quantity: 1, revenue: 2500 },
          ],
        },
        yearly: {
          revenue: {
            total: 15000000,
            previousPeriod: 13800000,
            byCategory: {
              'Grocery': 7500000,
              'Appliances': 3750000,
              'Electronics': 2250000,
              'Clothing': 1500000,
            },
          },
          expenses: {
            total: 10500000,
            previousPeriod: 9660000,
            byCategory: {
              'Cost of Goods': 8400000,
              'Salaries': 1200000,
              'Utilities': 600000,
              'Rent': 300000,
            },
          },
          profit: {
            total: 4500000,
            previousPeriod: 4140000,
          },
          transactions: {
            count: 39000,
            previousPeriod: 36000,
            byPaymentMethod: {
              'Cash': 23400,
              'Credit Card': 11700,
              'Mobile Payment': 3900,
            },
          },
          topProducts: [
            { id: 1, name: 'Rice (25kg)', quantity: 6000, revenue: 7500000 },
            { id: 2, name: 'Cooking Oil (1L)', quantity: 14400, revenue: 1728000 },
            { id: 3, name: 'Sugar (1kg)', quantity: 9600, revenue: 624000 },
            { id: 4, name: 'Electric Fan', quantity: 600, revenue: 900000 },
            { id: 5, name: 'Rice Cooker', quantity: 360, revenue: 900000 },
          ],
        },
      };

      setFinancialData(mockData[financialPeriod]);
    };

    fetchFinancialData();
  }, [financialPeriod]);

  // Handle financial period change
  const handleFinancialPeriodChange = (period) => {
    setFinancialPeriod(period);
  };

  // Convert metrics to the format expected by UnifiedDashboard
  const formattedMetrics = {
    members: {
      value: metrics[0].value,
      change: metrics[0].change,
      changeType: metrics[0].changeType
    },
    loans: {
      value: metrics[1].value,
      change: metrics[1].change,
      changeType: metrics[1].changeType
    },
    deposits: {
      value: metrics[2].value,
      change: metrics[2].change,
      changeType: metrics[2].changeType
    },
    disbursements: {
      value: metrics[3].value,
      change: metrics[3].change,
      changeType: metrics[3].changeType
    }
  };

  return (
    <AdminLayout>
      <div className="py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="mt-4 sm:mt-0">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Export report"
            >
              <svg className="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900">Quick Links</h2>
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link, index) => (
              <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <Link href={link.href} className="text-base font-medium text-gray-900 hover:text-indigo-600">
                        {link.name}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unified Dashboard */}
        <UnifiedDashboard
          metrics={formattedMetrics}
          financialData={financialData}
          financialPeriod={financialPeriod}
          onFinancialPeriodChange={handleFinancialPeriodChange}
          pendingApprovals={pendingApprovals}
          recentActivity={recentActivity}
        />

        {/* View All Links */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="text-right">
            <Link href="/admin/approvals" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all approvals <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="text-right">
            <Link href="/admin/activity" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View all activity <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
