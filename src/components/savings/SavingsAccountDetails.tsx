'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
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

interface SavingsAccount {
  id: number;
  accountNumber: string;
  balance: number;
  savingsType: string;
  status: string;
  createdAt: string;
  savingsProduct: {
    id: number;
    name: string;
    interestRate: number;
    minimumBalance: number;
    withdrawalLimit: number | null;
    withdrawalFee: number | null;
  };
  transactions: Transaction[];
}

interface SavingsAccountDetailsProps {
  accountId: number;
}

const SavingsAccountDetails: React.FC<SavingsAccountDetailsProps> = ({ accountId }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { config } = useWhiteLabel();

  const [account, setAccount] = useState<SavingsAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState('');

  // Fetch account details on component mount
  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (!accountId) return;

      try {
        setIsLoading(true);
        const response = await api.getSavingsAccountById(accountId);
        setAccount(response.data.savings);
        setTransactions(response.data.savings.transactions || []);
        setIsLoading(false);
      } catch (err: any) {
        setError('Failed to fetch account details. Please try again later.');
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAccountDetails();
    }
  }, [isAuthenticated, accountId]);

  // Handle deposit
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTransactionSuccess('');

    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      setError('Please enter a valid deposit amount');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await api.makeDeposit(accountId, {
        amount: parseFloat(depositAmount),
        description: 'Deposit via online banking',
      });

      setTransactionSuccess('Deposit successful!');
      setDepositAmount('');
      setIsDepositModalOpen(false);

      // Update account balance and transactions
      setAccount(prev => prev ? {
        ...prev,
        balance: response.data.newBalance,
      } : null);

      // Fetch updated transactions
      const txnResponse = await api.getTransactionsBySavingsId(accountId);
      setTransactions(txnResponse.data.transactions);
    } catch (err: any) {
      setError(err.message || 'Failed to process deposit. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle withdrawal
  const handleWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTransactionSuccess('');

    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      setError('Please enter a valid withdrawal amount');
      return;
    }

    if (!account) return;

    const amount = parseFloat(withdrawalAmount);

    // Check if withdrawal amount exceeds balance
    if (amount > account.balance) {
      setError('Insufficient balance for this withdrawal');
      return;
    }

    // Check if withdrawal would leave minimum balance
    if (account.balance - amount < account.savingsProduct.minimumBalance) {
      setError(`Withdrawal would leave less than the minimum balance of $${account.savingsProduct.minimumBalance}`);
      return;
    }

    // Check if withdrawal exceeds limit (if any)
    if (account.savingsProduct.withdrawalLimit && amount > account.savingsProduct.withdrawalLimit) {
      setError(`Withdrawal exceeds the limit of $${account.savingsProduct.withdrawalLimit}`);
      return;
    }

    setIsProcessing(true);

    try {
      const response = await api.makeWithdrawal(accountId, {
        amount,
        description: 'Withdrawal via online banking',
      });

      setTransactionSuccess('Withdrawal successful!');
      setWithdrawalAmount('');
      setIsWithdrawModalOpen(false);

      // Update account balance and transactions
      setAccount(prev => prev ? {
        ...prev,
        balance: response.data.newBalance,
      } : null);

      // Fetch updated transactions
      const txnResponse = await api.getTransactionsBySavingsId(accountId);
      setTransactions(txnResponse.data.transactions);
    } catch (err: any) {
      setError(err.message || 'Failed to process withdrawal. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Format transaction type for display
  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'WITHDRAWAL':
        return 'Withdrawal';
      case 'TRANSFER':
        return 'Transfer';
      case 'INTEREST_EARNED':
        return 'Interest';
      case 'FEE':
        return 'Fee';
      default:
        return type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ');
    }
  };

  // Get transaction type color
  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'INTEREST_EARNED':
        return 'text-green-600';
      case 'WITHDRAWAL':
      case 'FEE':
        return 'text-red-600';
      case 'TRANSFER':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !account) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
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

  if (!account) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">Account not found or you don't have permission to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
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
      )}

      {transactionSuccess && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{transactionSuccess}</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold" style={{ color: config.primaryColor }}>
            {account.savingsProduct.name}
          </h2>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            account.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            account.status === 'DORMANT' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {account.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          Account Number: {account.accountNumber}
        </p>
      </div>

      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <p className="text-sm text-gray-600">Current Balance</p>
            <p className="text-3xl font-bold" style={{ color: config.primaryColor }}>
              ₱{account.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => setIsDepositModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ backgroundColor: config.primaryColor }}
              disabled={account.status !== 'ACTIVE'}
            >
              Deposit
            </button>
            <button
              onClick={() => setIsWithdrawModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              disabled={account.status !== 'ACTIVE'}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Account Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Account Type:</span> {account.savingsType.charAt(0) + account.savingsType.slice(1).toLowerCase()}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Interest Rate:</span> {(account.savingsProduct.interestRate * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Minimum Balance:</span> ₱{account.savingsProduct.minimumBalance.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Withdrawal Limit:</span> {account.savingsProduct.withdrawalLimit ? `$${account.savingsProduct.withdrawalLimit.toLocaleString()}` : 'None'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Withdrawal Fee:</span> {account.savingsProduct.withdrawalFee ? `$${account.savingsProduct.withdrawalFee.toLocaleString()}` : 'None'}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Opened On:</span> {new Date(account.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>

        {transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getTransactionTypeColor(transaction.transactionType)}>
                        {formatTransactionType(transaction.transactionType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`${
                        transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'INTEREST_EARNED'
                          ? 'text-green-600'
                          : transaction.transactionType === 'WITHDRAWAL' || transaction.transactionType === 'FEE'
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}>
                        {transaction.transactionType === 'DEPOSIT' || transaction.transactionType === 'INTEREST_EARNED'
                          ? '+'
                          : transaction.transactionType === 'WITHDRAWAL' || transaction.transactionType === 'FEE'
                          ? '-'
                          : ''}
                        ₱{transaction.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        transaction.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push(`/transactions?accountId=${accountId}`)}
            className="text-sm font-medium"
            style={{ color: config.primaryColor }}
          >
            View All Transactions
          </button>
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Deposit Funds
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleDeposit}>
                        <div className="mb-4">
                          <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700">
                            Amount
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="depositAmount"
                              id="depositAmount"
                              value={depositAmount}
                              onChange={(e) => setDepositAmount(e.target.value)}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                              min="0.01"
                              step="0.01"
                              required
                              disabled={isProcessing}
                            />
                          </div>
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            style={{ backgroundColor: config.primaryColor }}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Deposit'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setIsDepositModalOpen(false)}
                            disabled={isProcessing}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Withdraw Funds
                    </h3>
                    <div className="mt-2">
                      <form onSubmit={handleWithdrawal}>
                        <div className="mb-4">
                          <label htmlFor="withdrawalAmount" className="block text-sm font-medium text-gray-700">
                            Amount
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="withdrawalAmount"
                              id="withdrawalAmount"
                              value={withdrawalAmount}
                              onChange={(e) => setWithdrawalAmount(e.target.value)}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                              min="0.01"
                              max={account.balance - account.savingsProduct.minimumBalance}
                              step="0.01"
                              required
                              disabled={isProcessing}
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Available balance: ${(account.balance - account.savingsProduct.minimumBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            {account.savingsProduct.withdrawalFee ? ` (Withdrawal fee: $${account.savingsProduct.withdrawalFee})` : ''}
                          </p>
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                            style={{ backgroundColor: config.primaryColor }}
                            disabled={isProcessing}
                          >
                            {isProcessing ? 'Processing...' : 'Withdraw'}
                          </button>
                          <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
                            onClick={() => setIsWithdrawModalOpen(false)}
                            disabled={isProcessing}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavingsAccountDetails;
