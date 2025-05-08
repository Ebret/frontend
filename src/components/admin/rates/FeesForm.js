'use client';

import React, { useState } from 'react';

/**
 * Fees Form Component
 * 
 * Allows administrators to manage various fees and charges:
 * - Processing fees
 * - Service fees
 * - Penalties
 * - Transaction fees
 */
const FeesForm = () => {
  // Initial fees data
  const initialFees = [
    {
      id: 1,
      category: 'Processing Fee',
      name: 'Loan Processing Fee',
      applicableTo: 'Regular Loan',
      calculationType: 'Percentage',
      value: 1,
      minAmount: 500,
      maxAmount: null,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 2,
      category: 'Processing Fee',
      name: 'Loan Processing Fee',
      applicableTo: 'Emergency Loan',
      calculationType: 'Percentage',
      value: 0.5,
      minAmount: 200,
      maxAmount: 1000,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 3,
      category: 'Processing Fee',
      name: 'Loan Processing Fee',
      applicableTo: 'Business Loan',
      calculationType: 'Percentage',
      value: 2,
      minAmount: 1000,
      maxAmount: 5000,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 4,
      category: 'Insurance Fee',
      name: 'Loan Insurance',
      applicableTo: 'All Loans',
      calculationType: 'Percentage',
      value: 0.5,
      minAmount: 200,
      maxAmount: null,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 5,
      category: 'Penalty',
      name: 'Late Payment Penalty',
      applicableTo: 'All Loans',
      calculationType: 'Percentage',
      value: 3,
      minAmount: 500,
      maxAmount: null,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 6,
      category: 'Transaction Fee',
      name: 'Fund Transfer Fee',
      applicableTo: 'External Transfers',
      calculationType: 'Fixed',
      value: 25,
      minAmount: null,
      maxAmount: null,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 7,
      category: 'Transaction Fee',
      name: 'ATM Withdrawal Fee',
      applicableTo: 'ATM Transactions',
      calculationType: 'Fixed',
      value: 15,
      minAmount: null,
      maxAmount: null,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 8,
      category: 'Service Fee',
      name: 'Account Maintenance Fee',
      applicableTo: 'Savings Accounts',
      calculationType: 'Fixed',
      value: 50,
      minAmount: null,
      maxAmount: null,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 9,
      category: 'Service Fee',
      name: 'Checkbook Issuance',
      applicableTo: 'Checking Accounts',
      calculationType: 'Fixed',
      value: 200,
      minAmount: null,
      maxAmount: null,
      effectiveDate: '2023-01-01',
      status: 'Active'
    }
  ];
  
  // State for fees
  const [fees, setFees] = useState(initialFees);
  
  // State for editing a fee
  const [editingFee, setEditingFee] = useState(null);
  
  // State for new fee form
  const [showNewFeeForm, setShowNewFeeForm] = useState(false);
  const [newFee, setNewFee] = useState({
    category: '',
    name: '',
    applicableTo: '',
    calculationType: 'Percentage',
    value: 0,
    minAmount: null,
    maxAmount: null,
    effectiveDate: '',
    status: 'Pending'
  });
  
  // Available fee categories, calculation types, and applicable to options
  const feeCategories = ['Processing Fee', 'Insurance Fee', 'Penalty', 'Transaction Fee', 'Service Fee', 'Documentary Fee'];
  const calculationTypes = ['Percentage', 'Fixed'];
  const applicableToOptions = [
    'All Loans', 'Regular Loan', 'Emergency Loan', 'Business Loan', 'Salary Loan', 'Housing Loan',
    'Savings Accounts', 'Time Deposits', 'Checking Accounts', 'ATM Transactions', 'External Transfers'
  ];
  
  // Handle editing a fee
  const handleEditFee = (fee) => {
    setEditingFee({ ...fee });
  };
  
  // Handle saving an edited fee
  const handleSaveEdit = () => {
    setFees(fees.map(fee => 
      fee.id === editingFee.id ? { ...editingFee, status: 'Pending Approval' } : fee
    ));
    setEditingFee(null);
  };
  
  // Handle canceling an edit
  const handleCancelEdit = () => {
    setEditingFee(null);
  };
  
  // Handle input change for editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFee({
      ...editingFee,
      [name]: ['value', 'minAmount', 'maxAmount'].includes(name)
        ? (value === '' ? null : parseFloat(value))
        : value
    });
  };
  
  // Handle input change for new fee
  const handleNewFeeInputChange = (e) => {
    const { name, value } = e.target;
    setNewFee({
      ...newFee,
      [name]: ['value', 'minAmount', 'maxAmount'].includes(name)
        ? (value === '' ? null : parseFloat(value))
        : value
    });
  };
  
  // Handle adding a new fee
  const handleAddNewFee = () => {
    const newId = Math.max(...fees.map(fee => fee.id)) + 1;
    setFees([...fees, { ...newFee, id: newId }]);
    setNewFee({
      category: '',
      name: '',
      applicableTo: '',
      calculationType: 'Percentage',
      value: 0,
      minAmount: null,
      maxAmount: null,
      effectiveDate: '',
      status: 'Pending'
    });
    setShowNewFeeForm(false);
  };
  
  // Format currency for display
  const formatCurrency = (value) => {
    if (value === null) return '-';
    return `₱${value.toLocaleString()}`;
  };
  
  // Format fee value for display
  const formatFeeValue = (fee) => {
    if (fee.calculationType === 'Percentage') {
      return `${fee.value}%`;
    } else {
      return formatCurrency(fee.value);
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Fees and Charges</h3>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowNewFeeForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Add New Fee
          </button>
        </div>
      </div>
      
      {/* New Fee Form */}
      {showNewFeeForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Fee</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-1">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Fee Category
              </label>
              <select
                id="category"
                name="category"
                value={newFee.category}
                onChange={handleNewFeeInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                <option value="">Select Category</option>
                {feeCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Fee Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={newFee.name}
                onChange={handleNewFeeInputChange}
                className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="applicableTo" className="block text-sm font-medium text-gray-700">
                Applicable To
              </label>
              <select
                id="applicableTo"
                name="applicableTo"
                value={newFee.applicableTo}
                onChange={handleNewFeeInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                <option value="">Select Applicable To</option>
                {applicableToOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="calculationType" className="block text-sm font-medium text-gray-700">
                Calculation Type
              </label>
              <select
                id="calculationType"
                name="calculationType"
                value={newFee.calculationType}
                onChange={handleNewFeeInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
              >
                {calculationTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                {newFee.calculationType === 'Percentage' ? 'Percentage (%)' : 'Fixed Amount (₱)'}
              </label>
              <input
                type="number"
                name="value"
                id="value"
                value={newFee.value}
                onChange={handleNewFeeInputChange}
                step={newFee.calculationType === 'Percentage' ? '0.01' : '1'}
                min="0"
                className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">
                Minimum Amount (₱)
              </label>
              <input
                type="number"
                name="minAmount"
                id="minAmount"
                value={newFee.minAmount || ''}
                onChange={handleNewFeeInputChange}
                min="0"
                placeholder="No minimum"
                className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">
                Maximum Amount (₱)
              </label>
              <input
                type="number"
                name="maxAmount"
                id="maxAmount"
                value={newFee.maxAmount || ''}
                onChange={handleNewFeeInputChange}
                min="0"
                placeholder="No maximum"
                className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="effectiveDate" className="block text-sm font-medium text-gray-700">
                Effective Date
              </label>
              <input
                type="date"
                name="effectiveDate"
                id="effectiveDate"
                value={newFee.effectiveDate}
                onChange={handleNewFeeInputChange}
                className="mt-1 focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowNewFeeForm(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddNewFee}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Add Fee
            </button>
          </div>
        </div>
      )}
      
      {/* Fees Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicable To
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min/Max
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Effective Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fees.map((fee) => (
                    <tr key={fee.id}>
                      {editingFee && editingFee.id === fee.id ? (
                        // Editing row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="category"
                              value={editingFee.category}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                            >
                              {feeCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              name="name"
                              value={editingFee.name}
                              onChange={handleEditInputChange}
                              className="focus:ring-red-500 focus:border-red-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="applicableTo"
                              value={editingFee.applicableTo}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                            >
                              {applicableToOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <select
                                name="calculationType"
                                value={editingFee.calculationType}
                                onChange={handleEditInputChange}
                                className="block w-24 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                              >
                                {calculationTypes.map(type => (
                                  <option key={type} value={type}>{type}</option>
                                ))}
                              </select>
                              <input
                                type="number"
                                name="value"
                                value={editingFee.value}
                                onChange={handleEditInputChange}
                                step={editingFee.calculationType === 'Percentage' ? '0.01' : '1'}
                                min="0"
                                className="w-20 focus:ring-red-500 focus:border-red-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2 items-center">
                              <input
                                type="number"
                                name="minAmount"
                                value={editingFee.minAmount || ''}
                                onChange={handleEditInputChange}
                                placeholder="Min"
                                className="w-20 focus:ring-red-500 focus:border-red-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                              <span>/</span>
                              <input
                                type="number"
                                name="maxAmount"
                                value={editingFee.maxAmount || ''}
                                onChange={handleEditInputChange}
                                placeholder="Max"
                                className="w-20 focus:ring-red-500 focus:border-red-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="date"
                              name="effectiveDate"
                              value={editingFee.effectiveDate}
                              onChange={handleEditInputChange}
                              className="focus:ring-red-500 focus:border-red-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Editing
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={handleSaveEdit}
                              className="text-red-600 hover:text-red-900 mr-4"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        // Normal row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {fee.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {fee.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {fee.applicableTo}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatFeeValue(fee)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {fee.minAmount ? formatCurrency(fee.minAmount) : '-'} / {fee.maxAmount ? formatCurrency(fee.maxAmount) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {fee.effectiveDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              fee.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : fee.status === 'Pending Approval'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {fee.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditFee(fee)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Edit
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesForm;
