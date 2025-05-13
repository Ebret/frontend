'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiUsers, FiUserPlus, FiDownload, FiUpload, FiFilter, FiSearch, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import MemberHealthMetrics from '@/components/management/members/MemberHealthMetrics';
import MemberSegmentation from '@/components/management/members/MemberSegmentation';
import MemberTable from '@/components/management/members/MemberTable';
import MemberFilters from '@/components/management/members/MemberFilters';

/**
 * Member Management Dashboard
 * 
 * Enhanced dashboard for managing members with:
 * - Member health metrics
 * - Advanced filtering and search
 * - Member segmentation
 * - Bulk actions
 */
const MemberManagementPage = () => {
  // State for members data
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    membershipType: '',
    joinDateRange: '',
    productUsage: '',
    creditScore: '',
    savedFilter: ''
  });
  
  // State for loading
  const [loading, setLoading] = useState(true);
  
  // State for showing filters panel
  const [showFilters, setShowFilters] = useState(false);
  
  // State for selected members (for bulk actions)
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  // State for saved filters
  const [savedFilters, setSavedFilters] = useState([
    { id: 'recent', name: 'Recently Joined', filter: { joinDateRange: 'last30' } },
    { id: 'inactive', name: 'Inactive Members', filter: { status: 'inactive' } },
    { id: 'high_risk', name: 'High Risk Members', filter: { creditScore: 'low' } }
  ]);
  
  // Fetch members data
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/management/members');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = [
          {
            id: 'M001',
            firstName: 'Juan',
            lastName: 'Dela Cruz',
            email: 'juan@example.com',
            phone: '09171234567',
            status: 'active',
            membershipType: 'regular',
            joinDate: '2020-05-15',
            lastActivity: '2023-06-20',
            creditScore: 85,
            products: ['savings', 'loan'],
            totalSavings: 125000,
            activeLoans: 1,
            healthScore: 92
          },
          {
            id: 'M002',
            firstName: 'Maria',
            lastName: 'Santos',
            email: 'maria@example.com',
            phone: '09189876543',
            status: 'active',
            membershipType: 'premium',
            joinDate: '2018-03-10',
            lastActivity: '2023-06-22',
            creditScore: 92,
            products: ['savings', 'time_deposit', 'loan'],
            totalSavings: 350000,
            activeLoans: 0,
            healthScore: 95
          },
          {
            id: 'M003',
            firstName: 'Pedro',
            lastName: 'Reyes',
            email: 'pedro@example.com',
            phone: '09207654321',
            status: 'inactive',
            membershipType: 'regular',
            joinDate: '2019-08-22',
            lastActivity: '2023-01-15',
            creditScore: 65,
            products: ['savings'],
            totalSavings: 15000,
            activeLoans: 0,
            healthScore: 45
          },
          {
            id: 'M004',
            firstName: 'Ana',
            lastName: 'Lim',
            email: 'ana@example.com',
            phone: '09151112222',
            status: 'active',
            membershipType: 'regular',
            joinDate: '2021-11-05',
            lastActivity: '2023-06-15',
            creditScore: 78,
            products: ['savings', 'loan'],
            totalSavings: 75000,
            activeLoans: 1,
            healthScore: 82
          },
          {
            id: 'M005',
            firstName: 'Jose',
            lastName: 'Garcia',
            email: 'jose@example.com',
            phone: '09183334444',
            status: 'at_risk',
            membershipType: 'regular',
            joinDate: '2020-02-18',
            lastActivity: '2023-05-30',
            creditScore: 58,
            products: ['savings', 'loan'],
            totalSavings: 8000,
            activeLoans: 1,
            healthScore: 35
          }
        ];
        
        setMembers(mockData);
        setFilteredMembers(mockData);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, []);
  
  // Apply filters to members
  useEffect(() => {
    if (members.length === 0) return;
    
    let result = [...members];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(member => 
        member.firstName.toLowerCase().includes(searchLower) ||
        member.lastName.toLowerCase().includes(searchLower) ||
        member.email.toLowerCase().includes(searchLower) ||
        member.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(member => member.status === filters.status);
    }
    
    // Apply membership type filter
    if (filters.membershipType) {
      result = result.filter(member => member.membershipType === filters.membershipType);
    }
    
    // Apply join date range filter
    if (filters.joinDateRange) {
      const today = new Date();
      let startDate;
      
      switch (filters.joinDateRange) {
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
        result = result.filter(member => new Date(member.joinDate) >= startDate);
      }
    }
    
    // Apply product usage filter
    if (filters.productUsage) {
      result = result.filter(member => member.products.includes(filters.productUsage));
    }
    
    // Apply credit score filter
    if (filters.creditScore) {
      switch (filters.creditScore) {
        case 'high':
          result = result.filter(member => member.creditScore >= 80);
          break;
        case 'medium':
          result = result.filter(member => member.creditScore >= 60 && member.creditScore < 80);
          break;
        case 'low':
          result = result.filter(member => member.creditScore < 60);
          break;
      }
    }
    
    setFilteredMembers(result);
  }, [filters, members]);
  
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
        membershipType: '',
        joinDateRange: '',
        productUsage: '',
        creditScore: '',
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
  
  // Handle member selection for bulk actions
  const handleMemberSelection = (memberId, isSelected) => {
    if (isSelected) {
      setSelectedMembers([...selectedMembers, memberId]);
    } else {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    }
  };
  
  // Handle select all members
  const handleSelectAllMembers = (isSelected) => {
    if (isSelected) {
      setSelectedMembers(filteredMembers.map(member => member.id));
    } else {
      setSelectedMembers([]);
    }
  };
  
  // Handle bulk action
  const handleBulkAction = (action) => {
    if (selectedMembers.length === 0) return;
    
    // In a real app, this would be an API call
    console.log(`Performing ${action} on members:`, selectedMembers);
    
    // Reset selection after action
    setSelectedMembers([]);
  };
  
  // Calculate member metrics
  const calculateMemberMetrics = () => {
    const total = members.length;
    const active = members.filter(m => m.status === 'active').length;
    const inactive = members.filter(m => m.status === 'inactive').length;
    const atRisk = members.filter(m => m.status === 'at_risk').length;
    
    const activePercentage = total > 0 ? (active / total) * 100 : 0;
    const inactivePercentage = total > 0 ? (inactive / total) * 100 : 0;
    const atRiskPercentage = total > 0 ? (atRisk / total) * 100 : 0;
    
    return {
      total,
      active,
      inactive,
      atRisk,
      activePercentage,
      inactivePercentage,
      atRiskPercentage
    };
  };
  
  const metrics = calculateMemberMetrics();
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.location.href = '/management/members/new'}
            >
              <FiUserPlus className="mr-2 h-5 w-5" />
              Add Member
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {/* Export logic */}}
            >
              <FiDownload className="mr-2 h-5 w-5" />
              Export
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {/* Import logic */}}
            >
              <FiUpload className="mr-2 h-5 w-5" />
              Import
            </button>
          </div>
        </div>
        
        {/* Member Health Metrics */}
        <MemberHealthMetrics metrics={metrics} />
        
        {/* Search and Filters */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0 mb-4 md:mb-0">
            <div className="relative rounded-md shadow-sm max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search members by name, email, or ID..."
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
          <MemberFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onSaveFilter={handleSaveFilter}
          />
        )}
        
        {/* Member Segmentation */}
        <div className="mt-6">
          <MemberSegmentation members={members} />
        </div>
        
        {/* Member Table */}
        <div className="mt-6">
          <MemberTable 
            members={filteredMembers}
            loading={loading}
            selectedMembers={selectedMembers}
            onSelectMember={handleMemberSelection}
            onSelectAll={handleSelectAllMembers}
            onBulkAction={handleBulkAction}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default MemberManagementPage;
