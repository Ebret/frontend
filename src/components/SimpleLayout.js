'use client';

import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

const SimpleLayout = ({
  children,
  title = 'Cooperative E-Wallet',
  description = 'A comprehensive e-wallet solution for cooperatives',
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <main id="main-content" className="flex-1" tabIndex="-1">
          {children}
        </main>
      </div>

      {/* Toast container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: {
            borderRadius: '8px',
            padding: '16px',
          },
          success: {
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: 'white',
            },
            duration: 8000,
          },
        }}
      />
    </>
  );
};

export default SimpleLayout;
