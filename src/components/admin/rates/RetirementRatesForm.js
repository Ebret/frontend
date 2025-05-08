'use client';

import React, { useState } from 'react';

/**
 * Retirement Rates Form Component
 * 
 * Allows administrators to manage retirement fund rates, returns,
 * and investment options.
 */
const RetirementRatesForm = () => {
  // Initial retirement rates data
  const initialRetirementRates = [
    {
      id: 1,
      fundType: 'Cooperative Retirement Fund',
      riskLevel: 'Low',
      targetReturn: 7,
      guaranteedReturn: 5,
      minimumInvestment: 10000,
      lockupPeriod: '1 year',
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 2,
      fundType: 'Cooperative Retirement Fund',
      riskLevel: 'Medium',
      targetReturn: 9,
      guaranteedReturn: 6,
      minimumInvestment: 25000,
      lockupPeriod: '2 years',
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 3,
      fundType: 'Cooperative Retirement Fund',
      riskLevel: 'High',
      targetReturn: 12,
      guaranteedReturn: 7,
      minimumInvestment: 50000,
      lockupPeriod: '3 years',
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 4,
      fundType: 'Personal Retirement Account',
      riskLevel: 'Low',
      targetReturn: 6,
      guaranteedReturn: 4,
      minimumInvestment: 5000,
      lockupPeriod: '6 months',
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 5,
      fundType: 'Personal Retirement Account',
      riskLevel: 'Medium',
      targetReturn: 8,
      guaranteedReturn: 5,
      minimumInvestment: 10000,
      lockupPeriod: '1 year',
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 6,
      fundType: 'Personal Retirement Account',
      riskLevel: 'High',
      targetReturn: 10,
      guaranteedReturn: 6,
      minimumInvestment: 20000,
      lockupPeriod: '2 years',
      effectiveDate: '2023-01-01',
      status: 'Active'
    },
    {
      id: 7,
      fundType: 'Retirement Income Fund',
      riskLevel: 'Low',
      targetReturn: 5,
      guaranteedReturn: 4,
      minimumInvestment: 100000,
      lockupPeriod: 'None',
      effectiveDate: '2023-01-01',
      status: 'Active'
    }
  ];
  
  // State for retirement rates
  const [retirementRates, setRetirementRates] = useState(initialRetirementRates);
  
  // State for editing a rate
  const [editingRate, setEditingRate] = useState(null);
  
  // State for new rate form
  const [showNewRateForm, setShowNewRateForm] = useState(false);
  const [newRate, setNewRate] = useState({
    fundType: '',
    riskLevel: '',
    targetReturn: 0,
    guaranteedReturn: 0,
    minimumInvestment: 0,
    lockupPeriod: '',
    effectiveDate: '',
    status: 'Pending'
  });
  
  // Available fund types, risk levels, and lockup periods
  const fundTypes = ['Cooperative Retirement Fund', 'Personal Retirement Account', 'Retirement Income Fund'];
  const riskLevels = ['Low', 'Medium', 'High'];
  const lockupPeriods = ['None', '6 months', '1 year', '2 years', '3 years', '5 years'];
  
  // Handle editing a rate
  const handleEditRate = (rate) => {
    setEditingRate({ ...rate });
  };
  
  // Handle saving an edited rate
  const handleSaveEdit = () => {
    setRetirementRates(retirementRates.map(rate => 
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
      [name]: ['targetReturn', 'guaranteedReturn', 'minimumInvestment'].includes(name)
        ? parseFloat(value)
        : value
    });
  };
  
  // Handle input change for new rate
  const handleNewRateInputChange = (e) => {
    const { name, value } = e.target;
    setNewRate({
      ...newRate,
      [name]: ['targetReturn', 'guaranteedReturn', 'minimumInvestment'].includes(name)
        ? parseFloat(value)
        : value
    });
  };
  
  // Handle adding a new rate
  const handleAddNewRate = () => {
    const newId = Math.max(...retirementRates.map(rate => rate.id)) + 1;
    setRetirementRates([...retirementRates, { ...newRate, id: newId }]);
    setNewRate({
      fundType: '',
      riskLevel: '',
      targetReturn: 0,
      guaranteedReturn: 0,
      minimumInvestment: 0,
      lockupPeriod: '',
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
        <h3 className="text-lg font-medium text-gray-900">Retirement Fund Rates</h3>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowNewRateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Add New Rate
          </button>
          <button
            type="button"
            onClick={handleBulkUpdate}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Bulk Update
          </button>
        </div>
      </div>
      
      {/* New Rate Form */}
      {showNewRateForm && (
        <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New Retirement Fund Rate</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label htmlFor="fundType" className="block text-sm font-medium text-gray-700">
                Fund Type
              </label>
              <select
                id="fundType"
                name="fundType"
                value={newRate.fundType}
                onChange={handleNewRateInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="">Select Fund Type</option>
                {fundTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="riskLevel" className="block text-sm font-medium text-gray-700">
                Risk Level
              </label>
              <select
                id="riskLevel"
                name="riskLevel"
                value={newRate.riskLevel}
                onChange={handleNewRateInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="">Select Risk Level</option>
                {riskLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="targetReturn" className="block text-sm font-medium text-gray-700">
                Target Return (%)
              </label>
              <input
                type="number"
                name="targetReturn"
                id="targetReturn"
                value={newRate.targetReturn}
                onChange={handleNewRateInputChange}
                step="0.1"
                min="0"
                max="20"
                className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="guaranteedReturn" className="block text-sm font-medium text-gray-700">
                Guaranteed Return (%)
              </label>
              <input
                type="number"
                name="guaranteedReturn"
                id="guaranteedReturn"
                value={newRate.guaranteedReturn}
                onChange={handleNewRateInputChange}
                step="0.1"
                min="0"
                max="15"
                className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="minimumInvestment" className="block text-sm font-medium text-gray-700">
                Minimum Investment (₱)
              </label>
              <input
                type="number"
                name="minimumInvestment"
                id="minimumInvestment"
                value={newRate.minimumInvestment}
                onChange={handleNewRateInputChange}
                min="0"
                className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-1">
              <label htmlFor="lockupPeriod" className="block text-sm font-medium text-gray-700">
                Lockup Period
              </label>
              <select
                id="lockupPeriod"
                name="lockupPeriod"
                value={newRate.lockupPeriod}
                onChange={handleNewRateInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
              >
                <option value="">Select Lockup Period</option>
                {lockupPeriods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
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
                className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="mt-5 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowNewRateForm(false)}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddNewRate}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
                      Fund Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Target Return (%)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guaranteed (%)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Min. Investment
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lockup Period
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
                  {retirementRates.map((rate) => (
                    <tr key={rate.id}>
                      {editingRate && editingRate.id === rate.id ? (
                        // Editing row
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="fundType"
                              value={editingRate.fundType}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            >
                              {fundTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="riskLevel"
                              value={editingRate.riskLevel}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            >
                              {riskLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              name="targetReturn"
                              value={editingRate.targetReturn}
                              onChange={handleEditInputChange}
                              step="0.1"
                              min="0"
                              max="20"
                              className="w-20 focus:ring-purple-500 focus:border-purple-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              name="guaranteedReturn"
                              value={editingRate.guaranteedReturn}
                              onChange={handleEditInputChange}
                              step="0.1"
                              min="0"
                              max="15"
                              className="w-20 focus:ring-purple-500 focus:border-purple-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              name="minimumInvestment"
                              value={editingRate.minimumInvestment}
                              onChange={handleEditInputChange}
                              min="0"
                              className="w-28 focus:ring-purple-500 focus:border-purple-500 block shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="lockupPeriod"
                              value={editingRate.lockupPeriod}
                              onChange={handleEditInputChange}
                              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                            >
                              {lockupPeriods.map(period => (
                                <option key={period} value={period}>{period}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Editing
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={handleSaveEdit}
                              className="text-purple-600 hover:text-purple-900 mr-4"
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
                            {rate.fundType}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              rate.riskLevel === 'Low' 
                                ? 'bg-green-100 text-green-800' 
                                : rate.riskLevel === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {rate.riskLevel}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.targetReturn}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.guaranteedReturn}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ₱{rate.minimumInvestment.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {rate.lockupPeriod}
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
                              className="text-purple-600 hover:text-purple-900"
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

export default RetirementRatesForm;
