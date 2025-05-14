'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useScreenSize } from './ResponsiveWrapper';

/**
 * MobileNavigation Component
 * 
 * A responsive navigation component optimized for mobile devices
 * 
 * @param {Object} props
 * @param {Array} props.items - Navigation items
 * @param {string} props.logo - Logo URL
 * @param {string} props.logoAlt - Logo alt text
 * @param {React.ReactNode} props.rightContent - Content to display on the right side of the header
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.sticky - Whether the navigation should be sticky
 * @param {boolean} props.transparent - Whether the navigation should be transparent
 * @param {boolean} props.dark - Whether to use dark mode
 */
const MobileNavigation = ({
  items = [],
  logo,
  logoAlt = 'Logo',
  rightContent,
  className = '',
  sticky = false,
  transparent = false,
  dark = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  const navRef = useRef(null);
  
  // Handle scroll for transparent navigation
  useEffect(() => {
    if (transparent) {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        setScrolled(scrollPosition > 10);
      };
      
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [transparent]);
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);
  
  // Toggle submenu
  const toggleSubmenu = (index) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };
  
  // Check if a link is active
  const isActive = (href) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };
  
  return (
    <nav
      ref={navRef}
      className={`
        ${sticky ? 'sticky top-0 z-50' : 'relative'}
        ${transparent && !scrolled ? 'bg-transparent' : dark ? 'bg-gray-900' : 'bg-white'}
        ${transparent && scrolled ? 'shadow-md' : ''}
        ${transparent && scrolled ? (dark ? 'bg-gray-900/95' : 'bg-white/95') : ''}
        ${transparent && scrolled ? 'backdrop-blur-sm' : ''}
        transition-all duration-300
        ${className}
      `}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                {logo ? (
                  <img
                    className="h-8 w-auto"
                    src={logo}
                    alt={logoAlt}
                  />
                ) : (
                  <span className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
                    {logoAlt}
                  </span>
                )}
              </Link>
            </div>
            
            {/* Desktop navigation */}
            {!isMobile && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {items.map((item, index) => (
                  item.children ? (
                    <div key={index} className="relative">
                      <button
                        type="button"
                        onClick={() => toggleSubmenu(index)}
                        className={`
                          inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2
                          ${isActive(item.href)
                            ? `${dark ? 'border-white text-white' : 'border-indigo-500 text-gray-900'}`
                            : `${dark ? 'border-transparent text-gray-300 hover:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                          }
                        `}
                        aria-expanded={openSubmenu === index}
                      >
                        {item.label}
                        {openSubmenu === index ? (
                          <FiChevronUp className="ml-1 h-4 w-4" />
                        ) : (
                          <FiChevronDown className="ml-1 h-4 w-4" />
                        )}
                      </button>
                      
                      {openSubmenu === index && (
                        <div className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {item.children.map((child, childIndex) => (
                            <Link
                              key={childIndex}
                              href={child.href}
                              className={`
                                block px-4 py-2 text-sm
                                ${isActive(child.href)
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700 hover:bg-gray-100'
                                }
                              `}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={index}
                      href={item.href}
                      className={`
                        inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2
                        ${isActive(item.href)
                          ? `${dark ? 'border-white text-white' : 'border-indigo-500 text-gray-900'}`
                          : `${dark ? 'border-transparent text-gray-300 hover:text-white' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                        }
                      `}
                    >
                      {item.icon && (
                        <span className="mr-1">{item.icon}</span>
                      )}
                      {item.label}
                    </Link>
                  )
                ))}
              </div>
            )}
          </div>
          
          {/* Right content and mobile menu button */}
          <div className="flex items-center">
            {/* Right content */}
            {rightContent && (
              <div className="flex-shrink-0">
                {rightContent}
              </div>
            )}
            
            {/* Mobile menu button */}
            {isMobile && (
              <div className="flex items-center sm:hidden ml-4">
                <button
                  type="button"
                  className={`
                    inline-flex items-center justify-center p-2 rounded-md
                    ${dark
                      ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }
                    focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
                  `}
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
                  {isOpen ? (
                    <FiX className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <FiMenu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobile && (
        <div className={`sm:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <div className={`pt-2 pb-3 space-y-1 ${dark ? 'bg-gray-900' : 'bg-white'}`}>
            {items.map((item, index) => (
              <div key={index}>
                {item.children ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(index)}
                      className={`
                        w-full flex items-center justify-between
                        px-4 py-2 text-base font-medium
                        ${isActive(item.href)
                          ? `${dark ? 'bg-gray-800 text-white' : 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'}`
                          : `${dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                        }
                      `}
                      aria-expanded={openSubmenu === index}
                    >
                      <span>{item.label}</span>
                      {openSubmenu === index ? (
                        <FiChevronUp className="h-5 w-5" />
                      ) : (
                        <FiChevronDown className="h-5 w-5" />
                      )}
                    </button>
                    
                    {openSubmenu === index && (
                      <div className={`pl-4 ${dark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            href={child.href}
                            className={`
                              block px-4 py-2 text-base font-medium
                              ${isActive(child.href)
                                ? `${dark ? 'text-white' : 'text-indigo-700'}`
                                : `${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`
                              }
                            `}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                      block px-4 py-2 text-base font-medium
                      ${isActive(item.href)
                        ? `${dark ? 'bg-gray-800 text-white' : 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-500'}`
                        : `${dark ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
                      }
                    `}
                  >
                    <div className="flex items-center">
                      {item.icon && (
                        <span className="mr-2">{item.icon}</span>
                      )}
                      {item.label}
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileNavigation;
