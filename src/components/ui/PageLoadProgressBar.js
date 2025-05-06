import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const PageLoadProgressBar = ({ color = '#3b82f6', height = 3, duration = 300 }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Handle route change start
    const handleStart = (url) => {
      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // Reset progress and show progress bar
      setProgress(0);
      setIsVisible(true);
      
      // Start progress animation
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Increase progress, but never reach 100% until route change is complete
          if (prevProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prevProgress + 10;
        });
      }, 100);
      
      // Store interval ID to clear it later
      return interval;
    };

    // Handle route change complete
    const handleComplete = (interval) => {
      // Clear progress interval
      if (interval) {
        clearInterval(interval);
      }
      
      // Set progress to 100% and hide after animation completes
      setProgress(100);
      
      // Hide progress bar after animation completes
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, duration);
      
      setTimeoutId(timeout);
    };

    // Handle route change error
    const handleError = (interval) => {
      // Clear progress interval
      if (interval) {
        clearInterval(interval);
      }
      
      // Set progress to 100% and hide after animation completes
      setProgress(100);
      
      // Hide progress bar after animation completes
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setProgress(0);
      }, duration);
      
      setTimeoutId(timeout);
    };

    // Set up router event listeners
    let progressInterval;
    
    const startHandler = () => {
      progressInterval = handleStart();
    };
    
    const completeHandler = () => {
      handleComplete(progressInterval);
    };
    
    const errorHandler = () => {
      handleError(progressInterval);
    };
    
    router.events.on('routeChangeStart', startHandler);
    router.events.on('routeChangeComplete', completeHandler);
    router.events.on('routeChangeError', errorHandler);

    // Clean up event listeners
    return () => {
      router.events.off('routeChangeStart', startHandler);
      router.events.off('routeChangeComplete', completeHandler);
      router.events.off('routeChangeError', errorHandler);
      
      // Clear any existing interval or timeout
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [router, duration, timeoutId]);

  // If not visible, don't render anything
  if (!isVisible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: `${height}px`,
        backgroundColor: 'transparent',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          backgroundColor: color,
          width: `${progress}%`,
          transition: `width ${duration}ms ease-in-out`,
        }}
      />
    </div>
  );
};

export default PageLoadProgressBar;
