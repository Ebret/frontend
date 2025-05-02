import { useState } from 'react';

type ValidationRule<T> = {
  validate: (value: T, formData?: Record<string, any>) => boolean;
  errorMessage: string;
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T>
) {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof T): boolean => {
    const fieldRules = validationRules[field];
    if (!fieldRules) return true;

    for (const rule of fieldRules) {
      if (!rule.validate(formData[field], formData)) {
        setErrors((prev) => ({ ...prev, [field]: rule.errorMessage }));
        return false;
      }
    }

    // Clear error if validation passes
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    return true;
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Partial<Record<keyof T, string>> = {};
    const newTouched: Partial<Record<keyof T, boolean>> = {};

    // Mark all fields as touched
    Object.keys(formData).forEach((key) => {
      newTouched[key as keyof T] = true;
    });

    // Validate all fields
    Object.keys(validationRules).forEach((field) => {
      const fieldKey = field as keyof T;
      const fieldRules = validationRules[fieldKey];
      
      if (!fieldRules) return;

      for (const rule of fieldRules) {
        if (!rule.validate(formData[fieldKey], formData)) {
          newErrors[fieldKey] = rule.errorMessage;
          isValid = false;
          break;
        }
      }
    });

    setErrors(newErrors);
    setTouched(newTouched);
    return isValid;
  };

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    formData,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateField,
    validateForm,
    resetForm,
    setFormData
  };
}

// Common validation rules
export const validationRules = {
  required: (fieldName: string): ValidationRule<any> => ({
    validate: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      return true;
    },
    errorMessage: `${fieldName} is required`
  }),
  
  email: (): ValidationRule<string> => ({
    validate: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    errorMessage: 'Please enter a valid email address'
  }),
  
  phoneNumber: (): ValidationRule<string> => ({
    validate: (value) => {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      return phoneRegex.test(value);
    },
    errorMessage: 'Please enter a valid phone number'
  }),
  
  password: (): ValidationRule<string> => ({
    validate: (value) => {
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(value);
    },
    errorMessage: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character'
  }),
  
  passwordMatch: (matchField: string): ValidationRule<string> => ({
    validate: (value, formData) => {
      return value === formData?.[matchField];
    },
    errorMessage: 'Passwords do not match'
  })
};
