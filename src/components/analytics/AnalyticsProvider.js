import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initAnalytics, trackPageView } from '@/utils/analytics';

/**
 * Analytics Provider Component
 * Initializes analytics and tracks page views
 */
const AnalyticsProvider = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    // Initialize analytics
    initAnalytics();

    // Track page views on route change
    const handleRouteChange = (url) => {
      trackPageView(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  return <>{children}</>;
};

export default AnalyticsProvider;
