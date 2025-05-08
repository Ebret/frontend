/**
 * Default (Light) Theme for Credit Cooperative System
 * 
 * This theme provides a clean, professional light appearance
 * with a focus on readability and usability.
 */

const defaultTheme = {
  // Color palette
  colors: {
    // Primary colors
    primary: '#0066cc',
    'primary-light': '#4d94ff',
    'primary-dark': '#004c99',
    
    // Secondary colors
    secondary: '#6c757d',
    'secondary-light': '#9aa0a6',
    'secondary-dark': '#495057',
    
    // Accent colors
    accent: '#28a745',
    'accent-light': '#48c664',
    'accent-dark': '#1e7e34',
    
    // Semantic colors
    success: '#28a745',
    info: '#17a2b8',
    warning: '#ffc107',
    danger: '#dc3545',
    
    // Neutral colors
    white: '#ffffff',
    'gray-100': '#f8f9fa',
    'gray-200': '#e9ecef',
    'gray-300': '#dee2e6',
    'gray-400': '#ced4da',
    'gray-500': '#adb5bd',
    'gray-600': '#6c757d',
    'gray-700': '#495057',
    'gray-800': '#343a40',
    'gray-900': '#212529',
    black: '#000000',
    
    // Background colors
    'bg-primary': '#ffffff',
    'bg-secondary': '#f8f9fa',
    'bg-tertiary': '#e9ecef',
    
    // Text colors
    'text-primary': '#212529',
    'text-secondary': '#495057',
    'text-tertiary': '#6c757d',
    'text-light': '#ffffff',
    
    // Border colors
    'border-light': '#dee2e6',
    'border-medium': '#ced4da',
    'border-dark': '#adb5bd',
    
    // Special purpose colors
    'overlay': 'rgba(0, 0, 0, 0.5)',
    'shadow': 'rgba(0, 0, 0, 0.1)',
    'highlight': '#fff8e6',
    'focus-ring': 'rgba(0, 102, 204, 0.25)',
    
    // Philippine Peso symbol color
    'peso': '#006633'
  },
  
  // Typography
  typography: {
    // Font families
    fonts: {
      'primary': "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      'secondary': "'Poppins', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      'monospace': "'Roboto Mono', 'Courier New', monospace"
    },
    
    // Font sizes
    sizes: {
      'xs': '0.75rem',     // 12px
      'sm': '0.875rem',    // 14px
      'base': '1rem',      // 16px
      'md': '1.125rem',    // 18px
      'lg': '1.25rem',     // 20px
      'xl': '1.5rem',      // 24px
      '2xl': '1.875rem',   // 30px
      '3xl': '2.25rem',    // 36px
      '4xl': '3rem',       // 48px
      '5xl': '4rem'        // 64px
    },
    
    // Font weights
    weights: {
      'light': 300,
      'regular': 400,
      'medium': 500,
      'semibold': 600,
      'bold': 700
    },
    
    // Line heights
    lineHeights: {
      'tight': 1.2,
      'normal': 1.5,
      'loose': 1.8
    },
    
    // Letter spacing
    letterSpacing: {
      'tight': '-0.025em',
      'normal': '0',
      'wide': '0.025em'
    }
  },
  
  // Spacing
  spacing: {
    'none': '0',
    'xs': '0.25rem',     // 4px
    'sm': '0.5rem',      // 8px
    'md': '1rem',        // 16px
    'lg': '1.5rem',      // 24px
    'xl': '2rem',        // 32px
    '2xl': '3rem',       // 48px
    '3xl': '4rem',       // 64px
    '4xl': '6rem',       // 96px
    '5xl': '8rem'        // 128px
  },
  
  // Border radius
  borderRadius: {
    'none': '0',
    'sm': '0.125rem',    // 2px
    'md': '0.25rem',     // 4px
    'lg': '0.5rem',      // 8px
    'xl': '1rem',        // 16px
    'full': '9999px'
  },
  
  // Shadows
  shadows: {
    'none': 'none',
    'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
    'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
    'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
    'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
    'inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  
  // Transitions
  transitions: {
    'default': '0.3s ease',
    'fast': '0.15s ease',
    'slow': '0.5s ease'
  },
  
  // Z-index
  zIndex: {
    'base': 0,
    'dropdown': 1000,
    'sticky': 1020,
    'fixed': 1030,
    'modal-backdrop': 1040,
    'modal': 1050,
    'popover': 1060,
    'tooltip': 1070
  },
  
  // Breakpoints
  breakpoints: {
    'xs': '0px',
    'sm': '576px',
    'md': '768px',
    'lg': '992px',
    'xl': '1200px',
    '2xl': '1400px'
  }
};

export default defaultTheme;
