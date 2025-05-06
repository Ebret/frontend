import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { trackEvent } from '@/utils/analytics';

const LanguageSwitcher = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fil', name: 'Filipino', flag: '🇵🇭' },
    { code: 'ceb', name: 'Cebuano', flag: '🇵🇭' },
    { code: 'ilo', name: 'Ilocano', flag: '🇵🇭' },
  ];

  // Get current language
  const getCurrentLanguage = () => {
    const { locale } = router;
    return languages.find(lang => lang.code === locale) || languages[0];
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle language change
  const handleLanguageChange = (langCode) => {
    trackEvent('Language', 'Language Changed', langCode);
    setIsOpen(false);
  };

  const currentLanguage = getCurrentLanguage();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="mr-1">{currentLanguage.flag}</span>
        <span>{currentLanguage.name}</span>
        <svg
          className={`ml-2 h-4 w-4 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
          isOpen
            ? 'transform opacity-100 scale-100 z-50'
            : 'transform opacity-0 scale-95 -z-10'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="language-menu"
      >
        <div className="py-1" role="none">
          {languages.map((language) => (
            <Link
              key={language.code}
              href={router.asPath}
              locale={language.code}
              className={`flex items-center px-4 py-2 text-sm ${
                currentLanguage.code === language.code
                  ? 'bg-gray-100 text-gray-900 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              role="menuitem"
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="mr-2">{language.flag}</span>
              {language.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
