'use client';

import React, { useState, useEffect } from 'react';

/**
 * Theme Toggle Component
 * A simple button to toggle between light and dark themes
 */
const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.body.classList.add('dark-theme');
    } else if (savedTheme === 'cooperative') {
      document.body.classList.add('cooperative-theme');
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
      document.body.classList.remove('cooperative-theme');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      className={`theme-toggle-button ${className}`}
      onClick={toggleTheme}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="theme-toggle-icon">
        {isDarkMode ? '☀️' : '🌙'}
      </span>
    </button>
  );
};

export default ThemeToggle;
