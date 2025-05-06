/**
 * Performance monitoring utility
 * Tracks and reports key performance metrics
 */

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
