'use client';

import React, { useState, useEffect } from 'react';

/**
 * ResponsiveWrapper Component
 * 
 * A utility component that provides responsive behavior based on screen size
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to render
 * @param {React.ReactNode} props.mobileContent - Optional alternative content for mobile screens
 * @param {React.ReactNode} props.tabletContent - Optional alternative content for tablet screens
 * @param {boolean} props.hideOnMobile - Whether to hide the content on mobile screens
 * @param {boolean} props.hideOnTablet - Whether to hide the content on tablet screens
 * @param {boolean} props.hideOnDesktop - Whether to hide the content on desktop screens
 * @param {string} props.className - Additional CSS classes to apply
 */
const ResponsiveWrapper = ({
  children,
  mobileContent,
  tabletContent,
  hideOnMobile = false,
  hideOnTablet = false,
  hideOnDesktop = false,
  className = '',
}) => {
  // Screen size breakpoints (in pixels)
  const MOBILE_BREAKPOINT = 640;
  const TABLET_BREAKPOINT = 1024;
  
  // State to track current screen size
  const [screenSize, setScreenSize] = useState('desktop');
  
  // Update screen size on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setScreenSize('mobile');
      } else if (width < TABLET_BREAKPOINT) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    // Set initial screen size
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Determine if content should be hidden based on screen size
  const shouldHide = 
    (screenSize === 'mobile' && hideOnMobile) ||
    (screenSize === 'tablet' && hideOnTablet) ||
    (screenSize === 'desktop' && hideOnDesktop);
  
  if (shouldHide) {
    return null;
  }
  
  // Render appropriate content based on screen size
  if (screenSize === 'mobile' && mobileContent) {
    return (
      <div className={className}>
        {mobileContent}
      </div>
    );
  }
  
  if (screenSize === 'tablet' && tabletContent) {
    return (
      <div className={className}>
        {tabletContent}
      </div>
    );
  }
  
  return (
    <div className={className}>
      {children}
    </div>
  );
};

/**
 * MobileOnly Component
 * 
 * A component that only renders on mobile screens
 */
export const MobileOnly = ({ children, className = '' }) => (
  <ResponsiveWrapper
    hideOnTablet
    hideOnDesktop
    className={className}
  >
    {children}
  </ResponsiveWrapper>
);

/**
 * TabletOnly Component
 * 
 * A component that only renders on tablet screens
 */
export const TabletOnly = ({ children, className = '' }) => (
  <ResponsiveWrapper
    hideOnMobile
    hideOnDesktop
    className={className}
  >
    {children}
  </ResponsiveWrapper>
);

/**
 * DesktopOnly Component
 * 
 * A component that only renders on desktop screens
 */
export const DesktopOnly = ({ children, className = '' }) => (
  <ResponsiveWrapper
    hideOnMobile
    hideOnTablet
    className={className}
  >
    {children}
  </ResponsiveWrapper>
);

/**
 * MobileAndTablet Component
 * 
 * A component that renders on mobile and tablet screens
 */
export const MobileAndTablet = ({ children, className = '' }) => (
  <ResponsiveWrapper
    hideOnDesktop
    className={className}
  >
    {children}
  </ResponsiveWrapper>
);

/**
 * TabletAndDesktop Component
 * 
 * A component that renders on tablet and desktop screens
 */
export const TabletAndDesktop = ({ children, className = '' }) => (
  <ResponsiveWrapper
    hideOnMobile
    className={className}
  >
    {children}
  </ResponsiveWrapper>
);

/**
 * useScreenSize Hook
 * 
 * A hook that returns the current screen size
 * 
 * @returns {string} The current screen size ('mobile', 'tablet', or 'desktop')
 */
export const useScreenSize = () => {
  // Screen size breakpoints (in pixels)
  const MOBILE_BREAKPOINT = 640;
  const TABLET_BREAKPOINT = 1024;
  
  // State to track current screen size
  const [screenSize, setScreenSize] = useState('desktop');
  
  // Update screen size on window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setScreenSize('mobile');
      } else if (width < TABLET_BREAKPOINT) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    // Set initial screen size
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return screenSize;
};

export default ResponsiveWrapper;
