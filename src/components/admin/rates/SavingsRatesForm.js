'use client';

import React, { useState } from 'react';

/**
 * Savings Rates Form Component
 * 
 * Allows administrators to manage savings interest rates for different account types,
 * balance tiers, and terms.
 */
const SavingsRatesForm = () => {
  // Initial savings rates data
  const initialSavingsRates = [
    {
      id: 1,
      accountType: 'Regular Savings',
      minimumBalance: 1000,
      maximumBalance: 50000,
      interestRate: 2.5,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 2,
      accountType: 'Regular Savings',
      minimumBalance: 50001,
      maximumBalance: 200000,
      interestRate: 3.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 3,
      accountType: 'Regular Savings',
      minimumBalance: 200001,
      maximumBalance: 1000000,
      interestRate: 3.5,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 4,
      accountType: 'Time Deposit',
      term: '6 months',
      interestRate: 4.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 5,
      accountType: 'Time Deposit',
      term: '1 year',
      interestRate: 5.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 6,
      accountType: 'Time Deposit',
      term: '2 years',
      interestRate: 5.5,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 7,
      accountType: 'Time Deposit',
      term: '3 years',
      interestRate: 6.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 8,
      accountType: 'Youth Savings',
      minimumBalance: 100,
      maximumBalance: 50000,
      interestRate: 3.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 9,
      accountType: 'Cooperative Investment',
      minimumBalance: 10000,
      maximumBalance: null,
      interestRate: 7.0,
      effectiveDate: '2023-01-01',
      status: 'Active'
    }
  ];
  
  // State for savings rates
  const [savingsRates, setSavingsRates] = useState(initialSavingsRates);
  
  // State for editing a rate
  const [editingRate, setEditingRate] = useState(null);
  
  // State for new rate form
  const [showNewRateForm, setShowNewRateForm] = useState(false);
  const [newRate, setNewRate] = useState({
    accountType: '',
    minimumBalance: 0,
    maximumBalance: null,
    term: '',
    interestRate: 0,
    effectiveDate: '',
    status: 'Pending'
  });
  
  // Available account types and terms
  const accountTypes = ['Regular Savings', 'Time Deposit', 'Youth Savings', 'Cooperative Investment', 'Senior Savings'];
  const depositTerms = ['6 months', '1 year', '2 years', '3 years', '5 years'];
  
  // Handle editing a rate
  const handleEditRate = (rate) => {
    setEditingRate({ ...rate });
  };
  
  // Handle saving an edited rate
  const handleSaveEdit = () => {
    setSavingsRates(savingsRates.map(rate => 
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
      [name]: name === 'interestRate' || name === 'minimumBalance' || name === 'maximumBalance' 
        ? (value === '' ? null : parseFloat(value)) 
        : value
    });
  };
  
  // Handle input change for new rate
  const handleNewRateInputChange = (e) => {
    const { name, value } = e.target;
    setNewRate({
      ...newRate,
      [name]: name === 'interestRate' || name === 'minimumBalance' || name === 'maximumBalance' 
        ? (value === '' ? null : parseFloat(value)) 
        : value
    });
  };
  
  // Handle adding a new rate
  const handleAddNewRate = () => {
    const newId = Math.max(...savingsRates.map(rate => rate.id)) + 1;
    setSavingsRates([...savingsRates, { ...newRate, id: newId }]);
    setNewRate({
      accountType: '',
      minimumBalance: 0,
      maximumBalance: null,
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
  
  // Check if account type is time deposit
  const isTimeDeposit = (type) => type === 'Time Deposit';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Savings Interest Rates</h3>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowNewRateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Add New Rate
          </button>
          <button
            type="button"
            onClick={handleBulkUpdate}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Bulk Update
          </button>
        </div>
      </div>
      
      {/* New Rate Form */}
      {showNewRateForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Savings Rate</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <select
                id="accountType"
                name="accountType"
                value={newRate.accountType}
                onChange={handleNewRateInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                <option value="">Select Account Type</option>
                {accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            {isTimeDeposit(newRate.accountType) ? (
              <div className="sm:col-span-1">
                <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                  Term
                </label>
                <select
                  id="term"
                  name="term"
                  value={newRate.term}
                  onChange={handleNewRateInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Term</option>
                  {depositTerms.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="sm:col-span-1">
                  <label htmlFor="minimumBalance" className="block text-sm font-medium text-gray-700">
                    Minimum Balance
                  </label>
                  <input
                    type="number"
                    name="minimumBalance"
                    id="minimumBalance"
                    value={newRate.minimumBalance || ''}
                    onChange={handleNewRateInputChange}
                    min="0"
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="maximumBalance" className="block text-sm font-medium text-gray-700">
                    Maximum Balance
                  </label>
                  <input
                    type="number"
                    name="maximumBalance"
                    id="maximumBalance"
                    value={newRate.maximumBalance || ''}
                    onChange={handleNewRateInputChange}
                    min="0"
                    placeholder="No limit"
                    className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </>
            )}
            
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
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowNewRateForm(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddNewRate}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
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
                      Account Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance Range / Term
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
                  {savingsRates.map((rate) => (
                    <tr key={rate.id}>
                      {editingRate && editingRate.id === rate.id ? (
                        // Editing row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="accountType"
                              value={editingRate.accountType}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                            >
                              {accountTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isTimeDeposit(editingRate.accountType) ? (
                              <select
                                name="term"
                                value={editingRate.term || ''}
                                onChange={handleEditInputChange}
                                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                              >
                                {depositTerms.map(term => (
                                  <option key={term} value={term}>{term}</option>
                                ))}
                              </select>
                            ) : (
                              <div className="flex space-x-2 items-center">
                                <input
                                  type="number"
                                  name="minimumBalance"
                                  value={editingRate.minimumBalance || ''}
                                  onChange={handleEditInputChange}
                                  placeholder="Min"
                                  className="w-24 focus:ring-green-500 focus:border-green-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                                <span>to</span>
                                <input
                                  type="number"
                                  name="maximumBalance"
                                  value={editingRate.maximumBalance || ''}
                                  onChange={handleEditInputChange}
                                  placeholder="No limit"
                                  className="w-24 focus:ring-green-500 focus:border-green-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                              </div>
                            )}
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
                              className="w-20 focus:ring-green-500 focus:border-green-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="date"
                              name="effectiveDate"
                              value={editingRate.effectiveDate}
                              onChange={handleEditInputChange}
                              className="focus:ring-green-500 focus:border-green-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                              className="text-green-600 hover:text-green-900 mr-4"
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
                            {rate.accountType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {isTimeDeposit(rate.accountType) 
                              ? rate.term 
                              : rate.maximumBalance 
                                ? `₱${rate.minimumBalance.toLocaleString()} to ₱${rate.maximumBalance.toLocaleString()}`
                                : `₱${rate.minimumBalance.toLocaleString()} and above`
                            }
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
                              className="text-green-600 hover:text-green-900"
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

export default SavingsRatesForm;
