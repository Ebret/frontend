'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { getDamayanFundById, makeContribution } from '@/services/damayanService';
import { formatCurrency } from '@/utils/formatters';
import { Spinner } from '@/components/ui';
import { withAuth } from '@/utils/withAuth';

interface DamayanFund {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  targetAmount: number;
  contributionsCount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  beneficiary?: {
    id: string;
    name: string;
    reason: string;
  };
}

const FundDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { config } = useWhiteLabel();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fund, setFund] = useState<DamayanFund | null>(null);
  const [contributionAmount, setContributionAmount] = useState('');
  const [showContributeModal, setShowContributeModal] = useState(false);
  
  useEffect(() => {
    const fetchFundDetails = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        
        // In a real app, this would call the API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Mock fund data
        const mockFund: DamayanFund = {
          id: params.id as string,
          name: params.id === '1' ? 'Medical Assistance Fund' : 
                params.id === '2' ? 'Calamity Relief Fund' : 'Education Support Fund',
          description: params.id === '1' ? 'Fund for members requiring medical assistance' : 
                       params.id === '2' ? 'Emergency fund for members affected by natural disasters' : 
                       'Fund to support children of members for educational expenses',
          totalAmount: params.id === '1' ? 150000 : 
                       params.id === '2' ? 250000 : 100000,
          targetAmount: params.id === '1' ? 200000 : 
                        params.id === '2' ? 250000 : 300000,
          contributionsCount: params.id === '1' ? 75 : 
                              params.id === '2' ? 100 : 50,
          status: params.id === '2' ? 'COMPLETED' : 'ACTIVE',
          createdAt: '2023-01-15T00:00:00Z',
          updatedAt: '2023-07-01T00:00:00Z',
          beneficiary: params.id === '1' ? {
            id: '101',
            name: 'Juan Dela Cruz',
            reason: 'Hospitalization due to pneumonia'
          } : undefined
        };
        
        setFund(mockFund);
        setError(null);
      } catch (err) {
        console.error('Error fetching fund details:', err);
        setError('Failed to load fund details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFundDetails();
  }, [params.id]);
  
  // Calculate progress percentage
  const getProgressPercentage = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };
  
  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to make a contribution');
      return;
    }
    
    if (!fund) {
      toast.error('Invalid fund information');
      return;
    }
    
    if (!contributionAmount || isNaN(parseFloat(contributionAmount)) || parseFloat(contributionAmount) <= 0) {
      toast.error('Please enter a valid contribution amount');
      return;
    }
    
    setSubmitting(true);
    try {
      // In a real app, this would call the API
      // For now, we'll just simulate a successful contribution
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      toast.success('Thank you for your contribution to the Damayan fund!');
      setShowContributeModal(false);
      setContributionAmount('');
      
      // Refresh fund details
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      // Update the mock fund data with the new contribution
      if (fund) {
        const updatedFund = { 
          ...fund,
          totalAmount: fund.totalAmount + parseFloat(contributionAmount),
          contributionsCount: fund.contributionsCount + 1
        };
        setFund(updatedFund);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error making contribution:', err);
      toast.error('Failed to process your contribution. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }
  
  if (error || !fund) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error || 'Fund not found'}</p>
            <div className="mt-2">
              <button
                onClick={() => router.push('/damayan')}
                className="text-sm font-medium text-red-700 hover:text-red-600"
              >
                Go back to Damayan Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{fund.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Damayan Fund Details
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            fund.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
            fund.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {fund.status}
          </span>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="prose max-w-none mb-6">
          <p>{fund.description}</p>
          
          {fund.beneficiary && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-700">Current Beneficiary: {fund.beneficiary.name}</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    {fund.beneficiary.reason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h4 className="text-base font-medium text-gray-900 mb-2">Fund Progress</h4>
          <div className="flex justify-between text-sm mb-1">
            <span>{formatCurrency(fund.totalAmount)}</span>
            <span>{formatCurrency(fund.targetAmount)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full"
              style={{
                width: `${getProgressPercentage(fund.totalAmount, fund.targetAmount)}%`,
                backgroundColor: config?.primaryColor || '#3b82f6'
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {fund.contributionsCount} contributions so far • 
            {getProgressPercentage(fund.totalAmount, fund.targetAmount).toFixed(1)}% of target
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <Link
            href="/damayan"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Funds
          </Link>
          
          {fund.status === 'ACTIVE' && (
            <button
              onClick={() => setShowContributeModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
            >
              Contribute to Fund
            </button>
          )}
        </div>
      </div>
      
      {/* Contribute Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Contribute to {fund.name}</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={() => setShowContributeModal(false)}
                disabled={submitting}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleContribute}>
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Contribution Amount (₱) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₱</span>
                  </div>
                  <input
                    type="text"
                    name="amount"
                    id="amount"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    value={contributionAmount}
                    onChange={(e) => setContributionAmount(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Your contribution will help fellow members in times of need.
                </p>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      The Damayan fund is a community support system that helps members during times of need, such as medical emergencies, deaths in the family, or other hardships.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowContributeModal(false)}
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
                      Processing...
                    </>
                  ) : (
                    'Make Contribution'
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

export default withAuth(FundDetailPage);
