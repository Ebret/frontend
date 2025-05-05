import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { makeContribution } from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';

const DamayanContributionPrompt = ({ 
  userId, 
  fundId, 
  fundName, 
  suggestedAmount = 10, 
  message, 
  transactionId,
  onClose,
  onContribute
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [amount, setAmount] = useState(suggestedAmount);
  
  const handleContribute = async () => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const contributionData = {
        userId,
        damayanFundId: fundId,
        amount,
        contributionType: 'MANUAL',
        transactionId
      };
      
      const result = await makeContribution(contributionData);
      
      toast.success('Thank you for your contribution to the Damayan fund!');
      
      if (onContribute) {
        onContribute(result);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error making contribution:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Contribute to Damayan Fund
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {message || `Would you like to contribute to the ${fundName} to help fellow members in need?`}
              </p>
            </div>
            
            <div className="mt-4">
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
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  min="1"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleContribute}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Contribute'}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            No, thanks
          </button>
        </div>
      </div>
    </div>
  );
};

export default DamayanContributionPrompt;
