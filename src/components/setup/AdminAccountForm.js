'use client';

import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

/**
 * Admin Account Form Component
 * 
 * Form for creating the initial admin account during setup
 * 
 * @param {Object} props
 * @param {Object} props.formData - Form data object
 * @param {Function} props.onChange - Function to call when form fields change
 */
const AdminAccountForm = ({ formData, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password validation
  const isPasswordValid = formData.adminPassword && formData.adminPassword.length >= 8;
  const doPasswordsMatch = formData.adminPassword === formData.adminConfirmPassword;
  
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Create Admin Account</h3>
      <p className="text-sm text-gray-500 mb-6">
        Create the initial administrator account for your cooperative system. This account will have full access to all system features.
      </p>
      
      <div className="space-y-4">
        {/* Admin Name */}
        <div>
          <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">
            Full Name *
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="adminName"
              name="adminName"
              value={formData.adminName}
              onChange={onChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        {/* Admin Email */}
        <div>
          <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <div className="mt-1">
            <input
              type="email"
              id="adminEmail"
              name="adminEmail"
              value={formData.adminEmail}
              onChange={onChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            This email will be used for login and system notifications.
          </p>
        </div>
        
        {/* Admin Password */}
        <div>
          <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">
            Password *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showPassword ? "text" : "password"}
              id="adminPassword"
              name="adminPassword"
              value={formData.adminPassword}
              onChange={onChange}
              className={`block w-full pr-10 sm:text-sm rounded-md ${
                formData.adminPassword
                  ? isPasswordValid
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                    : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {formData.adminPassword && !isPasswordValid && (
            <p className="mt-1 text-xs text-red-600">
              Password must be at least 8 characters long.
            </p>
          )}
        </div>
        
        {/* Confirm Password */}
        <div>
          <label htmlFor="adminConfirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="adminConfirmPassword"
              name="adminConfirmPassword"
              value={formData.adminConfirmPassword}
              onChange={onChange}
              className={`block w-full pr-10 sm:text-sm rounded-md ${
                formData.adminConfirmPassword
                  ? doPasswordsMatch
                    ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                    : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {formData.adminConfirmPassword && !doPasswordsMatch && (
            <p className="mt-1 text-xs text-red-600">
              Passwords do not match.
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Please remember your admin credentials. You will need them to access the system after setup is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Fields marked with * are required.
      </div>
    </div>
  );
};

export default AdminAccountForm;
