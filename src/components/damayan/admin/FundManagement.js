import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllDamayanFunds, 
  createDamayanFund, 
  updateDamayanFund,
  fetchDamayanFundStatistics
} from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';

const FundManagement = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundStatistics, setFundStatistics] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
    cooperativeId: null
  });
  
  useEffect(() => {
    loadFunds();
  }, []);
  
  const loadFunds = async () => {
    setIsLoading(true);
    try {
      const fundsData = await getAllDamayanFunds();
      setFunds(fundsData);
      
      if (fundsData.length > 0) {
        // Select the first fund by default
        setSelectedFund(fundsData[0]);
        
        // Load fund statistics
        const statsData = await fetchDamayanFundStatistics(fundsData[0].id);
        setFundStatistics(statsData);
      }
    } catch (error) {
      console.error('Error loading Damayan funds:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFundSelect = async (fundId) => {
    const fund = funds.find(f => f.id === parseInt(fundId, 10));
    setSelectedFund(fund);
    
    try {
      // Load fund statistics
      const statsData = await fetchDamayanFundStatistics(fund.id);
      setFundStatistics(statsData);
    } catch (error) {
      console.error('Error loading fund statistics:', error);
      toast.error(formatApiError(error));
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCreateFund = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Fund name is required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Set cooperative ID if available
      const fundData = {
        ...formData,
        cooperativeId: user?.cooperativeId || null
      };
      
      await createDamayanFund(fundData);
      
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
      toast.error(formatApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditFund = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast.error('Fund name is required');
      return;
    }
    
    if (!selectedFund) {
      toast.error('No fund selected');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateDamayanFund(selectedFund.id, formData);
      
      toast.success('Damayan fund updated successfully');
      setShowEditForm(false);
      
      // Reload funds
      await loadFunds();
    } catch (error) {
      console.error('Error updating Damayan fund:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openEditForm = () => {
    if (!selectedFund) return;
    
    setFormData({
      name: selectedFund.name,
      description: selectedFund.description || '',
      status: selectedFund.status,
      cooperativeId: selectedFund.cooperativeId
    });
    
    setShowEditForm(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Damayan Fund Management</h3>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setShowCreateForm(true)}
          >
            Create New Fund
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Manage Damayan funds and monitor their performance
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {funds.length === 0 && !showCreateForm ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Damayan funds</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new Damayan fund.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => setShowCreateForm(true)}
              >
                Create New Fund
              </button>
            </div>
          </div>
        ) : (
          <>
            {!showCreateForm && !showEditForm && (
              <div className="mb-6">
                <label htmlFor="fundSelect" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Fund
                </label>
                <select
                  id="fundSelect"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedFund?.id || ''}
                  onChange={(e) => handleFundSelect(e.target.value)}
                >
                  {funds.map((fund) => (
                    <option key={fund.id} value={fund.id}>
                      {fund.name} ({fund.status})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {showCreateForm && (
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Create New Damayan Fund</h4>
                <form onSubmit={handleCreateFund}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Fund Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Describe the purpose of this Damayan fund"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setShowCreateForm(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Creating...' : 'Create Fund'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {showEditForm && selectedFund && (
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Damayan Fund</h4>
                <form onSubmit={handleEditFund}>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Fund Name <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        Status
                      </label>
                      <div className="mt-1">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-6">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="Describe the purpose of this Damayan fund"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setShowEditForm(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {!showCreateForm && !showEditForm && selectedFund && fundStatistics && (
              <>
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
                  <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-900">{selectedFund.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedFund.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedFund.status}
                      </span>
                    </div>
                    {selectedFund.description && (
                      <p className="mt-1 text-sm text-gray-500">{selectedFund.description}</p>
                    )}
                  </div>
                  
                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500">Current Balance</h4>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">₱{fundStatistics.statistics.currentBalance.toLocaleString()}</p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500">Total Contributions</h4>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">₱{fundStatistics.statistics.totalContributions.toLocaleString()}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          From {fundStatistics.statistics.contributionsCount} contributions
                        </p>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-gray-500">Total Disbursements</h4>
                        <p className="mt-1 text-2xl font-semibold text-gray-900">₱{fundStatistics.statistics.totalDisbursements.toLocaleString()}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          From {fundStatistics.statistics.disbursementsCount} disbursements
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={openEditForm}
                      >
                        Edit Fund
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Contributions</h4>
                    {fundStatistics.recentActivity.contributions.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {fundStatistics.recentActivity.contributions.map((contribution) => (
                            <li key={contribution.id} className="px-4 py-3">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">₱{contribution.amount.toLocaleString()}</p>
                                  <p className="text-xs text-gray-500">
                                    {contribution.user.firstName} {contribution.user.lastName} • 
                                    {format(new Date(contribution.contributionDate), ' MMM d, yyyy')}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {contribution.contributionType.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No recent contributions</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Disbursements</h4>
                    {fundStatistics.recentActivity.disbursements.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <ul className="divide-y divide-gray-200">
                          {fundStatistics.recentActivity.disbursements.map((disbursement) => (
                            <li key={disbursement.id} className="px-4 py-3">
                              <div className="flex justify-between">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">₱{disbursement.amount.toLocaleString()}</p>
                                  <p className="text-xs text-gray-500">
                                    {disbursement.user.firstName} {disbursement.user.lastName} • 
                                    {format(new Date(disbursement.disbursementDate), ' MMM d, yyyy')}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No recent disbursements</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FundManagement;
