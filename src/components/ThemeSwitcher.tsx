'use client';

import React, { useState } from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext';
import './ThemeSwitcher.css';

/**
 * Theme Switcher Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Theme switcher component
 */
const ThemeSwitcher = ({
  showCustomizer = false,
  className = '',
  variant = 'icon',
  ...rest
}: {
  showCustomizer?: boolean;
  className?: string;
  variant?: 'icon' | 'dropdown';
  [key: string]: any;
}) => {
  const { currentTheme, changeTheme, toggleDarkMode, updateThemeColor } = useTheme();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  
  // Toggle customizer panel
  const toggleCustomizer = () => {
    setIsCustomizerOpen(prev => !prev);
  };
  
  // Theme options for dropdown
  const themeOptions = [
    { id: THEMES.LIGHT, name: 'Light', icon: '☀️' },
    { id: THEMES.DARK, name: 'Dark', icon: '🌙' },
    { id: THEMES.COOPERATIVE, name: 'Cooperative', icon: '🌿' }
  ];
  
  // Color options for customizer
  const colorOptions = [
    { name: 'primary', label: 'Primary Color' },
    { name: 'accent', label: 'Accent Color' },
    { name: 'success', label: 'Success Color' },
    { name: 'danger', label: 'Danger Color' },
    { name: 'warning', label: 'Warning Color' },
    { name: 'info', label: 'Info Color' }
  ];
  
  // Handle color change
  const handleColorChange = (colorName: string, colorValue: string) => {
    updateThemeColor(colorName, colorValue);
  };
  
  // Render icon-only theme switcher
  if (variant === 'icon') {
    return (
      <div className={`theme-switcher ${className}`} {...rest}>
        <button
          className="theme-toggle-button"
          onClick={toggleDarkMode}
          aria-label={`Switch to ${currentTheme === THEMES.DARK ? 'light' : 'dark'} theme`}
        >
          {currentTheme === THEMES.DARK ? '🌙' : '☀️'}
        </button>
        
        {showCustomizer && (
          <button
            className="theme-customizer-button"
            onClick={toggleCustomizer}
            aria-label="Customize theme"
          >
            🎨
          </button>
        )}
        
        {isCustomizerOpen && showCustomizer && (
          <ThemeCustomizer
            onClose={() => setIsCustomizerOpen(false)}
            colorOptions={colorOptions}
            onColorChange={handleColorChange}
          />
        )}
      </div>
    );
  }
  
  // Render dropdown theme switcher
  return (
    <div className={`theme-switcher ${className}`} {...rest}>
      <div className="theme-dropdown">
        <select
          value={currentTheme}
          onChange={(e) => changeTheme(e.target.value)}
          className="theme-select"
        >
          {themeOptions.map(theme => (
            <option key={theme.id} value={theme.id}>
              {theme.icon} {theme.name}
            </option>
          ))}
          {showCustomizer && (
            <option value={THEMES.CUSTOM}>🎨 Custom</option>
          )}
        </select>
      </div>
      
      {showCustomizer && (
        <button
          className="theme-customizer-button"
          onClick={toggleCustomizer}
          aria-label="Customize theme"
        >
          🎨
        </button>
      )}
      
      {isCustomizerOpen && showCustomizer && (
        <ThemeCustomizer
          onClose={() => setIsCustomizerOpen(false)}
          colorOptions={colorOptions}
          onColorChange={handleColorChange}
        />
      )}
    </div>
  );
};

/**
 * Theme Customizer Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Theme customizer component
 */
const ThemeCustomizer = ({
  onClose,
  colorOptions,
  onColorChange
}: {
  onClose: () => void;
  colorOptions: Array<{ name: string; label: string }>;
  onColorChange: (colorName: string, colorValue: string) => void;
}) => {
  const { themeData } = useTheme();
  
  return (
    <div className="theme-customizer">
      <div className="theme-customizer-header">
        <h3>Customize Theme</h3>
        <button
          className="theme-customizer-close"
          onClick={onClose}
          aria-label="Close customizer"
        >
          ✕
        </button>
      </div>
      
      <div className="theme-customizer-body">
        <div className="theme-color-options">
          {colorOptions.map(color => (
            <div key={color.name} className="theme-color-option">
              <label htmlFor={`color-${color.name}`}>{color.label}</label>
              <div className="color-picker-wrapper">
                <input
                  type="color"
                  id={`color-${color.name}`}
                  value={themeData.colors[color.name]}
                  onChange={(e) => onColorChange(color.name, e.target.value)}
                  className="color-picker"
                />
                <span className="color-value">{themeData.colors[color.name]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="theme-customizer-footer">
        <button
          className="theme-apply-button"
          onClick={onClose}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
