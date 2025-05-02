import React, { useState, useEffect } from 'react';

type PhoneInputProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  placeholder = '+1 (XXX) XXX-XXXX',
  required = false,
  disabled = false,
  className = '',
  helpText,
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Remove all non-numeric characters except for the plus sign at the beginning
    const cleaned = input.replace(/[^\d+]/g, '');
    
    // Ensure only one plus sign at the beginning
    const formatted = cleaned.replace(/^\+*/, match => 
      match.length > 0 ? '+' : ''
    );
    
    setInputValue(formatted);
    onChange(formatted);
  };

  return (
    <div className={`mb-4 ${className}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type="tel"
        value={inputValue}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
          disabled ? 'bg-gray-100 text-gray-500' : ''
        }`}
      />
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PhoneInput;
