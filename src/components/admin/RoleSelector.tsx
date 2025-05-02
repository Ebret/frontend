'use client';

import React, { useState } from 'react';
import { UserRole, roleDisplayNames, roleDescriptions, getPermissionsForRole, Permission } from '@/lib/roles';

interface RoleSelectorProps {
  selectedRole: UserRole;
  onChange: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onChange }) => {
  const [showPermissions, setShowPermissions] = useState(false);

  // Group permissions by category for better organization
  const permissionCategories = {
    'System Access': [
      Permission.MANAGE_USERS,
      Permission.MANAGE_ROLES,
      Permission.SYSTEM_CONFIGURATION,
      Permission.VIEW_AUDIT_LOGS,
    ],
    'Member Management': [
      Permission.VIEW_MEMBER_LIST,
      Permission.VIEW_MEMBER_DETAILS,
      Permission.CREATE_MEMBER,
      Permission.EDIT_MEMBER,
      Permission.DELETE_MEMBER,
    ],
    'Financial Operations': [
      Permission.VIEW_FINANCIAL_REPORTS,
      Permission.CREATE_JOURNAL_ENTRY,
      Permission.APPROVE_JOURNAL_ENTRY,
      Permission.MANAGE_GENERAL_LEDGER,
    ],
    'Loan Management': [
      Permission.VIEW_LOAN_APPLICATIONS,
      Permission.CREATE_LOAN_APPLICATION,
      Permission.PROCESS_LOAN_APPLICATION,
      Permission.APPROVE_LOAN,
      Permission.DISBURSE_LOAN,
    ],
    'Transaction Processing': [
      Permission.PROCESS_DEPOSITS,
      Permission.PROCESS_WITHDRAWALS,
      Permission.PROCESS_LOAN_PAYMENTS,
      Permission.PROCESS_TRANSFERS,
      Permission.MANAGE_CASH_DRAWER,
    ],
    'Compliance & Risk': [
      Permission.MANAGE_POLICIES,
      Permission.CONDUCT_AUDITS,
      Permission.MANAGE_RISK,
    ],
    'Marketing & Communications': [
      Permission.MANAGE_CAMPAIGNS,
      Permission.SEND_COMMUNICATIONS,
      Permission.MANAGE_CONTENT,
    ],
    'External Access': [
      Permission.ACCESS_API,
      Permission.EXCHANGE_DOCUMENTS,
    ],
  };

  // Get permissions for the selected role
  const rolePermissions = getPermissionsForRole(selectedRole);

  // Function to get a readable permission name
  const getPermissionDisplayName = (permission: Permission): string => {
    return permission
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <div className="mt-1">
          <select
            id="role"
            name="role"
            required
            value={selectedRole}
            onChange={(e) => onChange(e.target.value as UserRole)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {Object.entries(UserRole).map(([key, value]) => (
              <option key={key} value={value}>
                {roleDisplayNames[value as UserRole]}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {roleDescriptions[selectedRole]}
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowPermissions(!showPermissions)}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showPermissions ? 'Hide Permissions' : 'Show Permissions'}
          <svg
            className={`ml-2 -mr-0.5 h-4 w-4 transform transition-transform duration-200 ${
              showPermissions ? 'rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {showPermissions && (
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Permissions for {roleDisplayNames[selectedRole]}
          </h4>
          
          <div className="space-y-4">
            {Object.entries(permissionCategories).map(([category, permissions]) => {
              // Filter permissions that are granted to this role
              const grantedPermissions = permissions.filter(permission => 
                rolePermissions.includes(permission)
              );
              
              // Only show categories that have at least one granted permission
              if (grantedPermissions.length === 0) return null;
              
              return (
                <div key={category} className="border-t border-gray-200 pt-3">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">{category}</h5>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {grantedPermissions.map(permission => (
                      <li key={permission} className="flex items-center text-xs text-gray-600">
                        <svg 
                          className="h-4 w-4 text-green-500 mr-1" 
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
                        {getPermissionDisplayName(permission)}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <p>These permissions determine what actions this user can perform in the system.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSelector;
