'use client';

import React, { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiBarChart, FiPieChart, FiSettings, FiInfo } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * Inventory Valuation Component
 * 
 * Provides tools for managing inventory valuation methods and viewing inventory value
 * 
 * @param {Object} props
 * @param {Array} props.inventoryItems - List of inventory items
 * @param {Object} props.valuationSettings - Current valuation settings
 * @param {Function} props.onUpdateSettings - Function to call when updating settings
 */
const InventoryValuation = ({ 
  inventoryItems = [], 
  valuationSettings = {
    method: 'FIFO',
    costingPeriod: 'MONTHLY',
    includeZeroStock: false,
    includeExpired: false,
    includeNonSaleable: false,
  }, 
  onUpdateSettings 
}) => {
  const { cooperativeType, isLoading } = useCooperative();
  
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState({...valuationSettings});
  
  // State for valuation report
  const [valuationReport, setValuationReport] = useState({
    totalValue: 0,
    byCategoryValue: {},
    byLocationValue: {},
    topItems: [],
  });
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setEditedSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle start editing
  const handleStartEditing = () => {
    setEditedSettings({...valuationSettings});
    setIsEditing(true);
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    if (onUpdateSettings) {
      onUpdateSettings(editedSettings);
    }
    
    setIsEditing(false);
  };
  
  // Handle cancel editing
  const handleCancelEditing = () => {
    setEditedSettings({...valuationSettings});
    setIsEditing(false);
  };
  
  // Calculate inventory value
  const calculateInventoryValue = () => {
    if (!inventoryItems || inventoryItems.length === 0) {
      return {
        totalValue: 0,
        byCategoryValue: {},
        byLocationValue: {},
        topItems: [],
      };
    }
    
    // Calculate total value
    const totalValue = inventoryItems.reduce((sum, item) => {
      // Skip items based on settings
      if (item.quantity === 0 && !editedSettings.includeZeroStock) return sum;
      if (item.isExpired && !editedSettings.includeExpired) return sum;
      if (item.isNonSaleable && !editedSettings.includeNonSaleable) return sum;
      
      return sum + (item.quantity * item.costPrice);
    }, 0);
    
    // Calculate value by category
    const byCategoryValue = inventoryItems.reduce((categories, item) => {
      // Skip items based on settings
      if (item.quantity === 0 && !editedSettings.includeZeroStock) return categories;
      if (item.isExpired && !editedSettings.includeExpired) return categories;
      if (item.isNonSaleable && !editedSettings.includeNonSaleable) return categories;
      
      const category = item.category || 'Uncategorized';
      const itemValue = item.quantity * item.costPrice;
      
      if (!categories[category]) {
        categories[category] = 0;
      }
      
      categories[category] += itemValue;
      
      return categories;
    }, {});
    
    // Calculate value by location
    const byLocationValue = inventoryItems.reduce((locations, item) => {
      // Skip items based on settings
      if (item.quantity === 0 && !editedSettings.includeZeroStock) return locations;
      if (item.isExpired && !editedSettings.includeExpired) return locations;
      if (item.isNonSaleable && !editedSettings.includeNonSaleable) return locations;
      
      const location = item.location || 'Main Store';
      const itemValue = item.quantity * item.costPrice;
      
      if (!locations[location]) {
        locations[location] = 0;
      }
      
      locations[location] += itemValue;
      
      return locations;
    }, {});
    
    // Get top items by value
    const topItems = [...inventoryItems]
      .filter(item => {
        // Skip items based on settings
        if (item.quantity === 0 && !editedSettings.includeZeroStock) return false;
        if (item.isExpired && !editedSettings.includeExpired) return false;
        if (item.isNonSaleable && !editedSettings.includeNonSaleable) return false;
        
        return true;
      })
      .map(item => ({
        ...item,
        totalValue: item.quantity * item.costPrice
      }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
    
    return {
      totalValue,
      byCategoryValue,
      byLocationValue,
      topItems,
    };
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  // Get valuation method description
  const getValuationMethodDescription = (method) => {
    switch (method) {
      case 'FIFO':
        return 'First In, First Out - Assumes that the oldest inventory items are sold first.';
      case 'LIFO':
        return 'Last In, First Out - Assumes that the newest inventory items are sold first.';
      case 'AVERAGE':
        return 'Weighted Average Cost - Uses the weighted average of all units available for sale during the period.';
      case 'SPECIFIC':
        return 'Specific Identification - Tracks each inventory item individually with its own cost.';
      default:
        return '';
    }
  };
  
  // Calculate and update valuation report
  React.useEffect(() => {
    const report = calculateInventoryValue();
    setValuationReport(report);
  }, [inventoryItems, editedSettings]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not a multi-purpose cooperative
  if (cooperativeType !== 'MULTI_PURPOSE') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiInfo className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Inventory valuation is only available for Multi-Purpose Cooperatives. Please contact your administrator to change your cooperative type.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <FiDollarSign className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Inventory Valuation
          </h3>
        </div>
        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSaveChanges}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEditing}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleStartEditing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiSettings className="mr-2 h-4 w-4" />
              Edit Settings
            </button>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <dl>
          {/* Valuation Method */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Valuation Method</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <div>
                  <select
                    id="method"
                    name="method"
                    value={editedSettings.method}
                    onChange={handleInputChange}
                    className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="FIFO">First In, First Out (FIFO)</option>
                    <option value="LIFO">Last In, First Out (LIFO)</option>
                    <option value="AVERAGE">Weighted Average Cost</option>
                    <option value="SPECIFIC">Specific Identification</option>
                  </select>
                  <p className="mt-1 text-sm text-gray-500">
                    {getValuationMethodDescription(editedSettings.method)}
                  </p>
                </div>
              ) : (
                <div>
                  <span className="font-medium">{valuationSettings.method === 'FIFO' ? 'First In, First Out (FIFO)' : 
                    valuationSettings.method === 'LIFO' ? 'Last In, First Out (LIFO)' : 
                    valuationSettings.method === 'AVERAGE' ? 'Weighted Average Cost' : 
                    'Specific Identification'}</span>
                  <p className="mt-1 text-sm text-gray-500">
                    {getValuationMethodDescription(valuationSettings.method)}
                  </p>
                </div>
              )}
            </dd>
          </div>
          
          {/* Costing Period */}
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Costing Period</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <select
                  id="costingPeriod"
                  name="costingPeriod"
                  value={editedSettings.costingPeriod}
                  onChange={handleInputChange}
                  className="max-w-lg block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="DAILY">Daily</option>
                  <option value="WEEKLY">Weekly</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              ) : (
                valuationSettings.costingPeriod === 'DAILY' ? 'Daily' : 
                valuationSettings.costingPeriod === 'WEEKLY' ? 'Weekly' : 
                valuationSettings.costingPeriod === 'MONTHLY' ? 'Monthly' : 
                valuationSettings.costingPeriod === 'QUARTERLY' ? 'Quarterly' : 'Yearly'
              )}
            </dd>
          </div>
          
          {/* Include Options */}
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Include Options</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="includeZeroStock"
                        name="includeZeroStock"
                        type="checkbox"
                        checked={editedSettings.includeZeroStock}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="includeZeroStock" className="font-medium text-gray-700">Include Zero Stock Items</label>
                      <p className="text-gray-500">Include items with zero quantity in valuation reports.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="includeExpired"
                        name="includeExpired"
                        type="checkbox"
                        checked={editedSettings.includeExpired}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="includeExpired" className="font-medium text-gray-700">Include Expired Items</label>
                      <p className="text-gray-500">Include expired items in valuation reports.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="includeNonSaleable"
                        name="includeNonSaleable"
                        type="checkbox"
                        checked={editedSettings.includeNonSaleable}
                        onChange={handleInputChange}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="includeNonSaleable" className="font-medium text-gray-700">Include Non-Saleable Items</label>
                      <p className="text-gray-500">Include damaged or non-saleable items in valuation reports.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  <li className={valuationSettings.includeZeroStock ? 'text-gray-900' : 'text-gray-500 line-through'}>
                    Include Zero Stock Items
                  </li>
                  <li className={valuationSettings.includeExpired ? 'text-gray-900' : 'text-gray-500 line-through'}>
                    Include Expired Items
                  </li>
                  <li className={valuationSettings.includeNonSaleable ? 'text-gray-900' : 'text-gray-500 line-through'}>
                    Include Non-Saleable Items
                  </li>
                </ul>
              )}
            </dd>
          </div>
        </dl>
      </div>
      
      {/* Valuation Summary */}
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Valuation Summary</h4>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FiDollarSign className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Inventory Value</dt>
                    <dd className="text-lg font-semibold text-gray-900">{formatCurrency(valuationReport.totalValue)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FiBarChart className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Categories</dt>
                    <dd className="text-lg font-semibold text-gray-900">{Object.keys(valuationReport.byCategoryValue).length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <FiPieChart className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Locations</dt>
                    <dd className="text-lg font-semibold text-gray-900">{Object.keys(valuationReport.byLocationValue).length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <FiTrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Item Value</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {inventoryItems.length > 0
                        ? formatCurrency(valuationReport.totalValue / inventoryItems.length)
                        : formatCurrency(0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Top Items by Value */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h5 className="text-base font-medium text-gray-900 mb-4">Top Items by Value</h5>
              
              {valuationReport.topItems.length === 0 ? (
                <p className="text-sm text-gray-500">No items found.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {valuationReport.topItems.map((item) => (
                    <li key={item.id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            {item.quantity} units at {formatCurrency(item.costPrice)} each
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(item.totalValue)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Value by Category */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h5 className="text-base font-medium text-gray-900 mb-4">Value by Category</h5>
              
              {Object.keys(valuationReport.byCategoryValue).length === 0 ? (
                <p className="text-sm text-gray-500">No categories found.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {Object.entries(valuationReport.byCategoryValue)
                    .sort(([, a], [, b]) => b - a)
                    .map(([category, value]) => (
                      <li key={category} className="py-3">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{category}</p>
                          <p className="text-sm font-medium text-gray-900">{formatCurrency(value)}</p>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryValuation;
