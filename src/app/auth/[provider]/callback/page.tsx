'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

const SocialLoginCallbackPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const provider = params.provider as string;
        const code = searchParams?.get('code');
        
        if (!code) {
          setError('No authorization code provided');
          setIsLoading(false);
          return;
        }
        
        const response = await api.handleSocialLoginCallback(provider, code);
        
        if (response.data?.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Redirect to dashboard
          router.push('/dashboard');
        } else {
          setError('Failed to authenticate with social provider');
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to authenticate with social provider');
        setIsLoading(false);
      }
    };

    if (!isAuthenticated) {
      handleCallback();
    } else {
      router.push('/dashboard');
    }
  }, [params, searchParams, router, isAuthenticated]);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Social Login
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {isLoading ? (
              <div className="flex justify-center">
                <div 
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
                  role="status"
                  aria-label="Loading"
                >
                  <span className="sr-only">Authenticating...</span>
                </div>
                <p className="ml-3 text-sm text-gray-500">Completing authentication...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
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
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => router.push('/login')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Back to login
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SocialLoginCallbackPage;
