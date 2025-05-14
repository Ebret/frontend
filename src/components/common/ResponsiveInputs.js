'use client';

import React, { forwardRef } from 'react';
import { useScreenSize } from './ResponsiveWrapper';
import { FormGroup, FormLabel, FormControl } from './ResponsiveForm';

/**
 * TextInput Component
 * 
 * A responsive text input that adapts to different screen sizes
 * 
 * @param {Object} props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Input change handler
 * @param {string} props.type - Input type
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.required - Whether the input is required
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.layout - Layout type ('horizontal', 'vertical', 'responsive')
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {boolean} props.readOnly - Whether the input is read-only
 * @param {string} props.autoComplete - Input autocomplete attribute
 */
export const TextInput = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  hint,
  className = '',
  layout = 'responsive',
  disabled = false,
  readOnly = false,
  autoComplete,
  ...rest
}, ref) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  
  return (
    <FormGroup layout={layout}>
      {label && (
        <FormLabel htmlFor={id} required={required} layout={layout}>
          {label}
        </FormLabel>
      )}
      
      <FormControl error={error} hint={hint} layout={layout}>
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${isMobile ? 'text-base py-2.5' : 'text-sm py-2'}
            ${className}
          `}
          {...rest}
        />
        
        {error && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>
        )}
        
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>
        )}
      </FormControl>
    </FormGroup>
  );
});

TextInput.displayName = 'TextInput';

/**
 * TextArea Component
 * 
 * A responsive textarea that adapts to different screen sizes
 * 
 * @param {Object} props
 * @param {string} props.id - Textarea ID
 * @param {string} props.name - Textarea name
 * @param {string} props.label - Textarea label
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Textarea change handler
 * @param {string} props.placeholder - Textarea placeholder
 * @param {boolean} props.required - Whether the textarea is required
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.layout - Layout type ('horizontal', 'vertical', 'responsive')
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {boolean} props.readOnly - Whether the textarea is read-only
 * @param {number} props.rows - Number of rows
 */
export const TextArea = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  hint,
  className = '',
  layout = 'responsive',
  disabled = false,
  readOnly = false,
  rows = 4,
  ...rest
}, ref) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  
  return (
    <FormGroup layout={layout}>
      {label && (
        <FormLabel htmlFor={id} required={required} layout={layout}>
          {label}
        </FormLabel>
      )}
      
      <FormControl error={error} hint={hint} layout={layout}>
        <textarea
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${isMobile ? 'text-base' : 'text-sm'}
            ${className}
          `}
          {...rest}
        />
        
        {error && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>
        )}
        
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>
        )}
      </FormControl>
    </FormGroup>
  );
});

TextArea.displayName = 'TextArea';

/**
 * Select Component
 * 
 * A responsive select that adapts to different screen sizes
 * 
 * @param {Object} props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} props.label - Select label
 * @param {string} props.value - Select value
 * @param {Function} props.onChange - Select change handler
 * @param {Array} props.options - Select options
 * @param {boolean} props.required - Whether the select is required
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.layout - Layout type ('horizontal', 'vertical', 'responsive')
 * @param {boolean} props.disabled - Whether the select is disabled
 */
export const Select = forwardRef(({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  required = false,
  error,
  hint,
  className = '',
  layout = 'responsive',
  disabled = false,
  ...rest
}, ref) => {
  const screenSize = useScreenSize();
  const isMobile = screenSize === 'mobile';
  
  return (
    <FormGroup layout={layout}>
      {label && (
        <FormLabel htmlFor={id} required={required} layout={layout}>
          {label}
        </FormLabel>
      )}
      
      <FormControl error={error} hint={hint} layout={layout}>
        <select
          ref={ref}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`
            block w-full rounded-md border-gray-300 shadow-sm
            focus:border-indigo-500 focus:ring-indigo-500
            disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500' : ''}
            ${isMobile ? 'text-base py-2.5' : 'text-sm py-2'}
            ${className}
          `}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {error && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>
        )}
        
        {hint && !error && (
          <p id={`${id}-hint`} className="mt-1 text-xs text-gray-500">{hint}</p>
        )}
      </FormControl>
    </FormGroup>
  );
});

Select.displayName = 'Select';

/**
 * Checkbox Component
 * 
 * A responsive checkbox that adapts to different screen sizes
 * 
 * @param {Object} props
 * @param {string} props.id - Checkbox ID
 * @param {string} props.name - Checkbox name
 * @param {string} props.label - Checkbox label
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onChange - Checkbox change handler
 * @param {boolean} props.required - Whether the checkbox is required
 * @param {string} props.error - Error message
 * @param {string} props.hint - Hint text
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the checkbox is disabled
 */
export const Checkbox = forwardRef(({
  id,
  name,
  label,
  checked,
  onChange,
  required = false,
  error,
  hint,
  className = '',
  disabled = false,
  ...rest
}, ref) => {
  return (
    <div className={`relative flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`
            h-4 w-4 rounded border-gray-300 text-indigo-600
            focus:ring-indigo-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:ring-red-500' : ''}
          `}
          {...rest}
        />
      </div>
      <div className="ml-3 text-sm">
        {label && (
          <label htmlFor={id} className={`font-medium text-gray-700 ${disabled ? 'opacity-50' : ''}`}>
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        
        {hint && !error && (
          <p id={`${id}-hint`} className="text-xs text-gray-500">{hint}</p>
        )}
        
        {error && (
          <p id={`${id}-error`} className="text-xs text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
