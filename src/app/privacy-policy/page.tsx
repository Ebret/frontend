'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import DataPrivacyAgreement from '@/components/DataPrivacyAgreement';

const PrivacyPolicyPage: React.FC = () => {
  const { config } = useWhiteLabel();

  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Privacy Policy</h1>
              <img
                src="/images/dpo-dps-logo.png"
                alt="DPO/DPS Registered"
                className="h-24 w-20"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Our commitment to protecting your personal information
            </p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="mb-6 bg-blue-50 p-4 rounded-md border-l-4 border-blue-500">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-blue-700">
                          This privacy policy is in compliance with Republic Act No. 10173, also known as the Data Privacy Act of 2012, and its Implementing Rules and Regulations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p>
                      At {config.name}, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you use our services.
                    </p>

                    <p>
                      For the complete details of our data privacy practices, please review our Data Privacy Agreement:
                    </p>

                    <div className="my-6 flex justify-center">
                      <DataPrivacyAgreement cooperativeName={config.name} />
                    </div>

                    <h2>Contact Us</h2>
                    <p>
                      If you have any questions or concerns about our Privacy Policy or data practices, please contact our Data Protection Officer:
                    </p>

                    <div className="bg-gray-50 p-4 rounded-md">
                      <p><strong>Data Protection Officer</strong><br />
                      Email: dpo@{config.domain}<br />
                      Phone: {config.contactPhone || '+63 XXX XXX XXXX'}<br />
                      Address: {config.address || 'Main Office Address'}</p>
                    </div>

                    <p className="text-sm text-gray-500 mt-8">
                      Last updated: {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;
