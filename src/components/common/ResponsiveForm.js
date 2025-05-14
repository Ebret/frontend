'use client';

import React from 'react';
import { useScreenSize } from './ResponsiveWrapper';

/**
 * ResponsiveForm Component
 * 
 * A form component that adapts to different screen sizes
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form content
 * @param {Function} props.onSubmit - Form submit handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - Form ID
 * @param {boolean} props.loading - Whether the form is in a loading state
 * @param {string} props.submitText - Text for the submit button
 * @param {boolean} props.compact - Whether to use compact layout
 */
const ResponsiveForm = ({
  children,
  onSubmit,
  className = '',
  id,
  loading = false,
  submitText = 'Submit',
  compact = false,
}) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit && !loading) {
      onSubmit(e);
    }
  };
  
  return (
    <form
      id={id}
      onSubmit={handleSubmit}
      className={`w-full ${isMobile ? 'space-y-4' : 'space-y-6'} ${compact ? 'max-w-md' : 'max-w-2xl'} mx-auto ${className}`}
      noValidate
    >
      {children}
      
      {submitText && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`
              ${isMobile ? 'w-full py-2.5 text-sm' : 'px-6 py-3'}
              bg-indigo-600 text-white font-medium rounded-md
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
            `}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              submitText
            )}
          </button>
        </div>
      )}
    </form>
  );
};

/**
 * FormGroup Component
 * 
 * A responsive form group that adapts to different screen sizes
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form group content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.layout - Layout type ('horizontal', 'vertical', 'responsive')
 */
export const FormGroup = ({
  children,
  className = '',
  layout = 'responsive',
}) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  
  // Determine the layout based on the screen size and layout prop
  const isVertical = layout === 'vertical' || (layout === 'responsive' && isMobile);
  
  return (
    <div
      className={`
        ${isVertical ? 'flex flex-col space-y-2' : 'sm:flex sm:items-start sm:gap-4'}
        mb-4
        ${className}
      `}
    >
      {children}
    </div>
  );
};

/**
 * FormLabel Component
 * 
 * A responsive form label that adapts to different screen sizes
 * 
 * @param {Object} props
 * @param {string} props.htmlFor - ID of the form element this label is for
 * @param {React.ReactNode} props.children - Label content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.layout - Layout type ('horizontal', 'vertical', 'responsive')
 */
export const FormLabel = ({
  htmlFor,
  children,
  className = '',
  required = false,
  layout = 'responsive',
}) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  
  // Determine the layout based on the screen size and layout prop
  const isVertical = layout === 'vertical' || (layout === 'responsive' && isMobile);
  
  return (
    <label
      htmlFor={htmlFor}
      className={`
        block text-sm font-medium text-gray-700
        ${isVertical ? '' : 'sm:w-1/3 sm:text-right sm:pt-2'}
        ${className}
      `}
    >
      {children}
      {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
    </label>
  );
};

/**
 * FormControl Component
 * 
 * A responsive form control container that adapts to different screen sizes
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Form control content
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.layout - Layout type ('horizontal', 'vertical', 'responsive')
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 */
export const FormControl = ({
  children,
  className = '',
  layout = 'responsive',
  error,
  hint,
}) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  
  // Determine the layout based on the screen size and layout prop
  const isVertical = layout === 'vertical' || (layout === 'responsive' && isMobile);
  
  return (
    <div
      className={`
        ${isVertical ? 'w-full' : 'sm:w-2/3'}
        ${className}
      `}
    >
      {children}
      
      {hint && !error && (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ResponsiveForm;
