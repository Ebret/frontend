/**
 * Cooperative Theme for Credit Cooperative System
 *
 * This theme provides a branded appearance with cooperative colors
 * and styling that reflects the cooperative identity.
 */

import defaultTheme from './defaultTheme';
import { createCustomTheme } from './themeUtils';

const cooperativeTheme = createCustomTheme(defaultTheme, {
  colors: {
    // Primary colors - cooperative green
    primary: '#006633',
    'primary-light': '#008040',
    'primary-dark': '#004d26',

    // Secondary colors - warm accent
    secondary: '#d9a566',
    'secondary-light': '#e6bf8c',
    'secondary-dark': '#bf8040',

    // Accent colors - complementary to primary
    accent: '#ff9900',
    'accent-light': '#ffad33',
    'accent-dark': '#cc7a00',

    // Semantic colors
    success: '#006633',
    info: '#0066cc',
    warning: '#ff9900',
    danger: '#cc3300',

    // Background colors
    'bg-primary': '#ffffff',
    'bg-secondary': '#f5f9f7',
    'bg-tertiary': '#e6f2ec',

    // Text colors
    'text-primary': '#333333',
    'text-secondary': '#4d4d4d',
    'text-tertiary': '#666666',

    // Border colors
    'border-light': '#d9e6df',
    'border-medium': '#b3ccbf',
    'border-dark': '#8cb299',

    // Special purpose colors
    'highlight': '#f0f7f3',
    'focus-ring': 'rgba(0, 102, 51, 0.25)',

    // Philippine Peso symbol color
    'peso': '#006633'
  },

  // Typography
  typography: {
    // Font families
    fonts: {
      'primary': "'Montserrat', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      'secondary': "'Lato', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      'monospace': "'Roboto Mono', 'Courier New', monospace"
    }
  },

  // Shadows - softer for cooperative theme
  shadows: {
    'none': 'none',
    'sm': '0 1px 3px rgba(0, 102, 51, 0.05)',
    'md': '0 4px 6px rgba(0, 102, 51, 0.07)',
    'lg': '0 10px 15px rgba(0, 102, 51, 0.1)',
    'xl': '0 20px 25px rgba(0, 102, 51, 0.15)',
    'inner': 'inset 0 2px 4px rgba(0, 102, 51, 0.05)'
  },

  // Border radius - slightly more rounded
  borderRadius: {
    'none': '0',
    'sm': '0.25rem',    // 4px
    'md': '0.375rem',   // 6px
    'lg': '0.625rem',   // 10px
    'xl': '1.25rem',    // 20px
    'full': '9999px'
  }
});

export default cooperativeTheme;
