'use client';

import React, { useState, useEffect } from 'react';

/**
 * Simple Theme Toggle Component
 * A lightweight button to toggle between light and dark themes
 */
const SimpleThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize theme on component mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
    
    // Check for system preference if no saved theme
    if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    }
  }, []);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (isDarkMode) {
      // Switch to light theme
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    } else {
      // Switch to dark theme
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <button 
      className="theme-toggle-button"
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '9999px',
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        color: isDarkMode ? '#e5e7eb' : '#4b5563',
        border: `1px solid ${isDarkMode ? '#4b5563' : '#e5e7eb'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default SimpleThemeToggle;
