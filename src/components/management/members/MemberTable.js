'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiEdit, FiEye, FiMail, FiPhone, FiMoreVertical, FiChevronDown, FiChevronUp } from 'react-icons/fi';

/**
 * Member Table Component
 * 
 * Displays a table of members with:
 * - Sorting
 * - Selection for bulk actions
 * - Member details
 * - Quick actions
 * 
 * @param {Array} members - Array of member objects
 * @param {boolean} loading - Whether data is loading
 * @param {Array} selectedMembers - Array of selected member IDs
 * @param {Function} onSelectMember - Callback when a member is selected
 * @param {Function} onSelectAll - Callback when all members are selected
 * @param {Function} onBulkAction - Callback when a bulk action is performed
 */
const MemberTable = ({ 
  members, 
  loading, 
  selectedMembers, 
  onSelectMember, 
  onSelectAll,
  onBulkAction
}) => {
  // State for sorting
  const [sortField, setSortField] = useState('lastName');
  const [sortDirection, setSortDirection] = useState('asc');
  
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
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'at_risk':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get health score class
  const getHealthScoreClass = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Sort members
  const sortedMembers = [...members].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Special case for name sorting
    if (sortField === 'lastName') {
      aValue = a.lastName + a.firstName;
      bValue = b.lastName + b.firstName;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Check if all members are selected
  const allSelected = members.length > 0 && selectedMembers.length === members.length;
  
  // Toggle dropdown menu
  const toggleDropdown = (memberId) => {
    setActiveDropdown(activeDropdown === memberId ? null : memberId);
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Bulk Actions */}
      {selectedMembers.length > 0 && (
        <div className="bg-blue-50 px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-blue-700">
              {selectedMembers.length} {selectedMembers.length === 1 ? 'member' : 'members'} selected
            </span>
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => onBulkAction('email')}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiMail className="mr-2 h-4 w-4" />
              Email
            </button>
            <button
              type="button"
              onClick={() => onBulkAction('export')}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => onBulkAction('tag')}
              className="inline-flex items-center px-3 py-1.5 border border-blue-600 shadow-sm text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Tag
            </button>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('lastName')}
              >
                <div className="flex items-center">
                  <span>Name</span>
                  {sortField === 'lastName' && (
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
                onClick={() => handleSortChange('joinDate')}
              >
                <div className="flex items-center">
                  <span>Join Date</span>
                  {sortField === 'joinDate' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('totalSavings')}
              >
                <div className="flex items-center">
                  <span>Savings</span>
                  {sortField === 'totalSavings' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? <FiChevronUp className="h-4 w-4" /> : <FiChevronDown className="h-4 w-4" />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('healthScore')}
              >
                <div className="flex items-center">
                  <span>Health Score</span>
                  {sortField === 'healthScore' && (
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
                <td colSpan="7" className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">Loading members...</p>
                </td>
              </tr>
            ) : sortedMembers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                  No members found matching your filters.
                </td>
              </tr>
            ) : (
              sortedMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={(e) => onSelectMember(member.id, e.target.checked)}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {member.lastName}, {member.firstName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(member.status)}`}>
                      {member.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(member.joinDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(member.totalSavings)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getHealthScoreClass(member.healthScore)}`}>
                      {member.healthScore}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/management/members/${member.id}`} className="text-blue-600 hover:text-blue-900">
                        <FiEye className="h-5 w-5" />
                      </Link>
                      <Link href={`/management/members/${member.id}/edit`} className="text-green-600 hover:text-green-900">
                        <FiEdit className="h-5 w-5" />
                      </Link>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(member.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiMoreVertical className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === member.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              <a
                                href={`mailto:${member.email}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiMail className="inline-block mr-2 h-4 w-4" />
                                Send Email
                              </a>
                              <a
                                href={`tel:${member.phone}`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiPhone className="inline-block mr-2 h-4 w-4" />
                                Call
                              </a>
                              <Link
                                href={`/management/members/${member.id}/loans`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                View Loans
                              </Link>
                              <Link
                                href={`/management/members/${member.id}/deposits`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                View Deposits
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedMembers.length}</span> of{' '}
              <span className="font-medium">{sortedMembers.length}</span> results
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

export default MemberTable;
