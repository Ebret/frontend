'use client';

import React from 'react';

/**
 * SkipToContent Component
 * 
 * A component that provides a skip link for keyboard users to bypass navigation
 * and go directly to the main content of the page.
 * 
 * @param {Object} props
 * @param {string} props.contentId - The ID of the main content element to skip to
 * @param {string} props.className - Additional CSS classes to apply
 */
const SkipToContent = ({ contentId = 'main-content', className = '' }) => {
  const handleClick = (e) => {
    e.preventDefault();
    const contentElement = document.getElementById(contentId);
    
    if (contentElement) {
      // Set tabindex to make the element focusable
      contentElement.setAttribute('tabindex', '-1');
      contentElement.focus();
      
      // Remove tabindex after focus to avoid interfering with normal tab order
      contentElement.addEventListener('blur', () => {
        contentElement.removeAttribute('tabindex');
      }, { once: true });
    }
  };
  
  return (
    <a
      href={`#${contentId}`}
      onClick={handleClick}
      className={`skip-to-content ${className}`}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
