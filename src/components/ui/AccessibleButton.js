import React, { forwardRef } from 'react';
import { Spinner } from '@/components/ui';

const AccessibleButton = forwardRef(
  (
    {
      children,
      type = 'button',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      className = '',
      loadingText = 'Loading...',
      icon = null,
      iconPosition = 'left',
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    // Determine base classes based on variant
    const baseClasses = {
      primary:
        'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white',
      secondary:
        'bg-white hover:bg-gray-50 focus:ring-indigo-500 text-gray-700 border border-gray-300',
      danger:
        'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
      success:
        'bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white',
      link:
        'bg-transparent hover:underline focus:ring-indigo-500 text-indigo-600 p-0',
    };

    // Determine size classes
    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    // Skip animation if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center font-medium rounded-md
          focus:outline-none focus:ring-2 focus:ring-offset-2
          transition-colors
          ${prefersReducedMotion ? 'transition-none' : 'duration-150 ease-in-out'}
          ${baseClasses[variant] || baseClasses.primary}
          ${sizeClasses[size] || sizeClasses.md}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading && (
          <>
            <Spinner
              size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}
              className={`${children ? 'mr-2' : ''}`}
            />
            <span className="sr-only">{loadingText}</span>
          </>
        )}
        
        {!isLoading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!isLoading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
