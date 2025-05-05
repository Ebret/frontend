import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { makeContribution } from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';

const DamayanNotification = ({ 
  notification, 
  onClose,
  onAction
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Format the notification date
  const formattedDate = notification.createdAt ? 
    format(new Date(notification.createdAt), 'MMM d, yyyy h:mm a') : '';
  
  // Handle contribution action
  const handleContribute = async (amount) => {
    if (!user) {
      toast.error('You must be logged in to make a contribution');
      return;
    }
    
    if (!notification.metadata?.fundId) {
      toast.error('Invalid fund information');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const contributionData = {
        userId: user.id,
        damayanFundId: notification.metadata.fundId,
        amount,
        contributionType: 'MANUAL'
      };
      
      await makeContribution(contributionData);
      
      toast.success('Thank you for your contribution to the Damayan fund!');
      
      if (onAction) {
        onAction('contribute', { amount });
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
  
  // Handle view details action
  const handleViewDetails = () => {
    if (notification.metadata?.assistanceId) {
      if (onAction) {
        onAction('viewDetails', { assistanceId: notification.metadata.assistanceId });
      }
    } else {
      setShowDetails(!showDetails);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mb-4">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start">
          {/* Icon based on notification type */}
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 
            ${notification.notificationType === 'DAMAYAN_REQUEST' ? 'bg-yellow-100' : 
              notification.notificationType === 'DAMAYAN_APPROVAL' ? 'bg-green-100' : 
              notification.notificationType === 'DAMAYAN_DISBURSEMENT' ? 'bg-blue-100' : 
              'bg-indigo-100'}">
            {notification.notificationType === 'DAMAYAN_REQUEST' ? (
              <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : notification.notificationType === 'DAMAYAN_APPROVAL' ? (
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : notification.notificationType === 'DAMAYAN_DISBURSEMENT' ? (
              <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          {/* Notification content */}
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {notification.title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {notification.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formattedDate}
              </p>
            </div>
            
            {/* Additional details */}
            {showDetails && notification.metadata && (
              <div className="mt-4 bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Details</h4>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(notification.metadata).map(([key, value]) => (
                    <div key={key} className="col-span-1">
                      <dt className="text-xs font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                      <dd className="text-sm text-gray-900">{typeof value === 'object' ? JSON.stringify(value) : value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            
            {/* Action buttons */}
            <div className="mt-4 flex flex-wrap gap-2">
              {notification.notificationType === 'DAMAYAN_REQUEST' && notification.metadata?.fundId && (
                <>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleContribute(10)}
                    disabled={isSubmitting}
                  >
                    Contribute ₱10
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleContribute(50)}
                    disabled={isSubmitting}
                  >
                    Contribute ₱50
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => handleContribute(100)}
                    disabled={isSubmitting}
                  >
                    Contribute ₱100
                  </button>
                </>
              )}
              
              {notification.metadata && (
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handleViewDetails}
                >
                  {showDetails ? 'Hide Details' : 'View Details'}
                </button>
              )}
              
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={onClose}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamayanNotification;
