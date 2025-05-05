'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getAllDamayanFunds, makeContribution } from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';
import { withAuth } from '@/utils/withAuth';

const ContributePage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [funds, setFunds] = useState([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      amount: 10
    }
  });
  
  useEffect(() => {
    const loadFunds = async () => {
      try {
        const fundsData = await getAllDamayanFunds({ status: 'ACTIVE' });
        setFunds(fundsData);
      } catch (error) {
        console.error('Error loading Damayan funds:', error);
        toast.error(formatApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFunds();
  }, []);
  
  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to make a contribution');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const contributionData = {
        userId: user.id,
        damayanFundId: parseInt(data.fundId, 10),
        amount: parseFloat(data.amount),
        contributionType: 'MANUAL'
      };
      
      await makeContribution(contributionData);
      
      toast.success('Thank you for your contribution to the Damayan fund!');
      window.location.href = '/damayan';
    } catch (error) {
      console.error('Error making contribution:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsSubmitting(false);
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
  
  if (funds.length === 0) {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Damayan Funds</h3>
              <p className="text-gray-500 mb-4">There are no active Damayan funds available at the moment.</p>
              <a
                href="/damayan"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Damayan Dashboard
              </a>
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
          <h1 className="text-2xl font-semibold text-gray-900">Make a Contribution</h1>
          <p className="mt-1 text-sm text-gray-500">
            Support fellow members in need through the Damayan fund
          </p>
          
          <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="fundId" className="block text-sm font-medium text-gray-700">
                      Damayan Fund
                    </label>
                    <select
                      id="fundId"
                      name="fundId"
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${errors.fundId ? 'border-red-300' : ''}`}
                      {...register('fundId', { required: 'Please select a fund' })}
                    >
                      <option value="">Select a fund</option>
                      {funds.map((fund) => (
                        <option key={fund.id} value={fund.id}>
                          {fund.name}
                        </option>
                      ))}
                    </select>
                    {errors.fundId && (
                      <p className="mt-2 text-sm text-red-600">{errors.fundId.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                      Contribution Amount (₱)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₱</span>
                      </div>
                      <input
                        type="number"
                        name="amount"
                        id="amount"
                        className={`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${errors.amount ? 'border-red-300' : ''}`}
                        placeholder="0.00"
                        {...register('amount', { 
                          required: 'Please enter an amount',
                          min: {
                            value: 1,
                            message: 'Amount must be at least ₱1'
                          },
                          validate: value => !isNaN(parseFloat(value)) || 'Please enter a valid number'
                        })}
                        min="1"
                        step="1"
                      />
                    </div>
                    {errors.amount && (
                      <p className="mt-2 text-sm text-red-600">{errors.amount.message}</p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      Your contribution will help fellow members in times of need.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
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
                    <a
                      href="/damayan"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </a>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processing...' : 'Make Contribution'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(ContributePage);
