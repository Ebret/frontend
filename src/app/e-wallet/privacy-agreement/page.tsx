'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { useAuth } from '@/contexts/AuthContext';
import DataPrivacyFooter from '@/components/DataPrivacyFooter';
import { logDataPrivacyAgreementAccepted } from '@/lib/auditLogger';

const EWalletPrivacyAgreementPage: React.FC = () => {
  const router = useRouter();
  const { config } = useWhiteLabel();
  const { user } = useAuth();
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const eWalletName = `${config.name} E-Wallet`;
  const effectiveDate = "April 30, 2025";

  const handleAgree = async () => {
    if (!isAgreed) {
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would call the API to record the user's consent
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Log the data privacy agreement acceptance if user is logged in
      if (user) {
        await logDataPrivacyAgreementAccepted(
          {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          },
          'e-wallet'
        );
      }

      // Redirect to the next step
      router.push('/e-wallet/register');
    } catch (error) {
      console.error('Error recording consent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Data Privacy Agreement
              </h1>
              <img
                src="/images/ph-data-privacy-logo.svg"
                alt="Philippines Data Privacy Act Logo"
                className="h-16 w-16"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              For {eWalletName} • Effective Date: {effectiveDate}
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
                          This privacy agreement is in compliance with Republic Act No. 10173, also known as the Data Privacy Act of 2012, and its Implementing Rules and Regulations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <h2>1. Introduction</h2>
                    <p>
                      {eWalletName} ("we," "our," or "us") values your privacy and is committed to protecting your personal data. This Data Privacy Agreement outlines how we collect, use, store, and disclose your personal information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations.
                    </p>

                    <h2>2. Collection and Use of Personal Data</h2>
                    <p>
                      We collect and process your personal data to:
                    </p>
                    <ul>
                      <li>Create and manage your e-wallet account: This includes verifying your identity and ensuring compliance with legal requirements.</li>
                      <li>Facilitate transactions: Such as sending or receiving money, paying bills, and purchasing goods or services.</li>
                      <li>Enhance user experience: By analyzing usage patterns to improve our services.</li>
                    </ul>
                    <p>
                      The personal data we collect may include:
                    </p>
                    <ul>
                      <li>Full name</li>
                      <li>Date of birth</li>
                      <li>Address</li>
                      <li>Contact information (e.g., phone number, email address)</li>
                      <li>Government-issued identification details</li>
                      <li>Financial information necessary for transactions</li>
                    </ul>

                    <h2>3. Data Sharing and Disclosure</h2>
                    <p>
                      We may share your personal data with third parties, including:
                    </p>
                    <ul>
                      <li>Service providers: Who assist in operating our platform and providing services to you.</li>
                      <li>Regulatory authorities: To comply with legal obligations, such as anti-money laundering laws.</li>
                    </ul>
                    <p>
                      All third parties are required to handle your data in accordance with this agreement and applicable laws.
                    </p>

                    <h2>4. Data Protection Measures</h2>
                    <p>
                      We implement appropriate organizational, technical, and physical security measures to safeguard your personal data against unauthorized access, disclosure, alteration, or destruction.
                    </p>

                    <h2>5. Data Retention</h2>
                    <p>
                      Your personal data will be retained only for as long as necessary to fulfill the purposes outlined in this agreement, unless a longer retention period is required or permitted by law.
                    </p>

                    <h2>6. Your Rights</h2>
                    <p>
                      Under the Data Privacy Act, you have the right to:
                    </p>
                    <ul>
                      <li><strong>Access:</strong> Request access to your personal data.</li>
                      <li><strong>Correction:</strong> Request correction of inaccurate or outdated data.</li>
                      <li><strong>Erasure:</strong> Request deletion of your data under certain circumstances.</li>
                      <li><strong>Object:</strong> Object to the processing of your data.</li>
                      <li><strong>Data Portability:</strong> Obtain a copy of your data in a commonly used format.</li>
                    </ul>
                    <p>
                      To exercise these rights, please contact our Data Protection Officer at:
                    </p>
                    <p>
                      <strong>Email:</strong> dpo@{config.domain}<br />
                      <strong>Address:</strong> {config.address || '[Insert Physical Address]'}
                    </p>

                    <h2>7. Consent</h2>
                    <p>
                      By checking the box below and clicking the "Agree" button, you acknowledge that you have read, understood, and consented to the terms of this Data Privacy Agreement.
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-start mb-6">
                      <div className="flex items-center h-5">
                        <input
                          id="privacy-agreement"
                          name="privacy-agreement"
                          type="checkbox"
                          checked={isAgreed}
                          onChange={(e) => setIsAgreed(e.target.checked)}
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="privacy-agreement" className="font-medium text-gray-700">
                          I have read and agree to the Data Privacy Agreement.
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAgree}
                        disabled={!isAgreed || isSubmitting}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          'Agree'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <DataPrivacyFooter />
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default EWalletPrivacyAgreementPage;
