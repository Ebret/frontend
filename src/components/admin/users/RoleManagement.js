'use client';

import React, { useState, useEffect } from 'react';
import { FiUsers, FiShield, FiAlertTriangle, FiCheck, FiX } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';
import { 
  UserRole, 
  roleDisplayNames, 
  roleDescriptions, 
  isMultiPurposeRole,
  getRolesForCooperativeType
} from '@/lib/roles';

/**
 * Role Management Component
 * 
 * Allows administrators to manage user roles based on cooperative type
 * 
 * @param {Object} props
 * @param {Array} props.users - List of users
 * @param {Function} props.onUpdateUserRole - Function to call when updating a user's role
 */
const RoleManagement = ({ users = [], onUpdateUserRole }) => {
  const { cooperativeType, isLoading } = useCooperative();
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set available roles based on cooperative type
  useEffect(() => {
    if (!isLoading && cooperativeType) {
      setAvailableRoles(getRolesForCooperativeType(cooperativeType));
    }
  }, [cooperativeType, isLoading]);
  
  // Handle user selection
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || '');
  };
  
  // Handle role change
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };
  
  // Handle save button click
  const handleSaveClick = () => {
    if (selectedUser && selectedRole && selectedUser.role !== selectedRole) {
      setShowConfirmation(true);
    }
  };
  
  // Handle confirmation
  const handleConfirmChange = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      setIsSubmitting(true);
      
      // Call the update function
      await onUpdateUserRole(selectedUser.id, selectedRole);
      
      // Update the local user object
      setSelectedUser({
        ...selectedUser,
        role: selectedRole
      });
      
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    setShowConfirmation(false);
  };
  
  // Get role badge class
  const getRoleBadgeClass = (role) => {
    if (role === UserRole.ADMIN) {
      return 'bg-red-100 text-red-800';
    } else if (role === UserRole.GENERAL_MANAGER) {
      return 'bg-purple-100 text-purple-800';
    } else if (isMultiPurposeRole(role)) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-blue-100 text-blue-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <FiUsers className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Role Management
          </h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {cooperativeType === 'CREDIT' ? 'Credit Cooperative' : 'Multi-Purpose Cooperative'}
        </span>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
          {/* User List */}
          <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
            <div className="px-4 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Users
            </div>
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li 
                  key={user.id}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                    selectedUser?.id === user.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                    {user.role && (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                        {roleDisplayNames[user.role] || user.role}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Role Assignment */}
          <div className="col-span-2">
            {selectedUser ? (
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Assigned Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={selectedRole}
                    onChange={handleRoleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select a role</option>
                    {availableRoles.map((role) => (
                      <option key={role} value={role}>
                        {roleDisplayNames[role] || role}
                      </option>
                    ))}
                  </select>
                </div>
                
                {selectedRole && (
                  <div className="mb-4 bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center mb-2">
                      <FiShield className="h-5 w-5 text-blue-500 mr-2" />
                      <h5 className="text-sm font-medium text-gray-900">
                        {roleDisplayNames[selectedRole] || selectedRole}
                      </h5>
                    </div>
                    <p className="text-sm text-gray-500">
                      {roleDescriptions[selectedRole] || 'No description available.'}
                    </p>
                    
                    {isMultiPurposeRole(selectedRole) && cooperativeType === 'CREDIT' && (
                      <div className="mt-2 flex items-start">
                        <div className="flex-shrink-0">
                          <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-yellow-700">
                            This role is specific to Multi-Purpose Cooperatives. It may not have the expected permissions in a Credit Cooperative.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveClick}
                    disabled={!selectedRole || selectedUser.role === selectedRole}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      !selectedRole || selectedUser.role === selectedRole
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <FiUsers className="h-12 w-12 text-gray-300 mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No User Selected</h4>
                <p className="text-sm text-gray-500 text-center">
                  Select a user from the list to manage their role.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiShield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Change User Role
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to change the role of <span className="font-medium">{selectedUser?.firstName} {selectedUser?.lastName}</span> from <span className="font-medium">{roleDisplayNames[selectedUser?.role] || selectedUser?.role}</span> to <span className="font-medium">{roleDisplayNames[selectedRole] || selectedRole}</span>?
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This will change the user's permissions and access to system features.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleConfirmChange}
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2 h-4 w-4" />
                      Confirm
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;
