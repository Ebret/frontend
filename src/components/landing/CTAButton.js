import React from 'react';
import Link from 'next/link';

const CTAButton = ({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  ...props
}) => {
  // Determine base classes based on variant
  const baseClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white hover:bg-gray-100 text-blue-600 border border-blue-600',
    outline: 'bg-transparent hover:bg-blue-50 text-blue-600 border border-blue-600',
    white: 'bg-white hover:bg-gray-100 text-blue-600',
  };

  // Determine size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-colors duration-300
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${baseClasses[variant] || baseClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${className}
  `;

  // If href is provided, render as Link
  if (href) {
    return (
      <Link href={href} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }

  // Otherwise, render as button
  return (
    <button className={buttonClasses} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default CTAButton;
