'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiHome, 
  FiCreditCard, 
  FiDollarSign, 
  FiUser, 
  FiFileText, 
  FiSettings,
  FiChevronRight,
  FiArrowUp,
  FiArrowDown,
  FiPlus,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import { useScreenSize } from '../common/ResponsiveWrapper';
import MobileNavigation from '../common/MobileNavigation';
import AccessibilityMenu from '../common/AccessibilityMenu';
import SkipToContent from '../common/SkipToContent';

/**
 * MemberDashboard Component
 * 
 * A mobile-optimized dashboard for cooperative members
 * 
 * @param {Object} props
 * @param {Object} props.user - User information
 * @param {Object} props.accountSummary - Account summary information
 * @param {Array} props.recentTransactions - Recent transactions
 * @param {Array} props.activeLoans - Active loans
 * @param {Array} props.notifications - Notifications
 * @param {React.ReactNode} props.children - Dashboard content
 */
const MemberDashboard = ({
  user = {},
  accountSummary = {},
  recentTransactions = [],
  activeLoans = [],
  notifications = [],
  children,
}) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  // Navigation items
  const navigationItems = [
    { label: 'Dashboard', href: '/member', icon: <FiHome /> },
    { label: 'Accounts', href: '/member/accounts', icon: <FiDollarSign /> },
    { label: 'Loans', href: '/member/loans', icon: <FiCreditCard /> },
    { label: 'Transactions', href: '/member/transactions', icon: <FiRefreshCw /> },
    { label: 'Documents', href: '/member/documents', icon: <FiFileText /> },
    { label: 'Profile', href: '/member/profile', icon: <FiUser /> },
    { label: 'Settings', href: '/member/settings', icon: <FiSettings /> },
  ];
  
  // Get notification status icon
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <FiAlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
      default:
        return <FiClock className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to content link for accessibility */}
      <SkipToContent contentId="main-content" />
      
      {/* Accessibility menu */}
      <AccessibilityMenu />
      
      {/* Mobile navigation */}
      <MobileNavigation
        items={navigationItems}
        logoAlt="Cooperative"
        sticky={true}
        rightContent={
          <div className="flex items-center">
            <Link
              href="/member/notifications"
              className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">View notifications</span>
              <div className="relative">
                <FiAlertCircle className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </div>
            </Link>
          </div>
        }
      />
      
      {/* Main content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user.firstName || 'Member'}
          </h1>
          <p className="text-sm text-gray-500">
            Member ID: {user.memberId || 'N/A'}
          </p>
        </div>
        
        {/* Account summary */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Account Summary</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Savings</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(accountSummary.totalSavings || 0)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Loans</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(accountSummary.totalLoans || 0)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Available Balance</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(accountSummary.availableBalance || 0)}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Next Payment Due</p>
                <p className="text-xl font-semibold text-gray-900">
                  {accountSummary.nextPaymentDue || 'No payment due'}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/member/transfer"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiArrowUp className="mr-2 -ml-0.5 h-4 w-4" />
                Transfer
              </Link>
              
              <Link
                href="/member/withdraw"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiArrowDown className="mr-2 -ml-0.5 h-4 w-4" />
                Withdraw
              </Link>
              
              <Link
                href="/member/deposit"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FiPlus className="mr-2 -ml-0.5 h-4 w-4" />
                Deposit
              </Link>
            </div>
          </div>
        </div>
        
        {/* Dashboard tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`
                  w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === 'overview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                aria-current={activeTab === 'overview' ? 'page' : undefined}
              >
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('transactions')}
                className={`
                  w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === 'transactions'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                aria-current={activeTab === 'transactions' ? 'page' : undefined}
              >
                Transactions
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`
                  w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                  ${activeTab === 'notifications'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                aria-current={activeTab === 'notifications' ? 'page' : undefined}
              >
                Notifications
                {notifications.length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    {notifications.length}
                  </span>
                )}
              </button>
            </nav>
          </div>
          
          <div className="p-4 sm:p-6">
            {/* Overview tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Active Loans</h3>
                
                {activeLoans.length === 0 ? (
                  <p className="text-gray-500">You have no active loans.</p>
                ) : (
                  <div className="space-y-4">
                    {activeLoans.map((loan) => (
                      <div key={loan.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">{loan.type}</h4>
                            <p className="text-sm text-gray-500">Loan ID: {loan.id}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            loan.status === 'Current' ? 'bg-green-100 text-green-800' :
                            loan.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {loan.status}
                          </span>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Principal</p>
                            <p className="font-medium">{formatCurrency(loan.principal)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Balance</p>
                            <p className="font-medium">{formatCurrency(loan.balance)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Next Payment</p>
                            <p className="font-medium">{formatCurrency(loan.nextPayment)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Due Date</p>
                            <p className="font-medium">{loan.dueDate}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Link
                            href={`/member/loans/${loan.id}`}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium flex items-center"
                          >
                            View Details
                            <FiChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 text-right">
                  <Link
                    href="/member/loans"
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View All Loans
                  </Link>
                </div>
              </div>
            )}
            
            {/* Transactions tab */}
            {activeTab === 'transactions' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
                
                {recentTransactions.length === 0 ? (
                  <p className="text-gray-500">No recent transactions.</p>
                ) : (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-base font-medium text-gray-900">{transaction.description}</h4>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                          <span className={`text-base font-medium ${
                            transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                          </span>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            {transaction.category} • {transaction.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 text-right">
                  <Link
                    href="/member/transactions"
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View All Transactions
                  </Link>
                </div>
              </div>
            )}
            
            {/* Notifications tab */}
            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                
                {notifications.length === 0 ? (
                  <p className="text-gray-500">No notifications.</p>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="ml-3">
                            <h4 className="text-base font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-500">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-6 text-right">
                  <Link
                    href="/member/notifications"
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional content */}
        {children}
      </main>
    </div>
  );
};

export default MemberDashboard;
