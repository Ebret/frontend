'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import CollateralList from '@/components/admin/collateral/CollateralList';
import CollateralForm from '@/components/admin/collateral/CollateralForm';
import CollateralDetails from '@/components/admin/collateral/CollateralDetails';

/**
 * Collateral Management Dashboard
 * 
 * Main page for managing collaterals with:
 * - List view with search and filters
 * - Add/Edit forms
 * - Detailed view
 */
const CollateralManagementPage = () => {
  // State for active view
  const [activeView, setActiveView] = useState('list');
  
  // State for selected collateral
  const [selectedCollateral, setSelectedCollateral] = useState(null);
  
  // Handle view changes
  const handleViewChange = (view, collateral = null) => {
    setActiveView(view);
    if (collateral) {
      setSelectedCollateral(collateral);
    }
  };
  
  // Render the active view
  const renderActiveView = () => {
    switch (activeView) {
      case 'add':
        return (
          <CollateralForm 
            onCancel={() => handleViewChange('list')}
            onSuccess={() => handleViewChange('list')}
          />
        );
      case 'edit':
        return (
          <CollateralForm 
            collateral={selectedCollateral}
            isEditing={true}
            onCancel={() => handleViewChange('details', selectedCollateral)}
            onSuccess={(updatedCollateral) => handleViewChange('details', updatedCollateral)}
          />
        );
      case 'details':
        return (
          <CollateralDetails 
            collateral={selectedCollateral}
            onBack={() => handleViewChange('list')}
            onEdit={() => handleViewChange('edit', selectedCollateral)}
          />
        );
      case 'list':
      default:
        return (
          <CollateralList 
            onAdd={() => handleViewChange('add')}
            onView={(collateral) => handleViewChange('details', collateral)}
            onEdit={(collateral) => handleViewChange('edit', collateral)}
          />
        );
    }
  };
  
  return (
    <AdminLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">
            {activeView === 'list' && 'Collateral Management'}
            {activeView === 'add' && 'Add New Collateral'}
            {activeView === 'edit' && 'Edit Collateral'}
            {activeView === 'details' && 'Collateral Details'}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {activeView === 'list' && 'Manage collateral items for loans and credit facilities.'}
            {activeView === 'add' && 'Add a new collateral item to the system.'}
            {activeView === 'edit' && 'Edit details of an existing collateral item.'}
            {activeView === 'details' && 'View detailed information about this collateral.'}
          </p>
        </div>
        
        <div className="border-t border-gray-200">
          {renderActiveView()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CollateralManagementPage;
