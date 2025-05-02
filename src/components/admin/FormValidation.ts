// Comprehensive field validation utilities for forms

export interface ValidationError {
  field: string;
  message: string;
}

// Email validation with domain check
export const validateEmail = (email: string): string => {
  if (!email) return 'Email is required';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address';

  // Check for common domain errors
  const domain = email.split('@')[1];
  if (domain) {
    // Check for common typos in popular domains
    const commonTypos: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'gmal.com': 'gmail.com',
      'gmail.co': 'gmail.com',
      'hotmial.com': 'hotmail.com',
      'hotmal.com': 'hotmail.com',
      'yaho.com': 'yahoo.com',
      'yahooo.com': 'yahoo.com',
      'outloo.com': 'outlook.com',
      'outlok.com': 'outlook.com'
    };

    if (commonTypos[domain]) {
      return `Did you mean ${email.split('@')[0]}@${commonTypos[domain]}?`;
    }
  }

  return '';
};

// Phone number validation with international support
export const validatePhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';  // Phone is optional

  // Remove spaces, dashes, parentheses
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, '');

  // Check if it starts with + and has 10-15 digits
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  if (!phoneRegex.test(cleaned)) {
    return 'Please enter a valid phone number (e.g., +1 555-123-4567)';
  }

  return '';
};

// Password strength evaluation
export const evaluatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | null => {
  if (!password) return null;

  // Check for various character types
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Count the number of character types present
  const characterTypesCount = [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;

  // Evaluate based on length and character types
  if (password.length < 8 || characterTypesCount <= 2) return 'weak';
  if (password.length >= 12 && characterTypesCount >= 4) return 'strong';
  return 'medium';
};

// Validate password
export const validatePassword = (password: string, requirePassword: boolean = true): string => {
  if (!password) {
    return requirePassword ? 'Password is required' : '';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  const strength = evaluatePasswordStrength(password);
  if (strength === 'weak') {
    return 'Password is too weak. Include uppercase, lowercase, numbers, and special characters';
  }

  return '';
};

// Validate confirm password
export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

// Name validation
export const validateName = (name: string, fieldName: string): string => {
  if (!name) return `${fieldName} is required`;
  if (name.length < 2) return `${fieldName} must be at least 2 characters`;
  if (name.length > 50) return `${fieldName} must be less than 50 characters`;

  // Check for numbers or special characters
  if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(name)) {
    return `${fieldName} should not contain numbers or special characters`;
  }

  return '';
};

// Date validation
export const validateDate = (date: string, fieldName: string, required: boolean = false): string => {
  if (!date) return required ? `${fieldName} is required` : '';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `Please enter a valid date`;

  // Check if date is in the future
  if (dateObj > new Date()) return `${fieldName} cannot be in the future`;

  return '';
};

// Employee ID validation
export const validateEmployeeId = (id: string): string => {
  if (!id) return '';  // Optional field

  // Check for common employee ID formats
  const employeeIdRegex = /^[A-Za-z0-9\-]{3,20}$/;
  if (!employeeIdRegex.test(id)) {
    return 'Employee ID should be 3-20 alphanumeric characters';
  }

  return '';
};

// Address validation
export const validateAddress = (address: string): string => {
  if (!address) return '';  // Optional field

  if (address.length < 5) return 'Address seems too short';
  if (address.length > 200) return 'Address is too long';

  return '';
};

// Department validation
export const validateDepartment = (department: string): string => {
  if (!department) return '';  // Optional field

  if (department.length < 2) return 'Department name seems too short';
  if (department.length > 50) return 'Department name is too long';

  return '';
};

// Position validation
export const validatePosition = (position: string): string => {
  if (!position) return '';  // Optional field

  if (position.length < 2) return 'Position name seems too short';
  if (position.length > 50) return 'Position name is too long';

  return '';
};

// Validate form data
export const validateFormData = (formData: Record<string, any>, passwordOption: string): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Basic information
  errors.firstName = validateName(formData.firstName, 'First name');
  errors.lastName = validateName(formData.lastName, 'Last name');
  errors.email = validateEmail(formData.email);
  errors.phoneNumber = validatePhoneNumber(formData.phoneNumber);

  // Password validation based on option
  if (passwordOption === 'manual') {
    errors.password = validatePassword(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
  }

  // Employment information if provided
  if (formData.employeeId) errors.employeeId = validateEmployeeId(formData.employeeId);
  if (formData.department) errors.department = validateDepartment(formData.department);
  if (formData.position) errors.position = validatePosition(formData.position);
  if (formData.startDate) errors.startDate = validateDate(formData.startDate, 'Start date');

  // Address validation
  if (formData.address) errors.address = validateAddress(formData.address);

  // Remove empty error messages
  Object.keys(errors).forEach(key => {
    if (!errors[key]) delete errors[key];
  });

  return errors;
};

// Check if form has errors
export const hasErrors = (errors: Record<string, string>): boolean => {
  return Object.keys(errors).length > 0;
};
