import React, { useEffect, useRef, useState } from 'react';

/**
 * LazyLoad component for performance optimization
 * Only renders children when the component is in or near the viewport
 */
const LazyLoad = ({ 
  children, 
  placeholder = null, 
  threshold = 0.1, 
  rootMargin = '200px 0px', 
  className = '',
  onVisible = () => {}
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Skip if SSR or if already visible
    if (typeof window === 'undefined' || !ref.current || hasBeenVisible) {
      return;
    }

    // Check if IntersectionObserver is available
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setHasBeenVisible(true);
            onVisible();
            observer.disconnect();
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(ref.current);

      return () => {
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      };
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      setIsVisible(true);
      setHasBeenVisible(true);
      onVisible();
    }
  }, [threshold, rootMargin, hasBeenVisible, onVisible]);

  // Check if we should render the children
  const shouldRender = isVisible || hasBeenVisible;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : placeholder}
    </div>
  );
};

export default LazyLoad;
