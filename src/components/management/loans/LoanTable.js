'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEdit, FiMoreVertical, FiChevronDown, FiChevronUp, FiDollarSign, FiClock, FiAlertTriangle } from 'react-icons/fi';

/**
 * Loan Table Component
 * 
 * Displays a table of loans with:
 * - Sorting
 * - Loan details
 * - Quick actions
 * 
 * @param {Array} loans - Array of loan objects
 * @param {boolean} loading - Whether data is loading
 */
const LoanTable = ({ loans, loading }) => {
  // State for sorting
  const [sortField, setSortField] = useState('approvalDate');
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get risk level badge class
  const getRiskLevelBadgeClass = (riskLevel) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get loan type label
  const getLoanTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Sort loans
  const sortedLoans = [...loans].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle null values
    if (aValue === null && bValue !== null) return sortDirection === 'asc' ? -1 : 1;
    if (aValue !== null && bValue === null) return sortDirection === 'asc' ? 1 : -1;
    if (aValue === null && bValue === null) return 0;
    
    // Handle date sorting
    if (sortField === 'approvalDate' || sortField === 'disbursementDate' || sortField === 'maturityDate' || sortField === 'nextPaymentDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Toggle dropdown menu
  const toggleDropdown = (loanId) => {
    setActiveDropdown(activeDropdown === loanId ? null : loanId);
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
                  <span>Loan ID</span>
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
                onClick={() => handleSortChange('loanType')}
              >
                <div className="flex items-center">
                  <span>Type</span>
                  {sortField === 'loanType' && (
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
                onClick={() => handleSortChange('approvalDate')}
              >
                <div className="flex items-center">
                  <span>Approval Date</span>
                  {sortField === 'approvalDate' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('riskLevel')}
              >
                <div className="flex items-center">
                  <span>Risk</span>
                  {sortField === 'riskLevel' && (
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
                  <p className="mt-2 text-sm text-gray-500">Loading loans...</p>
                </td>
              </tr>
            ) : sortedLoans.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No loans found matching your filters.
                </td>
              </tr>
            ) : (
              sortedLoans.map((loan) => (
                <tr key={loan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {loan.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{loan.memberName}</div>
                    <div className="text-sm text-gray-500">{loan.memberId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getLoanTypeLabel(loan.loanType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(loan.amount)}
                    <div className="text-xs text-gray-500">
                      {loan.term} months @ {loan.interestRate}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(loan.status)}`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                    {loan.status === 'overdue' && (
                      <div className="text-xs text-red-600 mt-1">
                        {loan.daysOverdue} days overdue
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(loan.approvalDate)}
                    {loan.status === 'active' && (
                      <div className="text-xs text-gray-500">
                        Matures: {formatDate(loan.maturityDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelBadgeClass(loan.riskLevel)}`}>
                      {loan.riskLevel.charAt(0).toUpperCase() + loan.riskLevel.slice(1)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Score: {loan.riskScore}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/management/loans/${loan.id}`} className="text-blue-600 hover:text-blue-900">
                        <FiEye className="h-5 w-5" />
                      </Link>
                      <Link href={`/management/loans/${loan.id}/edit`} className="text-green-600 hover:text-green-900">
                        <FiEdit className="h-5 w-5" />
                      </Link>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(loan.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiMoreVertical className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === loan.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              {loan.status === 'pending' && (
                                <>
                                  <Link
                                    href={`/management/loans/${loan.id}/approve`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                  >
                                    <FiCheckCircle className="inline-block mr-2 h-4 w-4 text-green-500" />
                                    Approve Loan
                                  </Link>
                                  <Link
                                    href={`/management/loans/${loan.id}/reject`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                  >
                                    <FiXCircle className="inline-block mr-2 h-4 w-4 text-red-500" />
                                    Reject Loan
                                  </Link>
                                </>
                              )}
                              
                              {(loan.status === 'active' || loan.status === 'overdue') && (
                                <>
                                  <Link
                                    href={`/management/loans/${loan.id}/payment`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                  >
                                    <FiDollarSign className="inline-block mr-2 h-4 w-4 text-blue-500" />
                                    Record Payment
                                  </Link>
                                  <Link
                                    href={`/management/loans/${loan.id}/schedule`}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    role="menuitem"
                                  >
                                    <FiClock className="inline-block mr-2 h-4 w-4 text-blue-500" />
                                    Payment Schedule
                                  </Link>
                                </>
                              )}
                              
                              {loan.status === 'overdue' && (
                                <Link
                                  href={`/management/loans/${loan.id}/restructure`}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  <FiAlertTriangle className="inline-block mr-2 h-4 w-4 text-yellow-500" />
                                  Restructure Loan
                                </Link>
                              )}
                              
                              <Link
                                href={`/management/loans/${loan.id}/history`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                View History
                              </Link>
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedLoans.length}</span> of{' '}
              <span className="font-medium">{sortedLoans.length}</span> results
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

export default LoanTable;
