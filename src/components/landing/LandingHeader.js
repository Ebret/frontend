import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import MobileNavigation from './MobileNavigation';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { t } from '@/utils/i18n';
import { trackEvent } from '@/utils/analytics';

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMobileMenuOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  // Track navigation clicks
  const handleNavClick = (linkName) => {
    trackEvent('Navigation', 'Link Click', linkName);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Cooperative E-Wallet"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span
                className={`ml-3 font-bold text-xl ${
                  isScrolled ? 'text-blue-600' : 'text-white'
                }`}
              >
                CoopWallet
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className={`font-medium ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-100'
              } transition-colors`}
              onClick={() => handleNavClick('Features')}
            >
              {t('common.features', router.locale)}
            </Link>
            <Link
              href="/pricing"
              className={`font-medium ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-100'
              } transition-colors`}
              onClick={() => handleNavClick('Pricing')}
            >
              {t('common.pricing', router.locale)}
            </Link>
            <Link
              href="/about"
              className={`font-medium ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-100'
              } transition-colors`}
              onClick={() => handleNavClick('About Us')}
            >
              {t('common.about', router.locale)}
            </Link>
            <Link
              href="/contact"
              className={`font-medium ${
                isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-100'
              } transition-colors`}
              onClick={() => handleNavClick('Contact')}
            >
              {t('common.contact', router.locale)}
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className={`font-medium ${
                isScrolled
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-white hover:text-blue-100'
              } transition-colors`}
              onClick={() => handleNavClick('Login')}
            >
              {t('common.login', router.locale)}
            </Link>
            <Link
              href="/register"
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                isScrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-blue-600 hover:bg-blue-50'
              }`}
              onClick={() => handleNavClick('Sign Up')}
            >
              {t('common.signup', router.locale)}
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher className="ml-2" />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled ? 'text-gray-700 hover:text-blue-600 hover:bg-gray-100' : 'text-white hover:text-blue-100 hover:bg-blue-700'
              }`}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigation isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
};

export default LandingHeader;
