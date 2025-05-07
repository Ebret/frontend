'use client';

import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Spinner } from '@/components/ui';
import Link from 'next/link';
import { Transaction } from './TransactionHistory';

interface TransactionHistoryWidgetProps {
  accountId?: string;
  title?: string;
  limit?: number;
  showViewAll?: boolean;
}

const TransactionHistoryWidget: React.FC<TransactionHistoryWidgetProps> = ({
  accountId,
  title = 'Recent Transactions',
  limit = 5,
  showViewAll = true,
}) => {
  const { config } = useWhiteLabel();
  
  // State for transactions and loading
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
        
        // Mock transactions data
        const mockTransactions: Transaction[] = [
          {
            id: '1',
            type: 'DEPOSIT',
            amount: 5000,
            description: 'Monthly savings deposit',
            status: 'COMPLETED',
            reference: 'DEP-001',
            createdAt: '2023-07-01T10:30:00Z',
            accountId: '101',
            accountName: 'Regular Savings',
          },
          {
            id: '2',
            type: 'WITHDRAWAL',
            amount: 2000,
            description: 'ATM withdrawal',
            status: 'COMPLETED',
            reference: 'WDR-001',
            createdAt: '2023-07-05T14:15:00Z',
            accountId: '101',
            accountName: 'Regular Savings',
          },
          {
            id: '3',
            type: 'LOAN_PAYMENT',
            amount: 3500,
            description: 'Monthly loan payment',
            status: 'COMPLETED',
            reference: 'LPY-001',
            createdAt: '2023-07-10T09:45:00Z',
            accountId: '102',
            accountName: 'Personal Loan',
          },
          {
            id: '4',
            type: 'TRANSFER',
            amount: 1500,
            description: 'Transfer to savings',
            status: 'COMPLETED',
            reference: 'TRF-001',
            createdAt: '2023-07-15T16:20:00Z',
            accountId: '101',
            accountName: 'Regular Savings',
            counterpartyId: '103',
            counterpartyName: 'Time Deposit',
          },
          {
            id: '5',
            type: 'LOAN_DISBURSEMENT',
            amount: 50000,
            description: 'Personal loan disbursement',
            status: 'COMPLETED',
            reference: 'LDS-001',
            createdAt: '2023-06-15T11:00:00Z',
            accountId: '102',
            accountName: 'Personal Loan',
          },
        ];
        
        // Filter by accountId if provided
        let filteredTransactions = accountId
          ? mockTransactions.filter(t => t.accountId === accountId)
          : mockTransactions;
        
        // Sort by date (newest first)
        filteredTransactions.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        // Limit the number of transactions
        filteredTransactions = filteredTransactions.slice(0, limit);
        
        setTransactions(filteredTransactions);
        
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [accountId, limit]);
  
  // Get transaction type icon
  const getTransactionTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT':
        return (
          <div className="flex-shrink-0 rounded-full p-2 bg-green-100">
            <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case 'WITHDRAWAL':
        return (
          <div className="flex-shrink-0 rounded-full p-2 bg-red-100">
            <svg className="h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </div>
        );
      case 'TRANSFER':
        return (
          <div className="flex-shrink-0 rounded-full p-2 bg-blue-100">
            <svg className="h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      case 'LOAN_PAYMENT':
        return (
          <div className="flex-shrink-0 rounded-full p-2 bg-purple-100">
            <svg className="h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'LOAN_DISBURSEMENT':
        return (
          <div className="flex-shrink-0 rounded-full p-2 bg-yellow-100">
            <svg className="h-4 w-4 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      case 'FEE':
        return (
          <div className="flex-shrink-0 rounded-full p-2 bg-gray-100">
            <svg className="h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
          </div>
        );
      case 'INTEREST':
        return (
          <div className="flex-shrink-0 rounded-full p-2 bg-green-100">
            <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 rounded-full p-2 bg-gray-100">
            <svg className="h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        );
    }
  };
  
  // Get transaction amount display with color
  const getTransactionAmountDisplay = (transaction: Transaction) => {
    const isCredit = ['DEPOSIT', 'LOAN_DISBURSEMENT', 'INTEREST'].includes(transaction.type);
    const isDebit = ['WITHDRAWAL', 'LOAN_PAYMENT', 'FEE'].includes(transaction.type);
    
    if (isCredit) {
      return { text: `+${formatCurrency(transaction.amount)}`, color: 'text-green-600' };
    } else if (isDebit) {
      return { text: `-${formatCurrency(transaction.amount)}`, color: 'text-red-600' };
    } else {
      return { text: formatCurrency(transaction.amount), color: 'text-gray-900' };
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
        <div className="flex justify-center items-center py-12">
          <Spinner size="md" color="primary" />
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
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
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        {showViewAll && (
          <Link
            href="/transactions"
            className="text-sm font-medium hover:underline"
            style={{ color: config?.primaryColor || '#3b82f6' }}
          >
            View all
          </Link>
        )}
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-6">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
            <p className="mt-1 text-sm text-gray-500">
              No recent transactions found.
            </p>
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {transactions.map((transaction) => {
                const amountDisplay = getTransactionAmountDisplay(transaction);
                
                return (
                  <li key={transaction.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      {getTransactionTypeIcon(transaction.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {formatDate(transaction.createdAt)} • {transaction.reference}
                        </p>
                        {transaction.accountName && (
                          <p className="text-xs text-gray-500">
                            {transaction.accountName}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`text-sm font-medium ${amountDisplay.color}`}>
                          {amountDisplay.text}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryWidget;
