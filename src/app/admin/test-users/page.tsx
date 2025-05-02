'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/roles';
import { Dialog, Transition } from '@headlessui/react';
import {
  createDummyUser,
  createDummyEWalletUser,
  createDummyGoogleUser,
  createDummyFacebookUser,
  createDummyGoogleEWalletUser,
  createDummyFacebookEWalletUser,
  createBatchUsers,
  cleanupTestUsers,
  deleteTestUser,
  getCreatedTestUsers,
  getTestUserById,
  exportTestUsers,
  importTestUsers,
  DummyUser,
  SocialProvider
} from '@/utils/testUsers';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoadingButton from '@/components/LoadingButton';
import FormSelect from '@/components/FormSelect';
import FormInput from '@/components/FormInput';
import FormCard from '@/components/FormCard';
import ConfirmationDialog from '@/components/ConfirmationDialog';

const TestUsersPage: React.FC = () => {
  const { user } = useAuth();
  const [testUsers, setTestUsers] = useState<DummyUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.MEMBER);
  const [initialBalance, setInitialBalance] = useState<string>('0');
  const [isCreatingEWallet, setIsCreatingEWallet] = useState(false);
  const [socialProvider, setSocialProvider] = useState<SocialProvider>(null);

  // Batch creation
  const [batchCount, setBatchCount] = useState<string>('5');
  const [isBatchMode, setIsBatchMode] = useState(false);

  // User details
  const [selectedUser, setSelectedUser] = useState<DummyUser | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);

  // Import/Export
  const [importData, setImportData] = useState<string>('');
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Custom attributes
  const [customAttributes, setCustomAttributes] = useState<{key: string, value: string}[]>([
    { key: '', value: '' }
  ]);

  // Load existing test users on mount
  useEffect(() => {
    setTestUsers(getCreatedTestUsers());
  }, []);

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      let newUser: DummyUser;

      // Handle different combinations of social providers and e-wallet
      if (socialProvider === 'google') {
        if (isCreatingEWallet) {
          newUser = await createDummyGoogleEWalletUser(
            parseFloat(initialBalance) || 0,
            { role: selectedRole }
          );
        } else {
          newUser = await createDummyGoogleUser(selectedRole);
        }
      } else if (socialProvider === 'facebook') {
        if (isCreatingEWallet) {
          newUser = await createDummyFacebookEWalletUser(
            parseFloat(initialBalance) || 0,
            { role: selectedRole }
          );
        } else {
          newUser = await createDummyFacebookUser(selectedRole);
        }
      } else {
        // Regular user (no social provider)
        if (isCreatingEWallet) {
          newUser = await createDummyEWalletUser(
            parseFloat(initialBalance) || 0,
            { role: selectedRole }
          );
        } else {
          newUser = await createDummyUser(selectedRole);
        }
      }

      setTestUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Error creating test user:', error);
      alert('Failed to create test user. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchCreate = async () => {
    setIsLoading(true);
    try {
      const count = parseInt(batchCount);
      if (isNaN(count) || count <= 0) {
        alert('Please enter a valid number of users to create');
        setIsLoading(false);
        return;
      }

      // Create custom attributes object
      const customAttrs: Record<string, string> = {};
      customAttributes.forEach(attr => {
        if (attr.key && attr.value) {
          customAttrs[attr.key] = attr.value;
        }
      });

      const newUsers = await createBatchUsers(count, {
        role: selectedRole,
        withEWallet: isCreatingEWallet,
        initialBalance: parseFloat(initialBalance) || 0,
        socialProvider
      });

      setTestUsers(prev => [...prev, ...newUsers]);
    } catch (error) {
      console.error('Error creating batch test users:', error);
      alert('Failed to create batch test users. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUserDetails = (userId: number) => {
    const user = getTestUserById(userId);
    if (user) {
      setSelectedUser(user);
      setIsUserDetailOpen(true);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      await deleteTestUser(selectedUser.id);
      setTestUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setIsDeleteUserDialogOpen(false);
      setIsUserDetailOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting test user:', error);
      alert('Failed to delete test user. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const jsonData = exportTestUsers();
      // Create a download link
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test-users-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error('Error exporting test users:', error);
      alert('Failed to export test users. See console for details.');
    }
  };

  const handleImport = () => {
    try {
      if (!importData.trim()) {
        alert('Please enter valid JSON data');
        return;
      }

      const importedUsers = importTestUsers(importData);
      setTestUsers(importedUsers);
      setImportData('');
      setIsImportDialogOpen(false);
    } catch (error) {
      console.error('Error importing test users:', error);
      alert('Failed to import test users. Please check your JSON format.');
    }
  };

  const handleAddCustomAttribute = () => {
    setCustomAttributes([...customAttributes, { key: '', value: '' }]);
  };

  const handleRemoveCustomAttribute = (index: number) => {
    setCustomAttributes(customAttributes.filter((_, i) => i !== index));
  };

  const handleCustomAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    const newAttributes = [...customAttributes];
    newAttributes[index][field] = value;
    setCustomAttributes(newAttributes);
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    try {
      await cleanupTestUsers();
      setTestUsers([]);
      setIsCleanupDialogOpen(false);
    } catch (error) {
      console.error('Error cleaning up test users:', error);
      alert('Failed to clean up test users. See console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = Object.values(UserRole).map(role => ({
    value: role,
    label: role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
  }));

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Test Users Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCard
            title="Create Test User"
            description="Create dummy users for testing purposes"
          >
            <div className="space-y-4">
              <FormSelect
                id="role"
                name="role"
                label="User Role"
                value={selectedRole}
                options={roleOptions}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Social Login Provider
                </label>
                <div className="flex flex-wrap gap-4">
                  <div
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      socialProvider === null
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSocialProvider(null)}
                  >
                    <div className="w-6 h-6 mr-2 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <span>Regular User</span>
                  </div>

                  <div
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      socialProvider === 'google'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSocialProvider('google')}
                  >
                    <div className="w-6 h-6 mr-2 flex items-center justify-center text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                      </svg>
                    </div>
                    <span>Google</span>
                  </div>

                  <div
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      socialProvider === 'facebook'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSocialProvider('facebook')}
                  >
                    <div className="w-6 h-6 mr-2 flex items-center justify-center text-blue-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                    <span>Facebook</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                  <input
                    id="createWallet"
                    type="checkbox"
                    checked={isCreatingEWallet}
                    onChange={(e) => setIsCreatingEWallet(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="createWallet" className="ml-2 block text-sm text-gray-900">
                    Create with E-Wallet
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    id="batchMode"
                    type="checkbox"
                    checked={isBatchMode}
                    onChange={(e) => setIsBatchMode(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="batchMode" className="ml-2 block text-sm text-gray-900">
                    Batch Creation Mode
                  </label>
                </div>
              </div>

              {isCreatingEWallet && (
                <FormInput
                  id="initialBalance"
                  name="initialBalance"
                  label="Initial Balance"
                  type="number"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  min="0"
                  step="0.01"
                />
              )}

              {isBatchMode && (
                <FormInput
                  id="batchCount"
                  name="batchCount"
                  label="Number of Users to Create"
                  type="number"
                  value={batchCount}
                  onChange={(e) => setBatchCount(e.target.value)}
                  min="1"
                  max="100"
                  helpText="Create up to 100 users at once"
                />
              )}

              {/* Custom Attributes Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Attributes (Optional)
                </label>
                {customAttributes.map((attr, index) => (
                  <div key={index} className="flex items-center mb-2 gap-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={attr.key}
                      onChange={(e) => handleCustomAttributeChange(index, 'key', e.target.value)}
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={attr.value}
                      onChange={(e) => handleCustomAttributeChange(index, 'value', e.target.value)}
                      className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomAttribute(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddCustomAttribute}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Add Attribute
                </button>
              </div>

              <div className="flex justify-end space-x-2">
                {isBatchMode ? (
                  <LoadingButton
                    isLoading={isLoading}
                    onClick={handleBatchCreate}
                    className="w-full md:w-auto"
                  >
                    Create {batchCount} {socialProvider ? `${socialProvider.charAt(0).toUpperCase() + socialProvider.slice(1)} ` : ''}Test Users
                  </LoadingButton>
                ) : (
                  <LoadingButton
                    isLoading={isLoading}
                    onClick={handleCreateUser}
                    className="w-full md:w-auto"
                  >
                    Create {socialProvider ? `${socialProvider.charAt(0).toUpperCase() + socialProvider.slice(1)} ` : ''}Test User
                  </LoadingButton>
                )}
              </div>
            </div>
          </FormCard>

          <FormCard
            title="Test Users"
            description={`${testUsers.length} test users created`}
          >
            {testUsers.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between mb-2">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsImportDialogOpen(true)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      Import
                    </button>
                    <button
                      onClick={() => setIsExportDialogOpen(true)}
                      className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
                      disabled={testUsers.length === 0}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      Export
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Click on a user to view details
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleViewUserDetails(user.id)}
                        >
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {user.role}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex flex-wrap gap-1">
                              {user.socialProvider === 'google' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  Google
                                </span>
                              )}
                              {user.socialProvider === 'facebook' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  Facebook
                                </span>
                              )}
                              {user.walletId && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                  E-Wallet
                                </span>
                              )}
                              {!user.socialProvider && !user.walletId && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                  Regular
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                                setIsDeleteUserDialogOpen(true);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <LoadingButton
                    isLoading={isLoading}
                    onClick={() => setIsCleanupDialogOpen(true)}
                    className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  >
                    Clean Up All Test Users
                  </LoadingButton>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No test users created yet
              </div>
            )}
          </FormCard>
        </div>

        {/* Clean Up Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isCleanupDialogOpen}
          onClose={() => setIsCleanupDialogOpen(false)}
          onConfirm={handleCleanup}
          title="Clean Up Test Users"
          message="Are you sure you want to delete all test users? This action cannot be undone."
          confirmButtonText="Delete All"
          confirmButtonColor="red"
        />

        {/* Delete User Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isDeleteUserDialogOpen}
          onClose={() => setIsDeleteUserDialogOpen(false)}
          onConfirm={handleDeleteUser}
          title="Delete Test User"
          message={`Are you sure you want to delete the test user "${selectedUser?.firstName} ${selectedUser?.lastName}" (${selectedUser?.email})? This action cannot be undone.`}
          confirmButtonText="Delete User"
          confirmButtonColor="red"
        />

        {/* User Details Dialog */}
        <Transition.Root show={isUserDetailOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsUserDetailOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                            Test User Details
                          </Dialog.Title>

                          {selectedUser && (
                            <div className="mt-4 text-sm">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="font-medium text-gray-500">ID</p>
                                  <p>{selectedUser.id}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500">Name</p>
                                  <p>{selectedUser.firstName} {selectedUser.lastName}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500">Email</p>
                                  <p>{selectedUser.email}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500">Role</p>
                                  <p>{selectedUser.role}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500">Phone</p>
                                  <p>{selectedUser.phoneNumber}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500">Date of Birth</p>
                                  <p>{selectedUser.dateOfBirth}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-gray-500">Address</p>
                                  <p>{selectedUser.address}</p>
                                </div>

                                {selectedUser.socialProvider && (
                                  <div>
                                    <p className="font-medium text-gray-500">Social Provider</p>
                                    <p>{selectedUser.socialProvider}</p>
                                  </div>
                                )}

                                {selectedUser.socialId && (
                                  <div>
                                    <p className="font-medium text-gray-500">Social ID</p>
                                    <p>{selectedUser.socialId}</p>
                                  </div>
                                )}

                                {selectedUser.walletId && (
                                  <>
                                    <div>
                                      <p className="font-medium text-gray-500">Wallet ID</p>
                                      <p>{selectedUser.walletId}</p>
                                    </div>
                                    <div>
                                      <p className="font-medium text-gray-500">Wallet Balance</p>
                                      <p>${selectedUser.walletBalance?.toFixed(2)}</p>
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="mt-4">
                                <p className="font-medium text-gray-500">Login Credentials</p>
                                <div className="mt-1 p-2 bg-gray-50 rounded-md">
                                  {selectedUser.socialProvider ? (
                                    <p>This user can be logged in via {selectedUser.socialProvider} authentication.</p>
                                  ) : (
                                    <p>Email: {selectedUser.email}<br />Password: Password123!</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setIsUserDetailOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Import Dialog */}
        <Transition.Root show={isImportDialogOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsImportDialogOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div>
                        <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                          Import Test Users
                        </Dialog.Title>
                        <div className="mt-4">
                          <label htmlFor="importData" className="block text-sm font-medium text-gray-700 mb-1">
                            Paste JSON Data
                          </label>
                          <textarea
                            id="importData"
                            rows={10}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            value={importData}
                            onChange={(e) => setImportData(e.target.value)}
                            placeholder='[{"id": 1, "email": "test@example.com", ...}]'
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                        onClick={handleImport}
                      >
                        Import
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={() => setIsImportDialogOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Export Dialog */}
        <ConfirmationDialog
          isOpen={isExportDialogOpen}
          onClose={() => setIsExportDialogOpen(false)}
          onConfirm={handleExport}
          title="Export Test Users"
          message="This will download a JSON file containing all your test users. You can use this file to import the users later."
          confirmButtonText="Export"
          confirmButtonColor="indigo"
        />
      </div>
    </ProtectedRoute>
  );
};

export default TestUsersPage;
