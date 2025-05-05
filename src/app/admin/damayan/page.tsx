'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllDamayanFunds, 
  fetchDamayanFundStatistics, 
  fetchPendingAssistanceRequests,
  reviewAssistanceRequest,
  disburseAssistance
} from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';
import { withAuth } from '@/utils/withAuth';

const AdminDamayanPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [fundStatistics, setFundStatistics] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewData, setReviewData] = useState({
    status: 'APPROVED',
    amount: '',
    rejectionReason: '',
    approvedById: user?.id
  });
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load all active funds
        const fundsData = await getAllDamayanFunds({ status: 'ACTIVE' });
        setFunds(fundsData);
        
        if (fundsData.length > 0) {
          // Select the first fund by default
          setSelectedFund(fundsData[0]);
          
          // Load fund statistics
          const statsData = await fetchDamayanFundStatistics(fundsData[0].id);
          setFundStatistics(statsData);
          
          // Load pending requests
          const requestsData = await fetchPendingAssistanceRequests({
            cooperativeId: fundsData[0].cooperativeId
          });
          setPendingRequests(requestsData.requests);
        }
      } catch (error) {
        console.error('Error loading Damayan data:', error);
        toast.error(formatApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleFundChange = async (fundId) => {
    const fund = funds.find(f => f.id === parseInt(fundId, 10));
    setSelectedFund(fund);
    
    setIsLoading(true);
    try {
      // Load fund statistics
      const statsData = await fetchDamayanFundStatistics(fund.id);
      setFundStatistics(statsData);
      
      // Load pending requests
      const requestsData = await fetchPendingAssistanceRequests({
        cooperativeId: fund.cooperativeId
      });
      setPendingRequests(requestsData.requests);
    } catch (error) {
      console.error('Error loading fund data:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const openReviewModal = (request) => {
    setSelectedRequest(request);
    setReviewData({
      status: 'APPROVED',
      amount: '',
      rejectionReason: '',
      approvedById: user?.id
    });
    setShowReviewModal(true);
  };
  
  const closeReviewModal = () => {
    setSelectedRequest(null);
    setShowReviewModal(false);
  };
  
  const handleReviewInputChange = (e) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = (status) => {
    setReviewData(prev => ({
      ...prev,
      status
    }));
  };
  
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRequest) return;
    
    // Validate inputs
    if (reviewData.status === 'APPROVED' && (!reviewData.amount || parseFloat(reviewData.amount) <= 0)) {
      toast.error('Please enter a valid amount for approval');
      return;
    }
    
    if (reviewData.status === 'REJECTED' && !reviewData.rejectionReason) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setIsProcessing(true);
    try {
      await reviewAssistanceRequest(selectedRequest.id, reviewData);
      
      toast.success(`Assistance request ${reviewData.status.toLowerCase()} successfully`);
      
      // Refresh pending requests
      const requestsData = await fetchPendingAssistanceRequests({
        cooperativeId: selectedFund.cooperativeId
      });
      setPendingRequests(requestsData.requests);
      
      // Refresh fund statistics
      const statsData = await fetchDamayanFundStatistics(selectedFund.id);
      setFundStatistics(statsData);
      
      closeReviewModal();
    } catch (error) {
      console.error('Error reviewing request:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDisburse = async (requestId) => {
    setIsProcessing(true);
    try {
      await disburseAssistance(requestId, {});
      
      toast.success('Assistance disbursed successfully');
      
      // Refresh fund statistics
      const statsData = await fetchDamayanFundStatistics(selectedFund.id);
      setFundStatistics(statsData);
    } catch (error) {
      console.error('Error disbursing assistance:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Damayan Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage Damayan funds and assistance requests
          </p>
          
          {funds.length === 0 ? (
            <div className="mt-6 bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Damayan Funds</h3>
              <p className="text-gray-500 mb-4">There are no active Damayan funds available at the moment.</p>
              <a
                href="/admin/damayan/funds/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Damayan Fund
              </a>
            </div>
          ) : (
            <div className="mt-6">
              <div className="mb-6">
                <label htmlFor="fundId" className="block text-sm font-medium text-gray-700">
                  Select Damayan Fund
                </label>
                <select
                  id="fundId"
                  name="fundId"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedFund?.id || ''}
                  onChange={(e) => handleFundChange(e.target.value)}
                >
                  {funds.map((fund) => (
                    <option key={fund.id} value={fund.id}>
                      {fund.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {fundStatistics && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
                  <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Fund Statistics</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Overview of {selectedFund.name}
                    </p>
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
                  </div>
                </div>
              )}
              
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Pending Assistance Requests</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Review and process assistance requests
                  </p>
                </div>
                
                <div className="px-4 py-5 sm:p-6">
                  {pendingRequests.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Request Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Member
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reason
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Documents
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pendingRequests.map((request) => (
                            <tr key={request.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(request.requestDate), 'MMM d, yyyy')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {request.user.firstName} {request.user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {request.user.memberId || 'No Member ID'}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                                {request.reason}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.documents.length} document(s)
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => openReviewModal(request)}
                                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No pending requests</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        There are no assistance requests waiting for review at this time.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Review Modal */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Review Assistance Request</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={closeReviewModal}
                disabled={isProcessing}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Member</h4>
                  <p className="text-sm text-gray-900">
                    {selectedRequest.user.firstName} {selectedRequest.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedRequest.user.memberId || 'No Member ID'}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Request Date</h4>
                  <p className="text-sm text-gray-900">
                    {format(new Date(selectedRequest.requestDate), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Reason for Assistance</h4>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedRequest.reason}
                </p>
              </div>
              
              {selectedRequest.documents.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Supporting Documents</h4>
                  <ul className="divide-y divide-gray-200 border rounded-md">
                    {selectedRequest.documents.map((doc, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 flex-1 w-0 truncate">{doc.name}</span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            View
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <form onSubmit={handleReviewSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decision
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="approved"
                      name="status"
                      type="radio"
                      checked={reviewData.status === 'APPROVED'}
                      onChange={() => handleStatusChange('APPROVED')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="approved" className="ml-2 block text-sm text-gray-700">
                      Approve
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="rejected"
                      name="status"
                      type="radio"
                      checked={reviewData.status === 'REJECTED'}
                      onChange={() => handleStatusChange('REJECTED')}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label htmlFor="rejected" className="ml-2 block text-sm text-gray-700">
                      Reject
                    </label>
                  </div>
                </div>
              </div>
              
              {reviewData.status === 'APPROVED' && (
                <div className="mb-4">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Assistance Amount (₱) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₱</span>
                    </div>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      value={reviewData.amount}
                      onChange={handleReviewInputChange}
                      min="1"
                      step="1"
                      required={reviewData.status === 'APPROVED'}
                    />
                  </div>
                </div>
              )}
              
              {reviewData.status === 'REJECTED' && (
                <div className="mb-4">
                  <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="rejectionReason"
                    name="rejectionReason"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Please provide a reason for rejection"
                    value={reviewData.rejectionReason}
                    onChange={handleReviewInputChange}
                    required={reviewData.status === 'REJECTED'}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    This reason will be visible to the member.
                  </p>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={closeReviewModal}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    reviewData.status === 'APPROVED'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? 'Processing...'
                    : reviewData.status === 'APPROVED'
                    ? 'Approve Request'
                    : 'Reject Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default withAuth(AdminDamayanPage, ['ADMIN', 'MANAGER', 'BOARD_MEMBER']);
