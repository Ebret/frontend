import React from 'react';

type FormCheckboxProps = {
  id: string;
  name: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  helpText?: string;
};

const FormCheckbox: React.FC<FormCheckboxProps> = ({
  id,
  name,
  label,
  checked,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className = '',
  helpText,
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id={id}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
              error ? 'border-red-500' : ''
            } ${disabled ? 'bg-gray-100' : ''}`}
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={id}
            className={`font-medium ${
              disabled ? 'text-gray-500' : 'text-gray-700'
            }`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {helpText && !error && (
            <p className="text-gray-500">{helpText}</p>
          )}
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default FormCheckbox;
