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
          // Fetch white-label config with a timeout
          const abortController = new AbortController();
          const timeoutId = setTimeout(() => abortController.abort(), 3000); // 3 second timeout

          const response = await api.getWhiteLabelConfig(storedCode || undefined);
          clearTimeout(timeoutId);

          // Only update if we got a valid response
          if (response?.data?.config) {
            setConfig(response.data.config);
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
          // Fetch white-label config with a timeout
          const abortController = new AbortController();
          const timeoutId = setTimeout(() => abortController.abort(), 3000); // 3 second timeout

          const response = await api.getWhiteLabelConfig(cooperativeCode);
          clearTimeout(timeoutId);

          // Only update if we got a valid response
          if (response?.data?.config) {
            setConfig(response.data.config);
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
