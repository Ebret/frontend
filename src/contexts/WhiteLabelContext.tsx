'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, WhiteLabelConfig } from '@/lib/api';

interface WhiteLabelContextType {
  config: WhiteLabelConfig | null;
  isLoading: boolean;
  setCooperativeCode: (code: string) => void;
}

const defaultConfig: WhiteLabelConfig = {
  name: 'Credit Cooperative System',
  logo: '/logo.svg',
  primaryColor: '#007bff',
  secondaryColor: '#6c757d',
};

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

export const WhiteLabelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<WhiteLabelConfig | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cooperativeCode, setCooperativeCode] = useState<string | null>(null);

  useEffect(() => {
    const initWhiteLabel = async () => {
      try {
        // Try to get cooperative code from localStorage
        const storedCode = typeof window !== 'undefined' ? localStorage.getItem('cooperativeCode') : null;

        if (storedCode) {
          setCooperativeCode(storedCode);
        }

        // Set default config immediately to avoid UI flashing
        setConfig(defaultConfig);

        try {
          // Wrap in a try-catch to handle any fetch errors
          const mockResponse = {
            status: 'success',
            data: {
              config: {
                name: 'Credit Cooperative System',
                logo: '/logo.svg',
                primaryColor: '#007bff',
                secondaryColor: '#6c757d',
                address: '123 Main St, City, Country',
                phoneNumber: '+1 (555) 123-4567',
                email: 'info@creditcoop.com',
                website: 'https://creditcoop.com',
              }
            }
          };

          // Use the mock response directly instead of making an API call
          if (mockResponse?.data?.config) {
            setConfig(mockResponse.data.config);
          }
        } catch (fetchError) {
          console.error('Error fetching white-label config:', fetchError);
          // Default config is already set
        }
      } catch (error) {
        console.error('Error initializing white-label:', error);
        // Default config is already set
      } finally {
        setIsLoading(false);
      }
    };

    initWhiteLabel();
  }, []);

  useEffect(() => {
    const fetchConfig = async () => {
      if (cooperativeCode) {
        setIsLoading(true);

        try {
          // Use a mock response instead of making an API call
          const mockResponse = {
            status: 'success',
            data: {
              config: {
                name: 'Credit Cooperative System',
                logo: '/logo.svg',
                primaryColor: '#007bff',
                secondaryColor: '#6c757d',
                address: '123 Main St, City, Country',
                phoneNumber: '+1 (555) 123-4567',
                email: 'info@creditcoop.com',
                website: 'https://creditcoop.com',
              }
            }
          };

          // Only update if we got a valid response
          if (mockResponse?.data?.config) {
            setConfig(mockResponse.data.config);
            localStorage.setItem('cooperativeCode', cooperativeCode);
          } else {
            // Keep using default config if response is invalid
            setConfig(defaultConfig);
          }
        } catch (error) {
          console.error('Error fetching white-label config:', error);
          setConfig(defaultConfig);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchConfig();
  }, [cooperativeCode]);

  return (
    <WhiteLabelContext.Provider
      value={{
        config: config || defaultConfig,
        isLoading,
        setCooperativeCode,
      }}
    >
      {children}
    </WhiteLabelContext.Provider>
  );
};

export const useWhiteLabel = () => {
  const context = useContext(WhiteLabelContext);

  if (context === undefined) {
    throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
  }

  return context;
};
