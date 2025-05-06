'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import ConnectionStatus from './ConnectionStatus';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { config, isLoading } = useWhiteLabel();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ConnectionStatus />
    </div>
  );
};

export default Layout;
