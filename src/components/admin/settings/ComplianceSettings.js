'use client';

import React, { useState } from 'react';
import { FiShield, FiCheckCircle, FiAlertTriangle, FiInfo, FiFileText } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * Compliance Settings Component
 * 
 * Provides tools for managing compliance settings for both Credit and Multi-Purpose Cooperatives
 */
const ComplianceSettings = () => {
  const { cooperativeType, isLoading } = useCooperative();
  
  // State for compliance settings
  const [settings, setSettings] = useState({
    // Common settings
    enableAuditLogging: true,
    retentionPeriodDays: 365,
    enableTransactionMonitoring: true,
    enableUserActivityTracking: true,
    enableDocumentVersioning: true,
    
    // Credit Cooperative specific settings
    enableLoanComplianceChecks: true,
    enableInterestRateValidation: true,
    enableCollateralValidation: true,
    
    // Multi-Purpose Cooperative specific settings
    enableInventoryAuditing: true,
    enablePriceControls: true,
    enableSalesTaxCompliance: true,
    enableSupplierVerification: true,
    enableProductRegulationCompliance: true,
  });
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState({...settings});
  
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
    setEditedSettings({...settings});
    setIsEditing(true);
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    setSettings({...editedSettings});
    setIsEditing(false);
  };
  
  // Handle cancel editing
  const handleCancelEditing = () => {
    setEditedSettings({...settings});
    setIsEditing(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <FiShield className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Compliance Settings
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
              Edit Settings
            </button>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Cooperative Type</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {cooperativeType === 'CREDIT' ? 'Credit Cooperative' : 'Multi-Purpose Cooperative'}
            </dd>
          </div>
          
          <div className="bg-white px-4 py-5 sm:px-6">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                General Compliance Settings
              </h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableAuditLogging"
                    name="enableAuditLogging"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableAuditLogging : settings.enableAuditLogging}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableAuditLogging" className="font-medium text-gray-700">Enable Audit Logging</label>
                  <p className="text-gray-500">Log all user actions for compliance and security purposes.</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="retentionPeriodDays" className="block text-sm font-medium text-gray-700">
                  Data Retention Period (days)
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="retentionPeriodDays"
                    id="retentionPeriodDays"
                    value={isEditing ? editedSettings.retentionPeriodDays : settings.retentionPeriodDays}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Number of days to retain audit logs and transaction records.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableTransactionMonitoring"
                    name="enableTransactionMonitoring"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableTransactionMonitoring : settings.enableTransactionMonitoring}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableTransactionMonitoring" className="font-medium text-gray-700">Enable Transaction Monitoring</label>
                  <p className="text-gray-500">Monitor transactions for suspicious activity.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableUserActivityTracking"
                    name="enableUserActivityTracking"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableUserActivityTracking : settings.enableUserActivityTracking}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableUserActivityTracking" className="font-medium text-gray-700">Enable User Activity Tracking</label>
                  <p className="text-gray-500">Track user login, logout, and system access.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableDocumentVersioning"
                    name="enableDocumentVersioning"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableDocumentVersioning : settings.enableDocumentVersioning}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableDocumentVersioning" className="font-medium text-gray-700">Enable Document Versioning</label>
                  <p className="text-gray-500">Maintain version history for all documents.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Credit Cooperative specific settings */}
          <div className={`${cooperativeType === 'CREDIT' ? 'block' : 'hidden'} bg-gray-50 px-4 py-5 sm:px-6`}>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <FiInfo className="h-4 w-4 text-blue-500 mr-2" />
                Credit Cooperative Compliance Settings
              </h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableLoanComplianceChecks"
                    name="enableLoanComplianceChecks"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableLoanComplianceChecks : settings.enableLoanComplianceChecks}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableLoanComplianceChecks" className="font-medium text-gray-700">Enable Loan Compliance Checks</label>
                  <p className="text-gray-500">Verify loan applications against regulatory requirements.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableInterestRateValidation"
                    name="enableInterestRateValidation"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableInterestRateValidation : settings.enableInterestRateValidation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableInterestRateValidation" className="font-medium text-gray-700">Enable Interest Rate Validation</label>
                  <p className="text-gray-500">Validate interest rates against regulatory limits.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableCollateralValidation"
                    name="enableCollateralValidation"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableCollateralValidation : settings.enableCollateralValidation}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableCollateralValidation" className="font-medium text-gray-700">Enable Collateral Validation</label>
                  <p className="text-gray-500">Validate collateral documentation and valuation.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Multi-Purpose Cooperative specific settings */}
          <div className={`${cooperativeType === 'MULTI_PURPOSE' ? 'block' : 'hidden'} bg-gray-50 px-4 py-5 sm:px-6`}>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 flex items-center">
                <FiInfo className="h-4 w-4 text-green-500 mr-2" />
                Multi-Purpose Cooperative Compliance Settings
              </h4>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableInventoryAuditing"
                    name="enableInventoryAuditing"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableInventoryAuditing : settings.enableInventoryAuditing}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableInventoryAuditing" className="font-medium text-gray-700">Enable Inventory Auditing</label>
                  <p className="text-gray-500">Track inventory changes and perform regular audits.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enablePriceControls"
                    name="enablePriceControls"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enablePriceControls : settings.enablePriceControls}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enablePriceControls" className="font-medium text-gray-700">Enable Price Controls</label>
                  <p className="text-gray-500">Enforce price controls and approval workflows for price changes.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableSalesTaxCompliance"
                    name="enableSalesTaxCompliance"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableSalesTaxCompliance : settings.enableSalesTaxCompliance}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableSalesTaxCompliance" className="font-medium text-gray-700">Enable Sales Tax Compliance</label>
                  <p className="text-gray-500">Automatically calculate and track sales tax for reporting.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableSupplierVerification"
                    name="enableSupplierVerification"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableSupplierVerification : settings.enableSupplierVerification}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableSupplierVerification" className="font-medium text-gray-700">Enable Supplier Verification</label>
                  <p className="text-gray-500">Verify supplier credentials and documentation.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="enableProductRegulationCompliance"
                    name="enableProductRegulationCompliance"
                    type="checkbox"
                    checked={isEditing ? editedSettings.enableProductRegulationCompliance : settings.enableProductRegulationCompliance}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="enableProductRegulationCompliance" className="font-medium text-gray-700">Enable Product Regulation Compliance</label>
                  <p className="text-gray-500">Ensure products comply with relevant regulations and standards.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white px-4 py-5 sm:px-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900">Compliance Documentation</h4>
                <p className="mt-1 text-sm text-gray-500">
                  Ensure all compliance documentation is up-to-date and accessible to authorized personnel.
                </p>
                <ul className="mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1">
                  <li>Cooperative Development Authority (CDA) Regulations</li>
                  <li>Anti-Money Laundering Act (AMLA) Guidelines</li>
                  <li>Data Privacy Act Compliance Documentation</li>
                  {cooperativeType === 'MULTI_PURPOSE' && (
                    <>
                      <li>Bureau of Internal Revenue (BIR) Sales Tax Regulations</li>
                      <li>Department of Trade and Industry (DTI) Guidelines</li>
                      <li>Consumer Protection Act Compliance</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ComplianceSettings;
