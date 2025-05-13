'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiDatabase, FiPlus, FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import DepositMetrics from '@/components/management/deposits/DepositMetrics';
import DepositProductManagement from '@/components/management/deposits/DepositProductManagement';
import MaturityLadder from '@/components/management/deposits/MaturityLadder';
import LiquidityForecast from '@/components/management/deposits/LiquidityForecast';
import DepositFilters from '@/components/management/deposits/DepositFilters';
import DepositTable from '@/components/management/deposits/DepositTable';
import DepositGrowthStrategies from '@/components/management/deposits/DepositGrowthStrategies';

/**
 * Deposit Management Dashboard
 * 
 * Enhanced dashboard for managing deposits with:
 * - Deposit metrics
 * - Product management
 * - Maturity laddering
 * - Liquidity forecasting
 * - Growth strategies
 */
const DepositManagementPage = () => {
  // State for deposits data
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  
  // State for deposit products
  const [depositProducts, setDepositProducts] = useState([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    amountRange: '',
    maturityRange: '',
    savedFilter: ''
  });
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // State for showing filters panel
  const [showFilters, setShowFilters] = useState(false);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('all');
  
  // State for saved filters
  const [savedFilters, setSavedFilters] = useState([
    { id: 'maturing', name: 'Maturing Soon', filter: { maturityRange: 'next30' } },
    { id: 'large', name: 'Large Deposits', filter: { amountRange: 'large' } },
    { id: 'time_deposits', name: 'Time Deposits', filter: { type: 'time_deposit' } }
  ]);
  
  // Fetch deposits data
  useEffect(() => {
    const fetchDeposits = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/management/deposits');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockDeposits = [
          {
            id: 'D001',
            memberId: 'M001',
            memberName: 'Juan Dela Cruz',
            type: 'savings',
            productId: 'P001',
            productName: 'Regular Savings',
            amount: 125000,
            interestRate: 1.5,
            status: 'active',
            openDate: '2020-06-15',
            maturityDate: null,
            lastTransactionDate: '2023-06-20',
            lastTransactionAmount: 5000,
            transactionCount: 24
          },
          {
            id: 'D002',
            memberId: 'M002',
            memberName: 'Maria Santos',
            type: 'time_deposit',
            productId: 'P003',
            productName: '1-Year Time Deposit',
            amount: 250000,
            interestRate: 4.5,
            status: 'active',
            openDate: '2022-08-10',
            maturityDate: '2023-08-10',
            lastTransactionDate: '2022-08-10',
            lastTransactionAmount: 250000,
            transactionCount: 1
          },
          {
            id: 'D003',
            memberId: 'M002',
            memberName: 'Maria Santos',
            type: 'savings',
            productId: 'P002',
            productName: 'High-Yield Savings',
            amount: 100000,
            interestRate: 2.5,
            status: 'active',
            openDate: '2021-03-05',
            maturityDate: null,
            lastTransactionDate: '2023-06-15',
            lastTransactionAmount: 10000,
            transactionCount: 18
          },
          {
            id: 'D004',
            memberId: 'M003',
            memberName: 'Pedro Reyes',
            type: 'time_deposit',
            productId: 'P004',
            productName: '6-Month Time Deposit',
            amount: 50000,
            interestRate: 3.5,
            status: 'matured',
            openDate: '2022-11-15',
            maturityDate: '2023-05-15',
            lastTransactionDate: '2022-11-15',
            lastTransactionAmount: 50000,
            transactionCount: 1
          },
          {
            id: 'D005',
            memberId: 'M004',
            memberName: 'Ana Lim',
            type: 'time_deposit',
            productId: 'P005',
            productName: '2-Year Time Deposit',
            amount: 500000,
            interestRate: 5.0,
            status: 'active',
            openDate: '2023-01-20',
            maturityDate: '2025-01-20',
            lastTransactionDate: '2023-01-20',
            lastTransactionAmount: 500000,
            transactionCount: 1
          },
          {
            id: 'D006',
            memberId: 'M005',
            memberName: 'Jose Garcia',
            type: 'savings',
            productId: 'P001',
            productName: 'Regular Savings',
            amount: 8000,
            interestRate: 1.5,
            status: 'dormant',
            openDate: '2020-09-10',
            maturityDate: null,
            lastTransactionDate: '2022-03-15',
            lastTransactionAmount: -2000,
            transactionCount: 5
          }
        ];
        
        const mockProducts = [
          {
            id: 'P001',
            name: 'Regular Savings',
            type: 'savings',
            interestRate: 1.5,
            minimumBalance: 500,
            minimumInitialDeposit: 1000,
            maintenanceFee: 0,
            withdrawalLimit: null,
            earlyWithdrawalPenalty: null,
            status: 'active',
            description: 'Basic savings account with no maintenance fee'
          },
          {
            id: 'P002',
            name: 'High-Yield Savings',
            type: 'savings',
            interestRate: 2.5,
            minimumBalance: 10000,
            minimumInitialDeposit: 10000,
            maintenanceFee: 100,
            withdrawalLimit: null,
            earlyWithdrawalPenalty: null,
            status: 'active',
            description: 'Higher interest rate with minimum balance requirement'
          },
          {
            id: 'P003',
            name: '1-Year Time Deposit',
            type: 'time_deposit',
            interestRate: 4.5,
            minimumBalance: null,
            minimumInitialDeposit: 50000,
            maintenanceFee: 0,
            withdrawalLimit: null,
            earlyWithdrawalPenalty: 1.0,
            term: 12,
            status: 'active',
            description: '1-year time deposit with competitive rates'
          },
          {
            id: 'P004',
            name: '6-Month Time Deposit',
            type: 'time_deposit',
            interestRate: 3.5,
            minimumBalance: null,
            minimumInitialDeposit: 25000,
            maintenanceFee: 0,
            withdrawalLimit: null,
            earlyWithdrawalPenalty: 0.5,
            term: 6,
            status: 'active',
            description: 'Short-term time deposit with good rates'
          },
          {
            id: 'P005',
            name: '2-Year Time Deposit',
            type: 'time_deposit',
            interestRate: 5.0,
            minimumBalance: null,
            minimumInitialDeposit: 100000,
            maintenanceFee: 0,
            withdrawalLimit: null,
            earlyWithdrawalPenalty: 1.5,
            term: 24,
            status: 'active',
            description: 'Long-term time deposit with premium rates'
          }
        ];
        
        setDeposits(mockDeposits);
        setFilteredDeposits(mockDeposits);
        setDepositProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching deposits:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeposits();
  }, []);
  
  // Apply filters to deposits
  useEffect(() => {
    if (deposits.length === 0) return;
    
    let result = [...deposits];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'savings':
          result = result.filter(deposit => deposit.type === 'savings');
          break;
        case 'time_deposit':
          result = result.filter(deposit => deposit.type === 'time_deposit');
          break;
        case 'maturing':
          // Maturing in the next 30 days
          const thirtyDaysFromNow = new Date();
          thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
          result = result.filter(deposit => 
            deposit.maturityDate && 
            new Date(deposit.maturityDate) <= thirtyDaysFromNow &&
            new Date(deposit.maturityDate) >= new Date()
          );
          break;
        case 'dormant':
          result = result.filter(deposit => deposit.status === 'dormant');
          break;
      }
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(deposit => 
        deposit.memberName.toLowerCase().includes(searchLower) ||
        deposit.id.toLowerCase().includes(searchLower) ||
        deposit.memberId.toLowerCase().includes(searchLower) ||
        deposit.productName.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      result = result.filter(deposit => deposit.type === filters.type);
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(deposit => deposit.status === filters.status);
    }
    
    // Apply amount range filter
    if (filters.amountRange) {
      switch (filters.amountRange) {
        case 'small':
          result = result.filter(deposit => deposit.amount < 50000);
          break;
        case 'medium':
          result = result.filter(deposit => deposit.amount >= 50000 && deposit.amount < 200000);
          break;
        case 'large':
          result = result.filter(deposit => deposit.amount >= 200000);
          break;
      }
    }
    
    // Apply maturity range filter
    if (filters.maturityRange) {
      const today = new Date();
      let endDate;
      
      switch (filters.maturityRange) {
        case 'next30':
          endDate = new Date(today);
          endDate.setDate(today.getDate() + 30);
          result = result.filter(deposit => 
            deposit.maturityDate && 
            new Date(deposit.maturityDate) >= today &&
            new Date(deposit.maturityDate) <= endDate
          );
          break;
        case 'next90':
          endDate = new Date(today);
          endDate.setDate(today.getDate() + 90);
          result = result.filter(deposit => 
            deposit.maturityDate && 
            new Date(deposit.maturityDate) >= today &&
            new Date(deposit.maturityDate) <= endDate
          );
          break;
        case 'next365':
          endDate = new Date(today);
          endDate.setDate(today.getDate() + 365);
          result = result.filter(deposit => 
            deposit.maturityDate && 
            new Date(deposit.maturityDate) >= today &&
            new Date(deposit.maturityDate) <= endDate
          );
          break;
      }
    }
    
    setFilteredDeposits(result);
  }, [filters, deposits, activeTab]);
  
  // Handle filter change
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle saved filter selection
  const handleSavedFilterSelect = (filterId) => {
    if (!filterId) {
      // Reset filters
      setFilters({
        search: '',
        type: '',
        status: '',
        amountRange: '',
        maturityRange: '',
        savedFilter: ''
      });
      return;
    }
    
    const selectedFilter = savedFilters.find(f => f.id === filterId);
    if (selectedFilter) {
      setFilters({
        ...selectedFilter.filter,
        savedFilter: filterId
      });
    }
  };
  
  // Handle save current filter
  const handleSaveFilter = (name) => {
    const newFilter = {
      id: `custom_${Date.now()}`,
      name,
      filter: { ...filters }
    };
    
    setSavedFilters([...savedFilters, newFilter]);
  };
  
  // Calculate deposit metrics
  const calculateDepositMetrics = () => {
    const totalDeposits = deposits.length;
    const totalAmount = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    
    const savingsDeposits = deposits.filter(d => d.type === 'savings');
    const savingsAmount = savingsDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    
    const timeDeposits = deposits.filter(d => d.type === 'time_deposit');
    const timeDepositAmount = timeDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);
    
    const maturingSoon = deposits.filter(d => {
      if (!d.maturityDate) return false;
      const maturityDate = new Date(d.maturityDate);
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      return maturityDate >= today && maturityDate <= thirtyDaysFromNow;
    });
    const maturingSoonAmount = maturingSoon.reduce((sum, deposit) => sum + deposit.amount, 0);
    
    return {
      totalDeposits,
      totalAmount,
      savingsDeposits: savingsDeposits.length,
      savingsAmount,
      timeDeposits: timeDeposits.length,
      timeDepositAmount,
      maturingSoon: maturingSoon.length,
      maturingSoonAmount
    };
  };
  
  const metrics = calculateDepositMetrics();
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Deposit Management</h2>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.location.href = '/management/deposits/new'}
            >
              <FiPlus className="mr-2 h-5 w-5" />
              New Deposit
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {/* Export logic */}}
            >
              <FiDownload className="mr-2 h-5 w-5" />
              Export
            </button>
          </div>
        </div>
        
        {/* Deposit Metrics */}
        <DepositMetrics metrics={metrics} />
        
        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('all')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'all'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              All Deposits
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'savings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Savings
            </button>
            <button
              onClick={() => setActiveTab('time_deposit')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'time_deposit'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Time Deposits
            </button>
            <button
              onClick={() => setActiveTab('maturing')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'maturing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Maturing Soon
            </button>
            <button
              onClick={() => setActiveTab('dormant')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'dormant'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Dormant
            </button>
          </nav>
        </div>
        
        {/* Search and Filters */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0 mb-4 md:mb-0">
            <div className="relative rounded-md shadow-sm max-w-lg">
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search deposits by member name or ID..."
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiFilter className="mr-2 h-5 w-5 text-gray-400" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            <select
              value={filters.savedFilter}
              onChange={(e) => handleSavedFilterSelect(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Saved Filters</option>
              {savedFilters.map(filter => (
                <option key={filter.id} value={filter.id}>{filter.name}</option>
              ))}
            </select>
            
            <button
              type="button"
              onClick={() => handleSavedFilterSelect('')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiRefreshCw className="mr-2 h-5 w-5 text-gray-400" />
              Reset
            </button>
          </div>
        </div>
        
        {/* Filters Panel */}
        {showFilters && (
          <DepositFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onSaveFilter={handleSaveFilter}
          />
        )}
        
        {/* Deposit Product Management */}
        <div className="mt-6">
          <DepositProductManagement products={depositProducts} />
        </div>
        
        {/* Maturity Ladder and Liquidity Forecast */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MaturityLadder deposits={deposits} />
          <LiquidityForecast deposits={deposits} />
        </div>
        
        {/* Deposit Table */}
        <div className="mt-6">
          <DepositTable 
            deposits={filteredDeposits}
            loading={loading}
          />
        </div>
        
        {/* Deposit Growth Strategies */}
        <div className="mt-6">
          <DepositGrowthStrategies deposits={deposits} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default DepositManagementPage;
