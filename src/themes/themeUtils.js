/**
 * Theme Utility Functions
 * 
 * This file contains utility functions for working with themes
 * without creating circular dependencies.
 */

/**
 * Create a custom theme by merging with a base theme
 * @param {Object} baseTheme - Base theme to extend
 * @param {Object} customizations - Custom theme properties
 * @returns {Object} Custom theme
 */
export const createCustomTheme = (baseTheme, customizations) => {
  return {
    ...baseTheme,
    ...customizations,
    colors: {
      ...baseTheme.colors,
      ...(customizations.colors || {})
    },
    typography: {
      ...baseTheme.typography,
      ...(customizations.typography || {}),
      fonts: {
        ...baseTheme.typography.fonts,
        ...(customizations.typography?.fonts || {})
      },
      sizes: {
        ...baseTheme.typography.sizes,
        ...(customizations.typography?.sizes || {})
      }
    },
    spacing: {
      ...baseTheme.spacing,
      ...(customizations.spacing || {})
    },
    borderRadius: {
      ...baseTheme.borderRadius,
      ...(customizations.borderRadius || {})
    },
    shadows: {
      ...baseTheme.shadows,
      ...(customizations.shadows || {})
    },
    transitions: {
      ...baseTheme.transitions,
      ...(customizations.transitions || {})
    }
  };
};

/**
 * Get CSS variables from a theme object
 * @param {Object} theme - Theme object
 * @returns {Object} CSS variables object
 */
export const getThemeVariables = (theme) => {
  const variables = {};

  // Process colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    variables[`--color-${key}`] = value;
  });

  // Process typography
  Object.entries(theme.typography.fonts).forEach(([key, value]) => {
    variables[`--font-${key}`] = value;
  });

  Object.entries(theme.typography.sizes).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = value;
  });

  // Process spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value;
  });

  // Process border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    variables[`--radius-${key}`] = value;
  });

  // Process shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    variables[`--shadow-${key}`] = value;
  });

  // Process transitions
  Object.entries(theme.transitions).forEach(([key, value]) => {
    variables[`--transition-${key}`] = value;
  });

  return variables;
};

/**
 * Apply theme variables to an element
 * @param {HTMLElement} element - Element to apply theme to
 * @param {Object} theme - Theme object
 */
export const applyTheme = (element, theme) => {
  const variables = getThemeVariables(theme);

  Object.entries(variables).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });
};

/**
 * Get a color with opacity
 * @param {string} color - Hex color
 * @param {number} opacity - Opacity value (0-1)
 * @returns {string} RGBA color
 */
export const getColorWithOpacity = (color, opacity) => {
  // Convert hex to rgb
  let r, g, b;

  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (color.startsWith('rgb')) {
    const rgbValues = color.match(/\d+/g);
    r = parseInt(rgbValues[0], 10);
    g = parseInt(rgbValues[1], 10);
    b = parseInt(rgbValues[2], 10);
  } else {
    return color;
  }

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
