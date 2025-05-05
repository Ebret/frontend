import React, { useState, useEffect } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserContributions } from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';

const ContributionHistory = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [contributions, setContributions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [totalContributed, setTotalContributed] = useState(0);
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'list'
  
  useEffect(() => {
    const loadContributions = async () => {
      if (!user) return;
      
      try {
        const data = await fetchUserContributions(user.id);
        setContributions(data);
        
        // Calculate total contributed
        const total = data.reduce((sum, item) => sum + item.amount, 0);
        setTotalContributed(total);
        
        // Generate monthly data for the chart
        generateMonthlyData(data);
      } catch (error) {
        console.error('Error loading contributions:', error);
        toast.error(formatApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadContributions();
  }, [user]);
  
  const generateMonthlyData = (contributionsData) => {
    // Get date range (last 12 months)
    const endDate = new Date();
    const startDate = subMonths(endDate, 11);
    
    // Generate array of months
    const months = eachMonthOfInterval({
      start: startOfMonth(startDate),
      end: endOfMonth(endDate)
    });
    
    // Calculate total contributions for each month
    const monthlyTotals = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthContributions = contributionsData.filter(contribution => {
        const contributionDate = new Date(contribution.contributionDate);
        return contributionDate >= monthStart && contributionDate <= monthEnd;
      });
      
      const total = monthContributions.reduce((sum, item) => sum + item.amount, 0);
      
      return {
        month: format(month, 'MMM yyyy'),
        total,
        count: monthContributions.length
      };
    });
    
    setMonthlyData(monthlyTotals);
  };
  
  // Find the maximum monthly contribution for scaling the chart
  const maxMonthlyContribution = Math.max(...monthlyData.map(item => item.total), 1);
  
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
          <h3 className="text-lg font-medium text-gray-900">Contribution History</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 ${
                viewMode === 'chart' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setViewMode('chart')}
            >
              Chart
            </button>
            <button
              type="button"
              className={`inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 ${
                viewMode === 'list' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Your Damayan contribution history
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500">Total Contributions</h4>
            <p className="mt-1 text-2xl font-semibold text-gray-900">₱{totalContributed.toLocaleString()}</p>
            <p className="mt-1 text-xs text-gray-500">
              From {contributions.length} contributions
            </p>
          </div>
        </div>
        
        {viewMode === 'chart' && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Monthly Contribution Trend</h4>
            
            {/* Chart visualization */}
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end">
                {monthlyData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full max-w-[30px] bg-indigo-600 rounded-t"
                      style={{ 
                        height: `${(item.total / maxMonthlyContribution) * 100}%`,
                        minHeight: item.total > 0 ? '4px' : '0'
                      }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500 transform -rotate-45 origin-top-left whitespace-nowrap">
                      {item.month}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute inset-y-0 left-0 flex flex-col justify-between pointer-events-none">
                <div className="text-xs text-gray-400">₱{maxMonthlyContribution.toLocaleString()}</div>
                <div className="text-xs text-gray-400">₱{(maxMonthlyContribution / 2).toLocaleString()}</div>
                <div className="text-xs text-gray-400">₱0</div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-8 flex justify-center">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-indigo-600 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Monthly Contribution Total</span>
              </div>
            </div>
          </div>
        )}
        
        {viewMode === 'list' && (
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contributions.map((contribution) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionHistory;
