'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useCooperative } from '@/contexts/CooperativeContext';
import { FiCreditCard, FiShoppingBag, FiAlertTriangle, FiCheck } from 'react-icons/fi';

/**
 * Cooperative Type Settings Page
 * 
 * Allows administrators to change the cooperative type between:
 * - Credit Cooperative
 * - Multi-Purpose Cooperative
 */
const CooperativeTypeSettingsPage = () => {
  const { 
    cooperativeType, 
    cooperativeName, 
    isLoading, 
    updateCooperativeType 
  } = useCooperative();
  
  const [selectedType, setSelectedType] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Set initial selected type once data is loaded
  React.useEffect(() => {
    if (!isLoading && cooperativeType) {
      setSelectedType(cooperativeType);
    }
  }, [isLoading, cooperativeType]);
  
  // Handle type selection
  const handleTypeSelection = (type) => {
    setSelectedType(type);
    setError(null);
    setSuccess(null);
  };
  
  // Handle save button click
  const handleSaveClick = () => {
    // If type hasn't changed, do nothing
    if (selectedType === cooperativeType) {
      return;
    }
    
    // Show confirmation dialog
    setShowConfirmation(true);
  };
  
  // Handle confirmation
  const handleConfirmChange = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Call API to update cooperative type
      const result = await updateCooperativeType(1, selectedType); // Assuming cooperative ID is 1
      
      if (result.success) {
        setSuccess('Cooperative type updated successfully. Some features may require additional setup.');
        setShowConfirmation(false);
      } else {
        setError(result.error || 'Failed to update cooperative type');
        setShowConfirmation(false);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error updating cooperative type:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    setShowConfirmation(false);
  };
  
  if (isLoading) {
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
          <h2 className="text-2xl font-bold text-gray-900">Cooperative Type Settings</h2>
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-red-400" />
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
                <FiCheck className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Cooperative Type</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Select the type of cooperative you want to operate. This will determine the features and modules available in your system.
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Credit Cooperative */}
              <div
                className={`relative rounded-lg border ${
                  selectedType === 'CREDIT'
                    ? 'border-blue-500 ring-2 ring-blue-500'
                    : 'border-gray-300'
                } bg-white p-4 shadow-sm focus:outline-none cursor-pointer`}
                onClick={() => handleTypeSelection('CREDIT')}
              >
                <div className="flex items-start">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
                    selectedType === 'CREDIT' ? 'bg-blue-500' : 'bg-gray-100'
                  }`}>
                    <FiCreditCard className={`h-6 w-6 ${
                      selectedType === 'CREDIT' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Credit Cooperative</h4>
                    <p className="mt-1 text-xs text-gray-500">
                      Focused on providing financial services, loans, and savings products to members.
                    </p>
                  </div>
                </div>
                
                {selectedType === 'CREDIT' && (
                  <div className="absolute top-3 right-3">
                    <FiCheck className="h-5 w-5 text-blue-500" />
                  </div>
                )}
                
                <div className="mt-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Key Features:</h5>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Loan Management</li>
                    <li>• Savings & Deposits</li>
                    <li>• Share Capital Management</li>
                    <li>• Damayan Fund</li>
                    <li>• Financial Reports</li>
                  </ul>
                </div>
              </div>
              
              {/* Multi-Purpose Cooperative */}
              <div
                className={`relative rounded-lg border ${
                  selectedType === 'MULTI_PURPOSE'
                    ? 'border-blue-500 ring-2 ring-blue-500'
                    : 'border-gray-300'
                } bg-white p-4 shadow-sm focus:outline-none cursor-pointer`}
                onClick={() => handleTypeSelection('MULTI_PURPOSE')}
              >
                <div className="flex items-start">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
                    selectedType === 'MULTI_PURPOSE' ? 'bg-blue-500' : 'bg-gray-100'
                  }`}>
                    <FiShoppingBag className={`h-6 w-6 ${
                      selectedType === 'MULTI_PURPOSE' ? 'text-white' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Multi-Purpose Cooperative</h4>
                    <p className="mt-1 text-xs text-gray-500">
                      Combines financial services with consumer, producer, or marketing activities.
                    </p>
                  </div>
                </div>
                
                {selectedType === 'MULTI_PURPOSE' && (
                  <div className="absolute top-3 right-3">
                    <FiCheck className="h-5 w-5 text-blue-500" />
                  </div>
                )}
                
                <div className="mt-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Key Features:</h5>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• All Credit Cooperative Features</li>
                    <li>• Inventory Management</li>
                    <li>• Point of Sale</li>
                    <li>• Consumer Goods</li>
                    <li>• Marketing Services</li>
                    <li>• Production Management</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Important Note</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Changing the cooperative type may require additional setup and configuration. Some features may not be immediately available after changing the type.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveClick}
                disabled={selectedType === cooperativeType || isSubmitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                  selectedType === cooperativeType || isSubmitting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiAlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Change Cooperative Type
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to change the cooperative type from 
                        <span className="font-medium"> {cooperativeType === 'CREDIT' ? 'Credit Cooperative' : 'Multi-Purpose Cooperative'} </span> 
                        to 
                        <span className="font-medium"> {selectedType === 'CREDIT' ? 'Credit Cooperative' : 'Multi-Purpose Cooperative'}</span>?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This action may require additional setup and configuration. Some features may not be immediately available after changing the type.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmChange}
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Change'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default CooperativeTypeSettingsPage;
