/**
 * Enhanced Internationalization Utilities for Credit Cooperative System
 *
 * This module provides comprehensive utilities for internationalization including:
 * - Translation functions
 * - Language detection and switching
 * - Date and number formatting
 * - Currency formatting (with Philippine Peso ₱ symbol)
 * - Relative time formatting
 * - Percentage formatting
 */

// Default language
const DEFAULT_LOCALE = 'en';

// Available languages
export const AVAILABLE_LOCALES = ['en', 'fil', 'ceb', 'ilo'];

// Language names for display
export const LANGUAGE_NAMES = {
  en: 'English',
  fil: 'Filipino',
  ceb: 'Cebuano',
  ilo: 'Ilocano',
};

// Map our locale codes to Intl locale codes
export const LOCALE_MAP = {
  en: 'en-US',
  fil: 'fil-PH',
  ceb: 'ceb-PH',
  ilo: 'ilo-PH',
};

// Get browser language
export const getBrowserLanguage = () => {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE;

  const browserLang = navigator.language.split('-')[0];
  return AVAILABLE_LOCALES.includes(browserLang) ? browserLang : DEFAULT_LOCALE;
};

// Get user's preferred language from localStorage
export const getUserLanguage = () => {
  if (typeof localStorage === 'undefined') return DEFAULT_LOCALE;

  const savedLocale = localStorage.getItem('userLanguage');
  return savedLocale && AVAILABLE_LOCALES.includes(savedLocale) ? savedLocale : getBrowserLanguage();
};

// Set user's preferred language
export const setUserLanguage = (locale) => {
  if (typeof localStorage === 'undefined') return;

  const selectedLocale = AVAILABLE_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  localStorage.setItem('userLanguage', selectedLocale);

  // Update HTML lang attribute
  if (typeof document !== 'undefined') {
    document.documentElement.lang = selectedLocale;
  }

  return selectedLocale;
};

