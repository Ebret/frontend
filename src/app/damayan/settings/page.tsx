'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import DamayanSettings from '@/components/damayan/DamayanSettings';
import { withAuth } from '@/utils/withAuth';

const DamayanSettingsPage = () => {
  const router = useRouter();
  const { config } = useWhiteLabel();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Damayan Settings</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Manage your Damayan contribution preferences
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <DamayanSettings />

        <div className="mt-6">
          <button
            onClick={() => router.push('/damayan')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Damayan Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DamayanSettingsPage);
