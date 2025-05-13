'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiDollarSign, FiPlus, FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import LoanPortfolioMetrics from '@/components/management/loans/LoanPortfolioMetrics';
import LoanPortfolioAnalysis from '@/components/management/loans/LoanPortfolioAnalysis';
import LoanRiskScoring from '@/components/management/loans/LoanRiskScoring';
import LoanFilters from '@/components/management/loans/LoanFilters';
import LoanTable from '@/components/management/loans/LoanTable';
import CollectionDashboard from '@/components/management/loans/CollectionDashboard';

/**
 * Loan Management Dashboard
 * 
 * Enhanced dashboard for managing loans with:
 * - Loan portfolio metrics
 * - Portfolio analysis
 * - Risk scoring visualization
 * - Collection and recovery tools
 */
const LoanManagementPage = () => {
  // State for loans data
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    loanType: '',
    dateRange: '',
    amountRange: '',
    riskLevel: '',
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
    { id: 'overdue', name: 'Overdue Loans', filter: { status: 'overdue' } },
    { id: 'high_risk', name: 'High Risk Loans', filter: { riskLevel: 'high' } },
    { id: 'recent', name: 'Recently Approved', filter: { dateRange: 'last30' } }
  ]);
  
  // Fetch loans data
  useEffect(() => {
    const fetchLoans = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/management/loans');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = [
          {
            id: 'L001',
            memberId: 'M001',
            memberName: 'Juan Dela Cruz',
            loanType: 'personal',
            amount: 50000,
            term: 12,
            interestRate: 12,
            status: 'active',
            approvalDate: '2023-01-15',
            disbursementDate: '2023-01-20',
            maturityDate: '2024-01-20',
            remainingBalance: 35000,
            nextPaymentDate: '2023-07-20',
            nextPaymentAmount: 4583.33,
            paymentsOnTime: 5,
            paymentsLate: 0,
            daysOverdue: 0,
            collateralId: null,
            riskScore: 85,
            riskLevel: 'low'
          },
          {
            id: 'L002',
            memberId: 'M004',
            memberName: 'Ana Lim',
            loanType: 'business',
            amount: 100000,
            term: 24,
            interestRate: 14,
            status: 'active',
            approvalDate: '2022-11-10',
            disbursementDate: '2022-11-15',
            maturityDate: '2024-11-15',
            remainingBalance: 75000,
            nextPaymentDate: '2023-07-15',
            nextPaymentAmount: 4833.33,
            paymentsOnTime: 7,
            paymentsLate: 1,
            daysOverdue: 0,
            collateralId: 'C001',
            riskScore: 72,
            riskLevel: 'medium'
          },
          {
            id: 'L003',
            memberId: 'M005',
            memberName: 'Jose Garcia',
            loanType: 'personal',
            amount: 30000,
            term: 6,
            interestRate: 10,
            status: 'overdue',
            approvalDate: '2023-02-05',
            disbursementDate: '2023-02-10',
            maturityDate: '2023-08-10',
            remainingBalance: 15000,
            nextPaymentDate: '2023-06-10',
            nextPaymentAmount: 5250,
            paymentsOnTime: 3,
            paymentsLate: 1,
            daysOverdue: 25,
            collateralId: null,
            riskScore: 45,
            riskLevel: 'high'
          },
          {
            id: 'L004',
            memberId: 'M002',
            memberName: 'Maria Santos',
            loanType: 'housing',
            amount: 500000,
            term: 60,
            interestRate: 8,
            status: 'active',
            approvalDate: '2022-08-20',
            disbursementDate: '2022-09-01',
            maturityDate: '2027-09-01',
            remainingBalance: 450000,
            nextPaymentDate: '2023-07-01',
            nextPaymentAmount: 10166.67,
            paymentsOnTime: 10,
            paymentsLate: 0,
            daysOverdue: 0,
            collateralId: 'C002',
            riskScore: 92,
            riskLevel: 'low'
          },
          {
            id: 'L005',
            memberId: 'M003',
            memberName: 'Pedro Reyes',
            loanType: 'personal',
            amount: 25000,
            term: 6,
            interestRate: 10,
            status: 'completed',
            approvalDate: '2022-06-10',
            disbursementDate: '2022-06-15',
            maturityDate: '2022-12-15',
            remainingBalance: 0,
            nextPaymentDate: null,
            nextPaymentAmount: 0,
            paymentsOnTime: 5,
            paymentsLate: 1,
            daysOverdue: 0,
            collateralId: null,
            riskScore: 78,
            riskLevel: 'medium'
          },
          {
            id: 'L006',
            memberId: 'M006',
            memberName: 'Elena Cruz',
            loanType: 'business',
            amount: 200000,
            term: 36,
            interestRate: 15,
            status: 'pending',
            approvalDate: null,
            disbursementDate: null,
            maturityDate: null,
            remainingBalance: 200000,
            nextPaymentDate: null,
            nextPaymentAmount: 0,
            paymentsOnTime: 0,
            paymentsLate: 0,
            daysOverdue: 0,
            collateralId: 'C003',
            riskScore: 68,
            riskLevel: 'medium'
          }
        ];
        
        setLoans(mockData);
        setFilteredLoans(mockData);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoans();
  }, []);
  
  // Apply filters to loans
  useEffect(() => {
    if (loans.length === 0) return;
    
    let result = [...loans];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'active':
          result = result.filter(loan => loan.status === 'active');
          break;
        case 'pending':
          result = result.filter(loan => loan.status === 'pending');
          break;
        case 'overdue':
          result = result.filter(loan => loan.status === 'overdue');
          break;
        case 'completed':
          result = result.filter(loan => loan.status === 'completed');
          break;
      }
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(loan => 
        loan.memberName.toLowerCase().includes(searchLower) ||
        loan.id.toLowerCase().includes(searchLower) ||
        loan.memberId.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(loan => loan.status === filters.status);
    }
    
    // Apply loan type filter
    if (filters.loanType) {
      result = result.filter(loan => loan.loanType === filters.loanType);
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      const today = new Date();
      let startDate;
      
      switch (filters.dateRange) {
        case 'last30':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 30);
          break;
        case 'last90':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 90);
          break;
        case 'last365':
          startDate = new Date(today);
          startDate.setDate(today.getDate() - 365);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        result = result.filter(loan => new Date(loan.approvalDate) >= startDate);
      }
    }
    
    // Apply amount range filter
    if (filters.amountRange) {
      switch (filters.amountRange) {
        case 'small':
          result = result.filter(loan => loan.amount < 50000);
          break;
        case 'medium':
          result = result.filter(loan => loan.amount >= 50000 && loan.amount < 200000);
          break;
        case 'large':
          result = result.filter(loan => loan.amount >= 200000);
          break;
      }
    }
    
    // Apply risk level filter
    if (filters.riskLevel) {
      result = result.filter(loan => loan.riskLevel === filters.riskLevel);
    }
    
    setFilteredLoans(result);
  }, [filters, loans, activeTab]);
  
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
        status: '',
        loanType: '',
        dateRange: '',
        amountRange: '',
        riskLevel: '',
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
  
  // Calculate loan metrics
  const calculateLoanMetrics = () => {
    const totalLoans = loans.length;
    const activeLoans = loans.filter(l => l.status === 'active').length;
    const pendingLoans = loans.filter(l => l.status === 'pending').length;
    const overdueLoans = loans.filter(l => l.status === 'overdue').length;
    
    const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const outstandingAmount = loans
      .filter(l => l.status === 'active' || l.status === 'overdue')
      .reduce((sum, loan) => sum + loan.remainingBalance, 0);
    
    const highRiskLoans = loans.filter(l => l.riskLevel === 'high').length;
    
    return {
      totalLoans,
      activeLoans,
      pendingLoans,
      overdueLoans,
      totalAmount,
      outstandingAmount,
      highRiskLoans
    };
  };
  
  const metrics = calculateLoanMetrics();
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Loan Management</h2>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.location.href = '/management/loans/new'}
            >
              <FiPlus className="mr-2 h-5 w-5" />
              New Loan
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
        
        {/* Loan Portfolio Metrics */}
        <LoanPortfolioMetrics metrics={metrics} />
        
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
              All Loans
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'overdue'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Overdue
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Completed
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
                placeholder="Search loans by member name or ID..."
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
          <LoanFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onSaveFilter={handleSaveFilter}
          />
        )}
        
        {/* Loan Portfolio Analysis */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LoanPortfolioAnalysis loans={loans} />
          <LoanRiskScoring loans={loans} />
        </div>
        
        {/* Loan Table */}
        <div className="mt-6">
          <LoanTable 
            loans={filteredLoans}
            loading={loading}
          />
        </div>
        
        {/* Collection Dashboard */}
        {activeTab === 'overdue' && (
          <div className="mt-6">
            <CollectionDashboard 
              loans={filteredLoans.filter(loan => loan.status === 'overdue')}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default LoanManagementPage;
