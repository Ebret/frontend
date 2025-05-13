'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FiShield, FiPlus, FiDownload, FiFilter, FiRefreshCw } from 'react-icons/fi';
import Link from 'next/link';
import CollateralMetrics from '@/components/management/collateral/CollateralMetrics';
import CollateralValuation from '@/components/management/collateral/CollateralValuation';
import CollateralRiskManagement from '@/components/management/collateral/CollateralRiskManagement';
import CollateralFilters from '@/components/management/collateral/CollateralFilters';
import CollateralTable from '@/components/management/collateral/CollateralTable';
import DocumentManagement from '@/components/management/collateral/DocumentManagement';
import CollateralLiquidation from '@/components/management/collateral/CollateralLiquidation';

/**
 * Collateral Management Dashboard
 * 
 * Enhanced dashboard for managing collateral with:
 * - Collateral metrics
 * - Valuation tools
 * - Risk management
 * - Document management
 * - Liquidation workflow
 */
const CollateralManagementPage = () => {
  // State for collateral data
  const [collaterals, setCollaterals] = useState([]);
  const [filteredCollaterals, setFilteredCollaterals] = useState([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    valueRange: '',
    expiryRange: '',
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
    { id: 'expiring', name: 'Expiring Soon', filter: { expiryRange: 'next30' } },
    { id: 'high_value', name: 'High Value', filter: { valueRange: 'high' } },
    { id: 'real_estate', name: 'Real Estate', filter: { type: 'real_estate' } }
  ]);
  
  // Fetch collateral data
  useEffect(() => {
    const fetchCollaterals = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await fetch('/api/management/collaterals');
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = [
          {
            id: 'C001',
            loanId: 'L002',
            memberId: 'M004',
            memberName: 'Ana Lim',
            type: 'real_estate',
            description: 'Residential property in Makati City',
            address: '123 Ayala Avenue, Makati City',
            estimatedValue: 2500000,
            loanToValue: 0.4, // 40% LTV
            appraisalDate: '2023-01-15',
            nextAppraisalDate: '2024-01-15',
            status: 'active',
            documents: [
              { id: 'D001', type: 'title_deed', name: 'Property Title', expiryDate: null, status: 'verified' },
              { id: 'D002', type: 'appraisal_report', name: 'Appraisal Report', expiryDate: '2024-01-15', status: 'valid' },
              { id: 'D003', type: 'insurance', name: 'Property Insurance', expiryDate: '2023-12-31', status: 'valid' }
            ],
            riskScore: 15, // Low risk
            riskLevel: 'low'
          },
          {
            id: 'C002',
            loanId: 'L004',
            memberId: 'M002',
            memberName: 'Maria Santos',
            type: 'real_estate',
            description: 'Commercial property in Quezon City',
            address: '456 Commonwealth Avenue, Quezon City',
            estimatedValue: 5000000,
            loanToValue: 0.6, // 60% LTV
            appraisalDate: '2022-11-10',
            nextAppraisalDate: '2023-11-10',
            status: 'active',
            documents: [
              { id: 'D004', type: 'title_deed', name: 'Property Title', expiryDate: null, status: 'verified' },
              { id: 'D005', type: 'appraisal_report', name: 'Appraisal Report', expiryDate: '2023-11-10', status: 'valid' },
              { id: 'D006', type: 'insurance', name: 'Property Insurance', expiryDate: '2023-09-30', status: 'expiring_soon' }
            ],
            riskScore: 25, // Low risk
            riskLevel: 'low'
          },
          {
            id: 'C003',
            loanId: 'L006',
            memberId: 'M006',
            memberName: 'Elena Cruz',
            type: 'vehicle',
            description: '2021 Toyota Fortuner',
            address: null,
            estimatedValue: 1200000,
            loanToValue: 0.5, // 50% LTV
            appraisalDate: '2023-03-20',
            nextAppraisalDate: '2024-03-20',
            status: 'active',
            documents: [
              { id: 'D007', type: 'registration', name: 'Vehicle Registration', expiryDate: '2023-08-15', status: 'expiring_soon' },
              { id: 'D008', type: 'appraisal_report', name: 'Vehicle Appraisal', expiryDate: '2024-03-20', status: 'valid' },
              { id: 'D009', type: 'insurance', name: 'Comprehensive Insurance', expiryDate: '2023-12-31', status: 'valid' }
            ],
            riskScore: 35, // Medium risk
            riskLevel: 'medium'
          },
          {
            id: 'C004',
            loanId: 'L008',
            memberId: 'M008',
            memberName: 'Roberto Reyes',
            type: 'investment',
            description: 'Time Deposit Certificate',
            address: null,
            estimatedValue: 500000,
            loanToValue: 0.8, // 80% LTV
            appraisalDate: '2023-02-05',
            nextAppraisalDate: null,
            status: 'active',
            documents: [
              { id: 'D010', type: 'certificate', name: 'Time Deposit Certificate', expiryDate: '2024-02-05', status: 'valid' },
              { id: 'D011', type: 'assignment', name: 'Assignment of Rights', expiryDate: null, status: 'verified' }
            ],
            riskScore: 10, // Low risk
            riskLevel: 'low'
          },
          {
            id: 'C005',
            loanId: 'L010',
            memberId: 'M010',
            memberName: 'Carlos Bautista',
            type: 'equipment',
            description: 'Industrial Printing Equipment',
            address: '789 Industrial Ave, Pasig City',
            estimatedValue: 800000,
            loanToValue: 0.65, // 65% LTV
            appraisalDate: '2022-09-15',
            nextAppraisalDate: '2023-09-15',
            status: 'active',
            documents: [
              { id: 'D012', type: 'purchase_receipt', name: 'Purchase Receipt', expiryDate: null, status: 'verified' },
              { id: 'D013', type: 'appraisal_report', name: 'Equipment Appraisal', expiryDate: '2023-09-15', status: 'expiring_soon' },
              { id: 'D014', type: 'insurance', name: 'Equipment Insurance', expiryDate: '2023-10-31', status: 'valid' }
            ],
            riskScore: 45, // Medium risk
            riskLevel: 'medium'
          },
          {
            id: 'C006',
            loanId: 'L012',
            memberId: 'M012',
            memberName: 'Sophia Mendoza',
            type: 'real_estate',
            description: 'Vacant Lot in Tagaytay',
            address: 'Lot 24, Block 3, Tagaytay Highlands',
            estimatedValue: 3000000,
            loanToValue: 0.4, // 40% LTV
            appraisalDate: '2022-06-10',
            nextAppraisalDate: '2023-06-10',
            status: 'under_review',
            documents: [
              { id: 'D015', type: 'title_deed', name: 'Property Title', expiryDate: null, status: 'verification_pending' },
              { id: 'D016', type: 'appraisal_report', name: 'Appraisal Report', expiryDate: '2023-06-10', status: 'expired' },
              { id: 'D017', type: 'tax_declaration', name: 'Tax Declaration', expiryDate: '2023-12-31', status: 'valid' }
            ],
            riskScore: 55, // Medium risk
            riskLevel: 'medium'
          },
          {
            id: 'C007',
            loanId: 'L015',
            memberId: 'M015',
            memberName: 'Miguel Santos',
            type: 'vehicle',
            description: '2019 Honda Civic',
            address: null,
            estimatedValue: 750000,
            loanToValue: 0.6, // 60% LTV
            appraisalDate: '2022-11-25',
            nextAppraisalDate: '2023-11-25',
            status: 'foreclosure',
            documents: [
              { id: 'D018', type: 'registration', name: 'Vehicle Registration', expiryDate: '2023-05-20', status: 'expired' },
              { id: 'D019', type: 'appraisal_report', name: 'Vehicle Appraisal', expiryDate: '2023-11-25', status: 'valid' },
              { id: 'D020', type: 'insurance', name: 'Comprehensive Insurance', expiryDate: '2023-04-15', status: 'expired' }
            ],
            riskScore: 85, // High risk
            riskLevel: 'high'
          }
        ];
        
        setCollaterals(mockData);
        setFilteredCollaterals(mockData);
      } catch (error) {
        console.error('Error fetching collaterals:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCollaterals();
  }, []);
  
  // Apply filters to collaterals
  useEffect(() => {
    if (collaterals.length === 0) return;
    
    let result = [...collaterals];
    
    // Apply tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'real_estate':
          result = result.filter(collateral => collateral.type === 'real_estate');
          break;
        case 'vehicle':
          result = result.filter(collateral => collateral.type === 'vehicle');
          break;
        case 'equipment':
          result = result.filter(collateral => collateral.type === 'equipment');
          break;
        case 'investment':
          result = result.filter(collateral => collateral.type === 'investment');
          break;
        case 'foreclosure':
          result = result.filter(collateral => collateral.status === 'foreclosure');
          break;
      }
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(collateral => 
        collateral.memberName.toLowerCase().includes(searchLower) ||
        collateral.id.toLowerCase().includes(searchLower) ||
        collateral.loanId.toLowerCase().includes(searchLower) ||
        collateral.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      result = result.filter(collateral => collateral.type === filters.type);
    }
    
    // Apply status filter
    if (filters.status) {
      result = result.filter(collateral => collateral.status === filters.status);
    }
    
    // Apply value range filter
    if (filters.valueRange) {
      switch (filters.valueRange) {
        case 'low':
          result = result.filter(collateral => collateral.estimatedValue < 1000000);
          break;
        case 'medium':
          result = result.filter(collateral => collateral.estimatedValue >= 1000000 && collateral.estimatedValue < 3000000);
          break;
        case 'high':
          result = result.filter(collateral => collateral.estimatedValue >= 3000000);
          break;
      }
    }
    
    // Apply expiry range filter
    if (filters.expiryRange) {
      const today = new Date();
      let endDate;
      
      switch (filters.expiryRange) {
        case 'next30':
          endDate = new Date(today);
          endDate.setDate(today.getDate() + 30);
          
          result = result.filter(collateral => {
            // Check if any document is expiring within the next 30 days
            return collateral.documents.some(doc => 
              doc.expiryDate && 
              new Date(doc.expiryDate) >= today &&
              new Date(doc.expiryDate) <= endDate
            );
          });
          break;
        case 'next90':
          endDate = new Date(today);
          endDate.setDate(today.getDate() + 90);
          
          result = result.filter(collateral => {
            // Check if any document is expiring within the next 90 days
            return collateral.documents.some(doc => 
              doc.expiryDate && 
              new Date(doc.expiryDate) >= today &&
              new Date(doc.expiryDate) <= endDate
            );
          });
          break;
        case 'expired':
          result = result.filter(collateral => {
            // Check if any document is expired
            return collateral.documents.some(doc => 
              doc.expiryDate && 
              new Date(doc.expiryDate) < today
            );
          });
          break;
      }
    }
    
    setFilteredCollaterals(result);
  }, [filters, collaterals, activeTab]);
  
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
        valueRange: '',
        expiryRange: '',
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
  
  // Calculate collateral metrics
  const calculateCollateralMetrics = () => {
    const totalCollaterals = collaterals.length;
    const totalValue = collaterals.reduce((sum, collateral) => sum + collateral.estimatedValue, 0);
    
    const realEstateCollaterals = collaterals.filter(c => c.type === 'real_estate');
    const realEstateValue = realEstateCollaterals.reduce((sum, collateral) => sum + collateral.estimatedValue, 0);
    
    const vehicleCollaterals = collaterals.filter(c => c.type === 'vehicle');
    const vehicleValue = vehicleCollaterals.reduce((sum, collateral) => sum + collateral.estimatedValue, 0);
    
    const equipmentCollaterals = collaterals.filter(c => c.type === 'equipment');
    const equipmentValue = equipmentCollaterals.reduce((sum, collateral) => sum + collateral.estimatedValue, 0);
    
    const investmentCollaterals = collaterals.filter(c => c.type === 'investment');
    const investmentValue = investmentCollaterals.reduce((sum, collateral) => sum + collateral.estimatedValue, 0);
    
    const expiringDocuments = collaterals.reduce((count, collateral) => {
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);
      
      const expiringDocs = collateral.documents.filter(doc => 
        doc.expiryDate && 
        new Date(doc.expiryDate) >= today &&
        new Date(doc.expiryDate) <= thirtyDaysFromNow
      );
      
      return count + expiringDocs.length;
    }, 0);
    
    const foreclosureCollaterals = collaterals.filter(c => c.status === 'foreclosure');
    const foreclosureValue = foreclosureCollaterals.reduce((sum, collateral) => sum + collateral.estimatedValue, 0);
    
    return {
      totalCollaterals,
      totalValue,
      realEstateCollaterals: realEstateCollaterals.length,
      realEstateValue,
      vehicleCollaterals: vehicleCollaterals.length,
      vehicleValue,
      equipmentCollaterals: equipmentCollaterals.length,
      equipmentValue,
      investmentCollaterals: investmentCollaterals.length,
      investmentValue,
      expiringDocuments,
      foreclosureCollaterals: foreclosureCollaterals.length,
      foreclosureValue
    };
  };
  
  const metrics = calculateCollateralMetrics();
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Collateral Management</h2>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => window.location.href = '/management/collateral/new'}
            >
              <FiPlus className="mr-2 h-5 w-5" />
              New Collateral
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
        
        {/* Collateral Metrics */}
        <CollateralMetrics metrics={metrics} />
        
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
              All Collateral
            </button>
            <button
              onClick={() => setActiveTab('real_estate')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'real_estate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Real Estate
            </button>
            <button
              onClick={() => setActiveTab('vehicle')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'vehicle'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'equipment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Equipment
            </button>
            <button
              onClick={() => setActiveTab('investment')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'investment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Investments
            </button>
            <button
              onClick={() => setActiveTab('foreclosure')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === 'foreclosure'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              Foreclosure
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
                placeholder="Search collateral by description, member, or ID..."
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
          <CollateralFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
            onSaveFilter={handleSaveFilter}
          />
        )}
        
        {/* Collateral Valuation and Risk Management */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CollateralValuation collaterals={collaterals} />
          <CollateralRiskManagement collaterals={collaterals} />
        </div>
        
        {/* Collateral Table */}
        <div className="mt-6">
          <CollateralTable 
            collaterals={filteredCollaterals}
            loading={loading}
          />
        </div>
        
        {/* Document Management */}
        <div className="mt-6">
          <DocumentManagement collaterals={collaterals} />
        </div>
        
        {/* Collateral Liquidation */}
        {activeTab === 'foreclosure' && (
          <div className="mt-6">
            <CollateralLiquidation 
              collaterals={filteredCollaterals.filter(c => c.status === 'foreclosure')}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CollateralManagementPage;
