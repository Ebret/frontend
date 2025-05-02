'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, Permission } from '@/lib/roles';

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    users: false,
    finance: false,
    loans: false,
    members: false,
    reports: false,
    settings: false,
    development: false,
  });

  if (!user) return null;

  const toggleSection = (section: string) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const navItems = [
    {
      title: 'Dashboard',
      path: '/admin/dashboard',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
      permission: null,
    },
    {
      title: 'Users',
      section: 'users',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      permission: Permission.MANAGE_USERS,
      children: [
        {
          title: 'All Users',
          path: '/admin/users',
          permission: Permission.MANAGE_USERS,
        },
        {
          title: 'Create User',
          path: '/admin/users/create',
          permission: Permission.MANAGE_USERS,
        },
        {
          title: 'Roles & Permissions',
          path: '/admin/users/roles',
          permission: Permission.MANAGE_ROLES,
        },
      ],
    },
    {
      title: 'Members',
      section: 'members',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      permission: Permission.VIEW_MEMBER_LIST,
      children: [
        {
          title: 'All Members',
          path: '/admin/members',
          permission: Permission.VIEW_MEMBER_LIST,
        },
        {
          title: 'Add Member',
          path: '/admin/members/create',
          permission: Permission.CREATE_MEMBER,
        },
        {
          title: 'Member Types',
          path: '/admin/members/types',
          permission: Permission.SYSTEM_CONFIGURATION,
        },
      ],
    },
    {
      title: 'Loans',
      section: 'loans',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      permission: Permission.VIEW_LOAN_APPLICATIONS,
      children: [
        {
          title: 'Loan Applications',
          path: '/admin/loans/applications',
          permission: Permission.VIEW_LOAN_APPLICATIONS,
        },
        {
          title: 'Active Loans',
          path: '/admin/loans/active',
          permission: Permission.VIEW_LOAN_APPLICATIONS,
        },
        {
          title: 'Loan Products',
          path: '/admin/loans/products',
          permission: Permission.SYSTEM_CONFIGURATION,
        },
        {
          title: 'Loan Approvals',
          path: '/admin/loans/approvals',
          permission: Permission.APPROVE_LOAN,
        },
      ],
    },
    {
      title: 'Finance',
      section: 'finance',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      permission: Permission.VIEW_FINANCIAL_REPORTS,
      children: [
        {
          title: 'Transactions',
          path: '/admin/finance/transactions',
          permission: Permission.VIEW_FINANCIAL_REPORTS,
        },
        {
          title: 'General Ledger',
          path: '/admin/finance/ledger',
          permission: Permission.MANAGE_GENERAL_LEDGER,
        },
        {
          title: 'Financial Reports',
          path: '/admin/finance/reports',
          permission: Permission.VIEW_FINANCIAL_REPORTS,
        },
        {
          title: 'Cash Management',
          path: '/admin/finance/cash',
          permission: Permission.MANAGE_CASH_DRAWER,
        },
      ],
    },
    {
      title: 'Reports',
      section: 'reports',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      permission: Permission.VIEW_FINANCIAL_REPORTS,
      children: [
        {
          title: 'Member Reports',
          path: '/admin/reports/members',
          permission: Permission.VIEW_MEMBER_LIST,
        },
        {
          title: 'Loan Reports',
          path: '/admin/reports/loans',
          permission: Permission.VIEW_LOAN_APPLICATIONS,
        },
        {
          title: 'Financial Reports',
          path: '/admin/reports/financial',
          permission: Permission.VIEW_FINANCIAL_REPORTS,
        },
        {
          title: 'Audit Reports',
          path: '/admin/reports/audit',
          permission: Permission.VIEW_AUDIT_LOGS,
        },
      ],
    },
    {
      title: 'Marketing',
      section: 'marketing',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
          />
        </svg>
      ),
      permission: Permission.MANAGE_CAMPAIGNS,
      children: [
        {
          title: 'Campaigns',
          path: '/admin/marketing/campaigns',
          permission: Permission.MANAGE_CAMPAIGNS,
        },
        {
          title: 'Communications',
          path: '/admin/marketing/communications',
          permission: Permission.SEND_COMMUNICATIONS,
        },
        {
          title: 'Content',
          path: '/admin/marketing/content',
          permission: Permission.MANAGE_CONTENT,
        },
      ],
    },
    {
      title: 'Compliance',
      section: 'compliance',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      permission: Permission.CONDUCT_AUDITS,
      children: [
        {
          title: 'Audit Logs',
          path: '/admin/compliance/audit-logs',
          permission: Permission.VIEW_AUDIT_LOGS,
        },
        {
          title: 'Policies',
          path: '/admin/compliance/policies',
          permission: Permission.MANAGE_POLICIES,
        },
        {
          title: 'Risk Management',
          path: '/admin/compliance/risk',
          permission: Permission.MANAGE_RISK,
        },
      ],
    },
    {
      title: 'Settings',
      section: 'settings',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      permission: Permission.SYSTEM_CONFIGURATION,
      children: [
        {
          title: 'General Settings',
          path: '/admin/settings/general',
          permission: Permission.SYSTEM_CONFIGURATION,
        },
        {
          title: 'White Label',
          path: '/admin/settings/white-label',
          permission: Permission.SYSTEM_CONFIGURATION,
        },
        {
          title: 'Notifications',
          path: '/admin/settings/notifications',
          permission: Permission.SYSTEM_CONFIGURATION,
        },
        {
          title: 'API & Integrations',
          path: '/admin/settings/api',
          permission: Permission.SYSTEM_CONFIGURATION,
        },
      ],
    },
    {
      title: 'Development',
      section: 'development',
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      permission: Permission.SYSTEM_CONFIGURATION,
      children: [
        {
          title: 'Test Users',
          path: '/admin/test-users',
          permission: Permission.SYSTEM_CONFIGURATION,
        },
      ],
    },
  ];

  const renderNavItem = (item: any) => {
    // Check if user has permission to see this item
    if (item.permission && !hasPermission(user.role, item.permission)) {
      return null;
    }

    // If item has children, render as expandable section
    if (item.children) {
      // Check if user has permission to see any of the children
      const hasPermissionForAnyChild = item.children.some(
        (child: any) => !child.permission || hasPermission(user.role, child.permission)
      );

      if (!hasPermissionForAnyChild) {
        return null;
      }

      return (
        <div key={item.title} className="space-y-1">
          <button
            onClick={() => toggleSection(item.section)}
            className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              isActive(item.path)
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="mr-3 text-gray-500">{item.icon}</span>
            {item.title}
            <svg
              className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${
                expanded[item.section] ? 'rotate-90' : ''
              }`}
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
          {expanded[item.section] && (
            <div className="space-y-1 pl-10">
              {item.children.map((child: any) => {
                if (child.permission && !hasPermission(user.role, child.permission)) {
                  return null;
                }
                return (
                  <Link
                    key={child.title}
                    href={child.path}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(child.path)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {child.title}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Otherwise render as a simple link
    return (
      <Link
        key={item.title}
        href={item.path}
        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
          isActive(item.path)
            ? 'bg-gray-100 text-gray-900'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <span className="mr-3 text-gray-500">{item.icon}</span>
        {item.title}
      </Link>
    );
  };

  return (
    <div className="h-full flex flex-col border-r border-gray-200 bg-white overflow-y-auto">
      <div className="flex-grow flex flex-col">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navItems.map(renderNavItem)}
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
