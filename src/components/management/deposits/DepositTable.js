'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEdit, FiMoreVertical, FiChevronDown, FiChevronUp, FiDollarSign, FiClock, FiRefreshCw } from 'react-icons/fi';

/**
 * Deposit Table Component
 * 
 * Displays a table of deposits with:
 * - Sorting
 * - Deposit details
 * - Quick actions
 * 
 * @param {Array} deposits - Array of deposit objects
 * @param {boolean} loading - Whether data is loading
 */
const DepositTable = ({ deposits, loading }) => {
  // State for sorting
  const [sortField, setSortField] = useState('amount');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // State for dropdown menu
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Handle sort change
  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value);
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'dormant':
        return 'bg-yellow-100 text-yellow-800';
      case 'matured':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type badge class
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'savings':
        return 'bg-green-100 text-green-800';
      case 'time_deposit':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case 'savings':
        return 'Savings';
      case 'time_deposit':
        return 'Time Deposit';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };
  
  // Sort deposits
  const sortedDeposits = [...deposits].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle null values
    if (aValue === null && bValue !== null) return sortDirection === 'asc' ? -1 : 1;
    if (aValue !== null && bValue === null) return sortDirection === 'asc' ? 1 : -1;
    if (aValue === null && bValue === null) return 0;
    
    // Handle date sorting
    if (sortField === 'openDate' || sortField === 'maturityDate' || sortField === 'lastTransactionDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Toggle dropdown menu
  const toggleDropdown = (depositId) => {
    setActiveDropdown(activeDropdown === depositId ? null : depositId);
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('id')}
              >
                <div className="flex items-center">
                  <span>Deposit ID</span>
                  {sortField === 'id' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('memberName')}
              >
                <div className="flex items-center">
                  <span>Member</span>
                  {sortField === 'memberName' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('type')}
              >
                <div className="flex items-center">
                  <span>Type</span>
                  {sortField === 'type' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('amount')}
              >
                <div className="flex items-center">
                  <span>Amount</span>
                  {sortField === 'amount' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('status')}
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {sortField === 'status' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('openDate')}
              >
                <div className="flex items-center">
                  <span>Open Date</span>
                  {sortField === 'openDate' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('maturityDate')}
              >
                <div className="flex items-center">
                  <span>Maturity</span>
                  {sortField === 'maturityDate' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Loading deposits...</p>
                </td>
              </tr>
            ) : sortedDeposits.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No deposits found matching your filters.
                </td>
              </tr>
            ) : (
              sortedDeposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {deposit.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{deposit.memberName}</div>
                    <div className="text-sm text-gray-500">{deposit.memberId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(deposit.type)}`}>
                      {getTypeLabel(deposit.type)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {deposit.productName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(deposit.amount)}
                    <div className="text-xs text-gray-500">
                      {deposit.interestRate}% interest
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(deposit.status)}`}>
                      {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(deposit.openDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deposit.maturityDate ? formatDate(deposit.maturityDate) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/management/deposits/${deposit.id}`} className="text-blue-600 hover:text-blue-900">
                        <FiEye className="h-5 w-5" />
                      </Link>
                      <Link href={`/management/deposits/${deposit.id}/edit`} className="text-green-600 hover:text-green-900">
                        <FiEdit className="h-5 w-5" />
                      </Link>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(deposit.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiMoreVertical className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === deposit.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              <Link
                                href={`/management/deposits/${deposit.id}/transaction`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiDollarSign className="inline-block mr-2 h-4 w-4 text-blue-500" />
                                New Transaction
                              </Link>
                              
                              {deposit.type === 'time_deposit' && deposit.status === 'active' && (
                                <Link
                                  href={`/management/deposits/${deposit.id}/renew`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  <FiRefreshCw className="inline-block mr-2 h-4 w-4 text-green-500" />
                                  Renew Deposit
                                </Link>
                              )}
                              
                              <Link
                                href={`/management/deposits/${deposit.id}/history`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiClock className="inline-block mr-2 h-4 w-4 text-gray-500" />
                                View History
                              </Link>
                              
                              {deposit.status === 'dormant' && (
                                <Link
                                  href={`/management/deposits/${deposit.id}/reactivate`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  <FiRefreshCw className="inline-block mr-2 h-4 w-4 text-yellow-500" />
                                  Reactivate Account
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            type="button"
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            type="button"
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedDeposits.length}</span> of{' '}
              <span className="font-medium">{sortedDeposits.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                type="button"
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Previous</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                type="button"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                1
              </button>
              <button
                type="button"
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Next</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositTable;
