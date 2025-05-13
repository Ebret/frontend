'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create context
const CooperativeContext = createContext();

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Cooperative Context Provider
 * 
 * Provides cooperative type and related information to the application
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 */
export const CooperativeProvider = ({ children }) => {
  const [cooperativeType, setCooperativeType] = useState(null);
  const [cooperativeName, setCooperativeName] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cooperative type on mount
  useEffect(() => {
    const fetchCooperativeType = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_URL}/setup/cooperative-type`);
        
        setCooperativeType(response.data.data.type);
        setCooperativeName(response.data.data.name);
        setError(null);
      } catch (error) {
        console.error('Error fetching cooperative type:', error);
        setError('Failed to fetch cooperative type');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCooperativeType();
  }, []);

  // Check if a feature is available for the current cooperative type
  const isFeatureAvailable = (feature) => {
    // Features available for all cooperative types
    const commonFeatures = [
      'user_management',
      'loan_management',
      'savings_deposits',
      'share_capital',
      'damayan_fund',
      'reports',
      'settings',
    ];

    // Features only available for multi-purpose cooperatives
    const multiPurposeFeatures = [
      'inventory_management',
      'point_of_sale',
      'consumer_goods',
      'marketing_services',
      'production_management',
    ];

    if (commonFeatures.includes(feature)) {
      return true;
    }

    if (multiPurposeFeatures.includes(feature) && cooperativeType === 'MULTI_PURPOSE') {
      return true;
    }

    return false;
  };

  // Update cooperative type (admin only)
  const updateCooperativeType = async (cooperativeId, newType) => {
    try {
      setIsLoading(true);
      
      const response = await axios.put(
        `${API_URL}/setup/cooperative-type/${cooperativeId}`,
        { cooperativeType: newType },
        {
          headers: {
            'Content-Type': 'application/json',
            // Include auth token here
          },
        }
      );
      
      setCooperativeType(newType);
      setError(null);
      
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error updating cooperative type:', error);
      setError('Failed to update cooperative type');
      
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to update cooperative type' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Context value
  const value = {
    cooperativeType,
    cooperativeName,
    isLoading,
    error,
    isFeatureAvailable,
    updateCooperativeType,
    isCredit: cooperativeType === 'CREDIT',
    isMultiPurpose: cooperativeType === 'MULTI_PURPOSE',
  };

  return (
    <CooperativeContext.Provider value={value}>
      {children}
    </CooperativeContext.Provider>
  );
};

// Custom hook to use the cooperative context
export const useCooperative = () => {
  const context = useContext(CooperativeContext);
  
  if (context === undefined) {
    throw new Error('useCooperative must be used within a CooperativeProvider');
  }
  
  return context;
};

export default CooperativeContext;
