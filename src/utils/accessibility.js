/**
 * Enhanced Accessibility Utilities for Credit Cooperative System
 *
 * This module provides utilities for enhancing accessibility including:
 * - ARIA attributes for forms, dialogs, and tabs
 * - Keyboard navigation and focus management
 * - Screen reader support with announcements
 * - High contrast mode detection
 * - Reduced motion preferences
 * - Font size and text spacing adjustments
 * - Skip-to-content functionality
 */

/**
 * Generate ARIA attributes for a form field
 * @param {string} id - The field ID
 * @param {string} error - The error message (if any)
 * @returns {Object} - ARIA attributes
 */
export const getAriaAttributes = (id, error) => {
  const attributes = {
    'aria-invalid': !!error,
  };

  if (error) {
    attributes['aria-describedby'] = `${id}-error`;
  }

  return attributes;
};

/**
 * Generate ARIA attributes for a form field with description
 * @param {string} id - The field ID
 * @param {string} error - The error message (if any)
 * @param {boolean} hasDescription - Whether the field has a description
 * @returns {Object} - ARIA attributes
 */
export const getAriaAttributesWithDescription = (id, error, hasDescription) => {
  const attributes = getAriaAttributes(id, error);

  if (hasDescription) {
    attributes['aria-describedby'] = error
      ? `${id}-description ${id}-error`
      : `${id}-description`;
  }

  return attributes;
};

/**
 * Generate ARIA attributes for a dialog
 * @param {string} title - The dialog title
 * @param {string} description - The dialog description (if any)
 * @returns {Object} - ARIA attributes
 */
export const getDialogAriaAttributes = (title, description) => {
  const attributes = {
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': title ? `${title.replace(/\s+/g, '-').toLowerCase()}-title` : undefined,
  };

  if (description) {
    attributes['aria-describedby'] = `${description.replace(/\s+/g, '-').toLowerCase()}-description`;
  }

  return attributes;
};

/**
 * Generate ARIA attributes for a tab
 * @param {string} id - The tab ID
 * @param {boolean} selected - Whether the tab is selected
 * @returns {Object} - ARIA attributes
 */
export const getTabAriaAttributes = (id, selected) => {
  return {
    role: 'tab',
    'aria-selected': selected,
    'aria-controls': `${id}-panel`,
    id: `${id}-tab`,
    tabIndex: selected ? 0 : -1,
  };
};

/**
 * Generate ARIA attributes for a tab panel
 * @param {string} id - The tab ID
 * @returns {Object} - ARIA attributes
 */
export const getTabPanelAriaAttributes = (id) => {
  return {
    role: 'tabpanel',
    'aria-labelledby': `${id}-tab`,
    id: `${id}-panel`,
    tabIndex: 0,
  };
};

/**
 * Handle keyboard navigation for tabs
 * @param {Event} event - The keyboard event
 * @param {number} selectedIndex - The currently selected tab index
 * @param {number} tabCount - The total number of tabs
 * @param {Function} setSelectedIndex - Function to set the selected tab index
 */
export const handleTabKeyDown = (event, selectedIndex, tabCount, setSelectedIndex) => {
  let newIndex = selectedIndex;

  switch (event.key) {
    case 'ArrowRight':
      newIndex = (selectedIndex + 1) % tabCount;
      break;
    case 'ArrowLeft':
      newIndex = (selectedIndex - 1 + tabCount) % tabCount;
      break;
    case 'Home':
      newIndex = 0;
      break;
    case 'End':
      newIndex = tabCount - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  setSelectedIndex(newIndex);
  document.getElementById(`tab-${newIndex}`).focus();
};

/**
 * Skip to content link handler
 * @param {Event} event - The click event
 */
export const handleSkipToContent = (event) => {
  event.preventDefault();
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.tabIndex = -1;
    mainContent.focus();
  }
};

/**
 * Check if high contrast mode is enabled
 * @returns {boolean} - Whether high contrast mode is enabled
 */
export const isHighContrastMode = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(forced-colors: active)').matches;
};

/**
 * Check if reduced motion is preferred
 * @returns {boolean} - Whether reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} politeness - The politeness level ('polite' or 'assertive')
 */
export const announceToScreenReader = (message, politeness = 'polite') => {
  if (typeof document === 'undefined') return;

  const announcer = document.getElementById('sr-announcer');

  if (!announcer) {
    // Create announcer if it doesn't exist
    const newAnnouncer = document.createElement('div');
    newAnnouncer.id = 'sr-announcer';
    newAnnouncer.setAttribute('aria-live', politeness);
    newAnnouncer.setAttribute('aria-atomic', 'true');
    newAnnouncer.className = 'sr-only';
    document.body.appendChild(newAnnouncer);

    // Wait a moment before announcing to ensure screen readers pick it up
    setTimeout(() => {
      newAnnouncer.textContent = message;
    }, 100);
  } else {
    // Clear existing content first
    announcer.textContent = '';

    // Wait a moment before announcing to ensure screen readers pick it up
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }
};

// Default accessibility preferences
const defaultPreferences = {
  fontSize: 'medium', // small, medium, large, x-large
  contrast: 'normal', // normal, high, dark, light
  reducedMotion: false,
  focusIndicators: true,
  textSpacing: false,
  screenReader: false,
};

/**
 * Initialize accessibility features
 * @returns {Object} Current accessibility preferences
 */
