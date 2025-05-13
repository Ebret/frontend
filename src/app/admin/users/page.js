'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiUserPlus, FiSearch, FiFilter, FiRefreshCw } from 'react-icons/fi';
import AdminLayout from '@/components/admin/AdminLayout';
import RoleManagement from '@/components/admin/users/RoleManagement';
import { useCooperative } from '@/contexts/CooperativeContext';
import { roleDisplayNames } from '@/lib/roles';

/**
 * User Management Page
 * 
 * Provides tools for managing users and their roles
 */
const UserManagementPage = () => {
  const router = useRouter();
  const { cooperativeType, isLoading: isCooperativeLoading } = useCooperative();
  
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockUsers = [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'ADMIN',
            status: 'ACTIVE',
            createdAt: '2023-01-01T00:00:00.000Z',
          },
          {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'jane.smith@example.com',
            role: 'GENERAL_MANAGER',
            status: 'ACTIVE',
            createdAt: '2023-01-02T00:00:00.000Z',
          },
          {
            id: 3,
            firstName: 'Bob',
            lastName: 'Johnson',
            email: 'bob.johnson@example.com',
            role: 'CREDIT_OFFICER',
            status: 'ACTIVE',
            createdAt: '2023-01-03T00:00:00.000Z',
          },
          {
            id: 4,
            firstName: 'Alice',
            lastName: 'Williams',
            email: 'alice.williams@example.com',
            role: 'MEMBER',
            status: 'ACTIVE',
            createdAt: '2023-01-04T00:00:00.000Z',
          },
          {
            id: 5,
            firstName: 'Charlie',
            lastName: 'Brown',
            email: 'charlie.brown@example.com',
            role: 'TELLER',
            status: 'INACTIVE',
            createdAt: '2023-01-05T00:00:00.000Z',
          },
          {
            id: 6,
            firstName: 'David',
            lastName: 'Miller',
            email: 'david.miller@example.com',
            role: 'ACCOUNTANT',
            status: 'ACTIVE',
            createdAt: '2023-01-06T00:00:00.000Z',
          },
          {
            id: 7,
            firstName: 'Eva',
            lastName: 'Garcia',
            email: 'eva.garcia@example.com',
            role: 'COMPLIANCE_OFFICER',
            status: 'ACTIVE',
            createdAt: '2023-01-07T00:00:00.000Z',
          },
          {
            id: 8,
            firstName: 'Frank',
            lastName: 'Martinez',
            email: 'frank.martinez@example.com',
            role: 'STORE_MANAGER',
            status: 'ACTIVE',
            createdAt: '2023-01-08T00:00:00.000Z',
          },
          {
            id: 9,
            firstName: 'Grace',
            lastName: 'Lee',
            email: 'grace.lee@example.com',
            role: 'INVENTORY_MANAGER',
            status: 'ACTIVE',
            createdAt: '2023-01-09T00:00:00.000Z',
          },
          {
            id: 10,
            firstName: 'Henry',
            lastName: 'Wilson',
            email: 'henry.wilson@example.com',
            role: 'CASHIER',
            status: 'ACTIVE',
            createdAt: '2023-01-10T00:00:00.000Z',
          },
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Apply filters when search term, role filter, or status filter changes
  useEffect(() => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.firstName.toLowerCase().includes(term) ||
          user.lastName.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      );
    }
    
    // Apply role filter
    if (roleFilter) {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle role filter change
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };
  
  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
  };
  
  // Handle create user button click
  const handleCreateUserClick = () => {
    router.push('/admin/users/create');
  };
  
  // Handle update user role
  const handleUpdateUserRole = async (userId, role) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just update the local state
      
      // Update the user in the users array
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            role,
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      return true;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading || isCooperativeLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <button
            type="button"
            onClick={handleCreateUserClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiUserPlus className="mr-2 h-5 w-5" />
            Create User
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* User List */}
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div className="flex items-center">
                  <FiUsers className="h-5 w-5 text-gray-400 mr-2" />
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Users
                  </h3>
                </div>
                <span className="text-sm text-gray-500">
                  {filteredUsers.length} users
                </span>
              </div>
              
              <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Search users..."
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <select
                      value={roleFilter}
                      onChange={handleRoleFilterChange}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Roles</option>
                      {Object.entries(roleDisplayNames).map(([role, displayName]) => (
                        <option key={role} value={role}>
                          {displayName}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={statusFilter}
                      onChange={handleStatusFilterChange}
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Statuses</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SUSPENDED">Suspended</option>
                      <option value="PENDING">Pending</option>
                    </select>
                    
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiRefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {roleDisplayNames[user.role] || user.role}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Role Management */}
          <div>
            <RoleManagement 
              users={users}
              onUpdateUserRole={handleUpdateUserRole}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserManagementPage;
