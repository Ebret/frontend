'use client';

import React from 'react';
import Layout from '@/components/Layout';
import AdminSidebar from '@/components/AdminSidebar';
import AuditLogViewer from '@/components/admin/AuditLogViewer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Permission } from '@/lib/roles';
import DataPrivacyFooter from '@/components/DataPrivacyFooter';

const AuditLogsPage: React.FC = () => {
  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_AUDIT_LOGS}>
      <Layout sidebar={<AdminSidebar />}>
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Audit Logs</h1>
              <p className="mt-2 text-sm text-gray-500">
                View a detailed history of user management activities and system changes
              </p>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <AuditLogViewer />

                <div className="mt-8">
                  <DataPrivacyFooter />
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AuditLogsPage;
