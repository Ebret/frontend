'use client';

import React from 'react';
import { handleSkipToContent } from '@/utils/accessibility';

const SkipToContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      onClick={handleSkipToContent}
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
