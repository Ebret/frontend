import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { trackEvent } from '@/utils/analytics';

const MobileNavigation = ({ isOpen, onClose }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const menuRef = useRef(null);
  const router = useRouter();

  // Close menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      onClose();
    };

    router.events.on('routeChangeStart', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, onClose]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu);
  };

  // Track navigation clicks
  const trackNavClick = (linkName) => {
    trackEvent('Mobile Navigation', 'Link Click', linkName);
  };

  // Main navigation items
  const navItems = [
    {
      name: 'Features',
      href: '/features',
      submenu: [
        { name: 'Loan Management', href: '/features/loan-management' },
        { name: 'Savings Accounts', href: '/features/savings-accounts' },
        { name: 'Reporting & Analytics', href: '/features/reporting' },
        { name: 'Mobile Access', href: '/features/mobile-access' },
        { name: 'Security', href: '/features/security' },
      ],
    },
    {
      name: 'Pricing',
      href: '/pricing',
      submenu: null,
    },
    {
      name: 'Resources',
      href: '/resources',
      submenu: [
        { name: 'Documentation', href: '/resources/documentation' },
        { name: 'API Reference', href: '/resources/api' },
        { name: 'Tutorials', href: '/resources/tutorials' },
        { name: 'Blog', href: '/blog' },
      ],
    },
    {
      name: 'About',
      href: '/about',
      submenu: [
        { name: 'Our Story', href: '/about/story' },
        { name: 'Team', href: '/about/team' },
        { name: 'Careers', href: '/about/careers' },
        { name: 'Contact', href: '/contact' },
      ],
    },
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu panel */}
      <div
        ref={menuRef}
        className={`absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
          <button
            type="button"
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="px-4 py-6 overflow-y-auto h-[calc(100%-64px)]">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name} className="border-b border-gray-100 pb-2">
                {item.submenu ? (
                  <div>
                    <button
                      className="flex items-center justify-between w-full py-2 text-left text-gray-700 hover:text-blue-600"
                      onClick={() => toggleSubmenu(item.name)}
                      aria-expanded={activeSubmenu === item.name}
                    >
                      <span className="font-medium">{item.name}</span>
                      <svg
                        className={`h-5 w-5 transform transition-transform ${
                          activeSubmenu === item.name ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Submenu */}
                    <div
                      className={`mt-2 pl-4 space-y-2 overflow-hidden transition-all duration-300 ${
                        activeSubmenu === item.name ? 'max-h-96' : 'max-h-0'
                      }`}
                    >
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.name}
                          href={subitem.href}
                          className="block py-2 text-sm text-gray-600 hover:text-blue-600"
                          onClick={() => trackNavClick(`${item.name} - ${subitem.name}`)}
                        >
                          {subitem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-2 font-medium text-gray-700 hover:text-blue-600"
                    onClick={() => trackNavClick(item.name)}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          
          {/* Call to action buttons */}
          <div className="mt-8 space-y-4">
            <Link
              href="/login"
              className="block w-full py-2 text-center font-medium text-blue-600 hover:text-blue-700"
              onClick={() => trackNavClick('Login')}
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="block w-full py-2 text-center font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              onClick={() => trackNavClick('Sign Up')}
            >
              Sign Up
            </Link>
          </div>
          
          {/* Contact info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">Need help?</p>
            <a
              href="tel:+639123456789"
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 mb-2"
              onClick={() => trackNavClick('Phone')}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +63 912 345 6789
            </a>
            <a
              href="mailto:support@cooperative-ewallet.com"
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
              onClick={() => trackNavClick('Email')}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              support@cooperative-ewallet.com
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default MobileNavigation;
