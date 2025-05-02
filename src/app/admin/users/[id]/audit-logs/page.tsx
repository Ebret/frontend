'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import AdminSidebar from '@/components/AdminSidebar';
import AuditLogViewer from '@/components/admin/AuditLogViewer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Permission } from '@/lib/roles';
import { api } from '@/lib/api';

const UserAuditLogsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id ? parseInt(params.id as string, 10) : undefined;
  
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) {
        setError('Invalid user ID');
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await api.getUser(userId);
        setUser(response.data.user);
      } catch (err: any) {
        setError(err.message || 'Failed to load user');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_AUDIT_LOGS}>
      <Layout sidebar={<AdminSidebar />}>
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="mr-4 text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-3xl font-bold leading-tight text-gray-900">
                    {isLoading ? 'Loading...' : user ? `Audit Logs: ${user.firstName} ${user.lastName}` : 'User Not Found'}
                  </h1>
                  {user && (
                    <p className="mt-1 text-sm text-gray-500">
                      {user.email} • User ID: {user.id}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                {error ? (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
                ) : isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : user ? (
                  <AuditLogViewer userId={userId} />
                ) : null}
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default UserAuditLogsPage;
