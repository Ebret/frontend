'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AuditLog from '@/components/admin/audit/AuditLog';
import { FiActivity, FiDownload } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * Audit Log Page
 * 
 * Displays a log of all actions taken in the system
 */
const AuditLogPage = () => {
  const { cooperativeType, isLoading: isCooperativeLoading } = useCooperative();
  
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll use mock data
        const mockAuditLogs = [
          {
            id: 1,
            timestamp: '2023-06-01T10:15:30.000Z',
            user: 'John Doe',
            role: 'ADMIN',
            ipAddress: '192.168.1.1',
            action: 'LOGIN',
            module: 'SYSTEM',
            description: 'User logged in',
            details: {
              browser: 'Chrome',
              os: 'Windows',
            },
          },
          {
            id: 2,
            timestamp: '2023-06-01T10:30:45.000Z',
            user: 'John Doe',
            role: 'ADMIN',
            ipAddress: '192.168.1.1',
            action: 'CREATE_USER',
            module: 'USER',
            description: 'Created new user: Jane Smith',
            details: {
              userId: 2,
              email: 'jane.smith@example.com',
              role: 'GENERAL_MANAGER',
            },
          },
          {
            id: 3,
            timestamp: '2023-06-01T11:05:20.000Z',
            user: 'Jane Smith',
            role: 'GENERAL_MANAGER',
            ipAddress: '192.168.1.2',
            action: 'LOGIN',
            module: 'SYSTEM',
            description: 'User logged in',
            details: {
              browser: 'Firefox',
              os: 'MacOS',
            },
          },
          {
            id: 4,
            timestamp: '2023-06-01T11:15:10.000Z',
            user: 'Jane Smith',
            role: 'GENERAL_MANAGER',
            ipAddress: '192.168.1.2',
            action: 'APPROVE_LOAN',
            module: 'LOAN',
            description: 'Approved loan application #1001',
            details: {
              loanId: 1001,
              memberName: 'Bob Johnson',
              amount: 50000,
              term: 12,
            },
          },
          {
            id: 5,
            timestamp: '2023-06-01T13:45:30.000Z',
            user: 'Bob Johnson',
            role: 'CREDIT_OFFICER',
            ipAddress: '192.168.1.3',
            action: 'LOGIN',
            module: 'SYSTEM',
            description: 'User logged in',
            details: {
              browser: 'Chrome',
              os: 'Windows',
            },
          },
          {
            id: 6,
            timestamp: '2023-06-01T14:10:15.000Z',
            user: 'Bob Johnson',
            role: 'CREDIT_OFFICER',
            ipAddress: '192.168.1.3',
            action: 'CREATE_LOAN',
            module: 'LOAN',
            description: 'Created loan application #1002',
            details: {
              loanId: 1002,
              memberName: 'Alice Williams',
              amount: 75000,
              term: 24,
            },
          },
          {
            id: 7,
            timestamp: '2023-06-02T09:30:45.000Z',
            user: 'Alice Williams',
            role: 'MEMBER',
            ipAddress: '192.168.1.4',
            action: 'LOGIN',
            module: 'SYSTEM',
            description: 'User logged in',
            details: {
              browser: 'Safari',
              os: 'iOS',
            },
          },
          {
            id: 8,
            timestamp: '2023-06-02T09:45:20.000Z',
            user: 'Alice Williams',
            role: 'MEMBER',
            ipAddress: '192.168.1.4',
            action: 'VIEW_ACCOUNT',
            module: 'SAVINGS',
            description: 'Viewed savings account details',
            details: {
              accountId: 2001,
              balance: 25000,
            },
          },
          {
            id: 9,
            timestamp: '2023-06-02T10:15:30.000Z',
            user: 'Charlie Brown',
            role: 'TELLER',
            ipAddress: '192.168.1.5',
            action: 'LOGIN',
            module: 'SYSTEM',
            description: 'User logged in',
            details: {
              browser: 'Chrome',
              os: 'Windows',
            },
          },
          {
            id: 10,
            timestamp: '2023-06-02T10:30:45.000Z',
            user: 'Charlie Brown',
            role: 'TELLER',
            ipAddress: '192.168.1.5',
            action: 'DEPOSIT',
            module: 'SAVINGS',
            description: 'Processed deposit for member: Alice Williams',
            details: {
              accountId: 2001,
              amount: 5000,
              transactionId: 3001,
            },
          },
        ];
        
        // Add Multi-Purpose specific logs if applicable
        if (cooperativeType === 'MULTI_PURPOSE') {
          const multiPurposeLogs = [
            {
              id: 11,
              timestamp: '2023-06-02T13:15:30.000Z',
              user: 'David Miller',
              role: 'INVENTORY_MANAGER',
              ipAddress: '192.168.1.6',
              action: 'LOGIN',
              module: 'SYSTEM',
              description: 'User logged in',
              details: {
                browser: 'Chrome',
                os: 'Windows',
              },
            },
            {
              id: 12,
              timestamp: '2023-06-02T13:30:45.000Z',
              user: 'David Miller',
              role: 'INVENTORY_MANAGER',
              ipAddress: '192.168.1.6',
              action: 'ADD_INVENTORY',
              module: 'INVENTORY',
              description: 'Added new inventory items',
              details: {
                items: [
                  { id: 1, name: 'Rice (25kg)', quantity: 50, price: 1250 },
                  { id: 2, name: 'Cooking Oil (1L)', quantity: 100, price: 120 },
                ],
                purchaseOrderId: 1001,
              },
            },
            {
              id: 13,
              timestamp: '2023-06-02T14:45:30.000Z',
              user: 'Eva Garcia',
              role: 'STORE_MANAGER',
              ipAddress: '192.168.1.7',
              action: 'LOGIN',
              module: 'SYSTEM',
              description: 'User logged in',
              details: {
                browser: 'Firefox',
                os: 'Windows',
              },
            },
            {
              id: 14,
              timestamp: '2023-06-02T15:00:45.000Z',
              user: 'Eva Garcia',
              role: 'STORE_MANAGER',
              ipAddress: '192.168.1.7',
              action: 'UPDATE_PRICE',
              module: 'INVENTORY',
              description: 'Updated product prices',
              details: {
                items: [
                  { id: 1, name: 'Rice (25kg)', oldPrice: 1250, newPrice: 1300 },
                  { id: 2, name: 'Cooking Oil (1L)', oldPrice: 120, newPrice: 135 },
                ],
              },
            },
            {
              id: 15,
              timestamp: '2023-06-03T09:15:30.000Z',
              user: 'Frank Martinez',
              role: 'CASHIER',
              ipAddress: '192.168.1.8',
              action: 'LOGIN',
              module: 'SYSTEM',
              description: 'User logged in',
              details: {
                browser: 'Chrome',
                os: 'Windows',
              },
            },
            {
              id: 16,
              timestamp: '2023-06-03T09:30:45.000Z',
              user: 'Frank Martinez',
              role: 'CASHIER',
              ipAddress: '192.168.1.8',
              action: 'PROCESS_SALE',
              module: 'SALES',
              description: 'Processed sale transaction',
              details: {
                transactionId: 4001,
                items: [
                  { id: 1, name: 'Rice (25kg)', quantity: 2, price: 1300, total: 2600 },
                  { id: 2, name: 'Cooking Oil (1L)', quantity: 5, price: 135, total: 675 },
                ],
                total: 3275,
                paymentMethod: 'CASH',
              },
            },
            {
              id: 17,
              timestamp: '2023-06-03T13:45:30.000Z',
              user: 'Grace Lee',
              role: 'PURCHASING_OFFICER',
              ipAddress: '192.168.1.9',
              action: 'LOGIN',
              module: 'SYSTEM',
              description: 'User logged in',
              details: {
                browser: 'Edge',
                os: 'Windows',
              },
            },
            {
              id: 18,
              timestamp: '2023-06-03T14:00:45.000Z',
              user: 'Grace Lee',
              role: 'PURCHASING_OFFICER',
              ipAddress: '192.168.1.9',
              action: 'CREATE_PURCHASE_ORDER',
              module: 'PURCHASE',
              description: 'Created purchase order #1002',
              details: {
                purchaseOrderId: 1002,
                supplier: 'XYZ Distributors',
                items: [
                  { id: 1, name: 'Sugar (1kg)', quantity: 200, price: 65, total: 13000 },
                  { id: 2, name: 'Flour (1kg)', quantity: 150, price: 50, total: 7500 },
                ],
                total: 20500,
              },
            },
            {
              id: 19,
              timestamp: '2023-06-03T15:30:45.000Z',
              user: 'Jane Smith',
              role: 'GENERAL_MANAGER',
              ipAddress: '192.168.1.2',
              action: 'APPROVE_PURCHASE_ORDER',
              module: 'PURCHASE',
              description: 'Approved purchase order #1002',
              details: {
                purchaseOrderId: 1002,
                supplier: 'XYZ Distributors',
                total: 20500,
              },
            },
            {
              id: 20,
              timestamp: '2023-06-04T10:15:30.000Z',
              user: 'Henry Wilson',
              role: 'SUPPLIER',
              ipAddress: '192.168.1.10',
              action: 'ADD_SUPPLIER',
              module: 'SUPPLIER',
              description: 'Added new supplier: New Horizon Suppliers',
              details: {
                supplierId: 2001,
                name: 'New Horizon Suppliers',
                contactPerson: 'Henry Wilson',
                email: 'henry@newhorizon.com',
                phone: '123-456-7890',
              },
            },
          ];
          
          mockAuditLogs.push(...multiPurposeLogs);
        }
        
        // Sort logs by timestamp (newest first)
        mockAuditLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setAuditLogs(mockAuditLogs);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAuditLogs();
  }, [cooperativeType]);
  
  // Handle export
  const handleExport = (filters) => {
    // In a real app, this would generate a CSV or Excel file
    console.log('Exporting audit logs with filters:', filters);
    
    // Create a simple CSV
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Description'];
    const csvContent = [
      headers.join(','),
      ...auditLogs.map(log => [
        new Date(log.timestamp).toISOString(),
        log.user,
        log.role,
        log.action,
        log.module,
        `"${log.description.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Handle filter
  const handleFilter = (filters) => {
    // In a real app, this would filter the logs from the API
    console.log('Filtering audit logs with:', filters);
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
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Audit Log</h2>
          <button
            type="button"
            onClick={() => handleExport({})}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiDownload className="mr-2 h-5 w-5" />
            Export All
          </button>
        </div>
        
        <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiActivity className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                The audit log records all actions taken in the system. Use the filters to narrow down the results.
              </p>
            </div>
          </div>
        </div>
        
        <AuditLog
          auditLogs={auditLogs}
          onExport={handleExport}
          onFilter={handleFilter}
        />
      </div>
    </AdminLayout>
  );
};

export default AuditLogPage;
