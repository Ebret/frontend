'use client';

import React, { useState } from 'react';

/**
 * Fixed Deposit Rates Form Component
 * 
 * Allows administrators to manage fixed deposit interest rates for different
 * deposit amounts, terms, and member categories.
 */
const FixedDepositRatesForm = () => {
  // Initial fixed deposit rates data
  const initialFixedDepositRates = [
    {
      id: 1,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 10000,
      maximumAmount: 100000,
      term: '3 months',
      interestRate: 4.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 2,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 10000,
      maximumAmount: 100000,
      term: '6 months',
      interestRate: 4.5,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 3,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 10000,
      maximumAmount: 100000,
      term: '1 year',
      interestRate: 5.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 4,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 100001,
      maximumAmount: 500000,
      term: '3 months',
      interestRate: 4.25,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 5,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 100001,
      maximumAmount: 500000,
      term: '6 months',
      interestRate: 4.75,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 6,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 100001,
      maximumAmount: 500000,
      term: '1 year',
      interestRate: 5.25,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 7,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 500001,
      maximumAmount: null,
      term: '3 months',
      interestRate: 4.5,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 8,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 500001,
      maximumAmount: null,
      term: '6 months',
      interestRate: 5.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 9,
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 500001,
      maximumAmount: null,
      term: '1 year',
      interestRate: 5.5,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 10,
      depositType: 'Senior Fixed Deposit',
      minimumAmount: 10000,
      maximumAmount: null,
      term: '1 year',
      interestRate: 6.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 11,
      depositType: 'Youth Fixed Deposit',
      minimumAmount: 5000,
      maximumAmount: null,
      term: '1 year',
      interestRate: 5.5,
      effectiveDate: '2023-01-01',
      status: 'Active'
    }
  ];
  
  // State for fixed deposit rates
  const [fixedDepositRates, setFixedDepositRates] = useState(initialFixedDepositRates);
  
  // State for editing a rate
  const [editingRate, setEditingRate] = useState(null);
  
  // State for new rate form
  const [showNewRateForm, setShowNewRateForm] = useState(false);
  const [newRate, setNewRate] = useState({
    depositType: 'Regular Fixed Deposit',
    minimumAmount: 10000,
    maximumAmount: null,
    term: '',
    interestRate: 0,
    effectiveDate: '',
    status: 'Pending'
  });
  
  // Available deposit types and terms
  const depositTypes = ['Regular Fixed Deposit', 'Senior Fixed Deposit', 'Youth Fixed Deposit', 'Premium Fixed Deposit'];
  const depositTerms = ['3 months', '6 months', '9 months', '1 year', '2 years', '3 years', '5 years'];
  
  // Handle editing a rate
  const handleEditRate = (rate) => {
    setEditingRate({ ...rate });
  };
  
  // Handle saving an edited rate
  const handleSaveEdit = () => {
    setFixedDepositRates(fixedDepositRates.map(rate => 
      rate.id === editingRate.id ? { ...editingRate, status: 'Pending Approval' } : rate
    ));
    setEditingRate(null);
  };
  
  // Handle canceling an edit
  const handleCancelEdit = () => {
    setEditingRate(null);
  };
  
  // Handle input change for editing
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingRate({
      ...editingRate,
      [name]: ['interestRate', 'minimumAmount', 'maximumAmount'].includes(name)
        ? (value === '' ? null : parseFloat(value))
        : value
    });
  };
  
  // Handle input change for new rate
  const handleNewRateInputChange = (e) => {
    const { name, value } = e.target;
    setNewRate({
      ...newRate,
      [name]: ['interestRate', 'minimumAmount', 'maximumAmount'].includes(name)
        ? (value === '' ? null : parseFloat(value))
        : value
    });
  };
  
  // Handle adding a new rate
  const handleAddNewRate = () => {
    const newId = Math.max(...fixedDepositRates.map(rate => rate.id)) + 1;
    setFixedDepositRates([...fixedDepositRates, { ...newRate, id: newId }]);
    setNewRate({
      depositType: 'Regular Fixed Deposit',
      minimumAmount: 10000,
      maximumAmount: null,
      term: '',
      interestRate: 0,
      effectiveDate: '',
      status: 'Pending'
    });
    setShowNewRateForm(false);
  };
  
  // Handle bulk update of rates
  const handleBulkUpdate = () => {
    // Implementation for bulk update would go here
    alert('Bulk update functionality would be implemented here');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Fixed Deposit Interest Rates</h3>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowNewRateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Add New Rate
          </button>
          <button
            type="button"
            onClick={handleBulkUpdate}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Bulk Update
          </button>
        </div>
      </div>
      
      {/* New Rate Form */}
      {showNewRateForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Fixed Deposit Rate</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="depositType" className="block text-sm font-medium text-gray-700">
                Deposit Type
              </label>
              <select
                id="depositType"
                name="depositType"
                value={newRate.depositType}
                onChange={handleNewRateInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                {depositTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="minimumAmount" className="block text-sm font-medium text-gray-700">
                Minimum Amount (₱)
              </label>
              <input
                type="number"
                name="minimumAmount"
                id="minimumAmount"
                value={newRate.minimumAmount || ''}
                onChange={handleNewRateInputChange}
                min="0"
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="maximumAmount" className="block text-sm font-medium text-gray-700">
                Maximum Amount (₱)
              </label>
              <input
                type="number"
                name="maximumAmount"
                id="maximumAmount"
                value={newRate.maximumAmount || ''}
                onChange={handleNewRateInputChange}
                min="0"
                placeholder="No limit"
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                Term
              </label>
              <select
                id="term"
                name="term"
                value={newRate.term}
                onChange={handleNewRateInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
              >
                <option value="">Select Term</option>
                {depositTerms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                type="number"
                name="interestRate"
                id="interestRate"
                value={newRate.interestRate}
                onChange={handleNewRateInputChange}
                step="0.01"
                min="0"
                max="20"
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                value={newRate.effectiveDate}
                onChange={handleNewRateInputChange}
                className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowNewRateForm(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddNewRate}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Add Rate
            </button>
          </div>
        </div>
      )}
      
      {/* Rates Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deposit Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Range
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest Rate (%)
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
                  {fixedDepositRates.map((rate) => (
                    <tr key={rate.id}>
                      {editingRate && editingRate.id === rate.id ? (
                        // Editing row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="depositType"
                              value={editingRate.depositType}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                            >
                              {depositTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2 items-center">
                              <input
                                type="number"
                                name="minimumAmount"
                                value={editingRate.minimumAmount || ''}
                                onChange={handleEditInputChange}
                                placeholder="Min"
                                className="w-24 focus:ring-teal-500 focus:border-teal-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                              <span>to</span>
                              <input
                                type="number"
                                name="maximumAmount"
                                value={editingRate.maximumAmount || ''}
                                onChange={handleEditInputChange}
                                placeholder="No limit"
                                className="w-24 focus:ring-teal-500 focus:border-teal-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="term"
                              value={editingRate.term}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                            >
                              {depositTerms.map(term => (
                                <option key={term} value={term}>{term}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              name="interestRate"
                              value={editingRate.interestRate}
                              onChange={handleEditInputChange}
                              step="0.01"
                              min="0"
                              max="20"
                              className="w-20 focus:ring-teal-500 focus:border-teal-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="date"
                              name="effectiveDate"
                              value={editingRate.effectiveDate}
                              onChange={handleEditInputChange}
                              className="focus:ring-teal-500 focus:border-teal-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                              className="text-teal-600 hover:text-teal-900 mr-4"
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
                            {rate.depositType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.maximumAmount 
                              ? `₱${rate.minimumAmount.toLocaleString()} to ₱${rate.maximumAmount.toLocaleString()}`
                              : `₱${rate.minimumAmount.toLocaleString()} and above`
                            }
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.term}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.interestRate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.effectiveDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              rate.status === 'Active' 
                                ? 'bg-green-100 text-green-800' 
                                : rate.status === 'Pending Approval'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}>
                              {rate.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditRate(rate)}
                              className="text-teal-600 hover:text-teal-900"
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
      
      {/* Info section */}
      <div className="mt-6 bg-teal-50 rounded-lg p-4 border border-teal-200">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm text-teal-700">
              Fixed deposit balances are used to determine loan eligibility. Members can borrow up to 2x their fixed deposit balance without additional collateral.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedDepositRatesForm;
