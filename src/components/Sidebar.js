'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const router = useRouter();

  // Navigation items
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Wallet', href: '/wallet', icon: '💰' },
    { name: 'Transactions', href: '/transactions', icon: '📝' },
    { name: 'Loans', href: '/loans', icon: '💳' },
    { name: 'Damayan', href: '/damayan', icon: '🤝' },
    { name: 'Settings', href: '/settings', icon: '⚙️' },
  ];

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform ease-in-out duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <span className="text-xl font-semibold">Cooperative</span>
            </div>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
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
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                  router.pathname === item.href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200">
              <span className="text-xl font-semibold">Cooperative</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      router.pathname === item.href
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
