import { useEffect } from 'react';
import { initPerformanceMonitoring, trackResourcePerformance } from '@/utils/performance';

/**
 * Performance Monitor Component
 * Initializes performance monitoring and tracks key metrics
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();

    // Track resource performance after page load
    const handleLoad = () => {
      // Delay to ensure all resources are loaded
      setTimeout(() => {
        trackResourcePerformance();
      }, 2000);
    };

    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;
