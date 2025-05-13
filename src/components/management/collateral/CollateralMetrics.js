'use client';

import React from 'react';
import { FiShield, FiHome, FiTruck, FiTool, FiDollarSign, FiFileText, FiAlertTriangle } from 'react-icons/fi';

/**
 * Collateral Metrics Component
 * 
 * Displays key metrics for collateral:
 * - Total collateral value
 * - Collateral by type
 * - Expiring documents
 * - Foreclosure value
 * 
 * @param {Object} metrics - Object containing collateral metrics
 */
const CollateralMetrics = ({ metrics }) => {
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Collateral Value */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Collateral Value</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.totalValue)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-blue-700">{metrics.totalCollaterals} collateral items</span>
          </div>
        </div>
      </div>
      
      {/* Real Estate Collateral */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <FiHome className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Real Estate</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.realEstateValue)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-green-700">{metrics.realEstateCollaterals} properties</span>
          </div>
        </div>
      </div>
      
      {/* Expiring Documents */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <FiFileText className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Expiring Documents</dt>
                <dd className="text-lg font-semibold text-gray-900">{metrics.expiringDocuments}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-yellow-700">Expiring in 30 days</span>
          </div>
        </div>
      </div>
      
      {/* Foreclosure Value */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
              <FiAlertTriangle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Foreclosure Value</dt>
                <dd className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.foreclosureValue)}</dd>
              </dl>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-5 py-3">
          <div className="text-sm">
            <span className="font-medium text-red-700">{metrics.foreclosureCollaterals} items in foreclosure</span>
          </div>
        </div>
      </div>
      
      {/* Collateral Type Distribution */}
      <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Collateral Type Distribution</h3>
        </div>
        <div className="p-5">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs font-medium text-gray-700">Real Estate</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-900">
                  {metrics.realEstateCollaterals} items ({metrics.totalValue > 0 ? ((metrics.realEstateValue / metrics.totalValue) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${metrics.totalValue > 0 ? (metrics.realEstateValue / metrics.totalValue) * 100 : 0}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
            
            <div className="flex mb-2 items-center justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-xs font-medium text-gray-700">Vehicles</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-900">
                  {metrics.vehicleCollaterals} items ({metrics.totalValue > 0 ? ((metrics.vehicleValue / metrics.totalValue) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${metrics.totalValue > 0 ? (metrics.vehicleValue / metrics.totalValue) * 100 : 0}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
              ></div>
            </div>
            
            <div className="flex mb-2 items-center justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                <span className="text-xs font-medium text-gray-700">Equipment</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-900">
                  {metrics.equipmentCollaterals} items ({metrics.totalValue > 0 ? ((metrics.equipmentValue / metrics.totalValue) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${metrics.totalValue > 0 ? (metrics.equipmentValue / metrics.totalValue) * 100 : 0}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
              ></div>
            </div>
            
            <div className="flex mb-2 items-center justify-between">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-xs font-medium text-gray-700">Investments</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-medium text-gray-900">
                  {metrics.investmentCollaterals} items ({metrics.totalValue > 0 ? ((metrics.investmentValue / metrics.totalValue) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${metrics.totalValue > 0 ? (metrics.investmentValue / metrics.totalValue) * 100 : 0}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Collateral Value by Type */}
      <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Collateral Value by Type</h3>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center mb-2">
                <FiHome className="h-5 w-5 text-green-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Real Estate</h4>
              </div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.realEstateValue)}</div>
              <div className="text-xs text-gray-500 mt-1">
                Avg: {formatCurrency(metrics.realEstateCollaterals > 0 ? metrics.realEstateValue / metrics.realEstateCollaterals : 0)}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center mb-2">
                <FiTruck className="h-5 w-5 text-blue-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Vehicles</h4>
              </div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.vehicleValue)}</div>
              <div className="text-xs text-gray-500 mt-1">
                Avg: {formatCurrency(metrics.vehicleCollaterals > 0 ? metrics.vehicleValue / metrics.vehicleCollaterals : 0)}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center mb-2">
                <FiTool className="h-5 w-5 text-yellow-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Equipment</h4>
              </div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.equipmentValue)}</div>
              <div className="text-xs text-gray-500 mt-1">
                Avg: {formatCurrency(metrics.equipmentCollaterals > 0 ? metrics.equipmentValue / metrics.equipmentCollaterals : 0)}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex items-center mb-2">
                <FiDollarSign className="h-5 w-5 text-purple-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-700">Investments</h4>
              </div>
              <div className="text-lg font-semibold text-gray-900">{formatCurrency(metrics.investmentValue)}</div>
              <div className="text-xs text-gray-500 mt-1">
                Avg: {formatCurrency(metrics.investmentCollaterals > 0 ? metrics.investmentValue / metrics.investmentCollaterals : 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollateralMetrics;
