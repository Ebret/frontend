'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User, LoginCredentials, RegisterData } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Use mock data directly instead of making an API call
          const mockResponse = {
            status: 'success',
            data: {
              user: {
                id: 1,
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'ADMIN',
                status: 'ACTIVE',
                memberId: 'MEM123456',
                memberSince: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          };

          setUser(mockResponse.data.user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('token');
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      // Use mock data directly instead of making an API call
      const mockResponse = {
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: 1,
            email: credentials.email || 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'ADMIN',
            status: 'ACTIVE',
            memberId: 'MEM123456',
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: true,
          },
          token: 'mock-jwt-token',
        },
      };

      localStorage.setItem('token', mockResponse.data.token);
      setUser(mockResponse.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, this would redirect to Google OAuth
      // For development/testing, we'll simulate a successful login
      const response = await api.loginWithGoogle();

      // This code will only execute in development/testing
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, this would redirect to Facebook OAuth
      // For development/testing, we'll simulate a successful login
      const response = await api.loginWithFacebook();

      // This code will only execute in development/testing
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);

    try {
      const response = await api.register(data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        loginWithGoogle,
        loginWithFacebook,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
