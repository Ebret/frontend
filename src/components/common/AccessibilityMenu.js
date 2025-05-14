'use client';

import React, { useState, useEffect } from 'react';
import { FiType, FiSun, FiMoon, FiZoomIn, FiZoomOut, FiMaximize, FiMinimize, FiX } from 'react-icons/fi';

/**
 * AccessibilityMenu Component
 * 
 * A component that provides accessibility options for users
 */
const AccessibilityMenu = () => {
  // State for accessibility settings
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setFontSize(parsedSettings.fontSize || 16);
      setContrast(parsedSettings.contrast || 'normal');
      setReducedMotion(parsedSettings.reducedMotion || false);
      
      // Apply settings
      applySettings(parsedSettings);
    }
  }, []);
  
  // Save settings to localStorage when they change
  useEffect(() => {
    const settings = {
      fontSize,
      contrast,
      reducedMotion,
    };
    
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    
    // Apply settings
    applySettings(settings);
  }, [fontSize, contrast, reducedMotion]);
  
  // Apply accessibility settings to the document
  const applySettings = (settings) => {
    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    
    // Apply contrast
    document.documentElement.classList.remove('high-contrast', 'low-contrast');
    if (settings.contrast !== 'normal') {
      document.documentElement.classList.add(settings.contrast);
    }
    
    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  };
  
  // Increase font size
  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 1);
    }
  };
  
  // Decrease font size
  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 1);
    }
  };
  
  // Reset font size
  const resetFontSize = () => {
    setFontSize(16);
  };
  
  // Toggle contrast
  const toggleContrast = () => {
    if (contrast === 'normal') {
      setContrast('high-contrast');
    } else if (contrast === 'high-contrast') {
      setContrast('low-contrast');
    } else {
      setContrast('normal');
    }
  };
  
  // Toggle reduced motion
  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
  };
  
  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Accessibility button */}
      <button
        type="button"
        onClick={toggleMenu}
        className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        aria-label="Accessibility options"
        aria-expanded={isOpen}
      >
        <FiType className="h-6 w-6" />
      </button>
      
      {/* Accessibility menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Accessibility</h3>
            <button
              type="button"
              onClick={toggleMenu}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close accessibility menu"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          {/* Font size controls */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={decreaseFontSize}
                className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Decrease font size"
                disabled={fontSize <= 12}
              >
                <FiZoomOut className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium text-gray-900">{fontSize}px</span>
              <button
                type="button"
                onClick={increaseFontSize}
                className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Increase font size"
                disabled={fontSize >= 24}
              >
                <FiZoomIn className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={resetFontSize}
                className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                aria-label="Reset font size"
              >
                <FiMaximize className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Contrast controls */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contrast
            </label>
            <button
              type="button"
              onClick={toggleContrast}
              className="w-full flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="text-sm font-medium text-gray-900">
                {contrast === 'normal' ? 'Normal Contrast' : 
                 contrast === 'high-contrast' ? 'High Contrast' : 'Low Contrast'}
              </span>
              {contrast === 'normal' ? (
                <FiSun className="h-5 w-5" />
              ) : contrast === 'high-contrast' ? (
                <FiMoon className="h-5 w-5" />
              ) : (
                <FiSun className="h-5 w-5 opacity-50" />
              )}
            </button>
          </div>
          
          {/* Reduced motion controls */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="reduced-motion" className="text-sm font-medium text-gray-700">
                Reduced Motion
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="reduced-motion"
                  checked={reducedMotion}
                  onChange={toggleReducedMotion}
                  className="sr-only"
                />
                <div className={`block w-10 h-6 rounded-full ${reducedMotion ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${reducedMotion ? 'transform translate-x-4' : ''}`}></div>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Reduces animations and transitions throughout the application.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityMenu;
