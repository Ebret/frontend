import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getAllDamayanFunds, requestAssistance } from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';

const DamayanAssistanceForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [funds, setFunds] = useState([]);
  const [files, setFiles] = useState([]);
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
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
  
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };
  
  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to request assistance');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // In a real implementation, you would upload the files to a storage service
      // and get back URLs to include in the request
      const documentUrls = files.map(file => ({
        name: file.name,
        fileUrl: URL.createObjectURL(file), // This is just a placeholder
        documentType: 'OTHER'
      }));
      
      const requestData = {
        userId: user.id,
        damayanFundId: parseInt(data.fundId, 10),
        reason: data.reason,
        documents: documentUrls
      };
      
      await requestAssistance(requestData);
      
      toast.success('Your assistance request has been submitted successfully');
      router.push('/damayan');
    } catch (error) {
      console.error('Error submitting assistance request:', error);
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
  
  if (funds.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Damayan Funds</h3>
        <p className="text-gray-500 mb-4">There are no active Damayan funds available at the moment.</p>
        <button
          onClick={() => router.push('/damayan')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Damayan Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Request Assistance</h3>
        <p className="mt-1 text-sm text-gray-500">
          Submit a request for assistance from the Damayan fund
        </p>
      </div>
      
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
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                Reason for Assistance
              </label>
              <div className="mt-1">
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${errors.reason ? 'border-red-300' : ''}`}
                  placeholder="Please explain why you need assistance"
                  {...register('reason', { 
                    required: 'Please provide a reason for your request',
                    minLength: {
                      value: 20,
                      message: 'Please provide a more detailed explanation (at least 20 characters)'
                    }
                  })}
                />
              </div>
              {errors.reason && (
                <p className="mt-2 text-sm text-red-600">{errors.reason.message}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Please provide a detailed explanation of your situation and why you need assistance.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Supporting Documents
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB each
                  </p>
                </div>
              </div>
              {files.length > 0 && (
                <ul className="mt-2 divide-y divide-gray-200 border rounded-md">
                  {files.map((file, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 flex-1 w-0 truncate">{file.name}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          className="font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={() => {
                            const newFiles = [...files];
                            newFiles.splice(index, 1);
                            setFiles(newFiles);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Please upload any relevant documents to support your request (e.g., medical bills, death certificates).
              </p>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    By submitting this request, you confirm that all information provided is true and accurate. False claims may result in disciplinary action.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => router.push('/damayan')}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DamayanAssistanceForm;
