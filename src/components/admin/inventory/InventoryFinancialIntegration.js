'use client';

import React, { useState } from 'react';
import { FiDollarSign, FiLink, FiUnlink, FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * Inventory Financial Integration Component
 * 
 * Provides tools for integrating inventory with the accounting system
 * 
 * @param {Object} props
 * @param {Object} props.integrationSettings - Current integration settings
 * @param {Array} props.accountingAccounts - List of accounting accounts
 * @param {Function} props.onUpdateSettings - Function to call when updating settings
 * @param {Function} props.onRunReconciliation - Function to call when running reconciliation
 */
const InventoryFinancialIntegration = ({ 
  integrationSettings = {
    enabled: true,
    autoPostTransactions: true,
    inventoryAssetAccount: '',
    costOfGoodsSoldAccount: '',
    inventoryAdjustmentAccount: '',
    purchaseDiscountAccount: '',
    salesDiscountAccount: '',
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
  
  // Handle run reconciliation
  const handleRunReconciliation = async () => {
    try {
      setIsReconciling(true);
      setReconciliationResult(null);
      
      // In a real app, this would call the backend
      if (onRunReconciliation) {
        const result = await onRunReconciliation();
        setReconciliationResult(result);
      } else {
        // Mock result for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setReconciliationResult({
          success: true,
          date: new Date().toISOString(),
          totalItems: 248,
          totalValue: 1245000,
          discrepancies: 3,
          discrepancyValue: 1250,
          adjustments: [
            {
              id: 1,
              itemName: 'Rice (25kg)',
              systemQuantity: 42,
              actualQuantity: 40,
              difference: -2,
              value: -2500,
              reason: 'Inventory count adjustment',
            },
            {
              id: 2,
              itemName: 'Cooking Oil (1L)',
              systemQuantity: 85,
              actualQuantity: 86,
              difference: 1,
              value: 120,
              reason: 'Inventory count adjustment',
            },
            {
              id: 3,
              itemName: 'Sugar (1kg)',
              systemQuantity: 120,
              actualQuantity: 118,
              difference: -2,
              value: -130,
              reason: 'Inventory count adjustment',
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error running reconciliation:', error);
      
      setReconciliationResult({
        success: false,
        error: error.message || 'An error occurred during reconciliation',
      });
    } finally {
      setIsReconciling(false);
    }
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
              Inventory financial integration is only available for Multi-Purpose Cooperatives. Please contact your administrator to change your cooperative type.
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
            Inventory Financial Integration
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
            <>
              <button
                type="button"
                onClick={handleStartEditing}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Settings
              </button>
              <button
                type="button"
                onClick={handleRunReconciliation}
                disabled={isReconciling || !integrationSettings.enabled}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  isReconciling || !integrationSettings.enabled
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                {isReconciling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Reconciling...
                  </>
                ) : (
                  'Run Reconciliation'
                )}
              </button>
            </>
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
                    <label htmlFor="enabled" className="font-medium text-gray-700">Enable Inventory Financial Integration</label>
                    <p className="text-gray-500">When enabled, inventory transactions will be automatically posted to the accounting system.</p>
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
                      When enabled, inventory transactions will be automatically posted to the accounting system without manual approval.
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
          
          {/* Inventory Asset Account */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Inventory Asset Account</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <select
                  id="inventoryAssetAccount"
                  name="inventoryAssetAccount"
                  value={editedSettings.inventoryAssetAccount}
                  onChange={handleInputChange}
                  disabled={!editedSettings.enabled}
                  className={`max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
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
                integrationSettings.inventoryAssetAccount ? (
                  accountingAccounts.find(account => account.id === integrationSettings.inventoryAssetAccount)?.name || 
                  integrationSettings.inventoryAssetAccount
                ) : (
                  <span className="text-red-500">Not configured</span>
                )
              )}
            </dd>
          </div>
          
          {/* Cost of Goods Sold Account */}
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Cost of Goods Sold Account</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <select
                  id="costOfGoodsSoldAccount"
                  name="costOfGoodsSoldAccount"
                  value={editedSettings.costOfGoodsSoldAccount}
                  onChange={handleInputChange}
                  disabled={!editedSettings.enabled}
                  className={`max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
                    !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Select an account</option>
                  {accountingAccounts
                    .filter(account => account.type === 'EXPENSE')
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                </select>
              ) : (
                integrationSettings.costOfGoodsSoldAccount ? (
                  accountingAccounts.find(account => account.id === integrationSettings.costOfGoodsSoldAccount)?.name || 
                  integrationSettings.costOfGoodsSoldAccount
                ) : (
                  <span className="text-red-500">Not configured</span>
                )
              )}
            </dd>
          </div>
          
          {/* Inventory Adjustment Account */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Inventory Adjustment Account</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <select
                  id="inventoryAdjustmentAccount"
                  name="inventoryAdjustmentAccount"
                  value={editedSettings.inventoryAdjustmentAccount}
                  onChange={handleInputChange}
                  disabled={!editedSettings.enabled}
                  className={`max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
                    !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="">Select an account</option>
                  {accountingAccounts
                    .filter(account => account.type === 'EXPENSE' || account.type === 'INCOME')
                    .map(account => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                </select>
              ) : (
                integrationSettings.inventoryAdjustmentAccount ? (
                  accountingAccounts.find(account => account.id === integrationSettings.inventoryAdjustmentAccount)?.name || 
                  integrationSettings.inventoryAdjustmentAccount
                ) : (
                  <span className="text-red-500">Not configured</span>
                )
              )}
            </dd>
          </div>
          
          {/* Reconciliation Frequency */}
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Reconciliation Frequency</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <select
                  id="reconciliationFrequency"
                  name="reconciliationFrequency"
                  value={editedSettings.reconciliationFrequency}
                  onChange={handleInputChange}
                  disabled={!editedSettings.enabled}
                  className={`max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md ${
                    !editedSettings.enabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="MANUAL">Manual Only</option>
                </select>
              ) : (
                integrationSettings.reconciliationFrequency === 'DAILY' ? 'Daily' : 
                integrationSettings.reconciliationFrequency === 'WEEKLY' ? 'Weekly' : 
                integrationSettings.reconciliationFrequency === 'MONTHLY' ? 'Monthly' : 
                integrationSettings.reconciliationFrequency === 'QUARTERLY' ? 'Quarterly' : 'Manual Only'
              )}
            </dd>
          </div>
          
          {/* Last Reconciliation */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Last Reconciliation</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {formatDate(integrationSettings.lastReconciliationDate)}
            </dd>
          </div>
        </dl>
      </div>
      
      {/* Reconciliation Result */}
      {reconciliationResult && (
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Reconciliation Result</h4>
          
          {reconciliationResult.success ? (
            <div>
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiCheck className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Reconciliation completed successfully on {formatDate(reconciliationResult.date)}.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <FiDollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Value</dt>
                          <dd className="text-lg font-semibold text-gray-900">{formatCurrency(reconciliationResult.totalValue)}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <FiCheck className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                          <dd className="text-lg font-semibold text-gray-900">{reconciliationResult.totalItems}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                        <FiAlertTriangle className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Discrepancies</dt>
                          <dd className="text-lg font-semibold text-gray-900">{reconciliationResult.discrepancies}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                        <FiDollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Discrepancy Value</dt>
                          <dd className="text-lg font-semibold text-gray-900">{formatCurrency(reconciliationResult.discrepancyValue)}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {reconciliationResult.adjustments && reconciliationResult.adjustments.length > 0 && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h5 className="text-base font-medium text-gray-900">Adjustments</h5>
                  </div>
                  <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            System Qty
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actual Qty
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Difference
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reconciliationResult.adjustments.map((adjustment) => (
                          <tr key={adjustment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {adjustment.itemName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {adjustment.systemQuantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {adjustment.actualQuantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={adjustment.difference < 0 ? 'text-red-600' : adjustment.difference > 0 ? 'text-green-600' : ''}>
                                {adjustment.difference > 0 ? `+${adjustment.difference}` : adjustment.difference}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={adjustment.value < 0 ? 'text-red-600' : adjustment.value > 0 ? 'text-green-600' : ''}>
                                {formatCurrency(adjustment.value)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiX className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Reconciliation failed: {reconciliationResult.error}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InventoryFinancialIntegration;
