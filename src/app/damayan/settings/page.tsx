'use client';

import React from 'react';
import Layout from '@/components/Layout';
import DamayanSettings from '@/components/damayan/DamayanSettings';
import { withAuth } from '@/utils/withAuth';

const DamayanSettingsPage = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Damayan Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Damayan contribution preferences
          </p>
          
          <div className="mt-6">
            <DamayanSettings />
          </div>
          
          <div className="mt-6">
            <a
              href="/damayan"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Damayan Dashboard
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(DamayanSettingsPage);
