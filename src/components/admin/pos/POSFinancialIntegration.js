'use client';

import React, { useState } from 'react';
import { FiLink, FiDollarSign, FiCheck, FiX, FiInfo, FiAlertTriangle, FiSettings } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * POS Financial Integration Component
 *
 * Provides tools for integrating the Point of Sale system with the accounting system
 *
 * @param {Object} props
 * @param {Object} props.integrationSettings - Current integration settings
 * @param {Array} props.accountingAccounts - List of accounting accounts
 * @param {Function} props.onUpdateSettings - Function to call when updating settings
 * @param {Function} props.onRunReconciliation - Function to call when running reconciliation
 */
const POSFinancialIntegration = ({
  integrationSettings = {
    enabled: true,
    autoPostTransactions: true,
    salesRevenueAccount: '',
    salesTaxAccount: '',
    salesDiscountAccount: '',
    cashAccount: '',
    creditCardAccount: '',
    mobilePaymentAccount: '',
    reconciliationFrequency: 'DAILY',
    lastReconciliationDate: null,
  },
  accountingAccounts = [],
  onUpdateSettings,
  onRunReconciliation
}) => {
  const { cooperativeType, isLoading } = useCooperative();

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState({...integrationSettings});

  // State for reconciliation
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciliationResult, setReconciliationResult] = useState(null);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditedSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle start editing
  const handleStartEditing = () => {
    setEditedSettings({...integrationSettings});
    setIsEditing(true);
  };

  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    if (onUpdateSettings) {
      onUpdateSettings(editedSettings);
    }

    setIsEditing(false);
  };

  // Handle cancel editing
  const handleCancelEditing = () => {
    setEditedSettings({...integrationSettings});
    setIsEditing(false);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not a multi-purpose cooperative
  if (cooperativeType !== 'MULTI_PURPOSE') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              POS financial integration is only available for Multi-Purpose Cooperatives. Please contact your administrator to change your cooperative type.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <FiLink className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            POS Financial Integration
          </h3>
        </div>
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
              <FiSettings className="mr-2 h-4 w-4" />
              Edit Settings
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200">
        <dl>
          {/* Integration Status */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Integration Status</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enabled"
                      name="enabled"
                      type="checkbox"
                      checked={editedSettings.enabled}
                      onChange={handleInputChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enabled" className="font-medium text-gray-700">Enable POS Financial Integration</label>
                    <p className="text-gray-500">When enabled, POS transactions will be automatically posted to the accounting system.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  {integrationSettings.enabled ? (
                    <>
                      <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium text-green-700">Enabled</span>
                    </>
                  ) : (
                    <>
                      <FiX className="h-5 w-5 text-red-500 mr-2" />
                      <span className="font-medium text-red-700">Disabled</span>
                    </>
                  )}
                </div>
              )}
            </dd>
          </div>

          {/* Auto Post Transactions */}
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Auto Post Transactions</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="autoPostTransactions"
                      name="autoPostTransactions"
                      type="checkbox"
                      checked={editedSettings.autoPostTransactions}
                      onChange={handleInputChange}
                      disabled={!editedSettings.enabled}
                      className={`focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded ${
                        !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="autoPostTransactions" className={`font-medium ${!editedSettings.enabled ? 'text-gray-400' : 'text-gray-700'}`}>
                      Automatically Post Transactions
                    </label>
                    <p className={`${!editedSettings.enabled ? 'text-gray-400' : 'text-gray-500'}`}>
                      When enabled, POS transactions will be automatically posted to the accounting system without manual approval.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  {integrationSettings.autoPostTransactions ? (
                    <>
                      <FiCheck className="h-5 w-5 text-green-500 mr-2" />
                      <span className="font-medium text-green-700">Enabled</span>
                    </>
                  ) : (
                    <>
                      <FiX className="h-5 w-5 text-red-500 mr-2" />
                      <span className="font-medium text-red-700">Disabled</span>
                    </>
                  )}
                </div>
              )}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Account Mapping</h4>
        <p className="text-sm text-gray-500 mb-4">
          Map POS transactions to accounting accounts. These mappings determine how sales, taxes, and payment methods are recorded in the accounting system.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Proper account mapping is essential for accurate financial reporting. Consult with your accountant to ensure correct account selection.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h5 className="text-base font-medium text-gray-900">Revenue Accounts</h5>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="salesRevenueAccount" className="block text-sm font-medium text-gray-700">
                Sales Revenue Account
              </label>
              {isEditing ? (
                <select
                  id="salesRevenueAccount"
                  name="salesRevenueAccount"
                  value={editedSettings.salesRevenueAccount}
                  onChange={handleInputChange}
                  disabled={!editedSettings.enabled}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                    !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Select an account</option>
                  {accountingAccounts
                    .filter(account => account.type === 'REVENUE')
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                </select>
              ) : (
                <div className="mt-1 block w-full py-2 text-sm text-gray-900">
                  {integrationSettings.salesRevenueAccount ? (
                    accountingAccounts.find(account => account.id === integrationSettings.salesRevenueAccount)?.name ||
                    integrationSettings.salesRevenueAccount
                  ) : (
                    <span className="text-red-500">Not configured</span>
                  )}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Account where sales revenue will be recorded.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="salesTaxAccount" className="block text-sm font-medium text-gray-700">
                Sales Tax Account
              </label>
              {isEditing ? (
                <select
                  id="salesTaxAccount"
                  name="salesTaxAccount"
                  value={editedSettings.salesTaxAccount}
                  onChange={handleInputChange}
                  disabled={!editedSettings.enabled}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                    !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Select an account</option>
                  {accountingAccounts
                    .filter(account => account.type === 'LIABILITY')
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                </select>
              ) : (
                <div className="mt-1 block w-full py-2 text-sm text-gray-900">
                  {integrationSettings.salesTaxAccount ? (
                    accountingAccounts.find(account => account.id === integrationSettings.salesTaxAccount)?.name ||
                    integrationSettings.salesTaxAccount
                  ) : (
                    <span className="text-red-500">Not configured</span>
                  )}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Account where collected sales tax will be recorded.
              </p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="salesDiscountAccount" className="block text-sm font-medium text-gray-700">
                Sales Discount Account
              </label>
              {isEditing ? (
                <select
                  id="salesDiscountAccount"
                  name="salesDiscountAccount"
                  value={editedSettings.salesDiscountAccount}
                  onChange={handleInputChange}
                  disabled={!editedSettings.enabled}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                    !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Select an account</option>
                  {accountingAccounts
                    .filter(account => account.type === 'EXPENSE' || account.type === 'CONTRA_REVENUE')
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                </select>
              ) : (
                <div className="mt-1 block w-full py-2 text-sm text-gray-900">
                  {integrationSettings.salesDiscountAccount ? (
                    accountingAccounts.find(account => account.id === integrationSettings.salesDiscountAccount)?.name ||
                    integrationSettings.salesDiscountAccount
                  ) : (
                    <span className="text-red-500">Not configured</span>
                  )}
                </div>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Account where sales discounts will be recorded.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h5 className="text-base font-medium text-gray-900">Payment Method Accounts</h5>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mt-4">
              <div className="sm:col-span-3">
                <label htmlFor="cashAccount" className="block text-sm font-medium text-gray-700">
                  Cash Account
                </label>
                {isEditing ? (
                  <select
                    id="cashAccount"
                    name="cashAccount"
                    value={editedSettings.cashAccount}
                    onChange={handleInputChange}
                    disabled={!editedSettings.enabled}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                      !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Select an account</option>
                    {accountingAccounts
                      .filter(account => account.type === 'ASSET')
                      .map(account => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="mt-1 block w-full py-2 text-sm text-gray-900">
                    {integrationSettings.cashAccount ? (
                      accountingAccounts.find(account => account.id === integrationSettings.cashAccount)?.name ||
                      integrationSettings.cashAccount
                    ) : (
                      <span className="text-red-500">Not configured</span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Account where cash payments will be recorded.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="creditCardAccount" className="block text-sm font-medium text-gray-700">
                  Credit Card Account
                </label>
                {isEditing ? (
                  <select
                    id="creditCardAccount"
                    name="creditCardAccount"
                    value={editedSettings.creditCardAccount}
                    onChange={handleInputChange}
                    disabled={!editedSettings.enabled}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                      !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Select an account</option>
                    {accountingAccounts
                      .filter(account => account.type === 'ASSET')
                      .map(account => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="mt-1 block w-full py-2 text-sm text-gray-900">
                    {integrationSettings.creditCardAccount ? (
                      accountingAccounts.find(account => account.id === integrationSettings.creditCardAccount)?.name ||
                      integrationSettings.creditCardAccount
                    ) : (
                      <span className="text-red-500">Not configured</span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Account where credit card payments will be recorded.
                </p>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="mobilePaymentAccount" className="block text-sm font-medium text-gray-700">
                  Mobile Payment Account
                </label>
                {isEditing ? (
                  <select
                    id="mobilePaymentAccount"
                    name="mobilePaymentAccount"
                    value={editedSettings.mobilePaymentAccount}
                    onChange={handleInputChange}
                    disabled={!editedSettings.enabled}
                    className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                      !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Select an account</option>
                    {accountingAccounts
                      .filter(account => account.type === 'ASSET')
                      .map(account => (
                        <option key={account.id} value={account.id}>
                          {account.code} - {account.name}
                        </option>
                      ))}
                  </select>
                ) : (
                  <div className="mt-1 block w-full py-2 text-sm text-gray-900">
                    {integrationSettings.mobilePaymentAccount ? (
                      accountingAccounts.find(account => account.id === integrationSettings.mobilePaymentAccount)?.name ||
                      integrationSettings.mobilePaymentAccount
                    ) : (
                      <span className="text-red-500">Not configured</span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Account where mobile payments (GCash, PayMaya, etc.) will be recorded.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Reconciliation Settings</h4>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="reconciliationFrequency" className="block text-sm font-medium text-gray-700">
              Reconciliation Frequency
            </label>
            {isEditing ? (
              <select
                id="reconciliationFrequency"
                name="reconciliationFrequency"
                value={editedSettings.reconciliationFrequency}
                onChange={handleInputChange}
                disabled={!editedSettings.enabled}
                className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
                  !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="MANUAL">Manual Only</option>
              </select>
            ) : (
              <div className="mt-1 block w-full py-2 text-sm text-gray-900">
                {integrationSettings.reconciliationFrequency === 'DAILY' ? 'Daily' :
                integrationSettings.reconciliationFrequency === 'WEEKLY' ? 'Weekly' :
                integrationSettings.reconciliationFrequency === 'MONTHLY' ? 'Monthly' : 'Manual Only'}
              </div>
            )}
            <p className="mt-2 text-sm text-gray-500">
              How often POS transactions should be reconciled with accounting records.
            </p>
          </div>

          <div className="sm:col-span-3">
            <label className="block text-sm font-medium text-gray-700">
              Last Reconciliation
            </label>
            <div className="mt-1 block w-full py-2 text-sm text-gray-900">
              {formatDate(integrationSettings.lastReconciliationDate)}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => {
              // In a real app, this would call the backend to run reconciliation
              if (onRunReconciliation) {
                onRunReconciliation();
              }
            }}
            disabled={!integrationSettings.enabled || isEditing}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              !integrationSettings.enabled || isEditing
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
            }`}
          >
            <FiDollarSign className="mr-2 h-4 w-4" />
            Run Manual Reconciliation
          </button>
          <p className="mt-2 text-sm text-gray-500">
            Manually reconcile POS transactions with accounting records. This will create journal entries for any unreconciled transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default POSFinancialIntegration;
