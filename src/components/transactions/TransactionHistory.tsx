'use client';

import React, { useState, useEffect } from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Spinner } from '@/components/ui';

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'LOAN_PAYMENT' | 'LOAN_DISBURSEMENT' | 'FEE' | 'INTEREST' | 'OTHER';
  amount: number;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  reference: string;
  createdAt: string;
  accountId?: string;
  accountName?: string;
  counterpartyId?: string;
  counterpartyName?: string;
}

interface TransactionHistoryProps {
  accountId?: string;
  limit?: number;
  showFilters?: boolean;
  showExport?: boolean;
  showPagination?: boolean;
  isCompact?: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  accountId,
  limit = 10,
  showFilters = true,
  showExport = true,
  showPagination = true,
  isCompact = false,
}) => {
  const { config } = useWhiteLabel();
  const { user } = useAuth();

  // State for transactions and loading
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);

  // State for filters
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    search: '',
  });

  // State for sorting
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // State for export
  const [exporting, setExporting] = useState(false);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, this would be an API call with filters, pagination, etc.
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

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
          {
            id: '6',
            type: 'FEE',
            amount: 200,
            description: 'Loan processing fee',
            status: 'COMPLETED',
            reference: 'FEE-001',
            createdAt: '2023-06-15T11:05:00Z',
            accountId: '102',
            accountName: 'Personal Loan',
          },
          {
            id: '7',
            type: 'INTEREST',
            amount: 125,
            description: 'Savings interest credit',
            status: 'COMPLETED',
            reference: 'INT-001',
            createdAt: '2023-06-30T23:59:00Z',
            accountId: '101',
            accountName: 'Regular Savings',
          },
          {
            id: '8',
            type: 'DEPOSIT',
            amount: 10000,
            description: 'Time deposit opening',
            status: 'COMPLETED',
            reference: 'DEP-002',
            createdAt: '2023-06-01T13:30:00Z',
            accountId: '103',
            accountName: 'Time Deposit',
          },
          {
            id: '9',
            type: 'TRANSFER',
            amount: 2500,
            description: 'Transfer to another member',
            status: 'PENDING',
            reference: 'TRF-002',
            createdAt: '2023-07-20T10:15:00Z',
            accountId: '101',
            accountName: 'Regular Savings',
            counterpartyId: '201',
            counterpartyName: 'Juan Dela Cruz',
          },
          {
            id: '10',
            type: 'WITHDRAWAL',
            amount: 1000,
            description: 'Over-the-counter withdrawal',
            status: 'COMPLETED',
            reference: 'WDR-002',
            createdAt: '2023-07-18T15:45:00Z',
            accountId: '101',
            accountName: 'Regular Savings',
          },
        ];

        // Apply filters
        let filteredTransactions = [...mockTransactions];

        if (accountId) {
          filteredTransactions = filteredTransactions.filter(t => t.accountId === accountId);
        }

        if (filters.type) {
          filteredTransactions = filteredTransactions.filter(t => t.type === filters.type);
        }

        if (filters.status) {
          filteredTransactions = filteredTransactions.filter(t => t.status === filters.status);
        }

        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          filteredTransactions = filteredTransactions.filter(t => new Date(t.createdAt) >= startDate);
        }

        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999); // End of day
          filteredTransactions = filteredTransactions.filter(t => new Date(t.createdAt) <= endDate);
        }

        if (filters.minAmount) {
          const minAmount = parseFloat(filters.minAmount);
          filteredTransactions = filteredTransactions.filter(t => t.amount >= minAmount);
        }

        if (filters.maxAmount) {
          const maxAmount = parseFloat(filters.maxAmount);
          filteredTransactions = filteredTransactions.filter(t => t.amount <= maxAmount);
        }

        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredTransactions = filteredTransactions.filter(t =>
            t.description.toLowerCase().includes(searchLower) ||
            t.reference.toLowerCase().includes(searchLower) ||
            (t.accountName && t.accountName.toLowerCase().includes(searchLower)) ||
            (t.counterpartyName && t.counterpartyName.toLowerCase().includes(searchLower))
          );
        }

        // Apply sorting
        filteredTransactions.sort((a, b) => {
          if (sortField === 'amount') {
            return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
          } else if (sortField === 'createdAt') {
            return sortDirection === 'asc'
              ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
          return 0;
        });

        // Calculate pagination
        const totalItems = filteredTransactions.length;
        const totalPagesCount = Math.ceil(totalItems / limit);

        // Get current page items
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

        // Update state
        setTransactions(paginatedTransactions);
        setTotalPages(totalPagesCount);
        setTotalTransactions(totalItems);

      } catch (err) {
        console.error('Error fetching transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [accountId, filters, page, limit, sortField, sortDirection]);

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle sort changes
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle export
  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setExporting(true);

      // In a real app, this would call an API endpoint to generate the export
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate export delay

      // Mock export - in a real app, this would download a file
      console.log(`Exporting transactions in ${format} format`);

      // Show success message or trigger download
      alert(`Transactions exported successfully in ${format.toUpperCase()} format`);

    } catch (err) {
      console.error(`Error exporting transactions as ${format}:`, err);
      setError(`Failed to export transactions as ${format}. Please try again later.`);
    } finally {
      setExporting(false);
    }
  };

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

  // Render loading state
  if (loading && transactions.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Render error state
  if (error && transactions.length === 0) {
    return (
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
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      {/* Header */}
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Transaction History</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          View and filter your transaction history
        </p>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Transaction Type
              </label>
              <select
                id="type"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Types</option>
                <option value="DEPOSIT">Deposit</option>
                <option value="WITHDRAWAL">Withdrawal</option>
                <option value="TRANSFER">Transfer</option>
                <option value="LOAN_PAYMENT">Loan Payment</option>
                <option value="LOAN_DISBURSEMENT">Loan Disbursement</option>
                <option value="FEE">Fee</option>
                <option value="INTEREST">Interest</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">All Statuses</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by description, reference..."
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700">
                Min Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₱</span>
                </div>
                <input
                  type="number"
                  id="minAmount"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="0.00"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700">
                Max Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₱</span>
                </div>
                <input
                  type="number"
                  id="maxAmount"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="0.00"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Export buttons */}
          {showExport && (
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => handleExport('csv')}
                disabled={exporting || transactions.length === 0}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {exporting ? 'Exporting...' : 'Export CSV'}
              </button>
              <button
                type="button"
                onClick={() => handleExport('pdf')}
                disabled={exporting || transactions.length === 0}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {exporting ? 'Exporting...' : 'Export PDF'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Transaction list */}
      <div className="px-4 py-5 sm:p-6">
        {transactions.length === 0 ? (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.values(filters).some(v => v !== '')
                ? 'Try adjusting your filters to see more results.'
                : 'No transaction history is available for this account.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      <span>Date</span>
                      {sortField === 'createdAt' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reference
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center">
                      <span>Amount</span>
                      {sortField === 'amount' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => {
                  const statusDisplay = getTransactionStatusDisplay(transaction.status);
                  const amountDisplay = getTransactionAmountDisplay(transaction);

                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getTransactionTypeDisplay(transaction.type)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {transaction.description}
                        </div>
                        {transaction.accountName && (
                          <div className="text-xs text-gray-500 mt-1">
                            Account: {transaction.accountName}
                          </div>
                        )}
                        {transaction.counterpartyName && (
                          <div className="text-xs text-gray-500">
                            {transaction.type === 'TRANSFER' ? 'To: ' : 'From: '}
                            {transaction.counterpartyName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusDisplay.color}`}>
                          {statusDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={amountDisplay.color}>
                          {amountDisplay.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          style={{ color: config?.primaryColor }}
                          onClick={() => {
                            // In a real app, this would navigate to transaction details
                            console.log('View transaction details:', transaction.id);
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 flex items-center justify-between border-t border-gray-200">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * limit, totalTransactions)}
                </span>{' '}
                of <span className="font-medium">{totalTransactions}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (page <= 3) {
                    pageNumber = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setPage(pageNumber)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pageNumber
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                      style={page === pageNumber ? { backgroundColor: `${config?.primaryColor}20`, borderColor: config?.primaryColor, color: config?.primaryColor } : {}}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
