import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserDamayanSummary, makeContribution } from '@/services/damayanService';
import { getUnreadDamayanNotificationCount } from '@/services/notificationService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';

const DamayanWidget = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSummary, setUserSummary] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [showQuickContribute, setShowQuickContribute] = useState(false);
  const [contributionAmount, setContributionAmount] = useState(10);
  
  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        // Fetch user's Damayan summary
        const summaryData = await fetchUserDamayanSummary(user.id);
        setUserSummary(summaryData);
        
        // Fetch unread notification count
        const countData = await getUnreadDamayanNotificationCount(user.id);
        setNotificationCount(countData.count);
      } catch (error) {
        console.error('Error loading Damayan data:', error);
        toast.error(formatApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);
  
  const handleQuickContribute = async () => {
    if (!user) {
      toast.error('You must be logged in to make a contribution');
      return;
    }
    
    if (!userSummary || !userSummary.recentActivity.contributions.length) {
      toast.error('No fund information available');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const fundId = userSummary.recentActivity.contributions[0].damayanFundId;
      
      const contributionData = {
        userId: user.id,
        damayanFundId: fundId,
        amount: contributionAmount,
        contributionType: 'MANUAL'
      };
      
      await makeContribution(contributionData);
      
      toast.success('Thank you for your contribution to the Damayan fund!');
      setShowQuickContribute(false);
      
      // Refresh summary
      const summaryData = await fetchUserDamayanSummary(user.id);
      setUserSummary(summaryData);
    } catch (error) {
      console.error('Error making contribution:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <Spinner size="md" />
      </div>
    );
  }
  
  if (!userSummary) {
    return null;
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium text-gray-900">Damayan</h3>
          {notificationCount > 0 && (
            <a
              href="/damayan/notifications"
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {notificationCount} New
            </a>
          )}
        </div>
      </div>
      
      <div className="px-4 py-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <div className="text-sm text-gray-500">Your Contributions</div>
            <div className="text-xl font-semibold text-gray-900">₱{userSummary.summary.totalContributions.toLocaleString()}</div>
          </div>
          
          <div className="flex space-x-2">
            <a
              href="/damayan"
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Dashboard
            </a>
            <button
              type="button"
              onClick={() => setShowQuickContribute(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Contribute
            </button>
          </div>
        </div>
        
        {showQuickContribute && (
          <div className="mt-4 bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Contribution</h4>
            <div className="flex items-center space-x-2 mb-3">
              <button
                type="button"
                onClick={() => setContributionAmount(10)}
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  contributionAmount === 10 
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                ₱10
              </button>
              <button
                type="button"
                onClick={() => setContributionAmount(50)}
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  contributionAmount === 50 
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                ₱50
              </button>
              <button
                type="button"
                onClick={() => setContributionAmount(100)}
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  contributionAmount === 100 
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                ₱100
              </button>
              <button
                type="button"
                onClick={() => setContributionAmount(500)}
                className={`px-3 py-1 text-xs font-medium rounded-md ${
                  contributionAmount === 500 
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-300' 
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                ₱500
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setShowQuickContribute(false)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleQuickContribute}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Contribute ₱${contributionAmount}`}
              </button>
            </div>
          </div>
        )}
        
        {!showQuickContribute && (
          <div className="mt-4">
            <div className="text-sm text-gray-500 mb-2">Recent Activity</div>
            {userSummary.recentActivity.contributions.length > 0 || userSummary.recentActivity.assistance.length > 0 ? (
              <div className="space-y-2">
                {userSummary.recentActivity.contributions.slice(0, 1).map((contribution) => (
                  <div key={contribution.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-900">Contributed ₱{contribution.amount.toLocaleString()}</span>
                    </div>
                    <div className="text-gray-500">
                      {format(new Date(contribution.contributionDate), 'MMM d')}
                    </div>
                  </div>
                ))}
                
                {userSummary.recentActivity.assistance.slice(0, 1).map((assistance) => (
                  <div key={assistance.id} className="flex justify-between items-center text-sm">
                    <div>
                      <span className={`${
                        assistance.status === 'DISBURSED' ? 'text-green-600' : 
                        assistance.status === 'APPROVED' ? 'text-blue-600' : 
                        assistance.status === 'PENDING' ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        {assistance.status === 'DISBURSED' ? 'Received' : 
                         assistance.status === 'APPROVED' ? 'Approved' : 
                         assistance.status === 'PENDING' ? 'Requested' : 
                         'Rejected'} {assistance.amount ? `₱${assistance.amount.toLocaleString()}` : 'assistance'}
                      </span>
                    </div>
                    <div className="text-gray-500">
                      {format(new Date(
                        assistance.status === 'DISBURSED' ? assistance.disbursementDate : 
                        assistance.status === 'APPROVED' ? assistance.approvalDate : 
                        assistance.requestDate
                      ), 'MMM d')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No recent activity</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DamayanWidget;