// Translations
const translations = {
  en: {
    common: {
      login: 'Log In',
      signup: 'Sign Up',
      features: 'Features',
      pricing: 'Pricing',
      about: 'About Us',
      contact: 'Contact',
      getStarted: 'Get Started',
      learnMore: 'Learn More',
      requestDemo: 'Request Demo',
    },
    home: {
      hero: {
        title: 'Modern Credit Cooperative System',
        subtitle: 'A comprehensive financial management solution for credit cooperatives. Streamline operations, enhance member experience, and drive growth with our integrated platform.',
        cta: 'Get Started Free',
        demo: 'Request Demo',
      },
      features: {
        title: 'Comprehensive Features for Modern Cooperatives',
        subtitle: 'Our system provides a complete suite of tools to manage all aspects of your credit cooperative operations efficiently and securely.',
        loanManagement: {
          title: 'Loan Management',
          description: 'Streamline the entire loan lifecycle from application to disbursement and repayment tracking with automated workflows.',
        },
        savingsAccounts: {
          title: 'Savings Accounts',
          description: 'Manage various types of savings accounts with automated interest calculations and detailed member statements.',
        },
        reporting: {
          title: 'Reporting & Analytics',
          description: 'Generate comprehensive reports and gain insights into your cooperative\'s financial performance with advanced analytics.',
        },
        mobileAccess: {
          title: 'Mobile Access',
          description: 'Provide members with secure mobile access to their accounts, loan applications, and transaction history anytime, anywhere.',
        },
        security: {
          title: 'Security & Compliance',
          description: 'Ensure data security and regulatory compliance with role-based access control, audit trails, and encryption.',
        },
        whiteLabel: {
          title: 'White-Label Solution',
          description: 'Customize the platform with your cooperative\'s branding, colors, and logo for a seamless member experience.',
        },
      },
      testimonials: {
        title: 'What Our Clients Say',
        subtitle: 'Hear from credit cooperatives that have transformed their operations with our system.',
      },
      pricing: {
        title: 'Transparent Pricing',
        subtitle: 'Choose the plan that fits your cooperative\'s needs and budget. No hidden fees, no surprises.',
        noHiddenFees: 'No Hidden Fees',
        flexibleScaling: 'Flexible Scaling',
        freeSupport: 'Free Support',
      },
      howItWorks: {
        title: 'How It Works',
        subtitle: 'Getting started with our cooperative system is simple and straightforward.',
        step1: {
          title: 'Sign Up',
          description: 'Create your account and set up your cooperative\'s profile with basic information.',
        },
        step2: {
          title: 'Customize',
          description: 'Configure your system settings, add users, and customize the platform to match your branding.',
        },
        step3: {
          title: 'Go Live',
          description: 'Import your data, train your staff, and start managing your cooperative more efficiently.',
        },
      },
      cta: {
        title: 'Ready to Transform Your Cooperative?',
        subtitle: 'Join hundreds of credit cooperatives that have enhanced their operations and member experience with our system.',
        primary: 'Get Started Free',
        secondary: 'Contact Sales',
      },
    },
  },
  fil: {
    common: {
      login: 'Mag-login',
      signup: 'Mag-sign Up',
      features: 'Mga Feature',
      pricing: 'Presyo',
      about: 'Tungkol sa Amin',
      contact: 'Makipag-ugnayan',
      getStarted: 'Magsimula',
      learnMore: 'Alamin pa',
      requestDemo: 'Humiling ng Demo',
    },
    home: {
      hero: {
        title: 'Modernong Sistema ng Credit Cooperative',
        subtitle: 'Isang komprehensibong solusyon sa pamamahala ng pananalapi para sa mga credit cooperative. Gawing mas maayos ang operasyon, pahusayin ang karanasan ng miyembro, at palakasin ang paglago gamit ang aming integrated platform.',
        cta: 'Magsimula nang Libre',
        demo: 'Humiling ng Demo',
      },
      features: {
        title: 'Komprehensibong Mga Feature para sa Modernong Kooperatiba',
        subtitle: 'Ang aming sistema ay nagbibigay ng kumpletong hanay ng mga tool upang pamahalaan ang lahat ng aspeto ng inyong operasyon ng credit cooperative nang mabisa at ligtas.',
        loanManagement: {
          title: 'Pamamahala ng Pautang',
          description: 'Gawing mas maayos ang buong siklo ng pautang mula sa aplikasyon hanggang sa pagbibigay at pagsubaybay ng pagbabayad gamit ang mga awtomatikong workflow.',
        },
        savingsAccounts: {
          title: 'Mga Savings Account',
          description: 'Pamahalaan ang iba\'t ibang uri ng savings account na may awtomatikong kalkulasyon ng interes at detalyadong mga statement ng miyembro.',
        },
        reporting: {
          title: 'Pag-uulat at Analytics',
          description: 'Gumawa ng komprehensibong mga ulat at makakuha ng mga insight sa financial performance ng inyong kooperatiba gamit ang advanced analytics.',
        },
        mobileAccess: {
          title: 'Mobile Access',
          description: 'Bigyan ang mga miyembro ng secure na mobile access sa kanilang mga account, aplikasyon ng pautang, at kasaysayan ng transaksyon anumang oras, saanman.',
        },
        security: {
          title: 'Seguridad at Compliance',
          description: 'Tiyakin ang seguridad ng data at pagsunod sa regulasyon gamit ang role-based access control, audit trails, at encryption.',
        },
        whiteLabel: {
          title: 'White-Label na Solusyon',
          description: 'I-customize ang platform gamit ang branding, kulay, at logo ng inyong kooperatiba para sa isang seamless na karanasan ng miyembro.',
        },
      },
      // Additional translations would continue here
    },
  },
  // Additional languages would be added here
};

/**
 * Get translation for a key
 * @param {string} key - The translation key in dot notation (e.g., 'common.login')
 * @param {string} locale - The locale to use
 * @param {object} params - Parameters to replace in the translation
 * @returns {string} - The translated string
 */
export const t = (key, locale = DEFAULT_LOCALE, params = {}) => {
  // Use the specified locale or fall back to default
  const selectedLocale = AVAILABLE_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  // Split the key into parts
  const parts = key.split('.');

  // Navigate through the translations object
  let translation = translations[selectedLocale];
  for (const part of parts) {
    if (!translation || !translation[part]) {
      // If translation not found, try in default locale
      if (selectedLocale !== DEFAULT_LOCALE) {
        return t(key, DEFAULT_LOCALE, params);
      }
      // If still not found, return the key
      return key;
    }
    translation = translation[part];
  }

  // Replace parameters in the translation
  if (typeof translation === 'string' && params) {
    return Object.entries(params).reduce(
      (str, [param, value]) => str.replace(new RegExp(`{{${param}}}`, 'g'), value),
      translation
    );
  }

  return translation;
};

