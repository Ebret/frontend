'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiEye, FiEdit, FiMoreVertical, FiChevronDown, FiChevronUp, FiDollarSign, FiCalendar, FiFileText } from 'react-icons/fi';

/**
 * Collateral Table Component
 * 
 * Displays a table of collateral with:
 * - Sorting
 * - Collateral details
 * - Quick actions
 * 
 * @param {Array} collaterals - Array of collateral objects
 * @param {boolean} loading - Whether data is loading
 */
const CollateralTable = ({ collaterals, loading }) => {
  // State for sorting
  const [sortField, setSortField] = useState('estimatedValue');
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
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'foreclosure':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type badge class
  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'real_estate':
        return 'bg-green-100 text-green-800';
      case 'vehicle':
        return 'bg-blue-100 text-blue-800';
      case 'equipment':
        return 'bg-yellow-100 text-yellow-800';
      case 'investment':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case 'real_estate':
        return 'Real Estate';
      case 'vehicle':
        return 'Vehicle';
      case 'equipment':
        return 'Equipment';
      case 'investment':
        return 'Investment';
      default:
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
  
  // Sort collaterals
  const sortedCollaterals = [...collaterals].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle null values
    if (aValue === null && bValue !== null) return sortDirection === 'asc' ? -1 : 1;
    if (aValue !== null && bValue === null) return sortDirection === 'asc' ? 1 : -1;
    if (aValue === null && bValue === null) return 0;
    
    // Handle date sorting
    if (sortField === 'appraisalDate' || sortField === 'nextAppraisalDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Toggle dropdown menu
  const toggleDropdown = (collateralId) => {
    setActiveDropdown(activeDropdown === collateralId ? null : collateralId);
  };
  
  // Check if any document is expiring soon
  const hasExpiringDocuments = (collateral) => {
    if (!collateral.documents || collateral.documents.length === 0) return false;
    
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return collateral.documents.some(doc => 
      doc.expiryDate && 
      new Date(doc.expiryDate) >= today &&
      new Date(doc.expiryDate) <= thirtyDaysFromNow
    );
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
                  <span>ID</span>
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
                onClick={() => handleSortChange('description')}
              >
                <div className="flex items-center">
                  <span>Description</span>
                  {sortField === 'description' && (
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
                onClick={() => handleSortChange('memberName')}
              >
                <div className="flex items-center">
                  <span>Owner</span>
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
                onClick={() => handleSortChange('estimatedValue')}
              >
                <div className="flex items-center">
                  <span>Value</span>
                  {sortField === 'estimatedValue' && (
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
                  <p className="mt-2 text-sm text-gray-500">Loading collateral items...</p>
                </td>
              </tr>
            ) : sortedCollaterals.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                  No collateral items found matching your filters.
                </td>
              </tr>
            ) : (
              sortedCollaterals.map((collateral) => (
                <tr key={collateral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {collateral.id}
                    <div className="text-xs text-gray-500">
                      Loan: {collateral.loanId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{collateral.description}</div>
                    <div className="text-xs text-gray-500">
                      {collateral.address && (
                        <span>{collateral.address}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeClass(collateral.type)}`}>
                      {getTypeLabel(collateral.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{collateral.memberName}</div>
                    <div className="text-xs text-gray-500">{collateral.memberId}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(collateral.estimatedValue)}
                    <div className="text-xs text-gray-500">
                      LTV: {(collateral.loanToValue * 100).toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(collateral.status)}`}>
                      {collateral.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                    {hasExpiringDocuments(collateral) && (
                      <div className="text-xs text-yellow-600 mt-1">
                        Documents expiring soon
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskLevelBadgeClass(collateral.riskLevel)}`}>
                      {collateral.riskLevel.charAt(0).toUpperCase() + collateral.riskLevel.slice(1)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      Score: {collateral.riskScore}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-3">
                      <Link href={`/management/collateral/${collateral.id}`} className="text-blue-600 hover:text-blue-900">
                        <FiEye className="h-5 w-5" />
                      </Link>
                      <Link href={`/management/collateral/${collateral.id}/edit`} className="text-green-600 hover:text-green-900">
                        <FiEdit className="h-5 w-5" />
                      </Link>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(collateral.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiMoreVertical className="h-5 w-5" />
                        </button>
                        
                        {activeDropdown === collateral.id && (
                          <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              <Link
                                href={`/management/collateral/${collateral.id}/appraisal`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiDollarSign className="inline-block mr-2 h-4 w-4 text-blue-500" />
                                Schedule Appraisal
                              </Link>
                              
                              <Link
                                href={`/management/collateral/${collateral.id}/documents`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiFileText className="inline-block mr-2 h-4 w-4 text-green-500" />
                                Manage Documents
                              </Link>
                              
                              <Link
                                href={`/management/collateral/${collateral.id}/history`}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                role="menuitem"
                              >
                                <FiCalendar className="inline-block mr-2 h-4 w-4 text-gray-500" />
                                View History
                              </Link>
                              
                              {collateral.status === 'active' && (
                                <Link
                                  href={`/management/collateral/${collateral.id}/foreclosure`}
                                  className="block px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                                  role="menuitem"
                                >
                                  <FiAlertTriangle className="inline-block mr-2 h-4 w-4 text-red-500" />
                                  Initiate Foreclosure
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
              Showing <span className="font-medium">1</span> to <span className="font-medium">{sortedCollaterals.length}</span> of{' '}
              <span className="font-medium">{sortedCollaterals.length}</span> results
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

export default CollateralTable;
