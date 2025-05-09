'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SystemSettings from '@/components/admin/settings/SystemSettings';

/**
 * Admin Settings Page
 * 
 * This page allows administrators to configure various system settings:
 * - System settings (feature toggles, parameters, business rules)
 * - User roles and permissions
 * - Notification settings
 * - Integration settings
 */
const AdminSettingsPage = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('system');
  
  // Tabs for different setting categories
  const tabs = [
    { id: 'system', name: 'System Settings' },
    { id: 'roles', name: 'Roles & Permissions' },
    { id: 'notifications', name: 'Notifications' },
    { id: 'integrations', name: 'Integrations' },
  ];
  
  // Function to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'system':
        return <SystemSettings />;
      case 'roles':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Roles & Permissions</h3>
            <p className="text-gray-500">
              This section will allow you to manage user roles and permissions.
              (This feature is under development)
            </p>
          </div>
        );
      case 'notifications':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
            <p className="text-gray-500">
              This section will allow you to configure notification templates and delivery settings.
              (This feature is under development)
            </p>
          </div>
        );
      case 'integrations':
        return (
          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Settings</h3>
            <p className="text-gray-500">
              This section will allow you to configure integrations with external systems.
              (This feature is under development)
            </p>
          </div>
        );
      default:
        return <SystemSettings />;
    }
  };
  
  return (
    <AdminLayout>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Settings</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Configure system settings, user roles, notifications, and integrations.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                `}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab content */}
        <div className="px-4 py-5 sm:p-6">
          {renderTabContent()}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage;
