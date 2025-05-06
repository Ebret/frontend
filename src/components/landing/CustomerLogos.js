import React from 'react';
import Image from 'next/image';
import LazyLoad from '@/components/performance/LazyLoad';

const CustomerLogos = ({ 
  title = 'Trusted by credit cooperatives across the Philippines',
  logos = [],
  darkMode = false,
  className = ''
}) => {
  // Default logos if none provided
  const defaultLogos = [
    { name: 'ABC Cooperative', src: '/images/logos/placeholder-logo-1.svg', width: 120, height: 40 },
    { name: 'XYZ Credit Union', src: '/images/logos/placeholder-logo-2.svg', width: 120, height: 40 },
    { name: 'PQR Cooperative', src: '/images/logos/placeholder-logo-3.svg', width: 120, height: 40 },
    { name: 'LMN Credit Union', src: '/images/logos/placeholder-logo-4.svg', width: 120, height: 40 },
    { name: 'EFG Cooperative', src: '/images/logos/placeholder-logo-5.svg', width: 120, height: 40 },
  ];

  // Use provided logos or default ones
  const displayLogos = logos.length > 0 ? logos : defaultLogos;

  // Placeholder for when image is loading
  const logoPlaceholder = (
    <div className={`h-8 w-24 ${darkMode ? 'bg-white/20' : 'bg-gray-200'} rounded-md animate-pulse`}></div>
  );

  return (
    <div className={`text-center ${className}`}>
      <p className={`text-sm font-medium uppercase tracking-wider mb-6 ${darkMode ? 'text-blue-100' : 'text-gray-500'}`}>
        {title}
      </p>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
        {displayLogos.map((logo, index) => (
          <LazyLoad key={index} placeholder={logoPlaceholder}>
            {logo.src ? (
              <Image 
                src={logo.src} 
                alt={logo.name || `Client Logo ${index + 1}`} 
                width={logo.width || 120} 
                height={logo.height || 40}
                className={`h-8 w-auto ${darkMode ? 'opacity-70 hover:opacity-100' : 'opacity-60 hover:opacity-100'} transition-opacity`}
              />
            ) : (
              <div className={`h-8 w-24 ${darkMode ? 'bg-white/20' : 'bg-gray-200'} rounded-md flex items-center justify-center`}>
                <span className={`text-xs font-medium ${darkMode ? 'text-white/70' : 'text-gray-500'}`}>
                  {logo.name || `Logo ${index + 1}`}
                </span>
              </div>
            )}
          </LazyLoad>
        ))}
      </div>
    </div>
  );
};

export default CustomerLogos;
