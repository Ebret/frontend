'use client';

import React from 'react';
import Layout from '@/components/Layout';
import DamayanDashboard from '@/components/damayan/DamayanDashboard';
import { withAuth } from '@/utils/withAuth';

const DamayanPage = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Damayan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Community support for members in need
          </p>
          
          <div className="mt-6">
            <DamayanDashboard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(DamayanPage);
