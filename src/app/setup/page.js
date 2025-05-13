'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FiArrowRight, FiCheck, FiCreditCard, FiShoppingBag } from 'react-icons/fi';
import SetupLayout from '@/components/setup/SetupLayout';
import CooperativeTypeSelection from '@/components/setup/CooperativeTypeSelection';
import CooperativeDetailsForm from '@/components/setup/CooperativeDetailsForm';
import AdminAccountForm from '@/components/setup/AdminAccountForm';
import SetupComplete from '@/components/setup/SetupComplete';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Setup Wizard Page
 * 
 * Multi-step wizard for initial system setup:
 * 1. Select cooperative type (Credit or Multi-Purpose)
 * 2. Enter cooperative details
 * 3. Create admin account
 * 4. Setup complete
 */
const SetupPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    cooperativeType: 'CREDIT',
    cooperativeName: '',
    cooperativeAddress: '',
    cooperativePhone: '',
    cooperativeEmail: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminConfirmPassword: '',
  });
  
  // Check if system is already initialized
  useEffect(() => {
    const checkInitialization = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/setup/check-initialization`);
        setIsInitialized(response.data.data.initialized);
        
        if (response.data.data.initialized) {
          // Redirect to login if already initialized
          router.push('/login');
        }
      } catch (error) {
        setError('Failed to check system initialization. Please try again.');
        console.error('Error checking initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkInitialization();
  }, [router]);
  
  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle cooperative type selection
  const handleTypeSelection = (type) => {
    setFormData(prev => ({
      ...prev,
      cooperativeType: type
    }));
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (currentStep < 4) {
      // Move to next step
      setCurrentStep(currentStep + 1);
      return;
    }
    
    // Final submission
    try {
      setIsLoading(true);
      
      const payload = {
        cooperativeType: formData.cooperativeType,
        cooperativeName: formData.cooperativeName,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      };
      
      await axios.post(`${API_URL}/setup/initialize`, payload);
      
      // Move to complete step
      setCurrentStep(5);
    } catch (error) {
      setError('Failed to initialize system. Please try again.');
      console.error('Error initializing system:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Validate current step
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Cooperative Type
        return !!formData.cooperativeType;
      case 2: // Cooperative Details
        return (
          !!formData.cooperativeName &&
          !!formData.cooperativeAddress &&
          !!formData.cooperativeEmail
        );
      case 3: // Admin Account
        return (
          !!formData.adminName &&
          !!formData.adminEmail &&
          !!formData.adminPassword &&
          formData.adminPassword === formData.adminConfirmPassword &&
          formData.adminPassword.length >= 8
        );
      default:
        return true;
    }
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <CooperativeTypeSelection
            selectedType={formData.cooperativeType}
            onSelect={handleTypeSelection}
          />
        );
      case 2:
        return (
          <CooperativeDetailsForm
            formData={formData}
            onChange={handleChange}
          />
        );
      case 3:
        return (
          <AdminAccountForm
            formData={formData}
            onChange={handleChange}
          />
        );
      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review and Confirm</h3>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cooperative Type</h4>
              <p className="text-sm text-gray-900">
                {formData.cooperativeType === 'CREDIT' ? 'Credit Cooperative' : 'Multi-Purpose Cooperative'}
              </p>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Cooperative Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{formData.cooperativeName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{formData.cooperativeEmail}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900">{formData.cooperativePhone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">{formData.cooperativeAddress}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Admin Account</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-sm text-gray-900">{formData.adminName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm text-gray-900">{formData.adminEmail}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Please review the information above. Once you confirm, the system will be initialized with these settings.
            </p>
          </div>
        );
      case 5:
        return <SetupComplete cooperativeType={formData.cooperativeType} />;
      default:
        return null;
    }
  };
  
  if (isLoading && currentStep === 1) {
    return (
      <SetupLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </SetupLayout>
    );
  }
  
  return (
    <SetupLayout>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Progress Steps */}
      {currentStep < 5 && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step < currentStep ? 'bg-green-500' : 
                  step === currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`}>
                  {step < currentStep ? (
                    <FiCheck className="w-5 h-5 text-white" />
                  ) : (
                    <span className={`text-sm font-medium ${
                      step === currentStep ? 'text-white' : 'text-gray-500'
                    }`}>
                      {step}
                    </span>
                  )}
                </div>
                
                {step < 4 && (
                  <div className={`w-12 h-1 ${
                    step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-2">
            <span className="text-xs font-medium text-gray-500">Type</span>
            <span className="text-xs font-medium text-gray-500">Details</span>
            <span className="text-xs font-medium text-gray-500">Admin</span>
            <span className="text-xs font-medium text-gray-500">Review</span>
          </div>
        </div>
      )}
      
      {/* Step Content */}
      {renderStepContent()}
      
      {/* Navigation Buttons */}
      {currentStep < 5 && (
        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!validateCurrentStep() || isLoading}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              validateCurrentStep() && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-300 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <FiArrowRight className="mr-2 h-4 w-4" />
            )}
            {currentStep === 4 ? 'Complete Setup' : 'Continue'}
          </button>
        </div>
      )}
      
      {currentStep === 5 && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go to Login
          </button>
        </div>
      )}
    </SetupLayout>
  );
};

export default SetupPage;
