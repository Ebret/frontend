'use client';

import React from 'react';
import Layout from '@/components/Layout';
import DamayanAssistanceForm from '@/components/damayan/DamayanAssistanceForm';
import { withAuth } from '@/utils/withAuth';

const RequestAssistancePage = () => {
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Request Assistance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Submit a request for assistance from the Damayan fund
          </p>
          
          <div className="mt-6">
            <DamayanAssistanceForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(RequestAssistancePage);
