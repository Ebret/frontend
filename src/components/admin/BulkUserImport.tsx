'use client';

import React, { useState, useRef } from 'react';
import { UserRole, roleDisplayNames } from '@/lib/roles';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import Papa from 'papaparse';
import DataPrivacyAgreement from '@/components/DataPrivacyAgreement';

interface BulkUserImportProps {
  onImport: (users: any[]) => Promise<void>;
  onCancel: () => void;
}

interface UserImportRow {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  address?: string;
  department?: string;
  employeeId?: string;
  position?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

const BulkUserImport: React.FC<BulkUserImportProps> = ({ onImport, onCancel }) => {
  const { config } = useWhiteLabel();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'upload' | 'validate' | 'confirm'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<UserImportRow[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [importMethod, setImportMethod] = useState<'email' | 'temporary'>('email');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Generate a sample CSV template
  const generateTemplate = () => {
    const headers = ['firstName', 'lastName', 'email', 'role', 'phoneNumber', 'address', 'department', 'employeeId', 'position'];
    const sampleData = [
      ['John', 'Doe', 'john.doe@example.com', 'MEMBER', '+1234567890', '123 Main St', '', '', ''],
      ['Jane', 'Smith', 'jane.smith@example.com', 'CREDIT_OFFICER', '+0987654321', '', 'Loans', 'EMP001', 'Senior Officer'],
    ];

    const csv = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Validate a single row
  const validateRow = (row: any, index: number): ValidationError[] => {
    const rowErrors: ValidationError[] = [];

    // Check required fields
    if (!row.firstName) {
      rowErrors.push({ row: index, field: 'firstName', message: 'First name is required' });
    }

    if (!row.lastName) {
      rowErrors.push({ row: index, field: 'lastName', message: 'Last name is required' });
    }

    if (!row.email) {
      rowErrors.push({ row: index, field: 'email', message: 'Email is required' });
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        rowErrors.push({ row: index, field: 'email', message: 'Invalid email format' });
      }
    }

    // Validate role
    if (!row.role) {
      rowErrors.push({ row: index, field: 'role', message: 'Role is required' });
    } else if (!Object.values(UserRole).includes(row.role)) {
      rowErrors.push({
        row: index,
        field: 'role',
        message: `Invalid role. Must be one of: ${Object.values(UserRole).join(', ')}`
      });
    }

    // Validate phone number if provided
    if (row.phoneNumber) {
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (!phoneRegex.test(row.phoneNumber.replace(/\s+/g, ''))) {
        rowErrors.push({ row: index, field: 'phoneNumber', message: 'Invalid phone number format' });
      }
    }

    return rowErrors;
  };

  // Parse and validate the CSV file
  const parseFile = () => {
    if (!file) return;

    setIsLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedRows = results.data as UserImportRow[];
        setParsedData(parsedRows);

        // Validate each row
        const allErrors: ValidationError[] = [];
        parsedRows.forEach((row, index) => {
          const rowErrors = validateRow(row, index + 1); // +1 for human-readable row numbers
          allErrors.push(...rowErrors);
        });

        setErrors(allErrors);
        setStep('validate');
        setIsLoading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setErrors([{ row: 0, field: 'file', message: `Error parsing file: ${error.message}` }]);
        setIsLoading(false);
      }
    });
  };

  // Handle import confirmation
  const handleConfirmImport = async () => {
    if (errors.length > 0) {
      return; // Don't proceed if there are validation errors
    }

    if (!privacyAgreed) {
      setErrors([{ row: 0, field: 'privacy', message: 'You must agree to the Data Privacy Agreement to import users' }]);
      return;
    }

    setIsLoading(true);

    try {
      // Prepare user data with password setup method
      const usersToImport = parsedData.map(user => ({
        ...user,
        passwordSetupMethod: importMethod
      }));

      await onImport(usersToImport);

      // Reset state after successful import
      setFile(null);
      setParsedData([]);
      setErrors([]);
      setStep('upload');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing users:', error);
      setErrors([{ row: 0, field: 'import', message: 'Failed to import users. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {step === 'upload' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Bulk User Import</h3>
            <button
              type="button"
              onClick={generateTemplate}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Download Template
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Upload a CSV file with user information to create multiple users at once.
            Download the template for the correct format.
          </p>

          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".csv"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">CSV file up to 10MB</p>
            </div>
          </div>

          {file && (
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-900">{file.name}</span>
                <span className="ml-2 text-xs text-gray-500">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={parseFile}
              disabled={!file || isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: config.primaryColor }}
            >
              {isLoading ? 'Processing...' : 'Next'}
            </button>
          </div>
        </div>
      )}

      {step === 'validate' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Validate Import Data</h3>

          {errors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Found {errors.length} error{errors.length > 1 ? 's' : ''} in your import file
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.slice(0, 5).map((error, index) => (
                        <li key={index}>
                          Row {error.row}: {error.message} (Field: {error.field})
                        </li>
                      ))}
                      {errors.length > 5 && (
                        <li>And {errors.length - 5} more errors...</li>
                      )}
                    </ul>
                  </div>
                  <p className="mt-2 text-sm text-red-700">
                    Please fix these errors and upload the file again.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Department
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedData.slice(0, 10).map((user, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {roleDisplayNames[user.role as UserRole] || user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phoneNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.department || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 10 && (
              <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500">
                Showing 10 of {parsedData.length} users
              </div>
            )}
          </div>

          {errors.length === 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Password Setup Method</h4>
              <p className="mt-1 text-sm text-gray-500">
                Choose how users will set up their passwords
              </p>

              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="email-invite"
                    name="password-method"
                    type="radio"
                    checked={importMethod === 'email'}
                    onChange={() => setImportMethod('email')}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="email-invite" className="ml-3 block text-sm font-medium text-gray-700">
                    Send email invitations
                    <span className="block text-xs text-gray-500">
                      Users will receive an email with a link to set their password
                    </span>
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="temp-password"
                    name="password-method"
                    type="radio"
                    checked={importMethod === 'temporary'}
                    onChange={() => setImportMethod('temporary')}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="temp-password" className="ml-3 block text-sm font-medium text-gray-700">
                    Generate temporary passwords
                    <span className="block text-xs text-gray-500">
                      Users will receive an email with a temporary password they must change on first login
                    </span>
                  </label>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="privacyAgreed"
                        name="privacyAgreed"
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="privacyAgreed" className="font-medium text-gray-700">
                        I confirm that all imported users' data is collected in accordance with the <DataPrivacyAgreement cooperativeName={config.name} />
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
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setStep('upload')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleConfirmImport}
              disabled={errors.length > 0 || isLoading}
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
                  Importing...
                </>
              ) : (
                `Import ${parsedData.length} Users`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUserImport;