export const initializeAccessibility = () => {
  // Get saved preferences
  const preferences = getSavedPreferences();

  // Apply preferences
  applyAccessibilityPreferences(preferences);

  // Add keyboard navigation enhancements
  enhanceKeyboardNavigation();

  // Add screen reader support
  enhanceScreenReaderSupport();

  return preferences;
};

/**
 * Get saved accessibility preferences
 * @returns {Object} Accessibility preferences
 */
export const getSavedPreferences = () => {
  try {
    const saved = localStorage.getItem('accessibilityPreferences');
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  } catch (error) {
    console.error('Error loading accessibility preferences:', error);
    return defaultPreferences;
  }
};

/**
 * Save accessibility preferences
 * @param {Object} preferences - Accessibility preferences
 */
export const savePreferences = (preferences) => {
  try {
    localStorage.setItem('accessibilityPreferences', JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving accessibility preferences:', error);
  }
};

/**
 * Apply accessibility preferences to the page
 * @param {Object} preferences - Accessibility preferences
 */
export const applyAccessibilityPreferences = (preferences) => {
  const html = document.documentElement;

  // Apply font size
  html.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
  switch (preferences.fontSize) {
    case 'small':
      html.classList.add('text-sm');
      break;
    case 'medium':
      html.classList.add('text-base');
      break;
    case 'large':
      html.classList.add('text-lg');
      break;
    case 'x-large':
      html.classList.add('text-xl');
      break;
  }

  // Apply contrast
  html.classList.remove('contrast-normal', 'contrast-high', 'contrast-dark', 'contrast-light');
  html.classList.add(`contrast-${preferences.contrast}`);

  // Apply reduced motion
  if (preferences.reducedMotion) {
    html.classList.add('reduced-motion');
  } else {
    html.classList.remove('reduced-motion');
  }

  // Apply focus indicators
  if (preferences.focusIndicators) {
    html.classList.add('focus-visible');
  } else {
    html.classList.remove('focus-visible');
  }

  // Apply text spacing
  if (preferences.textSpacing) {
    html.classList.add('increased-spacing');
  } else {
    html.classList.remove('increased-spacing');
  }

  // Apply screen reader support
  if (preferences.screenReader) {
    html.classList.add('screen-reader-mode');
  } else {
    html.classList.remove('screen-reader-mode');
  }
};

/**
 * Update a single accessibility preference
 * @param {string} key - Preference key
 * @param {any} value - Preference value
 */
export const updatePreference = (key, value) => {
  const preferences = getSavedPreferences();
  preferences[key] = value;

  // Save and apply updated preferences
  savePreferences(preferences);
  applyAccessibilityPreferences(preferences);

  return preferences;
};

/**
 * Reset accessibility preferences to defaults
 */
export const resetPreferences = () => {
  savePreferences(defaultPreferences);
  applyAccessibilityPreferences(defaultPreferences);

  return defaultPreferences;
};

/**
 * Enhance keyboard navigation
 */
export const enhanceKeyboardNavigation = () => {
  // Add skip to content link if not already present
  if (!document.getElementById('skip-to-content')) {
    addSkipToContentLink();
  }

  // Track focus state
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-user');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-user');
  });

  // Add keyboard shortcuts
  document.addEventListener('keydown', (event) => {
    // Only handle keyboard shortcuts with Alt key
    if (!event.altKey) {
      return;
    }

    switch (event.key) {
      case 'h': // Home
        event.preventDefault();
        window.location.href = '/';
        break;
      case 'd': // Dashboard
        event.preventDefault();
        window.location.href = '/dashboard';
        break;
      case 'p': // Profile
        event.preventDefault();
        window.location.href = '/profile';
        break;
      case 'a': // Toggle accessibility panel
        event.preventDefault();
        const accessibilityPanel = document.getElementById('accessibility-panel');
        if (accessibilityPanel) {
          accessibilityPanel.classList.toggle('hidden');
        }
        break;
    }
  });
};

/**
 * Add skip to content link
 */
export const addSkipToContentLink = () => {
  // Create skip link
  const skipLink = document.createElement('a');
  skipLink.id = 'skip-to-content';
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to content';

  // Add to document
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add main content ID if not present
  const main = document.querySelector('main');
  if (main && !main.id) {
    main.id = 'main-content';
  }

  // Add event listener
  skipLink.addEventListener('click', handleSkipToContent);
};

/**
 * Enhance screen reader support by adding appropriate ARIA roles and live regions
 */
export const enhanceScreenReaderSupport = () => {
  if (typeof document === 'undefined') return;

  // Define standard landmark roles for common elements
  const landmarks = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'footer', role: 'contentinfo' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'section[role="search"]', role: 'search' }
  ];

  // Add appropriate ARIA roles to landmarks
  landmarks.forEach(({ selector, role }) => {
    const element = document.querySelector(selector);
    if (element && !element.getAttribute('role')) {
      element.setAttribute('role', role);
    }
  });

  // Add aria-current to current navigation item
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // Define live regions to create
  const liveRegions = [
    { id: 'status-message', role: 'status', ariaLive: 'polite' },
    { id: 'alert-message', role: 'alert', ariaLive: 'assertive' }
  ];

  // Add live regions for dynamic content if not already present
  liveRegions.forEach(({ id, role, ariaLive }) => {
    if (!document.getElementById(id)) {
      const region = document.createElement('div');
      region.id = id;
      region.className = 'sr-only';
      region.setAttribute('role', role);
      region.setAttribute('aria-live', ariaLive);
      document.body.appendChild(region);
    }
  });
};
