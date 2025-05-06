import React, { useState, useEffect, useRef } from 'react';
import { trackEvent } from '@/utils/analytics';

const AccessibilityMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'normal',
    contrast: 'normal',
    reducedMotion: false,
    focusVisible: false,
  });
  const menuRef = useRef(null);

  // Load saved settings on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        applySettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing accessibility settings:', error);
      }
    }
    
    // Check for system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
      document.documentElement.classList.add('reduce-motion');
    }
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Apply settings to the document
  const applySettings = (newSettings) => {
    // Font size
    document.documentElement.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    switch (newSettings.fontSize) {
      case 'small':
        document.documentElement.classList.add('text-sm');
        break;
      case 'normal':
        document.documentElement.classList.add('text-base');
        break;
      case 'large':
        document.documentElement.classList.add('text-lg');
        break;
      case 'x-large':
        document.documentElement.classList.add('text-xl');
        break;
    }
    
    // Contrast
    document.documentElement.classList.remove('high-contrast', 'inverted');
    switch (newSettings.contrast) {
      case 'high':
        document.documentElement.classList.add('high-contrast');
        break;
      case 'inverted':
        document.documentElement.classList.add('inverted');
        break;
    }
    
    // Reduced motion
    if (newSettings.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    
    // Focus visible
    if (newSettings.focusVisible) {
      document.documentElement.classList.add('focus-visible');
    } else {
      document.documentElement.classList.remove('focus-visible');
    }
    
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  // Update a single setting
  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    
    // Track event
    trackEvent('Accessibility', 'Setting Changed', `${key}: ${value}`);
  };

  // Reset all settings
  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'normal',
      contrast: 'normal',
      reducedMotion: false,
      focusVisible: false,
    };
    
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    
    // Track event
    trackEvent('Accessibility', 'Settings Reset');
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    
    // Track event
    if (!isOpen) {
      trackEvent('Accessibility', 'Menu Opened');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50" ref={menuRef}>
      {/* Accessibility Button */}
      <button
        className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Accessibility options"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </button>

      {/* Accessibility Menu */}
      <div
        className={`absolute bottom-14 right-0 w-72 bg-white rounded-lg shadow-xl transition-opacity duration-200 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Accessibility settings"
      >
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Accessibility Settings</h3>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Font Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  settings.fontSize === 'small'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => updateSetting('fontSize', 'small')}
              >
                Small
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  settings.fontSize === 'normal'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => updateSetting('fontSize', 'normal')}
              >
                Normal
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  settings.fontSize === 'large'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => updateSetting('fontSize', 'large')}
              >
                Large
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  settings.fontSize === 'x-large'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => updateSetting('fontSize', 'x-large')}
              >
                X-Large
              </button>
            </div>
          </div>
          
          {/* Contrast */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contrast
            </label>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  settings.contrast === 'normal'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => updateSetting('contrast', 'normal')}
              >
                Normal
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  settings.contrast === 'high'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => updateSetting('contrast', 'high')}
              >
                High Contrast
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  settings.contrast === 'inverted'
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
                onClick={() => updateSetting('contrast', 'inverted')}
              >
                Inverted
              </button>
            </div>
          </div>
          
          {/* Toggle Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                id="reduced-motion"
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="reduced-motion" className="ml-3 text-sm text-gray-700">
                Reduce animations
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="focus-visible"
                type="checkbox"
                checked={settings.focusVisible}
                onChange={(e) => updateSetting('focusVisible', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="focus-visible" className="ml-3 text-sm text-gray-700">
                Enhanced focus indicators
              </label>
            </div>
          </div>
          
          {/* Reset Button */}
          <button
            className="w-full mt-4 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={resetSettings}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityMenu;
