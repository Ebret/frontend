import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { 
  getAllDamayanFunds, 
  fetchDamayanFundStatistics,
  fetchMemberParticipation
} from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';

const MemberParticipation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [funds, setFunds] = useState([]);
  const [selectedFund, setSelectedFund] = useState(null);
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('contributionAmount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [participationStats, setParticipationStats] = useState(null);
  
  useEffect(() => {
    loadFunds();
  }, []);
  
  const loadFunds = async () => {
    setIsLoading(true);
    try {
      const fundsData = await getAllDamayanFunds({ status: 'ACTIVE' });
      setFunds(fundsData);
      
      if (fundsData.length > 0) {
        // Select the first fund by default
        setSelectedFund(fundsData[0]);
        
        // Load member participation data
        await loadMemberParticipation(fundsData[0].id);
      }
    } catch (error) {
      console.error('Error loading Damayan funds:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadMemberParticipation = async (fundId) => {
    setIsLoading(true);
    try {
      const data = await fetchMemberParticipation(fundId);
      setMembers(data.members);
      setParticipationStats(data.stats);
    } catch (error) {
      console.error('Error loading member participation:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFundChange = async (e) => {
    const fundId = e.target.value;
    const fund = funds.find(f => f.id === parseInt(fundId, 10));
    setSelectedFund(fund);
    
    await loadMemberParticipation(fundId);
  };
  
  const handleSort = (field) => {
    if (sortBy === field) {
      // Toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort field and default to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };
  
  // Filter and sort members
  const filteredMembers = members
    .filter(member => {
      const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const memberId = member.memberId ? member.memberId.toLowerCase() : '';
      const searchLower = searchTerm.toLowerCase();
      
      return fullName.includes(searchLower) || memberId.includes(searchLower);
    })
    .sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'name':
          valueA = `${a.firstName} ${a.lastName}`.toLowerCase();
          valueB = `${b.firstName} ${b.lastName}`.toLowerCase();
          break;
        case 'contributionAmount':
          valueA = a.contributionAmount;
          valueB = b.contributionAmount;
          break;
        case 'contributionCount':
          valueA = a.contributionCount;
          valueB = b.contributionCount;
          break;
        case 'lastContribution':
          valueA = a.lastContribution ? new Date(a.lastContribution) : new Date(0);
          valueB = b.lastContribution ? new Date(b.lastContribution) : new Date(0);
          break;
        case 'assistanceAmount':
          valueA = a.assistanceAmount;
          valueB = b.assistanceAmount;
          break;
        default:
          valueA = a.contributionAmount;
          valueB = b.contributionAmount;
      }
      
      if (sortDirection === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  
  if (isLoading && funds.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Member Participation</h3>
        <p className="mt-1 text-sm text-gray-500">
          Track member contributions and assistance
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-6">
          <label htmlFor="fundSelect" className="block text-sm font-medium text-gray-700 mb-1">
            Select Damayan Fund
          </label>
          <select
            id="fundSelect"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedFund?.id || ''}
            onChange={handleFundChange}
          >
            {funds.map((fund) => (
              <option key={fund.id} value={fund.id}>
                {fund.name}
              </option>
            ))}
          </select>
        </div>
        
        {participationStats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500">Total Members</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{participationStats.totalMembers}</p>
              <p className="mt-1 text-xs text-gray-500">
                {participationStats.activeContributors} active contributors
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500">Participation Rate</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {participationStats.participationRate}%
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Of total membership
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-500">Average Contribution</h4>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                ₱{participationStats.averageContribution.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Per contributing member
              </p>
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Members
          </label>
          <input
            type="text"
            id="search"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Search by name or member ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Member
                    {sortBy === 'name' && (
                      <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        {sortDirection === 'asc' ? (
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('contributionAmount')}
                >
                  <div className="flex items-center">
                    Contributions
                    {sortBy === 'contributionAmount' && (
                      <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        {sortDirection === 'asc' ? (
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('contributionCount')}
                >
                  <div className="flex items-center">
                    Count
                    {sortBy === 'contributionCount' && (
                      <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        {sortDirection === 'asc' ? (
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('lastContribution')}
                >
                  <div className="flex items-center">
                    Last Contribution
                    {sortBy === 'lastContribution' && (
                      <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        {sortDirection === 'asc' ? (
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('assistanceAmount')}
                >
                  <div className="flex items-center">
                    Assistance Received
                    {sortBy === 'assistanceAmount' && (
                      <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        {sortDirection === 'asc' ? (
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        )}
                      </svg>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {member.memberId || 'No Member ID'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₱{member.contributionAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.contributionCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {member.lastContribution 
                      ? format(new Date(member.lastContribution), 'MMM d, yyyy')
                      : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₱{member.assistanceAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
              
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    No members found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MemberParticipation;
