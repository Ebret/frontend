/**
 * Enhanced Performance Utilities for Credit Cooperative System
 *
 * This module provides comprehensive utilities for performance optimization including:
 * - Performance monitoring
 * - Web vitals tracking
 * - Resource load tracking
 * - Memory usage tracking
 * - Image optimization
 * - Resource prefetching
 * - Function optimization (debounce, throttle, memoize)
 * - Performance measurement
 * - Lazy loading
 */

import { lazy, Suspense } from 'react';

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // Listen for performance entries
  if (PerformanceObserver) {
    // Create observer for LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];

        // Report LCP
        const lcp = lastEntry.startTime;
        console.log(`LCP: ${Math.round(lcp)}ms`);

        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'LCP',
            value: Math.round(lcp),
            non_interaction: true,
          });
        }
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.error('LCP monitoring error:', e);
    }

    // Create observer for FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const firstEntry = entries[0];

        // Report FID
        const fid = firstEntry.processingStart - firstEntry.startTime;
        console.log(`FID: ${Math.round(fid)}ms`);

        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'FID',
            value: Math.round(fid),
            non_interaction: true,
          });
        }
      });

      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.error('FID monitoring error:', e);
    }

    // Create observer for CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      let clsEntries = [];

      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();

        entries.forEach((entry) => {
          // Only count layout shifts without recent user input
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });

        // Report CLS
        console.log(`Current CLS: ${clsValue.toFixed(4)}`);

        // Send to analytics (throttled to avoid too many events)
        if (window.gtag && clsEntries.length % 5 === 0) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'CLS',
            value: Math.round(clsValue * 1000),
            non_interaction: true,
          });
        }
      });

      clsObserver.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.error('CLS monitoring error:', e);
    }
  }

  // Track navigation timing metrics
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;

        // Calculate key metrics
        const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
        const tcpTime = timing.connectEnd - timing.connectStart;
        const ttfb = timing.responseStart - timing.requestStart;
        const domLoad = timing.domContentLoadedEventEnd - timing.navigationStart;
        const fullLoad = timing.loadEventEnd - timing.navigationStart;

        // Log metrics
        console.log('Performance metrics:');
        console.log(`DNS lookup: ${dnsTime}ms`);
        console.log(`TCP connection: ${tcpTime}ms`);
        console.log(`TTFB: ${ttfb}ms`);
        console.log(`DOM load: ${domLoad}ms`);
        console.log(`Full page load: ${fullLoad}ms`);

        // Send to analytics
        if (window.gtag) {
          window.gtag('event', 'performance_metrics', {
            event_category: 'Performance',
            dns_time: dnsTime,
            tcp_time: tcpTime,
            ttfb: ttfb,
            dom_load: domLoad,
            full_load: fullLoad,
            non_interaction: true,
          });
        }
      }
    }, 0);
  });
};

// Track resource load performance
export const trackResourcePerformance = () => {
  if (typeof window === 'undefined' || !window.performance) return;

  // Get resource timing entries
  const resources = window.performance.getEntriesByType('resource');

  // Group resources by type
  const resourcesByType = resources.reduce((acc, resource) => {
    const url = resource.name;
    let type = 'other';

    if (url.match(/\.js(\?|$)/)) type = 'js';
    else if (url.match(/\.css(\?|$)/)) type = 'css';
    else if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)(\?|$)/)) type = 'image';
    else if (url.match(/\.(woff|woff2|ttf|otf)(\?|$)/)) type = 'font';

    if (!acc[type]) acc[type] = [];
    acc[type].push(resource);

    return acc;
  }, {});

  // Calculate average load time by type
  const avgLoadTimeByType = Object.keys(resourcesByType).reduce((acc, type) => {
    const resources = resourcesByType[type];
    const totalLoadTime = resources.reduce((sum, resource) => sum + resource.duration, 0);
    acc[type] = Math.round(totalLoadTime / resources.length);
    return acc;
  }, {});

  // Log average load times
  console.log('Average resource load times:');
  Object.keys(avgLoadTimeByType).forEach((type) => {
    console.log(`${type}: ${avgLoadTimeByType[type]}ms (${resourcesByType[type].length} resources)`);
  });

  // Return the data for further analysis
  return {
    resourcesByType,
    avgLoadTimeByType,
  };
};

