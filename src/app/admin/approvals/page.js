'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ApprovalWorkflow from '@/components/admin/workflow/ApprovalWorkflow';
import { FiClock, FiFilter, FiRefreshCw } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * Approval Workflows Page
 * 
 * Displays all approval workflows for the cooperative
 */
const ApprovalsPage = () => {
  const { cooperativeType, isLoading: isCooperativeLoading } = useCooperative();
  
  // State for pending items
  const [pendingItems, setPendingItems] = useState({
    purchase: [],
    inventory: [],
    price: [],
    supplier: [],
    loan: [],
    withdrawal: [],
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('purchase');
  const [filter, setFilter] = useState('pending');
  
  // Fetch pending items
  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        
        // Mock purchase orders
        const mockPurchaseOrders = [
          {
            id: 1001,
            supplierName: 'ABC Suppliers',
            items: [
              { id: 1, name: 'Rice (25kg)', quantity: 50, price: 1250, total: 62500 },
              { id: 2, name: 'Cooking Oil (1L)', quantity: 100, price: 120, total: 12000 },
            ],
            totalAmount: 74500,
            status: 'pending',
            submittedBy: 'John Doe',
            createdAt: '2023-06-01T00:00:00.000Z',
          },
          {
            id: 1002,
            supplierName: 'XYZ Distributors',
            items: [
              { id: 1, name: 'Sugar (1kg)', quantity: 200, price: 65, total: 13000 },
              { id: 2, name: 'Flour (1kg)', quantity: 150, price: 50, total: 7500 },
            ],
            totalAmount: 20500,
            status: 'pending',
            submittedBy: 'Jane Smith',
            createdAt: '2023-06-02T00:00:00.000Z',
          },
          {
            id: 1003,
            supplierName: 'Tech Solutions',
            items: [
              { id: 1, name: 'Electric Fan', quantity: 10, price: 1500, total: 15000 },
              { id: 2, name: 'Rice Cooker', quantity: 5, price: 2500, total: 12500 },
            ],
            totalAmount: 27500,
            status: 'approved',
            submittedBy: 'Bob Johnson',
            createdAt: '2023-06-03T00:00:00.000Z',
            approvedBy: 'Admin User',
            approvedAt: '2023-06-04T00:00:00.000Z',
          },
        ];
        
        // Mock inventory adjustments
        const mockInventoryAdjustments = [
          {
            id: 2001,
            reason: 'Damaged Goods',
            items: [
              { id: 1, name: 'Rice (25kg)', quantity: -5, reason: 'Water damage' },
              { id: 2, name: 'Cooking Oil (1L)', quantity: -10, reason: 'Leaking containers' },
            ],
            status: 'pending',
            submittedBy: 'Alice Williams',
            createdAt: '2023-06-05T00:00:00.000Z',
          },
          {
            id: 2002,
            reason: 'Stock Count Adjustment',
            items: [
              { id: 1, name: 'Sugar (1kg)', quantity: 15, reason: 'Physical count higher than system' },
              { id: 2, name: 'Flour (1kg)', quantity: -8, reason: 'Physical count lower than system' },
            ],
            status: 'pending',
            submittedBy: 'Charlie Brown',
            createdAt: '2023-06-06T00:00:00.000Z',
          },
        ];
        
        // Mock price changes
        const mockPriceChanges = [
          {
            id: 3001,
            productName: 'Rice (25kg)',
            oldPrice: 1250,
            newPrice: 1300,
            reason: 'Supplier price increase',
            status: 'pending',
            submittedBy: 'David Miller',
            createdAt: '2023-06-07T00:00:00.000Z',
          },
          {
            id: 3002,
            productName: 'Cooking Oil (1L)',
            oldPrice: 120,
            newPrice: 135,
            reason: 'Market price adjustment',
            status: 'pending',
            submittedBy: 'Eva Garcia',
            createdAt: '2023-06-08T00:00:00.000Z',
          },
        ];
        
        // Mock supplier onboarding
        const mockSuppliers = [
          {
            id: 4001,
            name: 'New Horizon Suppliers',
            businessType: 'Wholesaler',
            contactPerson: 'Frank Martinez',
            email: 'frank@newhorizon.com',
            phone: '123-456-7890',
            status: 'pending',
            submittedBy: 'Grace Lee',
            createdAt: '2023-06-09T00:00:00.000Z',
          },
        ];
        
        // Mock loan applications
        const mockLoanApplications = [
          {
            id: 5001,
            memberName: 'Henry Wilson',
            loanType: 'Regular Loan',
            amount: 50000,
            term: 12,
            purpose: 'Home renovation',
            status: 'pending',
            submittedBy: 'Credit Officer',
            createdAt: '2023-06-10T00:00:00.000Z',
          },
          {
            id: 5002,
            memberName: 'Irene Taylor',
            loanType: 'Emergency Loan',
            amount: 20000,
            term: 6,
            purpose: 'Medical expenses',
            status: 'pending',
            submittedBy: 'Credit Officer',
            createdAt: '2023-06-11T00:00:00.000Z',
          },
        ];
        
        // Mock withdrawal requests
        const mockWithdrawalRequests = [
          {
            id: 6001,
            memberName: 'Jack Robinson',
            accountType: 'Savings',
            amount: 15000,
            reason: 'Personal use',
            status: 'pending',
            submittedBy: 'Teller',
            createdAt: '2023-06-12T00:00:00.000Z',
          },
        ];
        
        setPendingItems({
          purchase: mockPurchaseOrders,
          inventory: mockInventoryAdjustments,
          price: mockPriceChanges,
          supplier: mockSuppliers,
          loan: mockLoanApplications,
          withdrawal: mockWithdrawalRequests,
        });
      } catch (error) {
        console.error('Error fetching pending items:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPendingItems();
  }, []);
  
  // Handle approve
  const handleApprove = async (id, note) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just update the local state
      
      setPendingItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: 'approved',
              approvedBy: 'Current User',
              approvedAt: new Date().toISOString(),
              approvalNote: note,
            };
          }
          return item;
        }),
      }));
      
      return true;
    } catch (error) {
      console.error('Error approving item:', error);
      throw error;
    }
  };
  
  // Handle reject
  const handleReject = async (id, reason) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just update the local state
      
      setPendingItems(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: 'rejected',
              rejectedBy: 'Current User',
              rejectedAt: new Date().toISOString(),
              rejectionReason: reason,
            };
          }
          return item;
        }),
      }));
      
      return true;
    } catch (error) {
      console.error('Error rejecting item:', error);
      throw error;
    }
  };
  
  // Get filtered items
  const getFilteredItems = () => {
    if (!pendingItems[activeTab]) return [];
    
    if (filter === 'all') {
      return pendingItems[activeTab];
    }
    
    return pendingItems[activeTab].filter(item => item.status === filter);
  };
  
  // Get tabs based on cooperative type
  const getTabs = () => {
    const commonTabs = [
      { id: 'loan', name: 'Loan Applications' },
      { id: 'withdrawal', name: 'Withdrawal Requests' },
    ];
    
    const multiPurposeTabs = [
      { id: 'purchase', name: 'Purchase Orders' },
      { id: 'inventory', name: 'Inventory Adjustments' },
      { id: 'price', name: 'Price Changes' },
      { id: 'supplier', name: 'Supplier Onboarding' },
    ];
    
    return cooperativeType === 'MULTI_PURPOSE'
      ? [...multiPurposeTabs, ...commonTabs]
      : commonTabs;
  };
  
  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };
  
  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };
  
  if (isLoading || isCooperativeLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }
  
  const tabs = getTabs();
  const filteredItems = getFilteredItems();
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Approval Workflows</h2>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select
                value={filter}
                onChange={handleFilterChange}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="pending">Pending Only</option>
                <option value="approved">Approved Only</option>
                <option value="rejected">Rejected Only</option>
                <option value="all">All Items</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiFilter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.name}
                {pendingItems[tab.id]?.filter(item => item.status === 'pending').length > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {pendingItems[tab.id].filter(item => item.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Approval Workflow */}
        <ApprovalWorkflow
          pendingItems={filteredItems}
          onApprove={handleApprove}
          onReject={handleReject}
          workflowType={activeTab}
        />
      </div>
    </AdminLayout>
  );
};

export default ApprovalsPage;
