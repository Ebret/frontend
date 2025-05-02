'use client';

import React, { useState } from 'react';

interface UserOnboardingOptionsProps {
  email: string;
  onOptionChange: (option: 'manual' | 'email' | 'temporary') => void;
  selectedOption: 'manual' | 'email' | 'temporary';
  onPasswordChange?: (password: string) => void;
  onConfirmPasswordChange?: (password: string) => void;
}

const UserOnboardingOptions: React.FC<UserOnboardingOptionsProps> = ({
  email,
  onOptionChange,
  selectedOption,
  onPasswordChange,
  onConfirmPasswordChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  // Function to evaluate password strength
  const evaluatePasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    // Basic password strength evaluation
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasNumbers = /\d/.test(pwd);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    
    const strength = 
      [hasLowerCase, hasUpperCase, hasNumbers, hasSpecialChars].filter(Boolean).length;
    
    if (pwd.length < 8 || strength <= 2) return 'weak';
    if (pwd.length >= 12 && strength >= 4) return 'strong';
    return 'medium';
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    if (newPassword) {
      setPasswordStrength(evaluatePasswordStrength(newPassword));
    } else {
      setPasswordStrength(null);
    }
    
    if (onPasswordChange) {
      onPasswordChange(newPassword);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-base font-medium text-gray-900">Password Setup Method</label>
        <p className="text-sm text-gray-500">
          Choose how the user will set up their password
        </p>
        <div className="mt-4 space-y-4">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="email-invite"
                name="password-method"
                type="radio"
                checked={selectedOption === 'email'}
                onChange={() => onOptionChange('email')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="email-invite" className="font-medium text-gray-700">
                Email Invitation
              </label>
              <p className="text-gray-500">
                Send an email invitation to {email} with a secure link to set up their account.
                <span className="block mt-1 text-xs italic">
                  Recommended: Most secure option as only the user will know their password.
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="temporary-password"
                name="password-method"
                type="radio"
                checked={selectedOption === 'temporary'}
                onChange={() => onOptionChange('temporary')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="temporary-password" className="font-medium text-gray-700">
                Generate Temporary Password
              </label>
              <p className="text-gray-500">
                System will generate a temporary password that the user must change on first login.
                <span className="block mt-1 text-xs italic">
                  Good balance of security and convenience.
                </span>
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="manual-password"
                name="password-method"
                type="radio"
                checked={selectedOption === 'manual'}
                onChange={() => onOptionChange('manual')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="manual-password" className="font-medium text-gray-700">
                Set Password Manually
              </label>
              <p className="text-gray-500">
                You'll set the initial password for this user.
                <span className="block mt-1 text-xs italic">
                  Least secure option. Only use when other methods aren't available.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedOption === 'manual' && onPasswordChange && onConfirmPasswordChange && (
        <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                onChange={handlePasswordChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
            
            {/* Password strength indicator */}
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        passwordStrength === 'weak' ? 'w-1/3 bg-red-500' : 
                        passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' : 
                        'w-full bg-green-500'
                      }`}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-500">
                    {passwordStrength === 'weak' ? 'Weak' : 
                     passwordStrength === 'medium' ? 'Medium' : 
                     'Strong'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {passwordStrength === 'weak' && 'Use at least 8 characters with uppercase letters, numbers, and symbols.'}
                  {passwordStrength === 'medium' && 'Good password. For stronger security, add more variety or length.'}
                  {passwordStrength === 'strong' && 'Excellent password strength!'}
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p className="font-medium">Important Security Note:</p>
            <p>When setting a password manually, you should:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Use a secure, temporary password</li>
              <li>Communicate it securely to the user</li>
              <li>Instruct the user to change it immediately</li>
              <li>Consider enabling forced password change on first login</li>
            </ul>
          </div>
        </div>
      )}
      
      {selectedOption === 'temporary' && (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 text-green-500 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <p className="text-sm text-gray-700">
              A secure temporary password will be generated and sent to the user.
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            The user will be required to change this password on their first login.
            This password will expire after 24 hours if not used.
          </p>
        </div>
      )}
      
      {selectedOption === 'email' && (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <div className="flex items-center">
            <svg 
              className="h-5 w-5 text-green-500 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <p className="text-sm text-gray-700">
              An invitation email will be sent to {email}
            </p>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            The email will contain a secure link that expires after 48 hours.
            The user will be able to set their own password and complete their profile.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserOnboardingOptions;
