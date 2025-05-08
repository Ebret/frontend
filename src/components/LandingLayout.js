'use client';

import React from 'react';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import SkipToContent from './SkipToContent';
import ErrorBoundary from './ErrorBoundary';
import LandingHeader from './landing/LandingHeader';
import LandingFooter from './landing/LandingFooter';
import AnalyticsProvider from './analytics/AnalyticsProvider';
import { PageLoadProgressBar } from './ui';
import { announceToScreenReader } from '@/utils/accessibility';

const LandingLayout = ({
  children,
  title = 'Cooperative E-Wallet - Modern Financial Solutions',
  description = 'A comprehensive e-wallet solution for cooperatives with loan management, savings accounts, and advanced reporting capabilities.',
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <AnalyticsProvider>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://cooperative-ewallet.com" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="/og-image.jpg" />

        {/* Preload critical assets */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/hero-image.svg" as="image" />

        {/* Preconnect to third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* PWA Support */}
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script src="/scripts/register-sw.js" defer></script>
      </Head>

      {/* Page Load Progress Bar */}
      <PageLoadProgressBar />

      {/* Skip to content link */}
      <SkipToContent />

      {/* Screen reader announcer */}
      <div id="sr-announcer" className="sr-only" aria-live="polite" aria-atomic="true"></div>

      <div className="min-h-screen flex flex-col">
        {showHeader && <LandingHeader />}

        <main id="main-content" className="flex-grow" tabIndex="-1">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>

        {showFooter && <LandingFooter />}
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
    </AnalyticsProvider>
  );
};

export default LandingLayout;
