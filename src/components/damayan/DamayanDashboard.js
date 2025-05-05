import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserDamayanSummary, fetchDamayanFundStatistics } from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';

const DamayanDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userSummary, setUserSummary] = useState(null);
  const [fundStatistics, setFundStatistics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadDamayanData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        // Fetch user's Damayan summary
        const summaryData = await fetchUserDamayanSummary(user.id);
        setUserSummary(summaryData);
        
        // Fetch fund statistics if there are any contributions
        if (summaryData.recentActivity.contributions.length > 0) {
          const fundId = summaryData.recentActivity.contributions[0].damayanFundId;
          const fundData = await fetchDamayanFundStatistics(fundId);
          setFundStatistics(fundData);
        }
      } catch (error) {
        console.error('Error loading Damayan data:', error);
        toast.error(formatApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDamayanData();
  }, [user]);

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
        <h3 className="text-lg font-medium text-gray-900">Damayan Dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">
          Overview of your Damayan contributions and community support
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('contributions')}
              className={`${
                activeTab === 'contributions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              My Contributions
            </button>
            <button
              onClick={() => setActiveTab('assistance')}
              className={`${
                activeTab === 'assistance'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              Assistance History
            </button>
          </nav>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && userSummary && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500">Total Contributions</h4>
                <p className="mt-1 text-2xl font-semibold text-gray-900">₱{userSummary.summary.totalContributions.toLocaleString()}</p>
                <p className="mt-1 text-xs text-gray-500">
                  From {userSummary.summary.contributionsCount} contributions
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500">Assistance Received</h4>
                <p className="mt-1 text-2xl font-semibold text-gray-900">₱{userSummary.summary.totalAssistanceReceived.toLocaleString()}</p>
                <p className="mt-1 text-xs text-gray-500">
                  From {userSummary.summary.assistanceReceivedCount} requests
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-500">Pending Requests</h4>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{userSummary.summary.pendingRequestsCount}</p>
                <p className="mt-1 text-xs text-gray-500">
                  Awaiting approval
                </p>
              </div>
            </div>
            
            {fundStatistics && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-blue-800">Damayan Fund Status</h4>
                <p className="mt-1 text-2xl font-semibold text-blue-900">₱{fundStatistics.statistics.currentBalance.toLocaleString()}</p>
                <div className="mt-2 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-blue-600">Total Contributions</p>
                    <p className="text-sm font-medium text-blue-800">₱{fundStatistics.statistics.totalContributions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Total Disbursements</p>
                    <p className="text-sm font-medium text-blue-800">₱{fundStatistics.statistics.totalDisbursements.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-blue-600">Contributors</p>
                  <p className="text-sm font-medium text-blue-800">{fundStatistics.statistics.uniqueContributorsCount} members</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Contributions */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Contributions</h4>
                {userSummary.recentActivity.contributions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {userSummary.recentActivity.contributions.map((contribution) => (
                        <li key={contribution.id} className="px-4 py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">₱{contribution.amount.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{format(new Date(contribution.contributionDate), 'MMM d, yyyy')}</p>
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
                  <p className="text-sm text-gray-500 italic">No contributions yet</p>
                )}
              </div>
              
              {/* Recent Assistance */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Assistance</h4>
                {userSummary.recentActivity.assistance.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                      {userSummary.recentActivity.assistance.map((assistance) => (
                        <li key={assistance.id} className="px-4 py-3">
                          <div className="flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {assistance.amount ? `₱${assistance.amount.toLocaleString()}` : 'Pending'}
                              </p>
                              <p className="text-xs text-gray-500">{format(new Date(assistance.requestDate), 'MMM d, yyyy')}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                assistance.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                assistance.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                assistance.status === 'DISBURSED' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {assistance.status}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No assistance requests yet</p>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-center space-x-4">
              <a
                href="/damayan/contribute"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Make a Contribution
              </a>
              <a
                href="/damayan/request"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Request Assistance
              </a>
            </div>
          </div>
        )}
        
        {/* Contributions Tab */}
        {activeTab === 'contributions' && userSummary && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">My Contributions</h4>
            
            {userSummary.recentActivity.contributions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fund
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userSummary.recentActivity.contributions.map((contribution) => (
                      <tr key={contribution.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(contribution.contributionDate), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₱{contribution.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {contribution.damayanFund.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {contribution.contributionType.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {contribution.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No contributions yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't made any contributions to the Damayan fund yet.
                </p>
                <div className="mt-6">
                  <a
                    href="/damayan/contribute"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Make a Contribution
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Assistance Tab */}
        {activeTab === 'assistance' && userSummary && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Assistance History</h4>
            
            {userSummary.recentActivity.assistance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Request Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Disbursement Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userSummary.recentActivity.assistance.map((assistance) => (
                      <tr key={assistance.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(assistance.requestDate), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {assistance.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {assistance.amount ? `₱${assistance.amount.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            assistance.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            assistance.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                            assistance.status === 'DISBURSED' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {assistance.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {assistance.disbursementDate ? format(new Date(assistance.disbursementDate), 'MMM d, yyyy') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assistance requests yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't requested any assistance from the Damayan fund yet.
                </p>
                <div className="mt-6">
                  <a
                    href="/damayan/request"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Request Assistance
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DamayanDashboard;
