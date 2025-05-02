'use client';

import React from 'react';
import Link from 'next/link';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

const DataPrivacyFooter: React.FC = () => {
  const { config } = useWhiteLabel();
  
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/images/ph-data-privacy-logo.svg" 
            alt="Philippines Data Privacy Act Logo" 
            className="h-10 w-10"
          />
          <div className="text-xs text-gray-500">
            <p>
              {config.name} complies with the Data Privacy Act of 2012 (RA 10173)
            </p>
            <p>
              <Link href="/privacy-policy" className="text-indigo-600 hover:text-indigo-800">
                Privacy Policy
              </Link>
              {' • '}
              <Link href="/terms" className="text-indigo-600 hover:text-indigo-800">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          © {new Date().getFullYear()} {config.name}
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyFooter;
