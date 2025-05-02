'use client';

import React, { useState } from 'react';

interface TestUser {
  role: string;
  email: string;
  description: string;
}

const testUsers: TestUser[] = [
  {
    role: 'Admin / System Administrator',
    email: 'admin@kacooperatiba.com',
    description: 'Has full access to all system features and settings',
  },
  {
    role: 'Board of Directors',
    email: 'director@kacooperatiba.com',
    description: 'Can view reports, approve high-value loans, and make strategic decisions',
  },
  {
    role: 'General Manager',
    email: 'manager@kacooperatiba.com',
    description: 'Oversees daily operations and has access to most system features',
  },
  {
    role: 'Credit Officer',
    email: 'credit@kacooperatiba.com',
    description: 'Processes loan applications and manages loan portfolios',
  },
  {
    role: 'Accountant',
    email: 'accountant@kacooperatiba.com',
    description: 'Manages financial records, general ledger, and financial reports',
  },
  {
    role: 'Teller',
    email: 'teller@kacooperatiba.com',
    description: 'Handles cash transactions, deposits, and withdrawals',
  },
  {
    role: 'Compliance Officer',
    email: 'compliance@kacooperatiba.com',
    description: 'Ensures regulatory compliance and conducts internal audits',
  },
  {
    role: 'Regular Member',
    email: 'member@kacooperatiba.com',
    description: 'A standard cooperative member who can apply for loans and manage their accounts',
  },
  {
    role: 'Membership Officer',
    email: 'membership@kacooperatiba.com',
    description: 'Manages member applications and member information',
  },
  {
    role: 'Security Manager',
    email: 'security@kacooperatiba.com',
    description: 'Manages security settings and audit logs',
  },
  {
    role: 'Marketing Officer',
    email: 'marketing@kacooperatiba.com',
    description: 'Manages marketing campaigns and communications',
  },
  {
    role: 'Partner/Third-Party User',
    email: 'partner@kacooperatiba.com',
    description: 'External partner with limited access to specific features',
  },
];

const TestUsersList: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white px-4 py-3">
        <h2 className="text-lg font-semibold">Test Users</h2>
        <p className="text-sm">All users have the same password: <span className="font-mono bg-blue-700 px-2 py-1 rounded">Password123!</span></p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testUsers.map((user) => (
              <tr key={user.email} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => copyToClipboard(user.email)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {copiedEmail === user.email ? 'Copied!' : 'Copy Email'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-4 py-3 text-sm text-gray-500">
        <p>These test users are for development purposes only. Do not use in production.</p>
      </div>
    </div>
  );
};

export default TestUsersList;
