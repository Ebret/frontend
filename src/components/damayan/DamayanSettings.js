import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getUserDamayanSettings, updateUserDamayanSettings } from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';

const DamayanSettings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState(null);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        const userSettings = await getUserDamayanSettings(user.id);
        setSettings(userSettings);
        
        // Set form values
        setValue('autoContribute', userSettings.autoContribute);
        setValue('contributionType', userSettings.contributionType || 'FIXED');
        setValue('fixedAmount', userSettings.fixedAmount || 10);
        setValue('percentageAmount', userSettings.percentageAmount || 1);
        setValue('monthlyContribution', userSettings.monthlyContribution || false);
        setValue('monthlyAmount', userSettings.monthlyAmount || 50);
        setValue('receiveNotifications', userSettings.receiveNotifications !== false);
      } catch (error) {
        console.error('Error loading Damayan settings:', error);
        toast.error(formatApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [user, setValue]);
  
  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to update settings');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const updatedSettings = await updateUserDamayanSettings(user.id, data);
      setSettings(updatedSettings);
      
      toast.success('Damayan settings updated successfully');
    } catch (error) {
      console.error('Error updating Damayan settings:', error);
      toast.error(formatApiError(error));
    } finally {
      setIsSubmitting(false);
    }
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
        <h3 className="text-lg font-medium text-gray-900">Damayan Contribution Settings</h3>
        <p className="mt-1 text-sm text-gray-500">
          Manage your automatic contribution preferences
        </p>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="autoContribute"
                  name="autoContribute"
                  type="checkbox"
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  {...register('autoContribute')}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="autoContribute" className="font-medium text-gray-700">
                  Enable automatic contributions
                </label>
                <p className="text-gray-500">
                  Automatically contribute to the Damayan fund when you make transactions
                </p>
              </div>
            </div>
            
            <div className="pl-7">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contribution Type
              </label>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="fixed"
                    name="contributionType"
                    type="radio"
                    value="FIXED"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    {...register('contributionType')}
                  />
                  <label htmlFor="fixed" className="ml-3 block text-sm font-medium text-gray-700">
                    Fixed amount per transaction
                  </label>
                </div>
                
                <div className="pl-7">
                  <label htmlFor="fixedAmount" className="block text-sm font-medium text-gray-700">
                    Amount (₱)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm w-32">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₱</span>
                    </div>
                    <input
                      type="number"
                      name="fixedAmount"
                      id="fixedAmount"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="10"
                      min="1"
                      step="1"
                      {...register('fixedAmount', {
                        min: {
                          value: 1,
                          message: 'Amount must be at least ₱1'
                        }
                      })}
                    />
                  </div>
                  {errors.fixedAmount && (
                    <p className="mt-2 text-sm text-red-600">{errors.fixedAmount.message}</p>
                  )}
                </div>
                
                <div className="flex items-center">
                  <input
                    id="percentage"
                    name="contributionType"
                    type="radio"
                    value="PERCENTAGE"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    {...register('contributionType')}
                  />
                  <label htmlFor="percentage" className="ml-3 block text-sm font-medium text-gray-700">
                    Percentage of transaction amount
                  </label>
                </div>
                
                <div className="pl-7">
                  <label htmlFor="percentageAmount" className="block text-sm font-medium text-gray-700">
                    Percentage (%)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm w-32">
                    <input
                      type="number"
                      name="percentageAmount"
                      id="percentageAmount"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="1"
                      min="0.1"
                      max="10"
                      step="0.1"
                      {...register('percentageAmount', {
                        min: {
                          value: 0.1,
                          message: 'Percentage must be at least 0.1%'
                        },
                        max: {
                          value: 10,
                          message: 'Percentage cannot exceed 10%'
                        }
                      })}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">%</span>
                    </div>
                  </div>
                  {errors.percentageAmount && (
                    <p className="mt-2 text-sm text-red-600">{errors.percentageAmount.message}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="monthlyContribution"
                    name="monthlyContribution"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    {...register('monthlyContribution')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="monthlyContribution" className="font-medium text-gray-700">
                    Enable monthly contributions
                  </label>
                  <p className="text-gray-500">
                    Automatically contribute a fixed amount every month
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pl-7">
                <label htmlFor="monthlyAmount" className="block text-sm font-medium text-gray-700">
                  Monthly Amount (₱)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm w-32">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₱</span>
                  </div>
                  <input
                    type="number"
                    name="monthlyAmount"
                    id="monthlyAmount"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="50"
                    min="10"
                    step="10"
                    {...register('monthlyAmount', {
                      min: {
                        value: 10,
                        message: 'Monthly amount must be at least ₱10'
                      }
                    })}
                  />
                </div>
                {errors.monthlyAmount && (
                  <p className="mt-2 text-sm text-red-600">{errors.monthlyAmount.message}</p>
                )}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="receiveNotifications"
                    name="receiveNotifications"
                    type="checkbox"
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    {...register('receiveNotifications')}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="receiveNotifications" className="font-medium text-gray-700">
                    Receive Damayan notifications
                  </label>
                  <p className="text-gray-500">
                    Get notified about Damayan fund activities and assistance requests
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DamayanSettings;
