'use client';

import React, { useState } from 'react';

/**
 * Rate History Log Component
 * 
 * Displays a history of all rate and fee changes with:
 * - Who made the change
 * - When it was made
 * - What was changed
 * - Approval status
 */
const RateHistoryLog = () => {
  // Initial history data
  const initialHistory = [
    {
      id: 1,
      category: 'Loan Rates',
      itemName: 'Regular Loan - 1 year',
      changeType: 'Update',
      oldValue: '12%',
      newValue: '11.5%',
      changedBy: 'Maria Santos',
      changedAt: '2023-06-15 14:32:45',
      approvedBy: 'Juan Dela Cruz',
      approvedAt: '2023-06-16 09:15:22',
      status: 'Approved',
      notes: 'Reduced due to market competition'
    },
    {
      id: 2,
      category: 'Savings Rates',
      itemName: 'Time Deposit - 1 year',
      changeType: 'Update',
      oldValue: '4.5%',
      newValue: '5%',
      changedBy: 'Maria Santos',
      changedAt: '2023-06-15 15:10:33',
      approvedBy: 'Juan Dela Cruz',
      approvedAt: '2023-06-16 09:20:15',
      status: 'Approved',
      notes: 'Increased to attract more deposits'
    },
    {
      id: 3,
      category: 'Fees',
      itemName: 'Loan Processing Fee - Regular Loan',
      changeType: 'Update',
      oldValue: '1.5%',
      newValue: '1%',
      changedBy: 'Maria Santos',
      changedAt: '2023-06-15 15:45:12',
      approvedBy: 'Juan Dela Cruz',
      approvedAt: '2023-06-16 09:25:30',
      status: 'Approved',
      notes: 'Reduced to be more competitive'
    },
    {
      id: 4,
      category: 'Retirement Rates',
      itemName: 'Cooperative Retirement Fund - Medium Risk',
      changeType: 'Update',
      oldValue: '8%',
      newValue: '9%',
      changedBy: 'Maria Santos',
      changedAt: '2023-06-20 10:15:45',
      approvedBy: null,
      approvedAt: null,
      status: 'Pending Approval',
      notes: 'Adjusted based on fund performance'
    },
    {
      id: 5,
      category: 'Loan Rates',
      itemName: 'Business Loan - 3 years',
      changeType: 'Update',
      oldValue: '18%',
      newValue: '17.5%',
      changedBy: 'Maria Santos',
      changedAt: '2023-06-20 11:30:22',
      approvedBy: null,
      approvedAt: null,
      status: 'Pending Approval',
      notes: 'Adjusted to market rates'
    },
    {
      id: 6,
      category: 'Fees',
      itemName: 'ATM Withdrawal Fee',
      changeType: 'Update',
      oldValue: '₱10',
      newValue: '₱15',
      changedBy: 'Maria Santos',
      changedAt: '2023-06-21 09:45:33',
      approvedBy: null,
      approvedAt: null,
      status: 'Pending Approval',
      notes: 'Adjusted to cover increased costs'
    },
    {
      id: 7,
      category: 'Savings Rates',
      itemName: 'Youth Savings',
      changeType: 'Update',
      oldValue: '2.5%',
      newValue: '3%',
      changedBy: 'Maria Santos',
      changedAt: '2023-06-10 14:20:15',
      approvedBy: 'Juan Dela Cruz',
      approvedAt: '2023-06-11 10:05:45',
      status: 'Approved',
      notes: 'Promotional rate for Youth Month'
    },
    {
      id: 8,
      category: 'Loan Rates',
      itemName: 'Housing Loan - 5 years',
      changeType: 'New',
      oldValue: '-',
      newValue: '12%',
      changedBy: 'Pedro Reyes',
      changedAt: '2023-05-15 11:30:45',
      approvedBy: 'Juan Dela Cruz',
      approvedAt: '2023-05-16 09:15:30',
      status: 'Approved',
      notes: 'New housing loan product'
    },
    {
      id: 9,
      category: 'Fees',
      itemName: 'Loan Pre-termination Fee',
      changeType: 'New',
      oldValue: '-',
      newValue: '3%',
      changedBy: 'Pedro Reyes',
      changedAt: '2023-05-20 14:45:22',
      approvedBy: 'Juan Dela Cruz',
      approvedAt: '2023-05-21 10:30:15',
      status: 'Approved',
      notes: 'New fee for loan pre-termination'
    },
    {
      id: 10,
      category: 'Retirement Rates',
      itemName: 'Personal Retirement Account - Low Risk',
      changeType: 'Update',
      oldValue: '5.5%',
      newValue: '6%',
      changedBy: 'Maria Santos',
      changedAt: '2023-06-22 15:10:33',
      approvedBy: null,
      approvedAt: null,
      status: 'Rejected',
      notes: 'Rejected due to market conditions'
    }
  ];
  
  // State for history data
  const [history, setHistory] = useState(initialHistory);
  
  // State for filters
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    changedBy: ''
  });
  
  // State for showing details
  const [expandedItemId, setExpandedItemId] = useState(null);
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Apply filters to history data
  const filteredHistory = history.filter(item => {
    // Filter by category
    if (filters.category && item.category !== filters.category) {
      return false;
    }
    
    // Filter by status
    if (filters.status && item.status !== filters.status) {
      return false;
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      const itemDate = new Date(item.changedAt);
      const fromDate = new Date(filters.dateFrom);
      if (itemDate < fromDate) {
        return false;
      }
    }
    
    if (filters.dateTo) {
      const itemDate = new Date(item.changedAt);
      const toDate = new Date(filters.dateTo);
      // Set time to end of day
      toDate.setHours(23, 59, 59, 999);
      if (itemDate > toDate) {
        return false;
      }
    }
    
    // Filter by changed by
    if (filters.changedBy && !item.changedBy.toLowerCase().includes(filters.changedBy.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Toggle expanded item
  const toggleExpandItem = (id) => {
    if (expandedItemId === id) {
      setExpandedItemId(null);
    } else {
      setExpandedItemId(id);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      changedBy: ''
    });
  };
  
  // Available categories and statuses
  const categories = ['Loan Rates', 'Savings Rates', 'Retirement Rates', 'Fees'];
  const statuses = ['Approved', 'Pending Approval', 'Rejected'];
  
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Rate and Fee Change History</h3>
        
        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Filters</h4>
          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-5">
            <div>
              <label htmlFor="category" className="block text-xs font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="dateFrom" className="block text-xs font-medium text-gray-700">
                Date From
              </label>
              <input
                type="date"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="dateTo" className="block text-xs font-medium text-gray-700">
                Date To
              </label>
              <input
                type="date"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="changedBy" className="block text-xs font-medium text-gray-700">
                Changed By
              </label>
              <input
                type="text"
                id="changedBy"
                name="changedBy"
                value={filters.changedBy}
                onChange={handleFilterChange}
                placeholder="Search by name"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>
      
      {/* History Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category / Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Change
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Changed By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Changed At
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr className={expandedItemId === item.id ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{item.category}</div>
                          <div className="text-sm text-gray-500">{item.itemName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              item.changeType === 'New' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {item.changeType}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">
                              {item.oldValue} → {item.newValue}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.changedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.changedAt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.status === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : item.status === 'Pending Approval'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleExpandItem(item.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            {expandedItemId === item.id ? 'Hide' : 'Show'}
                          </button>
                        </td>
                      </tr>
                      
                      {/* Expanded details */}
                      {expandedItemId === item.id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-blue-50">
                            <div className="text-sm text-gray-900">
                              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                <div className="sm:col-span-1">
                                  <dt className="text-xs font-medium text-gray-500">Notes</dt>
                                  <dd className="mt-1 text-sm text-gray-900">{item.notes || 'No notes'}</dd>
                                </div>
                                
                                <div className="sm:col-span-1">
                                  <dt className="text-xs font-medium text-gray-500">Approval Details</dt>
                                  <dd className="mt-1 text-sm text-gray-900">
                                    {item.approvedBy 
                                      ? `Approved by ${item.approvedBy} on ${item.approvedAt}` 
                                      : 'Not yet approved'}
                                  </dd>
                                </div>
                                
                                {item.status === 'Pending Approval' && (
                                  <div className="sm:col-span-2 mt-2">
                                    <div className="flex space-x-3">
                                      <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </dl>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  
                  {filteredHistory.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No history records found matching the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateHistoryLog;
