'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiCreditCard, FiShoppingBag, FiSettings, FiShield, FiUsers, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * System Settings Component
 *
 * Allows administrators to configure system-wide settings:
 * - Feature toggles (enable/disable features)
 * - System parameters (loan limits, interest calculations, etc.)
 * - Business rules (approval workflows, validation rules, etc.)
 */
const SystemSettings = () => {
  // Get cooperative type from context
  const { cooperativeType, isLoading: isCooperativeLoading } = useCooperative();

  // Initial settings data
  const initialSettings = {
    featureToggles: [
      { id: 'retirement_features', name: 'Retirement Features', enabled: true, description: 'Enable retirement planning features and calculators' },
      { id: 'damayan_features', name: 'Damayan Features', enabled: true, description: 'Enable Damayan fund management features' },
      { id: 'mobile_banking', name: 'Mobile Banking', enabled: true, description: 'Enable mobile banking features and APIs' },
      { id: 'qr_payments', name: 'QR Code Payments', enabled: true, description: 'Enable QR code payment generation and processing' },
      { id: 'sms_notifications', name: 'SMS Notifications', enabled: true, description: 'Enable SMS notifications for transactions and alerts' },
      { id: 'email_notifications', name: 'Email Notifications', enabled: true, description: 'Enable email notifications for transactions and alerts' },
    ],
    loanParameters: [
      { id: 'max_loan_multiplier', name: 'Maximum Loan Multiplier for Fixed Deposits', value: 2, type: 'number', description: 'Maximum loan amount as a multiple of fixed deposit balance (without collateral)' },
      { id: 'min_fixed_deposit_tenure', name: 'Minimum Fixed Deposit Tenure for Loan Eligibility', value: 3, type: 'number', unit: 'months', description: 'Minimum tenure of fixed deposit to be eligible for loans based on deposit balance' },
      { id: 'collateral_loan_percentage', name: 'Collateral Loan Percentage', value: 70, type: 'percentage', description: 'Maximum loan amount as a percentage of collateral value' },
      { id: 'min_loan_amount', name: 'Minimum Loan Amount', value: 5000, type: 'currency', description: 'Minimum amount that can be borrowed' },
      { id: 'max_loan_amount', name: 'Maximum Loan Amount', value: 1000000, type: 'currency', description: 'Maximum amount that can be borrowed (regardless of deposits or collateral)' },
      { id: 'max_loan_term', name: 'Maximum Loan Term', value: 60, type: 'number', unit: 'months', description: 'Maximum loan term in months' },
    ],
    businessRules: [
      { id: 'require_approval_above', name: 'Require Approval for Loans Above', value: 100000, type: 'currency', description: 'Loan amounts above this value require additional approval' },
      { id: 'min_membership_duration', name: 'Minimum Membership Duration for Loans', value: 6, type: 'number', unit: 'months', description: 'Minimum duration of membership to be eligible for loans' },
      { id: 'max_active_loans', name: 'Maximum Active Loans per Member', value: 3, type: 'number', description: 'Maximum number of active loans a member can have' },
      { id: 'min_credit_score', name: 'Minimum Credit Score for Loan Approval', value: 650, type: 'number', description: 'Minimum credit score required for loan approval' },
    ]
  };

  // State for settings
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState('featureToggles');
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState(initialSettings);

  // Tabs for different setting categories
  const tabs = [
    { id: 'featureToggles', name: 'Feature Toggles' },
    { id: 'loanParameters', name: 'Loan Parameters' },
    { id: 'businessRules', name: 'Business Rules' },
  ];

  // Handle toggle change
  const handleToggleChange = (id) => {
    if (!isEditing) return;

    setEditedSettings({
      ...editedSettings,
      featureToggles: editedSettings.featureToggles.map(toggle =>
        toggle.id === id ? { ...toggle, enabled: !toggle.enabled } : toggle
      )
    });
  };

  // Handle parameter value change
  const handleParameterChange = (id, value, category) => {
    if (!isEditing) return;

    setEditedSettings({
      ...editedSettings,
      [category]: editedSettings[category].map(param =>
        param.id === id ? { ...param, value: value } : param
      )
    });
  };

  // Start editing
  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedSettings(settings);
  };

  // Cancel editing
  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedSettings(settings);
  };

  // Save changes
  const handleSaveChanges = () => {
    setSettings(editedSettings);
    setIsEditing(false);

    // Here you would typically make an API call to save the settings
    alert('Settings saved successfully!');
  };

  // Format value based on type
  const formatValue = (param) => {
    switch (param.type) {
      case 'currency':
        return `₱${param.value.toLocaleString()}`;
      case 'percentage':
        return `${param.value}%`;
      case 'number':
        return param.unit ? `${param.value} ${param.unit}` : param.value.toString();
      default:
        return param.value.toString();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">System Settings</h3>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEditing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleStartEditing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Settings
            </button>
          )}
        </div>
      </div>

      {/* Cooperative Type Card */}
      <div className="mb-6 bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div className="flex items-center">
            {!isCooperativeLoading && cooperativeType && (
              <div className="mr-3">
                {cooperativeType === 'CREDIT' ? (
                  <FiCreditCard className="h-6 w-6 text-blue-500" />
                ) : (
                  <FiShoppingBag className="h-6 w-6 text-green-500" />
                )}
              </div>
            )}
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Cooperative Type</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {!isCooperativeLoading && cooperativeType && (
                  cooperativeType === 'CREDIT'
                    ? 'Your system is configured as a Credit Cooperative'
                    : 'Your system is configured as a Multi-Purpose Cooperative'
                )}
              </p>
            </div>
          </div>
          <Link
            href="/admin/settings/cooperative-type"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Change Type
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {activeTab === 'featureToggles' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Enable or disable features in the system. Disabled features will not be visible to users.
            </p>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {(isEditing ? editedSettings : settings).featureToggles.map((toggle) => (
                  <li key={toggle.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex items-center h-5">
                            <input
                              id={toggle.id}
                              name={toggle.id}
                              type="checkbox"
                              checked={toggle.enabled}
                              onChange={() => handleToggleChange(toggle.id)}
                              disabled={!isEditing}
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={toggle.id} className="font-medium text-gray-700">
                              {toggle.name}
                            </label>
                            <p className="text-gray-500">{toggle.description}</p>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            toggle.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {toggle.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'loanParameters' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Configure parameters that control loan calculations, limits, and eligibility.
            </p>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {(isEditing ? editedSettings : settings).loanParameters.map((param) => (
                  <li key={param.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{param.name}</h4>
                          <p className="text-sm text-gray-500">{param.description}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {isEditing ? (
                            <div className="flex items-center">
                              {param.type === 'currency' && <span className="mr-1 text-gray-500">₱</span>}
                              <input
                                type="number"
                                value={param.value}
                                onChange={(e) => handleParameterChange(param.id, parseFloat(e.target.value) || 0, 'loanParameters')}
                                className="max-w-xs w-32 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                              />
                              {param.type === 'percentage' && <span className="ml-1 text-gray-500">%</span>}
                              {param.unit && <span className="ml-1 text-gray-500">{param.unit}</span>}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-900 font-medium">
                              {formatValue(param)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'businessRules' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">
              Configure business rules that control approval workflows, eligibility criteria, and other operational aspects.
            </p>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {(isEditing ? editedSettings : settings).businessRules.map((rule) => (
                  <li key={rule.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{rule.name}</h4>
                          <p className="text-sm text-gray-500">{rule.description}</p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {isEditing ? (
                            <div className="flex items-center">
                              {rule.type === 'currency' && <span className="mr-1 text-gray-500">₱</span>}
                              <input
                                type="number"
                                value={rule.value}
                                onChange={(e) => handleParameterChange(rule.id, parseFloat(e.target.value) || 0, 'businessRules')}
                                className="max-w-xs w-32 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md"
                              />
                              {rule.type === 'percentage' && <span className="ml-1 text-gray-500">%</span>}
                              {rule.unit && <span className="ml-1 text-gray-500">{rule.unit}</span>}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-900 font-medium">
                              {formatValue(rule)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Additional Settings Links */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Compliance Settings */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiShield className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Compliance Settings</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Regulatory and compliance configuration
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/admin/settings/compliance"
                className="font-medium text-blue-700 hover:text-blue-900"
              >
                Manage compliance settings
              </Link>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiUsers className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">User Management</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Manage users and roles
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/admin/users"
                className="font-medium text-blue-700 hover:text-blue-900"
              >
                Manage users
              </Link>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiDollarSign className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Financial Settings</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    Interest rates and fees
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/admin/rates"
                className="font-medium text-blue-700 hover:text-blue-900"
              >
                Manage financial settings
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Help section */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1 md:flex md:justify-between">
            <p className="text-sm text-blue-700">
              Changes to system settings may affect the behavior of the entire system.
              Please ensure you understand the impact of your changes before saving.
            </p>
            <p className="mt-3 text-sm md:mt-0 md:ml-6">
              <a href="/admin/help/settings" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                Learn more <span aria-hidden="true">&rarr;</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
