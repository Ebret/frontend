/**
 * Analytics utility for tracking user interactions
 * This is a placeholder implementation that can be replaced with actual analytics services
 * like Google Analytics, Mixpanel, or a custom analytics solution
 */

// Initialize analytics
export const initAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  // Check if analytics should be disabled (e.g., due to user preferences)
  const analyticsDisabled = localStorage.getItem('analytics-disabled') === 'true';
  
  if (analyticsDisabled) {
    console.log('Analytics disabled by user preference');
    return;
  }
  
  // Set up analytics here
  console.log('Analytics initialized');
  
  // Track page view on initial load
  trackPageView(window.location.pathname);
};

// Track page views
export const trackPageView = (url) => {
  if (typeof window === 'undefined') return;
  
  // Check if analytics should be disabled
  const analyticsDisabled = localStorage.getItem('analytics-disabled') === 'true';
  if (analyticsDisabled) return;
  
  // Track page view
  console.log(`Page view: ${url}`);
  
  // Example implementation for Google Analytics
  if (window.gtag) {
    window.gtag('config', 'GA-MEASUREMENT-ID', {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = (category, action, label = null, value = null) => {
  if (typeof window === 'undefined') return;
  
  // Check if analytics should be disabled
  const analyticsDisabled = localStorage.getItem('analytics-disabled') === 'true';
  if (analyticsDisabled) return;
  
  // Track event
  console.log(`Event: ${category} - ${action}${label ? ` - ${label}` : ''}${value ? ` - ${value}` : ''}`);
  
  // Example implementation for Google Analytics
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user identification
export const identifyUser = (userId, traits = {}) => {
  if (typeof window === 'undefined') return;
  
  // Check if analytics should be disabled
  const analyticsDisabled = localStorage.getItem('analytics-disabled') === 'true';
  if (analyticsDisabled) return;
  
  // Identify user
  console.log(`User identified: ${userId}`, traits);
  
  // Example implementation for Google Analytics
  if (window.gtag) {
    window.gtag('set', 'user_properties', {
      user_id: userId,
      ...traits,
    });
  }
};

// Disable analytics
export const disableAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('analytics-disabled', 'true');
  console.log('Analytics disabled');
};

// Enable analytics
export const enableAnalytics = () => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('analytics-disabled', 'false');
  console.log('Analytics enabled');
  
  // Re-initialize analytics
  initAnalytics();
};

// Check if analytics is enabled
export const isAnalyticsEnabled = () => {
  if (typeof window === 'undefined') return false;
  
  return localStorage.getItem('analytics-disabled') !== 'true';
};