// Track memory usage
export const trackMemoryUsage = () => {
  if (typeof window === 'undefined' || !window.performance || !window.performance.memory) return;

  const memory = window.performance.memory;

  console.log('Memory usage:');
  console.log(`Total JS heap size: ${Math.round(memory.totalJSHeapSize / (1024 * 1024))}MB`);
  console.log(`Used JS heap size: ${Math.round(memory.usedJSHeapSize / (1024 * 1024))}MB`);
  console.log(`JS heap size limit: ${Math.round(memory.jsHeapSizeLimit / (1024 * 1024))}MB`);

  return {
    totalHeapSize: memory.totalJSHeapSize,
    usedHeapSize: memory.usedJSHeapSize,
    heapSizeLimit: memory.jsHeapSizeLimit,
  };
};

/**
 * Optimize image loading with width and quality parameters
 * @param {string} src - Original image source
 * @param {number} width - Desired width
 * @param {number} quality - Image quality (1-100)
 * @returns {string} - Optimized image URL
 */
export const optimizeImage = (src, width = 0, quality = 75) => {
  // Check if src is a valid URL
  if (!src || typeof src !== 'string') {
    return src;
  }

  // If using Next.js Image optimization
  if (typeof window !== 'undefined' && window.__NEXT_IMAGE_OPTS) {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`;
  }

  // If using Cloudinary
  if (src.includes('cloudinary.com')) {
    // Extract base URL and transformation string
    const [baseUrl, transformations] = src.split('/upload/');

    // Add width and quality parameters
    const newTransformations = `w_${width},q_${quality}${transformations ? ',' + transformations : ''}`;

    return `${baseUrl}/upload/${newTransformations}`;
  }

  // If using Imgix
  if (src.includes('imgix.net')) {
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}w=${width}&q=${quality}`;
  }

  // Default: return original src
  return src;
};

/**
 * Prefetch a component for faster loading
 * @param {string} path - Path to the component
 */
export const prefetchComponent = (path) => {
  if (typeof document === 'undefined') return;

  // Create a link element for prefetching
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = path;
  link.as = 'script';

  // Add to document head
  document.head.appendChild(link);
};

/**
 * Prefetch an image for faster loading
 * @param {string} src - Image source URL
 */
export const prefetchImage = (src) => {
  if (typeof document === 'undefined') return;

  // Create a link element for prefetching
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = src;
  link.as = 'image';

  // Add to document head
  document.head.appendChild(link);
};

/**
 * Debounce a function to improve performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function to improve performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Memoize a function to improve performance
 * @param {Function} func - Function to memoize
 * @returns {Function} - Memoized function
 */
export const memoize = (func) => {
  const cache = new Map();

  return function memoizedFunction(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func(...args);
    cache.set(key, result);

    return result;
  };
};

/**
 * Measure function execution time
 * @param {Function} func - Function to measure
 * @param {string} funcName - Function name for logging
 * @returns {Function} - Wrapped function
 */
export const measureExecutionTime = (func, funcName = 'Anonymous') => {
  return function measuredFunction(...args) {
    const start = performance.now();
    const result = func(...args);
    const executionTime = performance.now() - start;

    console.log(`[Performance] ${funcName} executed in ${executionTime.toFixed(2)}ms`);

    return result;
  };
};

/**
 * Create a lazy-loaded component with custom loading fallback
 * @param {Function} importFunc - Import function for the component
 * @param {React.Component} Fallback - Fallback component to show while loading
 * @returns {React.Component} - Lazy-loaded component
 */
export const lazyLoad = (importFunc, Fallback) => {
  const LazyComponent = lazy(importFunc);

  return (props) => (
    <Suspense fallback={Fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Track a performance metric
 * @param {string} metricName - Name of the metric
 * @param {number} value - Metric value
 * @param {Object} tags - Additional tags for the metric
 */
export const trackPerformanceMetric = (metricName, value, tags = {}) => {
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[Performance Metric] ${metricName}: ${value}`, tags);
  }

  // Send to analytics in production
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'performance_metric', {
      metric_name: metricName,
      metric_value: value,
      ...tags,
    });
  }
};
