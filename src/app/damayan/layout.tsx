'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

export default function DamayanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { config } = useWhiteLabel();

  const navigation = [
    { name: 'Overview', href: '/damayan' },
    { name: 'Contribute', href: '/damayan/contribute' },
    { name: 'History', href: '/damayan/history' },
    { name: 'Notifications', href: '/damayan/notifications' },
    { name: 'Settings', href: '/damayan/settings' },
  ];

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Damayan</h1>
          <p className="mt-1 text-sm text-gray-500">
            Community support for members in need
          </p>

          {/* Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      isActive
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={
                      isActive
                        ? {
                            borderColor: config?.primaryColor || '#3b82f6',
                            color: config?.primaryColor || '#3b82f6',
                          }
                        : {}
                    }
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="mt-6">{children}</div>
        </div>
      </div>
    </Layout>
  );
}
