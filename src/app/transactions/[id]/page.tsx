'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import Layout from '@/components/Layout';
import { Spinner } from '@/components/ui';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Transaction } from '@/components/transactions/TransactionHistory';

const TransactionDetailsPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { config } = useWhiteLabel();
  
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch transaction details
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        // Mock transaction data
        const mockTransactions: Record<string, Transaction> = {
          '1': {
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
          '2': {
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
          '3': {
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
          '4': {
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
          '5': {
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
        };
        
        const transactionId = params.id as string;
        const foundTransaction = mockTransactions[transactionId];
        
        if (foundTransaction) {
          setTransaction(foundTransaction);
        } else {
          setError('Transaction not found');
        }
        
      } catch (err) {
        console.error('Error fetching transaction details:', err);
        setError('Failed to load transaction details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactionDetails();
  }, [isAuthenticated, params.id]);
  
  // Get transaction type display name
  const getTransactionTypeDisplay = (type: Transaction['type']) => {
    switch (type) {
      case 'DEPOSIT': return 'Deposit';
      case 'WITHDRAWAL': return 'Withdrawal';
      case 'TRANSFER': return 'Transfer';
      case 'LOAN_PAYMENT': return 'Loan Payment';
      case 'LOAN_DISBURSEMENT': return 'Loan Disbursement';
      case 'FEE': return 'Fee';
      case 'INTEREST': return 'Interest';
      case 'OTHER': return 'Other';
      default: return type;
    }
  };
  
  // Get transaction status display name and color
  const getTransactionStatusDisplay = (status: Transaction['status']) => {
    switch (status) {
      case 'COMPLETED':
        return { text: 'Completed', color: 'bg-green-100 text-green-800' };
      case 'PENDING':
        return { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' };
      case 'FAILED':
        return { text: 'Failed', color: 'bg-red-100 text-red-800' };
      case 'CANCELLED':
        return { text: 'Cancelled', color: 'bg-gray-100 text-gray-800' };
      default:
        return { text: status, color: 'bg-gray-100 text-gray-800' };
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
  
  if (isLoading || loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" color="primary" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Required</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You need to be logged in to view transaction details.
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ backgroundColor: config?.primaryColor }}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !transaction) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div>
                    <Link href="/" className="text-gray-400 hover:text-gray-500">
                      <svg
                        className="flex-shrink-0 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span className="sr-only">Home</span>
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <Link
                      href="/transactions"
                      className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                    >
                      Transactions
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                    <span
                      className="ml-4 text-sm font-medium text-gray-500"
                      aria-current="page"
                    >
                      Details
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Transaction Not Found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {error || 'The transaction you are looking for does not exist or has been removed.'}
                </p>
                <div className="mt-6">
                  <Link
                    href="/transactions"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    style={{ backgroundColor: config?.primaryColor }}
                  >
                    Back to Transactions
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const statusDisplay = getTransactionStatusDisplay(transaction.status);
  const amountDisplay = getTransactionAmountDisplay(transaction);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div>
                  <Link href="/" className="text-gray-400 hover:text-gray-500">
                    <svg
                      className="flex-shrink-0 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                    <span className="sr-only">Home</span>
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <Link
                    href="/transactions"
                    className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Transactions
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                  <span
                    className="ml-4 text-sm font-medium text-gray-500"
                    aria-current="page"
                  >
                    Transaction Details
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Transaction Details
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {getTransactionTypeDisplay(transaction.type)} • {transaction.reference}
              </p>
            </div>
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay.color}`}>
              {statusDisplay.text}
            </span>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Amount</p>
                    <p className={`text-3xl font-bold ${amountDisplay.color}`}>
                      {amountDisplay.text}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-lg font-medium text-gray-900">
                      {formatDate(transaction.createdAt, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Transaction Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{getTransactionTypeDisplay(transaction.type)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Reference Number</dt>
                <dd className="mt-1 text-sm text-gray-900">{transaction.reference}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Account</dt>
                <dd className="mt-1 text-sm text-gray-900">{transaction.accountName}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{statusDisplay.text}</dd>
              </div>
              
              {transaction.counterpartyName && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    {transaction.type === 'TRANSFER' ? 'Transferred To' : 'Received From'}
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{transaction.counterpartyName}</dd>
                </div>
              )}
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{transaction.description}</dd>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              style={{ backgroundColor: config?.primaryColor }}
              onClick={() => {
                // In a real app, this would download a receipt
                alert('Receipt downloaded');
              }}
            >
              Download Receipt
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionDetailsPage;
