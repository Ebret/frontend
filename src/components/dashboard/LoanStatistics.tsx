'use client';

import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { formatCurrency } from '@/utils/formatters';
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
import { Doughnut, Bar } from 'react-chartjs-2';

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

interface LoanData {
  totalLoans: number;
  activeLoans: number;
  totalLoanAmount: number;
  totalOutstanding: number;
  loansByType: {
    personal: number;
    business: number;
    emergency: number;
    educational: number;
    other: number;
  };
  loansByStatus: {
    current: number;
    pastDue: number;
    defaulted: number;
    paid: number;
  };
  monthlyDisbursements: {
    month: string;
    amount: number;
  }[];
}

const LoanStatistics: React.FC = () => {
  const { config } = useWhiteLabel();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loanData, setLoanData] = useState<LoanData>({
    totalLoans: 0,
    activeLoans: 0,
    totalLoanAmount: 0,
    totalOutstanding: 0,
    loansByType: {
      personal: 0,
      business: 0,
      emergency: 0,
      educational: 0,
      other: 0,
    },
    loansByStatus: {
      current: 0,
      pastDue: 0,
      defaulted: 0,
      paid: 0,
    },
    monthlyDisbursements: [],
  });

  useEffect(() => {
    // Simulate API call to fetch loan statistics
    const fetchLoanStatistics = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockData: LoanData = {
          totalLoans: 250,
          activeLoans: 175,
          totalLoanAmount: 12500000,
          totalOutstanding: 8750000,
          loansByType: {
            personal: 120,
            business: 45,
            emergency: 35,
            educational: 30,
            other: 20,
          },
          loansByStatus: {
            current: 150,
            pastDue: 15,
            defaulted: 10,
            paid: 75,
          },
          monthlyDisbursements: [
            { month: 'Jan', amount: 1200000 },
            { month: 'Feb', amount: 950000 },
            { month: 'Mar', amount: 1100000 },
            { month: 'Apr', amount: 1300000 },
            { month: 'May', amount: 1500000 },
            { month: 'Jun', amount: 1250000 },
          ],
        };

        setLoanData(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching loan statistics:', err);
        setError('Failed to load loan statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanStatistics();
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Loan Statistics</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Overview of loan portfolio and performance
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Loans</p>
            <p className="text-2xl font-semibold text-gray-900">{loanData.totalLoans}</p>
            <p className="text-sm text-gray-500 mt-1">
              {loanData.activeLoans} active ({Math.round((loanData.activeLoans / loanData.totalLoans) * 100)}%)
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Loan Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(loanData.totalLoanAmount)}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Outstanding Balance</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(loanData.totalOutstanding)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((loanData.totalOutstanding / loanData.totalLoanAmount) * 100)}% of total
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Past Due Rate</p>
            <p className="text-2xl font-semibold text-gray-900">
              {Math.round(
                ((loanData.loansByStatus.pastDue + loanData.loansByStatus.defaulted) /
                  loanData.activeLoans) *
                  100
              )}%
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {loanData.loansByStatus.pastDue + loanData.loansByStatus.defaulted} loans
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-base font-medium text-gray-700 mb-4">Loans by Type</h4>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Personal', 'Business', 'Emergency', 'Educational', 'Other'],
                  datasets: [
                    {
                      data: [
                        loanData.loansByType.personal,
                        loanData.loansByType.business,
                        loanData.loansByType.emergency,
                        loanData.loansByType.educational,
                        loanData.loansByType.other,
                      ],
                      backgroundColor: [
                        '#3b82f6', // blue
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
            <h4 className="text-base font-medium text-gray-700 mb-4">Loans by Status</h4>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Current', 'Past Due', 'Defaulted', 'Paid'],
                  datasets: [
                    {
                      data: [
                        loanData.loansByStatus.current,
                        loanData.loansByStatus.pastDue,
                        loanData.loansByStatus.defaulted,
                        loanData.loansByStatus.paid,
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

        <div>
          <h4 className="text-base font-medium text-gray-700 mb-4">Monthly Loan Disbursements</h4>
          <div className="h-64">
            <Bar
              data={{
                labels: loanData.monthlyDisbursements.map((item) => item.month),
                datasets: [
                  {
                    label: 'Loan Amount',
                    data: loanData.monthlyDisbursements.map((item) => item.amount),
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
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                          label += ': ';
                        }
                        if (context.parsed.y !== null) {
                          label += formatCurrency(context.parsed.y);
                        }
                        return label;
                      },
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function (value) {
                        return formatCurrency(value as number, {
                          notation: 'compact',
                          compactDisplay: 'short',
                        });
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanStatistics;
