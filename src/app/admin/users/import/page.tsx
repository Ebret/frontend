'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/AdminSidebar';
import BulkUserImport from '@/components/admin/BulkUserImport';
import { Permission, UserRole } from '@/lib/roles';
import { logBulkUserImport } from '@/lib/auditLogger';
import DataPrivacyFooter from '@/components/DataPrivacyFooter';

const BulkUserImportPage: React.FC = () => {
  const router = useRouter();
  const { config } = useWhiteLabel();
  const { user: currentUser } = useAuth();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [showImportSummary, setShowImportSummary] = useState(false);

  const handleImport = async (users: any[]) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // In a real app, this would call the API to import users
      const response = await api.importUsers(users);

      // Count users by role for audit logging
      const userRoles: Record<UserRole, number> = Object.values(UserRole).reduce((acc, role) => {
        acc[role as UserRole] = 0;
        return acc;
      }, {} as Record<UserRole, number>);

      // Count users by role
      users.forEach(user => {
        if (user.role && userRoles[user.role as UserRole] !== undefined) {
          userRoles[user.role as UserRole]++;
        }
      });

      // Log the bulk import in the audit log
      if (currentUser) {
        await logBulkUserImport(
          {
            id: currentUser.id,
            email: currentUser.email,
            name: `${currentUser.firstName} ${currentUser.lastName}`,
          },
          {
            totalCount: users.length,
            successCount: response.data.successCount || users.length,
            failureCount: response.data.failureCount || 0,
            passwordSetupMethod: users[0].passwordSetupMethod || 'email',
            userRoles,
          }
        );
      }

      setImportedCount(users.length);
      setSuccess(`Successfully imported ${users.length} users.`);
      setShowImportSummary(true);
    } catch (err: any) {
      setError(err.message || 'Failed to import users. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredPermission={Permission.MANAGE_USERS}>
      <Layout sidebar={<AdminSidebar />}>
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Bulk User Import</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    {error && (
                      <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
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
                    )}

                    {showImportSummary ? (
                      <div className="text-center py-12">
                        <svg
                          className="mx-auto h-12 w-12 text-green-500"
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
                        <h3 className="mt-2 text-lg font-medium text-gray-900">Import Successful</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {importedCount} users have been successfully imported.
                        </p>
                        <div className="mt-6 flex justify-center space-x-4">
                          <button
                            type="button"
                            onClick={() => {
                              setShowImportSummary(false);
                              setSuccess('');
                            }}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Import More Users
                          </button>
                          <button
                            type="button"
                            onClick={() => router.push('/admin/users')}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            View All Users
                          </button>
                        </div>
                      </div>
                    ) : (
                      <BulkUserImport
                        onImport={handleImport}
                        onCancel={() => router.push('/admin/users')}
                      />
                    )}

                    <div className="mt-8">
                      <DataPrivacyFooter />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default BulkUserImportPage;
