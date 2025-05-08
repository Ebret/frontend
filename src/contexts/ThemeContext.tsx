'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import defaultTheme from '../themes/defaultTheme';
import darkTheme from '../themes/darkTheme';
import cooperativeTheme from '../themes/cooperativeTheme';

// Create theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  COOPERATIVE: 'cooperative',
  CUSTOM: 'custom'
};

// Theme context type
export type ThemeContextType = {
  currentTheme: string;
  themeData: any;
  isLoading: boolean;
  changeTheme: (theme: string) => void;
  updateCustomTheme: (newThemeData: any) => void;
  updateThemeColor: (colorKey: string, colorValue: string) => void;
  toggleDarkMode: () => void;
  themes: typeof THEMES;
};

/**
 * Theme Provider Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const ThemeProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  // Initialize theme state
  const [currentTheme, setCurrentTheme] = useState(THEMES.LIGHT);
  const [themeData, setThemeData] = useState(defaultTheme);
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from localStorage on initial render
  useEffect(() => {
    const loadTheme = () => {
      try {
        // Get saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const savedThemeData = localStorage.getItem('themeData');

        if (savedTheme) {
          setCurrentTheme(savedTheme);

          // Set theme data based on theme type
          if (savedTheme === THEMES.DARK) {
            setThemeData(darkTheme);
          } else if (savedTheme === THEMES.COOPERATIVE) {
            setThemeData(cooperativeTheme);
          } else if (savedTheme === THEMES.CUSTOM && savedThemeData) {
            setThemeData(JSON.parse(savedThemeData));
          } else {
            setThemeData(defaultTheme);
          }
        } else {
          // Check for system preference if no saved theme
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setCurrentTheme(THEMES.DARK);
            setThemeData(darkTheme);
          } else {
            setCurrentTheme(THEMES.LIGHT);
            setThemeData(defaultTheme);
          }
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        // Fallback to default theme
        setCurrentTheme(THEMES.LIGHT);
        setThemeData(defaultTheme);
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Apply theme to document when theme changes
  useEffect(() => {
    if (isLoading) return;

    // Apply theme variables to document root
    const root = document.documentElement;

    // Apply colors
    Object.entries(themeData.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value as string);
    });

    // Apply fonts
    Object.entries(themeData.typography.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value as string);
    });

    // Apply font sizes
    Object.entries(themeData.typography.sizes).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value as string);
    });

    // Apply spacing
    Object.entries(themeData.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value as string);
    });

    // Apply border radius
    Object.entries(themeData.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value as string);
    });

    // Apply shadows
    Object.entries(themeData.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value as string);
    });

    // Apply transitions
    Object.entries(themeData.transitions).forEach(([key, value]) => {
      root.style.setProperty(`--transition-${key}`, value as string);
    });

    // Set theme class on body
    document.body.className = `theme-${currentTheme}`;

    // Save theme preference
    localStorage.setItem('theme', currentTheme);

    // Save custom theme data if using custom theme
    if (currentTheme === THEMES.CUSTOM) {
      localStorage.setItem('themeData', JSON.stringify(themeData));
    }
  }, [currentTheme, themeData, isLoading]);

  /**
   * Change the current theme
   * @param {string} theme - Theme name
   */
  const changeTheme = (theme: string) => {
    if (!Object.values(THEMES).includes(theme)) {
      console.error(`Invalid theme: ${theme}`);
      return;
    }

    setCurrentTheme(theme);

    // Set theme data based on theme type
    if (theme === THEMES.DARK) {
      setThemeData(darkTheme);
    } else if (theme === THEMES.COOPERATIVE) {
      setThemeData(cooperativeTheme);
    } else if (theme === THEMES.LIGHT) {
      setThemeData(defaultTheme);
    }
    // For custom theme, we don't change the theme data here
  };

  /**
   * Update custom theme data
   * @param {Object} newThemeData - New theme data
   */
  const updateCustomTheme = (newThemeData: any) => {
    setThemeData((prevTheme: any) => ({
      ...prevTheme,
      ...newThemeData
    }));

    // Switch to custom theme
    setCurrentTheme(THEMES.CUSTOM);
  };

  /**
   * Update a specific color in the theme
   * @param {string} colorKey - Color key to update
   * @param {string} colorValue - New color value
   */
  const updateThemeColor = (colorKey: string, colorValue: string) => {
    setThemeData((prevTheme: any) => ({
      ...prevTheme,
      colors: {
        ...prevTheme.colors,
        [colorKey]: colorValue
      }
    }));

    // Switch to custom theme
    setCurrentTheme(THEMES.CUSTOM);
  };

  /**
   * Toggle between light and dark themes
   */
  const toggleDarkMode = () => {
    setCurrentTheme(prevTheme =>
      prevTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    );

    setThemeData(prevTheme =>
      currentTheme === THEMES.DARK ? defaultTheme : darkTheme
    );
  };

  // Create context value
  const contextValue: ThemeContextType = {
    currentTheme,
    themeData,
    isLoading,
    changeTheme,
    updateCustomTheme,
    updateThemeColor,
    toggleDarkMode,
    themes: THEMES
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 * @returns {Object} Theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};

export default ThemeContext;
