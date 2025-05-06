'use client';

import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title
);

interface TransactionData {
  totalTransactions: number;
  totalTransactionAmount: number;
  averageTransactionAmount: number;
  transactionsByType: {
    deposit: number;
    withdrawal: number;
    loanPayment: number;
    loanDisbursement: number;
    transfer: number;
    other: number;
  };
  transactionsByStatus: {
    completed: number;
    pending: number;
    failed: number;
    cancelled: number;
  };
  monthlyTransactions: {
    month: string;
    count: number;
    amount: number;
  }[];
  dailyTransactions: {
    day: string;
    count: number;
  }[];
}

const TransactionStatistics: React.FC = () => {
  const { config } = useWhiteLabel();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionData>({
    totalTransactions: 0,
    totalTransactionAmount: 0,
    averageTransactionAmount: 0,
    transactionsByType: {
      deposit: 0,
      withdrawal: 0,
      loanPayment: 0,
      loanDisbursement: 0,
      transfer: 0,
      other: 0,
    },
    transactionsByStatus: {
      completed: 0,
      pending: 0,
      failed: 0,
      cancelled: 0,
    },
    monthlyTransactions: [],
    dailyTransactions: [],
  });

  useEffect(() => {
    // Simulate API call to fetch transaction statistics
    const fetchTransactionStatistics = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockData: TransactionData = {
          totalTransactions: 1250,
          totalTransactionAmount: 15000000,
          averageTransactionAmount: 12000,
          transactionsByType: {
            deposit: 450,
            withdrawal: 350,
            loanPayment: 200,
            loanDisbursement: 100,
            transfer: 100,
            other: 50,
          },
          transactionsByStatus: {
            completed: 1150,
            pending: 50,
            failed: 30,
            cancelled: 20,
          },
          monthlyTransactions: [
            { month: 'Jan', count: 150, amount: 1800000 },
            { month: 'Feb', count: 175, amount: 2100000 },
            { month: 'Mar', count: 200, amount: 2400000 },
            { month: 'Apr', count: 225, amount: 2700000 },
            { month: 'May', count: 250, amount: 3000000 },
            { month: 'Jun', count: 250, amount: 3000000 },
          ],
          dailyTransactions: [
            { day: 'Mon', count: 45 },
            { day: 'Tue', count: 50 },
            { day: 'Wed', count: 55 },
            { day: 'Thu', count: 60 },
            { day: 'Fri', count: 65 },
            { day: 'Sat', count: 40 },
            { day: 'Sun', count: 25 },
          ],
        };

        setTransactionData(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching transaction statistics:', err);
        setError('Failed to load transaction statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionStatistics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Transaction Statistics</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Overview of transaction volume and patterns
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Transactions</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatNumber(transactionData.totalTransactions)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Transaction Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(transactionData.totalTransactionAmount)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Average Transaction Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(transactionData.averageTransactionAmount)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-base font-medium text-gray-700 mb-4">Transactions by Type</h4>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Deposit', 'Withdrawal', 'Loan Payment', 'Loan Disbursement', 'Transfer', 'Other'],
                  datasets: [
                    {
                      data: [
                        transactionData.transactionsByType.deposit,
                        transactionData.transactionsByType.withdrawal,
                        transactionData.transactionsByType.loanPayment,
                        transactionData.transactionsByType.loanDisbursement,
                        transactionData.transactionsByType.transfer,
                        transactionData.transactionsByType.other,
                      ],
                      backgroundColor: [
                        '#3b82f6', // blue
                        '#ef4444', // red
                        '#10b981', // green
                        '#f59e0b', // amber
                        '#8b5cf6', // purple
                        '#6b7280', // gray
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || '';
                          const value = context.raw as number;
                          const total = (context.dataset.data as number[]).reduce(
                            (acc, curr) => acc + curr,
                            0
                          );
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-700 mb-4">Transactions by Status</h4>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Completed', 'Pending', 'Failed', 'Cancelled'],
                  datasets: [
                    {
                      data: [
                        transactionData.transactionsByStatus.completed,
                        transactionData.transactionsByStatus.pending,
                        transactionData.transactionsByStatus.failed,
                        transactionData.transactionsByStatus.cancelled,
                      ],
                      backgroundColor: [
                        '#10b981', // green
                        '#f59e0b', // amber
                        '#ef4444', // red
                        '#6b7280', // gray
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          const label = context.label || '';
                          const value = context.raw as number;
                          const total = (context.dataset.data as number[]).reduce(
                            (acc, curr) => acc + curr,
                            0
                          );
                          const percentage = Math.round((value / total) * 100);
                          return `${label}: ${value} (${percentage}%)`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="text-base font-medium text-gray-700 mb-4">Monthly Transaction Volume</h4>
            <div className="h-64">
              <Bar
                data={{
                  labels: transactionData.monthlyTransactions.map((item) => item.month),
                  datasets: [
                    {
                      label: 'Transaction Count',
                      data: transactionData.monthlyTransactions.map((item) => item.count),
                      backgroundColor: config?.primaryColor || '#3b82f6',
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Transactions',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-700 mb-4">Daily Transaction Pattern</h4>
            <div className="h-64">
              <Line
                data={{
                  labels: transactionData.dailyTransactions.map((item) => item.day),
                  datasets: [
                    {
                      label: 'Transaction Count',
                      data: transactionData.dailyTransactions.map((item) => item.count),
                      borderColor: config?.primaryColor || '#3b82f6',
                      backgroundColor: `${config?.primaryColor}20` || 'rgba(59, 130, 246, 0.2)',
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Number of Transactions',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistics;