/**
 * Format a number according to the locale
 * @param {number} number - The number to format
 * @param {string} locale - The locale to use
 * @param {object} options - Intl.NumberFormat options
 * @returns {string} - The formatted number
 */
export const formatNumber = (number, locale = DEFAULT_LOCALE, options = {}) => {
  const selectedLocale = AVAILABLE_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  return new Intl.NumberFormat(LOCALE_MAP[selectedLocale], options).format(number);
};

/**
 * Format a currency amount according to the locale
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: PHP)
 * @param {string} locale - The locale to use
 * @returns {string} - The formatted currency amount with Philippine Peso symbol (₱)
 */
export const formatCurrency = (amount, currency = 'PHP', locale = DEFAULT_LOCALE) => {
  // Use the formatNumber function with currency style
  const formatted = formatNumber(amount, locale, {
    style: 'currency',
    currency,
    currencyDisplay: 'symbol',
  });

  // For PHP currency, ensure we use the proper Peso symbol (₱)
  if (currency === 'PHP') {
    // Some browsers/systems might not show the correct peso symbol
    // Replace with the proper peso symbol if needed
    return formatted.replace(/PHP|P/, '₱');
  }

  return formatted;
};

/**
 * Format a date according to the locale
 * @param {Date|string|number} date - The date to format
 * @param {string} locale - The locale to use
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - The formatted date
 */
export const formatDate = (date, locale = DEFAULT_LOCALE, options = {}) => {
  const selectedLocale = AVAILABLE_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const dateObj = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat(LOCALE_MAP[selectedLocale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
};

/**
 * Format a date and time according to the locale
 * @param {Date|string|number} date - The date to format
 * @param {string} locale - The locale to use
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - The formatted date and time
 */
export const formatDateTime = (date, locale = DEFAULT_LOCALE, options = {}) => {
  const selectedLocale = AVAILABLE_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const dateObj = date instanceof Date ? date : new Date(date);

  return new Intl.DateTimeFormat(LOCALE_MAP[selectedLocale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    ...options,
  }).format(dateObj);
};

/**
 * Format relative time based on user locale
 * @param {Date|string|number} date - Date to format
 * @param {string} locale - The locale to use
 * @returns {string} - Formatted relative time
 */
export const formatRelativeTime = (date, locale = DEFAULT_LOCALE) => {
  const selectedLocale = AVAILABLE_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  // Create date object if string or number
  const dateObj = date instanceof Date ? date : new Date(date);

  // Get time difference in seconds
  const now = new Date();
  const diffSeconds = Math.floor((now - dateObj) / 1000);

  // Get absolute difference
  const absDiffSeconds = Math.abs(diffSeconds);

  // Define time units
  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ];

  // Find appropriate unit
  for (const { unit, seconds } of units) {
    if (absDiffSeconds >= seconds) {
      const value = Math.floor(absDiffSeconds / seconds);
      const rtf = new Intl.RelativeTimeFormat(LOCALE_MAP[selectedLocale], { numeric: 'auto' });
      return rtf.format(diffSeconds < 0 ? value : -value, unit);
    }
  }

  // Fallback for "just now"
  const rtf = new Intl.RelativeTimeFormat(LOCALE_MAP[selectedLocale], { numeric: 'auto' });
  return rtf.format(0, 'second');
};

/**
 * Format percentage based on user locale
 * @param {number} number - Number to format (0-1)
 * @param {string} locale - The locale to use
 * @param {object} options - Intl.NumberFormat options
 * @returns {string} - Formatted percentage
 */
export const formatPercentage = (number, locale = DEFAULT_LOCALE, options = {}) => {
  const selectedLocale = AVAILABLE_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;

  // Default options
  const defaultOptions = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  // Merge options
  const formatOptions = { ...defaultOptions, ...options };

  // Format percentage
  return new Intl.NumberFormat(LOCALE_MAP[selectedLocale], formatOptions).format(number);
};
