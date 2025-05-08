/**
 * Dark Theme for Credit Cooperative System
 *
 * This theme provides a modern dark appearance with reduced eye strain
 * for night-time usage and enhanced contrast.
 */

import defaultTheme from './defaultTheme';
import { createCustomTheme } from './themeUtils';

const darkTheme = createCustomTheme(defaultTheme, {
  colors: {
    // Primary colors
    primary: '#4d94ff',
    'primary-light': '#80b3ff',
    'primary-dark': '#0066cc',

    // Secondary colors
    secondary: '#9aa0a6',
    'secondary-light': '#bdc1c6',
    'secondary-dark': '#6c757d',

    // Accent colors
    accent: '#48c664',
    'accent-light': '#6bd384',
    'accent-dark': '#28a745',

    // Semantic colors
    success: '#48c664',
    info: '#4cc3d9',
    warning: '#ffcd39',
    danger: '#e05c6e',

    // Neutral colors - inverted for dark theme
    white: '#000000',
    'gray-100': '#212529',
    'gray-200': '#343a40',
    'gray-300': '#495057',
    'gray-400': '#6c757d',
    'gray-500': '#adb5bd',
    'gray-600': '#ced4da',
    'gray-700': '#dee2e6',
    'gray-800': '#e9ecef',
    'gray-900': '#f8f9fa',
    black: '#ffffff',

    // Background colors
    'bg-primary': '#121212',
    'bg-secondary': '#1e1e1e',
    'bg-tertiary': '#2d2d2d',

    // Text colors
    'text-primary': '#e9ecef',
    'text-secondary': '#ced4da',
    'text-tertiary': '#adb5bd',
    'text-light': '#121212',

    // Border colors
    'border-light': '#495057',
    'border-medium': '#6c757d',
    'border-dark': '#adb5bd',

    // Special purpose colors
    'overlay': 'rgba(0, 0, 0, 0.7)',
    'shadow': 'rgba(0, 0, 0, 0.3)',
    'highlight': '#2d3748',
    'focus-ring': 'rgba(77, 148, 255, 0.25)',

    // Philippine Peso symbol color
    'peso': '#48c664'
  },

  // Shadows - enhanced for dark theme
  shadows: {
    'none': 'none',
    'sm': '0 1px 2px rgba(0, 0, 0, 0.2)',
    'md': '0 4px 6px rgba(0, 0, 0, 0.3)',
    'lg': '0 10px 15px rgba(0, 0, 0, 0.3)',
    'xl': '0 20px 25px rgba(0, 0, 0, 0.3)',
    'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
  }
});

export default darkTheme;
