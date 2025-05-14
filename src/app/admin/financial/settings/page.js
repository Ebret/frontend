'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import POSFinancialIntegration from '@/components/admin/pos/POSFinancialIntegration';
import InventoryFinancialIntegration from '@/components/admin/inventory/InventoryFinancialIntegration';
import { FiDollarSign, FiLink, FiSettings, FiInfo } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * Financial Settings Page
 * 
 * Provides tools for managing financial settings and integrations
 */
const FinancialSettingsPage = () => {
  const { cooperativeType, isLoading: isCooperativeLoading } = useCooperative();
  
  // State for accounting accounts
  const [accountingAccounts, setAccountingAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  
  // State for integration settings
  const [posIntegrationSettings, setPosIntegrationSettings] = useState({
    enabled: true,
    autoPostTransactions: true,
    salesRevenueAccount: 'revenue-001',
    salesTaxAccount: 'liability-001',
    salesDiscountAccount: 'expense-001',
    cashAccount: 'asset-001',
    creditCardAccount: 'asset-002',
    mobilePaymentAccount: 'asset-003',
    reconciliationFrequency: 'DAILY',
    lastReconciliationDate: '2023-06-15T10:30:00.000Z',
  });
  
  const [inventoryIntegrationSettings, setInventoryIntegrationSettings] = useState({
    enabled: true,
    autoPostTransactions: true,
    inventoryAssetAccount: 'asset-004',
    costOfGoodsSoldAccount: 'expense-002',
    inventoryAdjustmentAccount: 'expense-003',
    purchaseDiscountAccount: 'expense-004',
    salesDiscountAccount: 'expense-001',
    reconciliationFrequency: 'DAILY',
    lastReconciliationDate: '2023-06-15T10:30:00.000Z',
  });
  
  // Fetch accounting accounts
  useEffect(() => {
    const fetchAccountingAccounts = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockAccounts = [
          { id: 'asset-001', code: '1000', name: 'Cash on Hand', type: 'ASSET' },
          { id: 'asset-002', code: '1010', name: 'Cash in Bank', type: 'ASSET' },
          { id: 'asset-003', code: '1020', name: 'Mobile Payment Accounts', type: 'ASSET' },
          { id: 'asset-004', code: '1200', name: 'Inventory', type: 'ASSET' },
          { id: 'liability-001', code: '2000', name: 'Sales Tax Payable', type: 'LIABILITY' },
          { id: 'liability-002', code: '2100', name: 'Accounts Payable', type: 'LIABILITY' },
          { id: 'equity-001', code: '3000', name: 'Common Stock', type: 'EQUITY' },
          { id: 'equity-002', code: '3100', name: 'Retained Earnings', type: 'EQUITY' },
          { id: 'revenue-001', code: '4000', name: 'Sales Revenue', type: 'REVENUE' },
          { id: 'revenue-002', code: '4100', name: 'Service Revenue', type: 'REVENUE' },
          { id: 'expense-001', code: '5000', name: 'Sales Discounts', type: 'EXPENSE' },
          { id: 'expense-002', code: '5100', name: 'Cost of Goods Sold', type: 'EXPENSE' },
          { id: 'expense-003', code: '5200', name: 'Inventory Adjustments', type: 'EXPENSE' },
          { id: 'expense-004', code: '5300', name: 'Purchase Discounts', type: 'EXPENSE' },
          { id: 'contra-revenue-001', code: '4900', name: 'Sales Returns and Allowances', type: 'CONTRA_REVENUE' },
        ];
        
        setAccountingAccounts(mockAccounts);
      } catch (error) {
        console.error('Error fetching accounting accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAccountingAccounts();
  }, []);
  
  // Handle update POS integration settings
  const handleUpdatePosIntegrationSettings = (settings) => {
    // In a real app, this would be an API call
    setPosIntegrationSettings(settings);
  };
  
  // Handle update inventory integration settings
  const handleUpdateInventoryIntegrationSettings = (settings) => {
    // In a real app, this would be an API call
    setInventoryIntegrationSettings(settings);
  };
  
  // Handle run POS reconciliation
  const handleRunPosReconciliation = async () => {
    // In a real app, this would be an API call
    // For now, we'll just return a mock result
    return {
      success: true,
      date: new Date().toISOString(),
      totalTransactions: 156,
      totalAmount: 78500,
      discrepancies: 2,
      discrepancyAmount: 750,
    };
  };
  
  // Handle run inventory reconciliation
  const handleRunInventoryReconciliation = async () => {
    // In a real app, this would be an API call
    // For now, we'll just return a mock result
    return {
      success: true,
      date: new Date().toISOString(),
      totalItems: 248,
      totalValue: 1245000,
      discrepancies: 3,
      discrepancyValue: 1250,
    };
  };
  
  if (isLoading || isCooperativeLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Financial Settings</h2>
        </div>
        
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiInfo className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Financial settings control how transactions are recorded in the accounting system. Proper configuration is essential for accurate financial reporting.
              </p>
            </div>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('general')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'general'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              aria-current={activeTab === 'general' ? 'page' : undefined}
            >
              General Settings
            </button>
            
            {cooperativeType === 'MULTI_PURPOSE' && (
              <>
                <button
                  onClick={() => setActiveTab('pos')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === 'pos'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                  aria-current={activeTab === 'pos' ? 'page' : undefined}
                >
                  POS Integration
                </button>
                
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === 'inventory'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                  aria-current={activeTab === 'inventory' ? 'page' : undefined}
                >
                  Inventory Integration
                </button>
              </>
            )}
            
            <button
              onClick={() => setActiveTab('accounts')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'accounts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              aria-current={activeTab === 'accounts' ? 'page' : undefined}
            >
              Chart of Accounts
            </button>
          </nav>
        </div>
        
        {/* Tab content */}
        {activeTab === 'general' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div className="flex items-center">
                <FiSettings className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  General Financial Settings
                </h3>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <p className="text-sm text-gray-500 mb-4">
                Configure general financial settings for your cooperative.
              </p>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiInfo className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      General financial settings are under development. Please check back later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'pos' && (
          <POSFinancialIntegration
            integrationSettings={posIntegrationSettings}
            accountingAccounts={accountingAccounts}
            onUpdateSettings={handleUpdatePosIntegrationSettings}
            onRunReconciliation={handleRunPosReconciliation}
          />
        )}
        
        {activeTab === 'inventory' && (
          <InventoryFinancialIntegration
            integrationSettings={inventoryIntegrationSettings}
            accountingAccounts={accountingAccounts}
            onUpdateSettings={handleUpdateInventoryIntegrationSettings}
            onRunReconciliation={handleRunInventoryReconciliation}
          />
        )}
        
        {activeTab === 'accounts' && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div className="flex items-center">
                <FiDollarSign className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Chart of Accounts
                </h3>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <p className="text-sm text-gray-500 mb-4">
                View and manage your chart of accounts.
              </p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Code
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accountingAccounts.map((account) => (
                      <tr key={account.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {account.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FinancialSettingsPage;
