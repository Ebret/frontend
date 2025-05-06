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
import { Doughnut, Line, Bar } from 'react-chartjs-2';

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

interface SavingsData {
  totalAccounts: number;
  totalSavingsAmount: number;
  averageSavingsAmount: number;
  savingsByType: {
    regular: number;
    time: number;
    special: number;
  };
  savingsByRange: {
    range: string;
    count: number;
  }[];
  monthlySavingsGrowth: {
    month: string;
    amount: number;
  }[];
}

const SavingsStatistics: React.FC = () => {
  const { config } = useWhiteLabel();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingsData, setSavingsData] = useState<SavingsData>({
    totalAccounts: 0,
    totalSavingsAmount: 0,
    averageSavingsAmount: 0,
    savingsByType: {
      regular: 0,
      time: 0,
      special: 0,
    },
    savingsByRange: [],
    monthlySavingsGrowth: [],
  });

  useEffect(() => {
    // Simulate API call to fetch savings statistics
    const fetchSavingsStatistics = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockData: SavingsData = {
          totalAccounts: 350,
          totalSavingsAmount: 25000000,
          averageSavingsAmount: 71428.57,
          savingsByType: {
            regular: 250,
            time: 75,
            special: 25,
          },
          savingsByRange: [
            { range: '₱0-₱10k', count: 50 },
            { range: '₱10k-₱50k', count: 125 },
            { range: '₱50k-₱100k', count: 100 },
            { range: '₱100k-₱500k', count: 60 },
            { range: '₱500k+', count: 15 },
          ],
          monthlySavingsGrowth: [
            { month: 'Jan', amount: 22000000 },
            { month: 'Feb', amount: 22500000 },
            { month: 'Mar', amount: 23000000 },
            { month: 'Apr', amount: 23500000 },
            { month: 'May', amount: 24000000 },
            { month: 'Jun', amount: 24500000 },
            { month: 'Jul', amount: 25000000 },
          ],
        };

        setSavingsData(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching savings statistics:', err);
        setError('Failed to load savings statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsStatistics();
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Savings Statistics</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Overview of savings accounts and growth
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Accounts</p>
            <p className="text-2xl font-semibold text-gray-900">{savingsData.totalAccounts}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Savings Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(savingsData.totalSavingsAmount)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Average Savings Amount</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(savingsData.averageSavingsAmount)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-base font-medium text-gray-700 mb-4">Savings Type Distribution</h4>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Regular Savings', 'Time Deposit', 'Special Savings'],
                  datasets: [
                    {
                      data: [
                        savingsData.savingsByType.regular,
                        savingsData.savingsByType.time,
                        savingsData.savingsByType.special,
                      ],
                      backgroundColor: [
                        '#3b82f6', // blue
                        '#10b981', // green
                        '#8b5cf6', // purple
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
            <h4 className="text-base font-medium text-gray-700 mb-4">Savings Amount Distribution</h4>
            <div className="h-64">
              <Bar
                data={{
                  labels: savingsData.savingsByRange.map((item) => item.range),
                  datasets: [
                    {
                      label: 'Number of Accounts',
                      data: savingsData.savingsByRange.map((item) => item.count),
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
                        text: 'Number of Accounts',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Balance Range',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-medium text-gray-700 mb-4">Monthly Savings Growth</h4>
          <div className="h-64">
            <Line
              data={{
                labels: savingsData.monthlySavingsGrowth.map((item) => item.month),
                datasets: [
                  {
                    label: 'Total Savings',
                    data: savingsData.monthlySavingsGrowth.map((item) => item.amount),
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
                    beginAtZero: false,
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

export default SavingsStatistics;
