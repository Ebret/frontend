import {
  validateEmail,
  validatePhoneNumber,
  evaluatePasswordStrength,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateDate,
  validateEmployeeId,
  validateAddress,
  validateDepartment,
  validatePosition,
  validateFormData,
  hasErrors
} from '../FormValidation';

describe('FormValidation', () => {
  describe('validateEmail', () => {
    it('returns an error message for empty email', () => {
      expect(validateEmail('')).toBe('Email is required');
    });

    it('returns an error message for invalid email format', () => {
      expect(validateEmail('invalid-email')).toBe('Please enter a valid email address');
      expect(validateEmail('invalid@')).toBe('Please enter a valid email address');
      expect(validateEmail('invalid@domain')).toBe('Please enter a valid email address');
    });

    it('returns an error message for domain without dot', () => {
      expect(validateEmail('user@domaincom')).toBe('Please enter a valid email address');
    });

    it('suggests correction for common typos in email domains', () => {
      expect(validateEmail('user@gmial.com')).toContain('Did you mean user@gmail.com?');
      expect(validateEmail('user@hotmial.com')).toContain('Did you mean user@hotmail.com?');
      expect(validateEmail('user@yahooo.com')).toContain('Did you mean user@yahoo.com?');
    });

    it('returns empty string for valid email', () => {
      expect(validateEmail('user@example.com')).toBe('');
      expect(validateEmail('user.name@example.co.uk')).toBe('');
    });
  });

  describe('validatePhoneNumber', () => {
    it('returns empty string for empty phone number (optional)', () => {
      expect(validatePhoneNumber('')).toBe('');
    });

    it('returns an error message for invalid phone number format', () => {
      expect(validatePhoneNumber('123')).toContain('Please enter a valid phone number');
      expect(validatePhoneNumber('abcdefghij')).toContain('Please enter a valid phone number');
    });

    it('returns empty string for valid phone number', () => {
      expect(validatePhoneNumber('+1234567890')).toBe('');
      expect(validatePhoneNumber('1234567890')).toBe('');
      expect(validatePhoneNumber('+63 912 345 6789')).toBe('');
    });
  });

  describe('evaluatePasswordStrength', () => {
    it('returns null for empty password', () => {
      expect(evaluatePasswordStrength('')).toBeNull();
    });

    it('returns weak for short passwords', () => {
      expect(evaluatePasswordStrength('pass')).toBe('weak');
    });

    it('returns weak for passwords with limited character types', () => {
      expect(evaluatePasswordStrength('password123')).toBe('weak');
    });

    it('returns medium for passwords with moderate strength', () => {
      expect(evaluatePasswordStrength('Password123')).toBe('medium');
    });

    it('returns strong for passwords with high strength', () => {
      expect(evaluatePasswordStrength('Password123!')).toBe('strong');
    });
  });

  describe('validatePassword', () => {
    it('returns an error message for empty password when required', () => {
      expect(validatePassword('', true)).toBe('Password is required');
    });

    it('returns empty string for empty password when not required', () => {
      expect(validatePassword('', false)).toBe('');
    });

    it('returns an error message for short passwords', () => {
      expect(validatePassword('pass')).toContain('at least 8 characters');
    });

    it('returns an error message for weak passwords', () => {
      expect(validatePassword('password123')).toContain('Password is too weak');
    });

    it('returns empty string for strong passwords', () => {
      expect(validatePassword('Password123!')).toBe('');
    });
  });

  describe('validateConfirmPassword', () => {
    it('returns an error message for empty confirm password', () => {
      expect(validateConfirmPassword('password', '')).toBe('Please confirm your password');
    });

    it('returns an error message for non-matching passwords', () => {
      expect(validateConfirmPassword('password1', 'password2')).toBe('Passwords do not match');
    });

    it('returns empty string for matching passwords', () => {
      expect(validateConfirmPassword('password', 'password')).toBe('');
    });
  });

  describe('validateName', () => {
    it('returns an error message for empty name', () => {
      expect(validateName('', 'First name')).toBe('First name is required');
    });

    it('returns an error message for too short names', () => {
      expect(validateName('A', 'First name')).toContain('at least 2 characters');
    });

    it('returns an error message for too long names', () => {
      const longName = 'A'.repeat(51);
      expect(validateName(longName, 'First name')).toContain('less than 50 characters');
    });

    it('returns an error message for names with numbers or special characters', () => {
      expect(validateName('John123', 'First name')).toContain('should not contain numbers or special characters');
      expect(validateName('John!', 'First name')).toContain('should not contain numbers or special characters');
    });

    it('returns empty string for valid names', () => {
      expect(validateName('John', 'First name')).toBe('');
      expect(validateName('Mary Jane', 'First name')).toBe('');
    });
  });

  describe('validateFormData', () => {
    const validFormData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1234567890',
      password: 'Password123!',
      confirmPassword: 'Password123!',
    };

    it('returns no errors for valid form data with manual password option', () => {
      const errors = validateFormData(validFormData, 'manual');
      expect(Object.keys(errors).length).toBe(0);
    });

    it('returns errors for invalid form data', () => {
      const invalidFormData = {
        ...validFormData,
        firstName: '',
        email: 'invalid-email',
      };

      const errors = validateFormData(invalidFormData, 'manual');
      expect(errors.firstName).toBeTruthy();
      expect(errors.email).toBeTruthy();
    });

    it('validates password only when password option is manual', () => {
      const formDataWithoutPassword = {
        ...validFormData,
        password: '',
        confirmPassword: '',
      };

      const errorsWithManual = validateFormData(formDataWithoutPassword, 'manual');
      expect(errorsWithManual.password).toBeTruthy();

      const errorsWithEmail = validateFormData(formDataWithoutPassword, 'email');
      expect(errorsWithEmail.password).toBeUndefined();
    });
  });

  describe('hasErrors', () => {
    it('returns true when errors object has properties', () => {
      const errors = { firstName: 'First name is required' };
      expect(hasErrors(errors)).toBe(true);
    });

    it('returns false when errors object is empty', () => {
      const errors = {};
      expect(hasErrors(errors)).toBe(false);
    });
  });
});
