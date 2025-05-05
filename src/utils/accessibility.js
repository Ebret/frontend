/**
 * Utility functions for accessibility
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
