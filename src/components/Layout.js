import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import SkipToContent from './SkipToContent';
import ErrorBoundary from './ErrorBoundary';
import { announceToScreenReader } from '@/utils/accessibility';

const Layout = ({
  children,
  title = 'Cooperative E-Wallet',
  description = 'A comprehensive e-wallet solution for cooperatives',
  showSidebar = true,
  showHeader = true,
  showFooter = true,
}) => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Announce page changes to screen readers
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Extract page title from URL
      const pageTitle = url
        .split('/')
        .pop()
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Announce page change
      announceToScreenReader(`Navigated to ${pageTitle || 'Home'} page`);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Skip to content link */}
      <SkipToContent />

      {/* Screen reader announcer */}
      <div id="sr-announcer" className="sr-only" aria-live="polite" aria-atomic="true"></div>

      <div className="min-h-screen bg-gray-100">
        {showHeader && (
          <Header
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}

        <div className="flex">
          {showSidebar && (
            <Sidebar
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          )}

          <main
            id="main-content"
            className={`flex-1 ${showSidebar ? 'lg:pl-64' : ''}`}
            tabIndex="-1"
          >
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>

        {showFooter && <Footer />}
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

export default Layout;
