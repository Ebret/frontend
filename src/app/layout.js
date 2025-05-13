'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { CooperativeProvider } from '@/contexts/CooperativeContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CooperativeProvider>
          {children}
        </CooperativeProvider>
      </body>
    </html>
  );
}
