'use client';

import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { formatNumber } from '@/utils/formatters';
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

interface MemberData {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersThisMonth: number;
  membersByGender: {
    male: number;
    female: number;
    other: number;
  };
  membersByAge: {
    under18: number;
    age18to30: number;
    age31to45: number;
    age46to60: number;
    over60: number;
  };
  membersByStatus: {
    active: number;
    inactive: number;
    suspended: number;
    pending: number;
  };
  memberGrowth: {
    month: string;
    count: number;
  }[];
  membersByLocation: {
    location: string;
    count: number;
  }[];
}

const MemberStatistics: React.FC = () => {
  const { config } = useWhiteLabel();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [memberData, setMemberData] = useState<MemberData>({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    newMembersThisMonth: 0,
    membersByGender: {
      male: 0,
      female: 0,
      other: 0,
    },
    membersByAge: {
      under18: 0,
      age18to30: 0,
      age31to45: 0,
      age46to60: 0,
      over60: 0,
    },
    membersByStatus: {
      active: 0,
      inactive: 0,
      suspended: 0,
      pending: 0,
    },
    memberGrowth: [],
    membersByLocation: [],
  });

  useEffect(() => {
    // Simulate API call to fetch member statistics
    const fetchMemberStatistics = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data
        const mockData: MemberData = {
          totalMembers: 1500,
          activeMembers: 1350,
          inactiveMembers: 150,
          newMembersThisMonth: 45,
          membersByGender: {
            male: 750,
            female: 725,
            other: 25,
          },
          membersByAge: {
            under18: 50,
            age18to30: 350,
            age31to45: 600,
            age46to60: 350,
            over60: 150,
          },
          membersByStatus: {
            active: 1350,
            inactive: 100,
            suspended: 25,
            pending: 25,
          },
          memberGrowth: [
            { month: 'Jan', count: 1200 },
            { month: 'Feb', count: 1250 },
            { month: 'Mar', count: 1300 },
            { month: 'Apr', count: 1350 },
            { month: 'May', count: 1400 },
            { month: 'Jun', count: 1450 },
            { month: 'Jul', count: 1500 },
          ],
          membersByLocation: [
            { location: 'Manila', count: 500 },
            { location: 'Quezon City', count: 350 },
            { location: 'Makati', count: 250 },
            { location: 'Pasig', count: 150 },
            { location: 'Taguig', count: 100 },
            { location: 'Others', count: 150 },
          ],
        };

        setMemberData(mockData);
        setError(null);
      } catch (err) {
        console.error('Error fetching member statistics:', err);
        setError('Failed to load member statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberStatistics();
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
        <h3 className="text-lg leading-6 font-medium text-gray-900">Member Statistics</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Overview of membership and demographics
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Total Members</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatNumber(memberData.totalMembers)}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Active Members</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatNumber(memberData.activeMembers)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((memberData.activeMembers / memberData.totalMembers) * 100)}% of total
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">Inactive Members</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatNumber(memberData.inactiveMembers)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {Math.round((memberData.inactiveMembers / memberData.totalMembers) * 100)}% of total
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-500">New Members This Month</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatNumber(memberData.newMembersThisMonth)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-base font-medium text-gray-700 mb-4">Members by Gender</h4>
            <div className="h-64">
              <Doughnut
                data={{
                  labels: ['Male', 'Female', 'Other'],
                  datasets: [
                    {
                      data: [
                        memberData.membersByGender.male,
                        memberData.membersByGender.female,
                        memberData.membersByGender.other,
                      ],
                      backgroundColor: [
                        '#3b82f6', // blue
                        '#ec4899', // pink
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
            <h4 className="text-base font-medium text-gray-700 mb-4">Members by Age Group</h4>
            <div className="h-64">
              <Bar
                data={{
                  labels: ['Under 18', '18-30', '31-45', '46-60', 'Over 60'],
                  datasets: [
                    {
                      label: 'Number of Members',
                      data: [
                        memberData.membersByAge.under18,
                        memberData.membersByAge.age18to30,
                        memberData.membersByAge.age31to45,
                        memberData.membersByAge.age46to60,
                        memberData.membersByAge.over60,
                      ],
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
                        text: 'Number of Members',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Age Group',
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
            <h4 className="text-base font-medium text-gray-700 mb-4">Member Growth</h4>
            <div className="h-64">
              <Line
                data={{
                  labels: memberData.memberGrowth.map((item) => item.month),
                  datasets: [
                    {
                      label: 'Total Members',
                      data: memberData.memberGrowth.map((item) => item.count),
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
                      beginAtZero: false,
                    },
                  },
                }}
              />
            </div>
          </div>

          <div>
            <h4 className="text-base font-medium text-gray-700 mb-4">Members by Location</h4>
            <div className="h-64">
              <Bar
                data={{
                  labels: memberData.membersByLocation.map((item) => item.location),
                  datasets: [
                    {
                      label: 'Number of Members',
                      data: memberData.membersByLocation.map((item) => item.count),
                      backgroundColor: [
                        '#3b82f6', // blue
                        '#10b981', // green
                        '#f59e0b', // amber
                        '#8b5cf6', // purple
                        '#ec4899', // pink
                        '#6b7280', // gray
                      ],
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
                        text: 'Number of Members',
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

export default MemberStatistics;
