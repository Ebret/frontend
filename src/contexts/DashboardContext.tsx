'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  description: string;
  referenceNumber: string;
  status: string;
  createdAt: string;
}

interface DashboardSummary {
  totalLoanAmount: number;
  totalSavingsBalance: number;
  totalPayments: number;
  activeLoans: number;
  pendingApplications: number;
  savingsAccounts: number;
  recentTransactions: Transaction[];
}

interface AdminDashboardSummary {
  totalMembers: number;
  activeMembers: number;
  totalLoans: number;
  activeLoans: number;
  totalLoanAmount: number;
  totalSavings: number;
  totalAccounts: number;
  pendingApplications: number;
  recentActivity: any[];
}

interface DashboardContextType {
  summary: DashboardSummary | null;
  adminSummary: AdminDashboardSummary | null;
  loading: boolean;
  error: string | null;
  fetchDashboardSummary: () => Promise<void>;
  fetchAdminDashboardSummary: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [adminSummary, setAdminSummary] = useState<AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for dashboard updates via Socket.IO
  useEffect(() => {
    if (isAuthenticated && user) {
      // Socket.IO connection is already established in NotificationContext
      // We just need to listen for dashboard-update events
      const socket = (window as any).socket;
      
      if (socket) {
        socket.on('dashboard-update', (data: DashboardSummary) => {
          setSummary(data);
        });
        
        if (user.role === 'ADMIN') {
          socket.on('admin-dashboard-update', (data: AdminDashboardSummary) => {
            setAdminSummary(data);
          });
        }
      }
      
      // Clean up on unmount
      return () => {
        if (socket) {
          socket.off('dashboard-update');
          socket.off('admin-dashboard-update');
        }
      };
    }
  }, [isAuthenticated, user]);

  // Fetch dashboard summary
  const fetchDashboardSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getDashboardSummary();
      setSummary(response.data);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard summary');
      setLoading(false);
    }
  };

  // Fetch admin dashboard summary
  const fetchAdminDashboardSummary = async () => {
    try {
      if (user?.role !== 'ADMIN') {
        throw new Error('Unauthorized');
      }
      
      setLoading(true);
      setError(null);
      
      const response = await api.getAdminDashboardSummary();
      setAdminSummary(response.data);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin dashboard summary');
      setLoading(false);
    }
  };

  // Fetch dashboard summary on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardSummary();
      
      if (user?.role === 'ADMIN') {
        fetchAdminDashboardSummary();
      }
    }
  }, [isAuthenticated, user?.role]);

  return (
    <DashboardContext.Provider
      value={{
        summary,
        adminSummary,
        loading,
        error,
        fetchDashboardSummary,
        fetchAdminDashboardSummary,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
};
