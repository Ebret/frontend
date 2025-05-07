'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { useAuth } from '@/contexts/AuthContext';
import { getAllDamayanFunds, fetchUserDamayanSummary } from '@/services/damayanService';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

interface DamayanFund {
  id: string;
  name: string;
  description: string;
  totalAmount: number;
  targetAmount: number;
  contributionsCount: number;
  status: 'ACTIVE' | 'COMPLETED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  beneficiary?: {
    id: string;
    name: string;
    reason: string;
  };
}

const DamayanWidget: React.FC = () => {
  const { config } = useWhiteLabel();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFunds, setActiveFunds] = useState<DamayanFund[]>([]);
  const [userSummary, setUserSummary] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);

        // In a real app, these would be API calls
        // For now, we'll use mock data but structure it like real API calls
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

        try {
          // Get active funds
          // const fundsData = await getAllDamayanFunds({ status: 'ACTIVE' });
          // setActiveFunds(fundsData);

          // Mock active funds data
          const mockFunds: DamayanFund[] = [
            {
              id: '1',
              name: 'Medical Assistance Fund',
              description: 'Fund for members requiring medical assistance',
              totalAmount: 150000,
              targetAmount: 200000,
              contributionsCount: 75,
              status: 'ACTIVE',
              createdAt: '2023-01-15T00:00:00Z',
              updatedAt: '2023-07-01T00:00:00Z',
              beneficiary: {
                id: '101',
                name: 'Juan Dela Cruz',
                reason: 'Hospitalization due to pneumonia'
              }
            },
            {
              id: '3',
              name: 'Education Support Fund',
              description: 'Fund to support children of members for educational expenses',
              totalAmount: 100000,
              targetAmount: 300000,
              contributionsCount: 50,
              status: 'ACTIVE',
              createdAt: '2023-03-20T00:00:00Z',
              updatedAt: '2023-07-05T00:00:00Z'
            }
          ];

          setActiveFunds(mockFunds);
        } catch (fundError) {
          console.error('Error fetching Damayan funds:', fundError);
          toast.error('Failed to load Damayan funds');
        }

        try {
          // Get user summary
          // const summaryData = await fetchUserDamayanSummary(user.id);
          // setUserSummary(summaryData);

          // Mock user summary data
          const mockSummary = {
            summary: {
              totalContributions: 5000,
              contributionsCount: 5,
              totalAssistanceReceived: 0,
              assistanceReceivedCount: 0,
              pendingRequestsCount: 1
            },
            recentActivity: {
              contributions: [
                {
                  id: '1001',
                  amount: 1000,
                  contributionDate: '2023-06-01T00:00:00Z',
                  damayanFundId: '1',
                  damayanFund: {
                    name: 'Medical Assistance Fund'
                  }
                }
              ],
              assistance: []
            }
          };

          setUserSummary(mockSummary);
        } catch (summaryError) {
          console.error('Error fetching user Damayan summary:', summaryError);
          // Don't show toast for this error as it's not critical
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching Damayan data:', err);
        setError('Failed to load Damayan data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate progress percentage
  const getProgressPercentage = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Damayan Program</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Mutual aid for cooperative members
          </p>
        </div>
        <Link
          href="/damayan"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white"
          style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
        >
          View All
        </Link>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
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
        ) : activeFunds.length === 0 ? (
          <div className="text-center py-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-900">No active Damayan funds</p>
            <p className="mt-1 text-sm text-gray-500">Check back later for new funds or create a request.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeFunds.map((fund) => (
              <div key={fund.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-base font-medium text-gray-900">{fund.name}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>

                <p className="mt-1 text-sm text-gray-500 line-clamp-2">{fund.description}</p>

                {fund.beneficiary && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Beneficiary:</span> {fund.beneficiary.name}
                    <p className="text-gray-500 text-xs mt-0.5">{fund.beneficiary.reason}</p>
                  </div>
                )}

                <div className="mt-3">
                  <div className="flex justify-between text-sm">
                    <span>{formatCurrency(fund.totalAmount)}</span>
                    <span>{formatCurrency(fund.targetAmount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${getProgressPercentage(fund.totalAmount, fund.targetAmount)}%`,
                        backgroundColor: config?.primaryColor || '#3b82f6'
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {fund.contributionsCount} contributions so far
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/damayan/funds/${fund.id}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: config?.primaryColor || '#3b82f6' }}
                  >
                    View details
                  </Link>
                  <span className="mx-2 text-gray-300">|</span>
                  <Link
                    href={`/damayan/funds/${fund.id}`}
                    className="text-sm font-medium hover:underline"
                    style={{ color: config?.primaryColor || '#3b82f6' }}
                  >
                    Contribute
                  </Link>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex flex-col">
                <Link
                  href="/damayan/request"
                  className="text-sm font-medium hover:underline"
                  style={{ color: config?.primaryColor || '#3b82f6' }}
                >
                  Request assistance
                </Link>
                {userSummary && userSummary.summary.pendingRequestsCount > 0 && (
                  <span className="text-xs text-gray-500 mt-1">
                    You have {userSummary.summary.pendingRequestsCount} pending request(s)
                  </span>
                )}
              </div>
              <div className="flex flex-col items-end">
                <Link
                  href="/damayan"
                  className="text-sm font-medium hover:underline"
                  style={{ color: config?.primaryColor || '#3b82f6' }}
                >
                  View all funds
                </Link>
                {userSummary && (
                  <span className="text-xs text-gray-500 mt-1">
                    You've contributed {formatCurrency(userSummary.summary.totalContributions)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DamayanWidget;
