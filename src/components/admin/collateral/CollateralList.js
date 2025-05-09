'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiPlus, FiSearch, FiFilter, FiDownload, FiEdit, FiEye, FiTrash2 } from 'react-icons/fi';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

/**
 * Collateral List Component
 * 
 * Displays a list of collaterals with search, filter, and pagination
 * 
 * @param {Function} onAdd - Callback when Add button is clicked
 * @param {Function} onView - Callback when View button is clicked
 * @param {Function} onEdit - Callback when Edit button is clicked
 */
const CollateralList = ({ onAdd, onView, onEdit }) => {
  // State for collaterals data
  const [collaterals, setCollaterals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    minValue: '',
    maxValue: '',
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  
  // State for showing filter panel
  const [showFilters, setShowFilters] = useState(false);
  
  // State for delete confirmation
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    collateral: null
  });
  
  // Fetch collaterals on component mount and when filters or pagination change
  useEffect(() => {
    fetchCollaterals();
  }, [filters, pagination.page, pagination.limit]);
  
  // Mock function to fetch collaterals (replace with actual API call)
  const fetchCollaterals = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/collaterals?' + new URLSearchParams({
      //   page: pagination.page,
      //   limit: pagination.limit,
      //   search: filters.search,
      //   type: filters.type,
      //   status: filters.status,
      //   minValue: filters.minValue,
      //   maxValue: filters.maxValue,
      //   sortBy: filters.sortBy,
      //   sortOrder: filters.sortOrder
      // }));
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockData = {
        success: true,
        data: [
          {
            _id: '1',
            name: 'Residential Property in Makati',
            type: 'real_estate',
            estimated_value: 5000000,
            status: 'active',
            owner: { first_name: 'Juan', last_name: 'Dela Cruz', member_id: 'M001' },
            location: 'Makati City',
            created_at: '2023-01-15T08:30:00Z'
          },
          {
            _id: '2',
            name: 'Toyota Fortuner 2020',
            type: 'vehicle',
            estimated_value: 1500000,
            status: 'active',
            owner: { first_name: 'Maria', last_name: 'Santos', member_id: 'M002' },
            registration_number: 'ABC-123',
            created_at: '2023-02-20T10:15:00Z'
          },
          {
            _id: '3',
            name: 'Commercial Space in Ortigas',
            type: 'real_estate',
            estimated_value: 8000000,
            status: 'pending_verification',
            owner: { first_name: 'Pedro', last_name: 'Reyes', member_id: 'M003' },
            location: 'Ortigas Center, Pasig',
            created_at: '2023-03-05T14:45:00Z'
          },
          {
            _id: '4',
            name: 'Time Deposit Certificate',
            type: 'investment',
            estimated_value: 500000,
            status: 'active',
            owner: { first_name: 'Ana', last_name: 'Lim', member_id: 'M004' },
            created_at: '2023-04-10T09:20:00Z'
          },
          {
            _id: '5',
            name: 'Farm Equipment',
            type: 'equipment',
            estimated_value: 750000,
            status: 'active',
            owner: { first_name: 'Jose', last_name: 'Garcia', member_id: 'M005' },
            created_at: '2023-05-15T11:30:00Z'
          }
        ],
        pagination: {
          total: 5,
          page: 1,
          limit: 10,
          pages: 1
        }
      };
      
      setCollaterals(mockData.data);
      setPagination(mockData.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching collaterals:', err);
      setError('Failed to fetch collaterals. Please try again.');
      toast.error('Failed to fetch collaterals');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      minValue: '',
      maxValue: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.pages) {
      setPagination(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };
  
  // Handle delete collateral
  const handleDeleteCollateral = async () => {
    if (!deleteModal.collateral) return;
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/collaterals/${deleteModal.collateral._id}`, {
      //   method: 'DELETE'
      // });
      
      // Mock successful deletion
      toast.success('Collateral deleted successfully');
      
      // Refresh the list
      fetchCollaterals();
    } catch (err) {
      console.error('Error deleting collateral:', err);
      toast.error('Failed to delete collateral');
    } finally {
      // Close the modal
      setDeleteModal({
        isOpen: false,
        collateral: null
      });
    }
  };
  
  // Handle export to CSV
  const handleExportCSV = () => {
    // In a real app, this would trigger a file download
    // window.location.href = `/api/collaterals/export/csv?${new URLSearchParams(filters)}`;
    
    // Mock successful export
    toast.success('Collaterals exported successfully');
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
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'archived':
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
      case 'inventory':
        return 'Inventory';
      case 'cash':
        return 'Cash';
      case 'investment':
        return 'Investment';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };
  
  return (
    <div className="px-4 py-5 sm:p-6">
      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <form onSubmit={handleSearch} className="flex w-full md:max-w-md">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search collaterals..."
                />
              </div>
              <button
                type="submit"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
            </form>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
              Filters
            </button>
            
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiDownload className="mr-2 h-5 w-5 text-gray-400" />
              Export
            </button>
            
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="mr-2 h-5 w-5" />
              Add Collateral
            </button>
          </div>
        </div>
        
        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="real_estate">Real Estate</option>
                  <option value="vehicle">Vehicle</option>
                  <option value="equipment">Equipment</option>
                  <option value="inventory">Inventory</option>
                  <option value="cash">Cash</option>
                  <option value="investment">Investment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="rejected">Rejected</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="minValue" className="block text-sm font-medium text-gray-700">
                  Min Value (₱)
                </label>
                <input
                  type="number"
                  id="minValue"
                  name="minValue"
                  value={filters.minValue}
                  onChange={handleFilterChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Min value"
                />
              </div>
              
              <div>
                <label htmlFor="maxValue" className="block text-sm font-medium text-gray-700">
                  Max Value (₱)
                </label>
                <input
                  type="number"
                  id="maxValue"
                  name="maxValue"
                  value={filters.maxValue}
                  onChange={handleFilterChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Max value"
                />
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Collaterals Table */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Loading collaterals...</p>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-red-500">
                        {error}
                      </td>
                    </tr>
                  ) : collaterals.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No collaterals found.
                      </td>
                    </tr>
                  ) : (
                    collaterals.map((collateral) => (
                      <tr key={collateral._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{collateral.name}</div>
                          <div className="text-sm text-gray-500">
                            {collateral.location || collateral.registration_number || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{getTypeLabel(collateral.type)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(collateral.estimated_value)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {collateral.owner.first_name} {collateral.owner.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{collateral.owner.member_id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(collateral.status)}`}>
                            {collateral.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => onView(collateral)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <FiEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onEdit(collateral)}
                            className="text-green-600 hover:text-green-900 mr-4"
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, collateral })}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {!loading && !error && collaterals.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                pagination.page === pagination.pages ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
                    pagination.page === pagination.pages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
      )}
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Collateral"
        message={`Are you sure you want to delete the collateral "${deleteModal.collateral?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        onConfirm={handleDeleteCollateral}
        onCancel={() => setDeleteModal({ isOpen: false, collateral: null })}
      />
    </div>
  );
};

export default CollateralList;
