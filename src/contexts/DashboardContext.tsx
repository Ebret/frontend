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
  // Enhanced data for improved dashboards
  nextPaymentDue?: string;
  nextPaymentAmount?: number;
  daysUntilNextPayment?: number;
  creditScore?: number;
  savingsGrowth?: number;
  loanBalance?: number;
  availableCredit?: number;
  interestPaid?: number;
  principalPaid?: number;
  totalLoans?: number;
  loanUtilization?: number;
  paymentHistory?: {
    onTime: number;
    late: number;
    missed: number;
  };
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

      // Use mock data directly instead of making an API call
      const mockResponse = {
        status: 'success',
        data: {
          totalLoanAmount: 125000,
          totalSavingsBalance: 250000,
          totalPayments: 75000,
          activeLoans: 3,
          pendingApplications: 2,
          savingsAccounts: 4,
          recentTransactions: [
            {
              id: 1,
              transactionType: 'DEPOSIT',
              amount: 1000,
              description: 'Savings deposit',
              referenceNumber: 'TXN123456',
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              transactionType: 'WITHDRAWAL',
              amount: 500,
              description: 'ATM withdrawal',
              referenceNumber: 'TXN123457',
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
            {
              id: 3,
              transactionType: 'LOAN_PAYMENT',
              amount: 750,
              description: 'Loan payment',
              referenceNumber: 'TXN123458',
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
          ],
          // Enhanced data for improved dashboards
          nextPaymentDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          nextPaymentAmount: 5000,
          daysUntilNextPayment: 7,
          creditScore: 720,
          savingsGrowth: 2.5,
          loanBalance: 75000,
          availableCredit: 50000,
          interestPaid: 12500,
          principalPaid: 25000,
          totalLoans: 3,
          loanUtilization: 0.6, // 60% of available credit used
          paymentHistory: {
            onTime: 24,
            late: 2,
            missed: 0,
          }
        }
      };

      setSummary(mockResponse.data);

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

      // Use mock data directly instead of making an API call
      const mockResponse = {
        status: 'success',
        data: {
          totalMembers: 250,
          activeMembers: 220,
          totalLoans: 180,
          activeLoans: 120,
          totalLoanAmount: 1250000,
          totalSavings: 2500000,
          totalAccounts: 350,
          pendingApplications: 15,
          recentActivity: [
            {
              id: 1,
              type: 'LOAN_APPLICATION',
              user: {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
              },
              amount: 5000,
              status: 'PENDING',
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              type: 'DEPOSIT',
              user: {
                id: 3,
                firstName: 'Robert',
                lastName: 'Johnson',
                email: 'robert.johnson@example.com',
              },
              amount: 1000,
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
            {
              id: 3,
              type: 'WITHDRAWAL',
              user: {
                id: 4,
                firstName: 'Emily',
                lastName: 'Davis',
                email: 'emily.davis@example.com',
              },
              amount: 500,
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
          ],
        }
      };

      setAdminSummary(mockResponse.data);

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
