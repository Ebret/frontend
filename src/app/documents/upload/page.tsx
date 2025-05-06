'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import Layout from '@/components/Layout';
import DocumentUploadContainer from '@/components/documents/DocumentUploadContainer';
import { Spinner } from '@/components/ui';
import Link from 'next/link';

const DocumentUploadPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { config } = useWhiteLabel();
  const [entityType, setEntityType] = useState<'loan' | 'member' | 'savings'>('loan');
  const [allDocumentsUploaded, setAllDocumentsUploaded] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" color="primary" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You need to be logged in to upload documents.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ backgroundColor: config?.primaryColor }}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div>
                  <Link href="/" className="text-gray-400 hover:text-gray-500">
                    <svg
                      className="flex-shrink-0 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="sr-only">Home</span>
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <Link
                    href="/documents"
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Documents
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span
                    className="ml-4 text-sm font-medium text-gray-500"
                    aria-current="page"
                  >
                    Upload
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-lg leading-6 font-medium text-gray-900">Document Upload</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Upload required documents for your application.
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="mb-6">
              <label htmlFor="entityType" className="block text-sm font-medium text-gray-700">
                Document Category
              </label>
              <select
                id="entityType"
                name="entityType"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as any)}
              >
                <option value="loan">Loan Application</option>
                <option value="member">Membership</option>
                <option value="savings">Savings Account</option>
              </select>
            </div>
            
            <DocumentUploadContainer
              entityType={entityType}
              onComplete={setAllDocumentsUploaded}
            />
            
            <div className="mt-8 flex justify-end">
              <Link
                href="/"
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </Link>
              <button
                type="button"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ backgroundColor: config?.primaryColor }}
                disabled={!allDocumentsUploaded}
              >
                {allDocumentsUploaded ? 'Submit Documents' : 'Upload Required Documents'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocumentUploadPage;
