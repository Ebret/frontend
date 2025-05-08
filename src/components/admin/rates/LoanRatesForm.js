'use client';

import React, { useState } from 'react';

/**
 * Loan Rates Form Component
 * 
 * Allows administrators to manage loan interest rates for different loan types,
 * terms, and member categories.
 */
const LoanRatesForm = () => {
  // Initial loan rates data
  const initialLoanRates = [
    {
      id: 1,
      loanType: 'Regular Loan',
      term: '1 year',
      memberCategory: 'Regular',
      interestRate: 12,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 2,
      loanType: 'Regular Loan',
      term: '2 years',
      memberCategory: 'Regular',
      interestRate: 14,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 3,
      loanType: 'Regular Loan',
      term: '3 years',
      memberCategory: 'Regular',
      interestRate: 16,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 4,
      loanType: 'Emergency Loan',
      term: '6 months',
      memberCategory: 'Regular',
      interestRate: 10,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 5,
      loanType: 'Salary Loan',
      term: '1 year',
      memberCategory: 'Regular',
      interestRate: 8,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 6,
      loanType: 'Business Loan',
      term: '2 years',
      memberCategory: 'Regular',
      interestRate: 15,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 7,
      loanType: 'Business Loan',
      term: '3 years',
      memberCategory: 'Regular',
      interestRate: 18,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 8,
      loanType: 'Regular Loan',
      term: '1 year',
      memberCategory: 'Preferred',
      interestRate: 10,
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 9,
      loanType: 'Regular Loan',
      term: '2 years',
      memberCategory: 'Preferred',
      interestRate: 12,
      effectiveDate: '2023-01-01',
      status: 'Active'
    }
  ];
  
  // State for loan rates
  const [loanRates, setLoanRates] = useState(initialLoanRates);
  
  // State for editing a rate
  const [editingRate, setEditingRate] = useState(null);
  
  // State for new rate form
  const [showNewRateForm, setShowNewRateForm] = useState(false);
  const [newRate, setNewRate] = useState({
    loanType: '',
    term: '',
    memberCategory: 'Regular',
    interestRate: 0,
    effectiveDate: '',
    status: 'Pending'
  });
  
  // Available loan types, terms, and member categories
  const loanTypes = ['Regular Loan', 'Emergency Loan', 'Salary Loan', 'Business Loan', 'Housing Loan', 'Educational Loan'];
  const loanTerms = ['6 months', '1 year', '2 years', '3 years', '5 years'];
  const memberCategories = ['Regular', 'Preferred', 'Premium', 'New Member'];
  
  // Handle editing a rate
  const handleEditRate = (rate) => {
    setEditingRate({ ...rate });
  };
  
  // Handle saving an edited rate
  const handleSaveEdit = () => {
    setLoanRates(loanRates.map(rate => 
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
      [name]: name === 'interestRate' ? parseFloat(value) : value
    });
  };
  
  // Handle input change for new rate
  const handleNewRateInputChange = (e) => {
    const { name, value } = e.target;
    setNewRate({
      ...newRate,
      [name]: name === 'interestRate' ? parseFloat(value) : value
    });
  };
  
  // Handle adding a new rate
  const handleAddNewRate = () => {
    const newId = Math.max(...loanRates.map(rate => rate.id)) + 1;
    setLoanRates([...loanRates, { ...newRate, id: newId }]);
    setNewRate({
      loanType: '',
      term: '',
      memberCategory: 'Regular',
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
        <h3 className="text-lg font-medium text-gray-900">Loan Interest Rates</h3>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowNewRateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add New Rate
          </button>
          <button
            type="button"
            onClick={handleBulkUpdate}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Bulk Update
          </button>
        </div>
      </div>
      
      {/* New Rate Form */}
      {showNewRateForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Loan Rate</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
                Loan Type
              </label>
              <select
                id="loanType"
                name="loanType"
                value={newRate.loanType}
                onChange={handleNewRateInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Loan Type</option>
                {loanTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
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
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">Select Term</option>
                {loanTerms.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="memberCategory" className="block text-sm font-medium text-gray-700">
                Member Category
              </label>
              <select
                id="memberCategory"
                name="memberCategory"
                value={newRate.memberCategory}
                onChange={handleNewRateInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                {memberCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
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
                max="100"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowNewRateForm(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddNewRate}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                      Loan Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Term
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Category
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
                  {loanRates.map((rate) => (
                    <tr key={rate.id}>
                      {editingRate && editingRate.id === rate.id ? (
                        // Editing row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="loanType"
                              value={editingRate.loanType}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              {loanTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="term"
                              value={editingRate.term}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              {loanTerms.map(term => (
                                <option key={term} value={term}>{term}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="memberCategory"
                              value={editingRate.memberCategory}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              {memberCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
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
                              max="100"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="date"
                              name="effectiveDate"
                              value={editingRate.effectiveDate}
                              onChange={handleEditInputChange}
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
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
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
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
                            {rate.loanType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.term}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.memberCategory}
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
                              className="text-indigo-600 hover:text-indigo-900"
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

export default LoanRatesForm;
