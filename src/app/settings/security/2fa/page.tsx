'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { api } from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';

const TwoFactorSetupPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { config } = useWhiteLabel();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [step, setStep] = useState<'initial' | 'setup' | 'verify' | 'complete' | 'disable'>('initial');

  useEffect(() => {
    // Check if 2FA is already enabled
    if (user?.twoFactorEnabled) {
      setStep('disable');
    } else {
      setStep('initial');
    }
  }, [user]);

  const handleEnable2FA = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.enable2FA();
      setQrCodeUrl(response.data.qrCodeUrl);
      setSecret(response.data.secret);
      setStep('setup');
    } catch (err: any) {
      setError(err.message || 'Failed to enable 2FA. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.verify2FASetup(verificationCode);
      setBackupCodes(response.data.backupCodes);
      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await api.disable2FA(verificationCode);
      setSuccess('Two-factor authentication has been disabled successfully.');
      setStep('initial');
      
      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Invalid verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderInitialStep = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
      <p className="mt-1 text-sm text-gray-600">
        Add an extra layer of security to your account by enabling two-factor authentication.
      </p>
      <div className="mt-4">
        <button
          type="button"
          onClick={handleEnable2FA}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: config.primaryColor }}
        >
          {isLoading ? 'Enabling...' : 'Enable 2FA'}
        </button>
      </div>
    </div>
  );

  const renderSetupStep = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Set Up Two-Factor Authentication</h3>
      <p className="mt-1 text-sm text-gray-600">
        Scan the QR code below with your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator).
      </p>
      
      <div className="mt-4 flex justify-center">
        {qrCodeUrl && (
          <div className="p-4 bg-white border border-gray-300 rounded-md">
            <Image
              src={qrCodeUrl}
              alt="QR Code for 2FA"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          If you can't scan the QR code, you can manually enter this secret key in your authenticator app:
        </p>
        <div className="mt-2 p-2 bg-gray-100 rounded-md font-mono text-sm break-all">
          {secret}
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setStep('verify')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: config.primaryColor }}
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderVerifyStep = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Verify Two-Factor Authentication</h3>
      <p className="mt-1 text-sm text-gray-600">
        Enter the verification code from your authenticator app to complete the setup.
      </p>
      
      <form className="mt-4 space-y-6" onSubmit={handleVerify2FA}>
        <div>
          <label
            htmlFor="verificationCode"
            className="block text-sm font-medium text-gray-700"
          >
            Verification Code
          </label>
          <div className="mt-1">
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              autoComplete="one-time-code"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter 6-digit code"
              maxLength={6}
              autoFocus
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: config.primaryColor }}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderCompleteStep = () => (
    <div>
      <div className="flex items-center justify-center">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg
            className="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
      
      <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Two-Factor Authentication Enabled</h3>
      <p className="mt-1 text-sm text-gray-600 text-center">
        Your account is now protected with two-factor authentication.
      </p>
      
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900">Backup Codes</h4>
        <p className="mt-1 text-sm text-gray-600">
          Save these backup codes in a secure place. You can use them to sign in if you lose access to your authenticator app.
        </p>
        
        <div className="mt-2 p-4 bg-gray-100 rounded-md">
          <div className="grid grid-cols-2 gap-2">
            {backupCodes.map((code, index) => (
              <div key={index} className="font-mono text-sm">
                {code}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              const codesText = backupCodes.join('\n');
              navigator.clipboard.writeText(codesText);
              setSuccess('Backup codes copied to clipboard');
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Copy Codes
          </button>
        </div>
      </div>
      
      <div className="mt-6">
        <button
          type="button"
          onClick={() => router.push('/settings/security')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ backgroundColor: config.primaryColor }}
        >
          Done
        </button>
      </div>
    </div>
  );

  const renderDisableStep = () => (
    <div>
      <h3 className="text-lg font-medium text-gray-900">Disable Two-Factor Authentication</h3>
      <p className="mt-1 text-sm text-gray-600">
        Enter the verification code from your authenticator app to disable two-factor authentication.
      </p>
      
      <form className="mt-4 space-y-6" onSubmit={handleDisable2FA}>
        <div>
          <label
            htmlFor="verificationCode"
            className="block text-sm font-medium text-gray-700"
          >
            Verification Code
          </label>
          <div className="mt-1">
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              autoComplete="one-time-code"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter 6-digit code"
              maxLength={6}
              autoFocus
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            {isLoading ? 'Disabling...' : 'Disable 2FA'}
          </button>
        </div>
      </form>
    </div>
  );

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
                <div className="max-w-md mx-auto bg-white shadow overflow-hidden sm:rounded-lg">
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

                    {success && (
                      <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-green-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">{success}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 'initial' && renderInitialStep()}
                    {step === 'setup' && renderSetupStep()}
                    {step === 'verify' && renderVerifyStep()}
                    {step === 'complete' && renderCompleteStep()}
                    {step === 'disable' && renderDisableStep()}
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

export default TwoFactorSetupPage;
