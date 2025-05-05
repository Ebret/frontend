import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    // Check if IntersectionObserver is available
    if (typeof IntersectionObserver !== 'undefined') {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            startAnimation();
            // Once animation starts, disconnect the observer
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        },
        { threshold: 0.1 }
      );

      if (countRef.current) {
        observerRef.current.observe(countRef.current);
      }
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      startAnimation();
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [end, duration]);

  const startAnimation = () => {
    const startTime = Date.now();
    const startValue = 0;
    
    const step = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      
      if (elapsedTime < duration) {
        const nextCount = easeOutQuad(elapsedTime, startValue, end, duration);
        setCount(nextCount);
        requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(step);
  };

  // Easing function for smoother animation
  const easeOutQuad = (t, b, c, d) => {
    t /= d;
    return -c * t * (t - 2) + b;
  };

  // Format the number with commas and decimals
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <span ref={countRef} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
