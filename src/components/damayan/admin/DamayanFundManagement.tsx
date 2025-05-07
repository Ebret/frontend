'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { 
  getAllDamayanFunds, 
  createDamayanFund, 
  updateDamayanFund,
  fetchDamayanFundStatistics
} from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { formatCurrency } from '@/utils/formatters';
import { Spinner } from '@/components/ui';

interface DamayanFund {
  id: string;
  name: string;
  description: string;
  balance: number;
  status: 'ACTIVE' | 'INACTIVE';
  cooperativeId?: number;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE';
  cooperativeId?: number | null;
}

interface FundStatistics {
  totalContributions: number;
  contributionsCount: number;
  totalDisbursements: number;
  disbursementsCount: number;
  currentBalance: number;
  pendingRequestsCount: number;
  uniqueContributorsCount: number;
}

const DamayanFundManagement: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { config } = useWhiteLabel();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [funds, setFunds] = useState<DamayanFund[]>([]);
  const [selectedFund, setSelectedFund] = useState<DamayanFund | null>(null);
  const [fundStatistics, setFundStatistics] = useState<FundStatistics | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    status: 'ACTIVE',
    cooperativeId: null
  });
  
  useEffect(() => {
    loadFunds();
  }, []);
  
  const loadFunds = async () => {
    setLoading(true);
    try {
      // In a real app, this would call the API
      // For now, we'll use mock data
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
      
      // Mock funds data
      const mockFunds: DamayanFund[] = [
        {
          id: '1',
          name: 'Medical Assistance Fund',
          description: 'Fund for members requiring medical assistance',
          balance: 150000,
          status: 'ACTIVE',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-07-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Calamity Relief Fund',
          description: 'Emergency fund for members affected by natural disasters',
          balance: 250000,
          status: 'ACTIVE',
          createdAt: '2022-11-10T00:00:00Z',
          updatedAt: '2023-06-15T00:00:00Z'
        },
        {
          id: '3',
          name: 'Education Support Fund',
          description: 'Fund to support children of members for educational expenses',
          balance: 100000,
          status: 'ACTIVE',
          createdAt: '2023-03-20T00:00:00Z',
          updatedAt: '2023-07-05T00:00:00Z'
        }
      ];
      
      setFunds(mockFunds);
      
      if (mockFunds.length > 0) {
        // Select the first fund by default
        setSelectedFund(mockFunds[0]);
        
        // Load fund statistics
        // In a real app, this would call the API
        // For now, we'll use mock data
        
        // Mock statistics data
        const mockStats: FundStatistics = {
          totalContributions: 200000,
          contributionsCount: 75,
          totalDisbursements: 50000,
          disbursementsCount: 5,
          currentBalance: 150000,
          pendingRequestsCount: 3,
          uniqueContributorsCount: 50
        };
        
        setFundStatistics(mockStats);
      }
    } catch (error) {
      console.error('Error loading Damayan funds:', error);
      toast.error('Failed to load Damayan funds');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectFund = async (fundId: string) => {
    const fund = funds.find(f => f.id === fundId);
    if (fund) {
      setSelectedFund(fund);
      
      // In a real app, this would call the API to get fund statistics
      // For now, we'll use mock data
      const mockStats: FundStatistics = {
        totalContributions: parseInt(fund.id) * 50000,
        contributionsCount: parseInt(fund.id) * 25,
        totalDisbursements: parseInt(fund.id) * 10000,
        disbursementsCount: parseInt(fund.id),
        currentBalance: fund.balance,
        pendingRequestsCount: parseInt(fund.id),
        uniqueContributorsCount: parseInt(fund.id) * 10
      };
      
      setFundStatistics(mockStats);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateFund = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Fund name is required');
      return;
    }
    
    setSubmitting(true);
    try {
      // In a real app, this would call the API
      // For now, we'll just simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      toast.success('Damayan fund created successfully');
      setShowCreateForm(false);
      setFormData({
        name: '',
        description: '',
        status: 'ACTIVE',
        cooperativeId: null
      });
      
      // Reload funds
      await loadFunds();
    } catch (error) {
      console.error('Error creating Damayan fund:', error);
      toast.error('Failed to create Damayan fund');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleEditFund = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Fund name is required');
      return;
    }
    
    if (!selectedFund) {
      toast.error('No fund selected');
      return;
    }
    
    setSubmitting(true);
    try {
      // In a real app, this would call the API
      // For now, we'll just simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      toast.success('Damayan fund updated successfully');
      setShowEditForm(false);
      
      // Reload funds
      await loadFunds();
    } catch (error) {
      console.error('Error updating Damayan fund:', error);
      toast.error('Failed to update Damayan fund');
    } finally {
      setSubmitting(false);
    }
  };
  
  const openEditForm = (fund: DamayanFund) => {
    setFormData({
      name: fund.name,
      description: fund.description,
      status: fund.status,
      cooperativeId: fund.cooperativeId
    });
    setSelectedFund(fund);
    setShowEditForm(true);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Damayan Fund Management</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Create and manage Damayan funds
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
          onClick={() => setShowCreateForm(true)}
        >
          Create New Fund
        </button>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {funds.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Damayan funds</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new Damayan fund.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                onClick={() => setShowCreateForm(true)}
              >
                Create New Fund
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <label htmlFor="fundId" className="block text-sm font-medium text-gray-700">
                Select Fund
              </label>
              <select
                id="fundId"
                name="fundId"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedFund?.id || ''}
                onChange={(e) => handleSelectFund(e.target.value)}
              >
                {funds.map((fund) => (
                  <option key={fund.id} value={fund.id}>
                    {fund.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedFund && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedFund.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{selectedFund.description}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedFund.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedFund.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Current Balance</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(selectedFund.balance)}</p>
                  </div>
                  
                  {fundStatistics && (
                    <>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Total Contributions</p>
                        <p className="text-2xl font-semibold text-gray-900">{formatCurrency(fundStatistics.totalContributions)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          From {fundStatistics.contributionsCount} contributions
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm font-medium text-gray-500">Total Disbursements</p>
                        <p className="text-2xl font-semibold text-gray-900">{formatCurrency(fundStatistics.totalDisbursements)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          From {fundStatistics.disbursementsCount} disbursements
                        </p>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => openEditForm(selectedFund)}
                  >
                    Edit Fund
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h4 className="text-base font-medium text-gray-900 mb-4">All Funds</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {funds.map((fund) => (
                      <tr key={fund.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{fund.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{fund.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(fund.balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            fund.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {fund.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(fund.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditForm(fund)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            style={{ color: config?.primaryColor }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Create Fund Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create New Damayan Fund</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowCreateForm(false)}
                disabled={submitting}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateFund}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Fund Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowCreateForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" color="white" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Fund'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Edit Fund Modal */}
      {showEditForm && selectedFund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Damayan Fund</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowEditForm(false)}
                disabled={submitting}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleEditFund}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                    Fund Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="edit-name"
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    id="edit-description"
                    rows={3}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="edit-status"
                    name="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowEditForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Spinner size="sm" color="white" className="mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Fund'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DamayanFundManagement;
