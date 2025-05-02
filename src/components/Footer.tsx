'use client';

import React from 'react';
import Link from 'next/link';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

const Footer: React.FC = () => {
  const { config } = useWhiteLabel();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-xl font-bold mb-4" style={{ color: config.primaryColor }}>
              {config.name}
            </h2>
            <p className="text-gray-300 mb-4">
              A comprehensive financial management system for credit cooperatives.
            </p>
            {config.address && (
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Address:</span> {config.address}
              </p>
            )}
            {config.phoneNumber && (
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Phone:</span> {config.phoneNumber}
              </p>
            )}
            {config.email && (
              <p className="text-gray-300 mb-2">
                <span className="font-semibold">Email:</span> {config.email}
              </p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Member Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/loans" className="text-gray-300 hover:text-white">
                  Loans
                </Link>
              </li>
              <li>
                <Link href="/savings" className="text-gray-300 hover:text-white">
                  Savings
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-300 hover:text-white">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-gray-300 text-sm text-center">
            &copy; {year} {config.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
