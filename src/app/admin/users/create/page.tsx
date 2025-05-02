'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { UserRole, Permission } from '@/lib/roles';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminSidebar from '@/components/AdminSidebar';
import RoleSelector from '@/components/admin/RoleSelector';
import UserOnboardingOptions from '@/components/admin/UserOnboardingOptions';
import { logUserCreation } from '@/lib/auditLogger';
import DataPrivacyAgreement from '@/components/DataPrivacyAgreement';
import DataPrivacyFooter from '@/components/DataPrivacyFooter';

const CreateUserPage: React.FC = () => {
  const router = useRouter();
  const { config } = useWhiteLabel();
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.MEMBER,
    phoneNumber: '',
    address: '',
    department: '',
    employeeId: '',
    position: '',
    startDate: '',
  });

  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form submission state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Password management
  const [passwordOption, setPasswordOption] = useState<'manual' | 'email' | 'temporary'>('email');

  // Audit information
  const [auditInfo, setAuditInfo] = useState({
    createdAt: new Date().toISOString(),
    createdBy: 'Current Admin User', // This would come from the auth context in a real app
  });

  // Validate a single field
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim() === '' ? 'This field is required' : '';
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim() === '') return 'Email is required';
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (passwordOption === 'manual') {
          if (value.trim() === '') return 'Password is required';
          if (value.length < 8) return 'Password must be at least 8 characters long';
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(value);
          if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars)) {
            return 'Password must include uppercase, lowercase, numbers, and special characters';
          }
        }
        return '';
      case 'confirmPassword':
        if (passwordOption === 'manual') {
          if (value.trim() === '') return 'Please confirm your password';
          if (value !== formData.password) return 'Passwords do not match';
        }
        return '';
      case 'phoneNumber':
        if (value.trim() !== '') {
          const phoneRegex = /^\+?[0-9]{10,15}$/;
          if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
            return 'Please enter a valid phone number';
          }
        }
        return '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Validate required fields
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const error = validateField(key, value);
        if (error) {
          newErrors[key] = error;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      if (name === 'privacyAgreed') {
        setPrivacyAgreed(checked);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));

      // Mark field as touched
      setTouched(prev => ({ ...prev, [name]: true }));

      // Validate field on change
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  // Handle password option change
  const handlePasswordOptionChange = (option: 'manual' | 'email' | 'temporary') => {
    setPasswordOption(option);

    // Clear password fields if not using manual option
    if (option !== 'manual') {
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));

      // Clear password errors
      setErrors(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    }
  };

  // Handle password change
  const handlePasswordChange = (password: string) => {
    setFormData(prev => ({ ...prev, password }));
    const error = validateField('password', password);
    setErrors(prev => ({ ...prev, password: error }));

    // Also validate confirm password if it exists
    if (formData.confirmPassword) {
      const confirmError = password !== formData.confirmPassword ? 'Passwords do not match' : '';
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (confirmPassword: string) => {
    setFormData(prev => ({ ...prev, confirmPassword }));
    const error = formData.password !== confirmPassword ? 'Passwords do not match' : '';
    setErrors(prev => ({ ...prev, confirmPassword: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      setError('Please correct the errors in the form before submitting.');
      return;
    }

    // Check if privacy agreement is accepted
    if (!privacyAgreed) {
      setError('You must agree to the Data Privacy Agreement to create a user');
      return;
    }

    setIsLoading(true);

    try {
      // Prepare user data based on password option
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        phoneNumber: formData.phoneNumber || undefined,
        address: formData.address || undefined,
        department: formData.department || undefined,
        employeeId: formData.employeeId || undefined,
        position: formData.position || undefined,
        startDate: formData.startDate || undefined,
        passwordSetupMethod: passwordOption,
        // Only include password if manual option is selected
        ...(passwordOption === 'manual' ? { password: formData.password } : {}),
        // Include audit information
        createdAt: auditInfo.createdAt,
        createdBy: auditInfo.createdBy,
      };

      // In a real app, this would call the API to create the user
      const response = await api.createUser(userData);

      // Log the user creation in the audit log
      if (currentUser) {
        await logUserCreation(
          {
            id: currentUser.id,
            email: currentUser.email,
            name: `${currentUser.firstName} ${currentUser.lastName}`,
          },
          {
            id: response.data.user.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: formData.role as UserRole,
          },
          passwordOption as 'manual' | 'import' | 'invitation'
        );
      }

      // Show success message with appropriate text based on password option
      let successMessage = `User ${formData.firstName} ${formData.lastName} created successfully.`;

      if (passwordOption === 'email') {
        successMessage += ` An invitation email has been sent to ${formData.email}.`;
      } else if (passwordOption === 'temporary') {
        successMessage += ` A temporary password has been generated and sent to ${formData.email}.`;
      }

      setSuccess(successMessage);

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: UserRole.MEMBER,
        phoneNumber: '',
        address: '',
        department: '',
        employeeId: '',
        position: '',
        startDate: '',
      });

      // Reset touched state
      setTouched({});

      // Reset errors
      setErrors({});

      // Reset password option to default
      setPasswordOption('email');
    } catch (err: any) {
      setError(err.message || 'Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredPermission="MANAGE_USERS">
      <Layout sidebar={<AdminSidebar />}>
        <div className="py-10">
          <header>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">Create User</h1>
            </div>
          </header>
          <main>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-8 sm:px-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    {error && (
                      <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-red-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {success && (
                      <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg
                              className="h-5 w-5 text-green-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">{success}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                      {/* Basic Information Section */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              First name <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                              <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                autoComplete="given-name"
                                required
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`appearance-none block w-full px-3 py-2 border ${
                                  errors.firstName && touched.firstName
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                } rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
                              />
                              {errors.firstName && touched.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="lastName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Last name <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                              <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                autoComplete="family-name"
                                required
                                value={formData.lastName}
                                onChange={handleChange}
                                className={`appearance-none block w-full px-3 py-2 border ${
                                  errors.lastName && touched.lastName
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                } rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
                              />
                              {errors.lastName && touched.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Email address <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1">
                              <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`appearance-none block w-full px-3 py-2 border ${
                                  errors.email && touched.email
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                } rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
                              />
                              {errors.email && touched.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label
                              htmlFor="phoneNumber"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Phone number
                            </label>
                            <div className="mt-1">
                              <input
                                id="phoneNumber"
                                name="phoneNumber"
                                type="tel"
                                autoComplete="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1 (555) 123-4567"
                                className={`appearance-none block w-full px-3 py-2 border ${
                                  errors.phoneNumber && touched.phoneNumber
                                    ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                                } rounded-md shadow-sm placeholder-gray-400 sm:text-sm`}
                              />
                              {errors.phoneNumber && touched.phoneNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Role & Permissions Section */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Role & Permissions</h3>
                        <div className="mt-4">
                          <RoleSelector
                            selectedRole={formData.role as UserRole}
                            onChange={handleRoleChange}
                          />
                        </div>
                      </div>

                      {/* Role-Specific Fields */}
                      {(formData.role === UserRole.ADMIN ||
                        formData.role === UserRole.GENERAL_MANAGER ||
                        formData.role === UserRole.CREDIT_OFFICER ||
                        formData.role === UserRole.ACCOUNTANT ||
                        formData.role === UserRole.TELLER ||
                        formData.role === UserRole.COMPLIANCE_OFFICER ||
                        formData.role === UserRole.MEMBERSHIP_OFFICER ||
                        formData.role === UserRole.SECURITY_MANAGER ||
                        formData.role === UserRole.MARKETING_OFFICER) && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Employment Information</h3>
                          <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor="employeeId"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Employee ID
                              </label>
                              <div className="mt-1">
                                <input
                                  id="employeeId"
                                  name="employeeId"
                                  type="text"
                                  value={formData.employeeId}
                                  onChange={handleChange}
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="department"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Department
                              </label>
                              <div className="mt-1">
                                <input
                                  id="department"
                                  name="department"
                                  type="text"
                                  value={formData.department}
                                  onChange={handleChange}
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="position"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Position
                              </label>
                              <div className="mt-1">
                                <input
                                  id="position"
                                  name="position"
                                  type="text"
                                  value={formData.position}
                                  onChange={handleChange}
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="startDate"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Start Date
                              </label>
                              <div className="mt-1">
                                <input
                                  id="startDate"
                                  name="startDate"
                                  type="date"
                                  value={formData.startDate}
                                  onChange={handleChange}
                                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Member-specific fields */}
                      {formData.role === UserRole.MEMBER && (
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Member Information</h3>
                          <div className="mt-4">
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Address
                            </label>
                            <div className="mt-1">
                              <input
                                id="address"
                                name="address"
                                type="text"
                                autoComplete="street-address"
                                value={formData.address}
                                onChange={handleChange}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Password Setup Section */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Account Setup</h3>
                        <div className="mt-4">
                          <UserOnboardingOptions
                            email={formData.email}
                            selectedOption={passwordOption}
                            onOptionChange={handlePasswordOptionChange}
                            onPasswordChange={handlePasswordChange}
                            onConfirmPasswordChange={handleConfirmPasswordChange}
                          />

                          {errors.password && touched.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                          )}

                          {errors.confirmPassword && touched.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                          )}
                        </div>
                      </div>

                      {/* Data Privacy Agreement */}
                      <div className="mb-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="privacyAgreed"
                              name="privacyAgreed"
                              type="checkbox"
                              checked={privacyAgreed}
                              onChange={handleChange}
                              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                              required
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="privacyAgreed" className="font-medium text-gray-700">
                              I confirm that this user's data is collected in accordance with the <DataPrivacyAgreement cooperativeName={config.name} />
                            </label>
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <img
                                src="/images/ph-data-privacy-logo.svg"
                                alt="Philippines Data Privacy Act Logo"
                                className="h-4 w-4 mr-1"
                              />
                              In compliance with Republic Act No. 10173 - Data Privacy Act of 2012
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Audit Information */}
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700">Audit Information</h3>
                        <p className="mt-1 text-xs text-gray-500">
                          This user will be created by {auditInfo.createdBy} on {new Date(auditInfo.createdAt).toLocaleString()}.
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => router.push('/admin/users')}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ backgroundColor: config.primaryColor }}
                        >
                          {isLoading ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Creating User...
                            </>
                          ) : (
                            'Create User'
                          )}
                        </button>
                      </div>

                      <DataPrivacyFooter />
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateUserPage;
