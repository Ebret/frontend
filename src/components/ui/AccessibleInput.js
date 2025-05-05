import React, { forwardRef } from 'react';
import { getAriaAttributesWithDescription } from '@/utils/accessibility';

const AccessibleInput = forwardRef(
  (
    {
      id,
      label,
      type = 'text',
      error,
      description,
      required = false,
      className = '',
      labelClassName = '',
      inputClassName = '',
      errorClassName = '',
      descriptionClassName = '',
      hideLabel = false,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;
    const ariaAttributes = getAriaAttributesWithDescription(
      inputId,
      error,
      !!description
    );

    return (
      <div className={`mb-4 ${className}`}>
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium text-gray-700 mb-1 ${
            hideLabel ? 'sr-only' : ''
          } ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${
            error ? 'border-red-300' : ''
          } ${inputClassName}`}
          required={required}
          {...ariaAttributes}
          {...props}
        />
        
        {description && !error && (
          <p
            id={`${inputId}-description`}
            className={`mt-1 text-sm text-gray-500 ${descriptionClassName}`}
          >
            {description}
          </p>
        )}
        
        {error && (
          <p
            id={`${inputId}-error`}
            className={`mt-1 text-sm text-red-600 ${errorClassName}`}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput;
