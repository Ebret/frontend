'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import NotificationBell from './notifications/NotificationBell';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { config } = useWhiteLabel();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                {config.logo ? (
                  <Image
                    src={config.logo}
                    alt={config.name}
                    width={40}
                    height={40}
                    className="h-8 w-auto"
                    priority
                  />
                ) : (
                  <div
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                )}
                <span
                  className="ml-2 text-xl font-bold"
                  style={{ color: config.primaryColor }}
                >
                  {config.name}
                </span>
              </Link>
            </div>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Home
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/loans"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Loans
                  </Link>
                  <Link
                    href="/savings"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Savings
                  </Link>
                  <Link
                    href="/damayan"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  >
                    Damayan
                  </Link>
                  {(user?.role === 'ADMIN' || user?.role === 'CREDIT_OFFICER' || user?.role === 'MANAGER' || user?.role === 'ACCOUNTANT') && (
                    <Link
                      href="/admin/loans"
                      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                      Loan Management
                    </Link>
                  )}
                  {(user?.role === 'ADMIN' || user?.role === 'MANAGER' || user?.role === 'BOARD_MEMBER') && (
                    <Link
                      href="/admin/damayan"
                      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                      Damayan Admin
                    </Link>
                  )}
                  {user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
              <Link
                href="/about"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <NotificationBell />
                <span className="text-sm text-gray-700">
                  Hello, {user?.firstName}
                </span>
                <div className="relative">
                  <button
                    type="button"
                    className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    id="user-menu-button"
                  >
                    <span className="sr-only">Open user menu</span>
                    {user?.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {user?.firstName?.[0]}
                          {user?.lastName?.[0]}
                        </span>
                      </div>
                    )}
                  </button>
                </div>
                <button
                  onClick={() => logout()}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
