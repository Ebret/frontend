import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

/**
 * Advanced Analytics Component
 * Tracks detailed user interactions and behavior
 */
const AdvancedAnalytics = () => {
  const router = useRouter();
  const sessionStartTime = useRef(Date.now());
  const lastActivityTime = useRef(Date.now());
  const pageViews = useRef(0);
  const interactions = useRef(0);
  const scrollDepth = useRef(0);
  const sessionId = useRef(null);

  // Generate a unique session ID
  const generateSessionId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Initialize analytics
  useEffect(() => {
    // Skip if not in browser
    if (typeof window === 'undefined') return;

    // Generate session ID if not exists
    if (!sessionId.current) {
      sessionId.current = generateSessionId();
    }

    // Track page view
    pageViews.current += 1;
    trackEvent('page_view', {
      page: router.pathname,
      referrer: document.referrer,
      session_id: sessionId.current,
      page_view_count: pageViews.current,
    });

    // Track session start
    trackEvent('session_start', {
      session_id: sessionId.current,
      start_time: new Date().toISOString(),
      user_agent: navigator.userAgent,
      screen_size: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language,
    });

    // Set up scroll tracking
    const handleScroll = () => {
      // Update last activity time
      lastActivityTime.current = Date.now();
      
      // Calculate scroll depth
      const windowHeight = window.innerHeight;
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const currentScrollDepth = Math.floor((scrollTop + windowHeight) / documentHeight * 100);
      
      // Track new maximum scroll depth
      if (currentScrollDepth > scrollDepth.current) {
        scrollDepth.current = currentScrollDepth;
        
        // Track scroll depth at 25%, 50%, 75%, and 100%
        if (
          (scrollDepth.current >= 25 && scrollDepth.current < 50) ||
          (scrollDepth.current >= 50 && scrollDepth.current < 75) ||
          (scrollDepth.current >= 75 && scrollDepth.current < 100) ||
          scrollDepth.current === 100
        ) {
          trackEvent('scroll_depth', {
            page: router.pathname,
            depth: scrollDepth.current,
            session_id: sessionId.current,
          });
        }
      }
    };

    // Set up interaction tracking
    const handleInteraction = () => {
      // Update last activity time
      lastActivityTime.current = Date.now();
      
      // Increment interaction count
      interactions.current += 1;
    };

    // Set up click tracking
    const handleClick = (e) => {
      // Update last activity time
      lastActivityTime.current = Date.now();
      
      // Get clicked element
      const element = e.target;
      
      // Track button clicks
      if (element.tagName === 'BUTTON' || 
          (element.tagName === 'A' && element.href) ||
          element.closest('button') || 
          element.closest('a[href]')) {
        
        const button = element.tagName === 'BUTTON' || element.tagName === 'A' 
          ? element 
          : (element.closest('button') || element.closest('a[href]'));
        
        const buttonText = button.innerText || button.textContent;
        const buttonId = button.id || '';
        const buttonClass = button.className || '';
        const buttonHref = button.href || '';
        
        trackEvent('button_click', {
          page: router.pathname,
          button_text: buttonText,
          button_id: buttonId,
          button_class: buttonClass,
          button_href: buttonHref,
          session_id: sessionId.current,
        });
      }
    };

    // Set up form tracking
    const handleSubmit = (e) => {
      // Update last activity time
      lastActivityTime.current = Date.now();
      
      // Get form element
      const form = e.target;
      
      // Track form submission
      trackEvent('form_submit', {
        page: router.pathname,
        form_id: form.id || '',
        form_name: form.name || '',
        form_action: form.action || '',
        session_id: sessionId.current,
      });
    };

    // Set up session tracking interval
    const sessionInterval = setInterval(() => {
      // Calculate session duration
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      
      // Calculate time since last activity
      const inactiveTime = Math.floor((Date.now() - lastActivityTime.current) / 1000);
      
      // Track session heartbeat every minute
      trackEvent('session_heartbeat', {
        session_id: sessionId.current,
        duration: sessionDuration,
        inactive_time: inactiveTime,
        page_views: pageViews.current,
        interactions: interactions.current,
        max_scroll_depth: scrollDepth.current,
      });
      
      // End session after 30 minutes of inactivity
      if (inactiveTime > 1800) {
        trackEvent('session_end', {
          session_id: sessionId.current,
          duration: sessionDuration,
          page_views: pageViews.current,
          interactions: interactions.current,
          max_scroll_depth: scrollDepth.current,
          end_reason: 'inactivity',
        });
        
        // Reset session
        sessionId.current = generateSessionId();
        sessionStartTime.current = Date.now();
        lastActivityTime.current = Date.now();
        pageViews.current = 0;
        interactions.current = 0;
        scrollDepth.current = 0;
      }
    }, 60000); // Every minute

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleClick);
    document.addEventListener('submit', handleSubmit);

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleSubmit);
      clearInterval(sessionInterval);
    };
  }, [router]);

  // Track page changes
  useEffect(() => {
    // Skip if not in browser or no session ID
    if (typeof window === 'undefined' || !sessionId.current) return;

    // Track page view on route change
    const handleRouteChange = (url) => {
      // Update last activity time
      lastActivityTime.current = Date.now();
      
      // Increment page view count
      pageViews.current += 1;
      
      // Reset scroll depth for new page
      scrollDepth.current = 0;
      
      // Track page view
      trackEvent('page_view', {
        page: url,
        referrer: router.pathname,
        session_id: sessionId.current,
        page_view_count: pageViews.current,
      });
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Track session end on unmount
  useEffect(() => {
    return () => {
      // Skip if not in browser or no session ID
      if (typeof window === 'undefined' || !sessionId.current) return;

      // Calculate session duration
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      
      // Track session end
      trackEvent('session_end', {
        session_id: sessionId.current,
        duration: sessionDuration,
        page_views: pageViews.current,
        interactions: interactions.current,
        max_scroll_depth: scrollDepth.current,
        end_reason: 'navigation',
      });
    };
  }, []);

  // Track event helper function
  const trackEvent = (eventName, eventData) => {
    // Skip if not in browser
    if (typeof window === 'undefined') return;

    // Add common properties
    const data = {
      ...eventData,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    // Log event to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${eventName}:`, data);
    }

    // Send to analytics service
    if (window.gtag) {
      window.gtag('event', eventName, data);
    }

    // You can add additional analytics services here
  };

  // This component doesn't render anything
  return null;
};

export default AdvancedAnalytics;
