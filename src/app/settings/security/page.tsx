'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import ProtectedRoute from '@/components/ProtectedRoute';

const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { config } = useWhiteLabel();

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Security Settings</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Security Options</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Manage your account security settings.
                    </p>
                  </div>
                  <div className="border-t border-gray-200">
                    <dl>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Email Verification</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {user?.emailVerified ? 'Verified' : 'Not Verified'}
                              </span>
                              <p className="mt-1 text-sm text-gray-500">
                                {user?.emailVerified
                                  ? 'Your email address has been verified.'
                                  : 'Please verify your email address to access all features.'}
                              </p>
                            </div>
                            {!user?.emailVerified && (
                              <Link
                                href="/verify-email"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{ backgroundColor: config.primaryColor }}
                              >
                                Verify Email
                              </Link>
                            )}
                          </div>
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Two-Factor Authentication</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user?.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                              </span>
                              <p className="mt-1 text-sm text-gray-500">
                                {user?.twoFactorEnabled
                                  ? 'Your account is protected with two-factor authentication.'
                                  : 'Add an extra layer of security to your account by enabling two-factor authentication.'}
                              </p>
                            </div>
                            <Link
                              href="/settings/security/2fa"
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              {user?.twoFactorEnabled ? 'Manage 2FA' : 'Enable 2FA'}
                            </Link>
                          </div>
                        </dd>
                      </div>
                      <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Password</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">
                                Change your password regularly to keep your account secure.
                              </p>
                            </div>
                            <Link
                              href="/settings/security/change-password"
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              Change Password
                            </Link>
                          </div>
                        </dd>
                      </div>
                      <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">Login History</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">
                                View your recent login activity.
                              </p>
                            </div>
                            <Link
                              href="/settings/security/login-history"
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                              style={{ backgroundColor: config.primaryColor }}
                            >
                              View History
                            </Link>
                          </div>
                        </dd>
                      </div>
                    </dl>
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

export default SecuritySettingsPage;
