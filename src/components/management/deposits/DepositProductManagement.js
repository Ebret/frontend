'use client';

import React, { useState } from 'react';
import { FiEdit, FiPlusCircle, FiToggleLeft, FiToggleRight, FiInfo } from 'react-icons/fi';

/**
 * Deposit Product Management Component
 * 
 * Allows management of deposit products:
 * - View product details
 * - Compare products
 * - Edit product parameters
 * 
 * @param {Array} products - Array of deposit product objects
 */
const DepositProductManagement = ({ products }) => {
  // State for selected product
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  
  // State for edited product
  const [editedProduct, setEditedProduct] = useState(null);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value) => {
    return `${value}%`;
  };
  
  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setEditMode(false);
    setEditedProduct(null);
  };
  
  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (editMode) {
      setEditMode(false);
      setEditedProduct(null);
    } else {
      setEditMode(true);
      setEditedProduct({ ...selectedProduct });
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({
      ...prev,
      [name]: name === 'interestRate' || name === 'earlyWithdrawalPenalty' 
        ? parseFloat(value) 
        : name === 'minimumBalance' || name === 'minimumInitialDeposit' || name === 'maintenanceFee' || name === 'term'
          ? parseInt(value, 10)
          : value
    }));
  };
  
  // Handle save changes
  const handleSaveChanges = () => {
    // In a real app, this would be an API call
    console.log('Saving product changes:', editedProduct);
    
    // Update the selected product with edited values
    setSelectedProduct(editedProduct);
    setEditMode(false);
  };
  
  // Handle status toggle
  const handleStatusToggle = (product) => {
    // In a real app, this would be an API call
    console.log('Toggling product status:', product.id);
    
    // Update the product status
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    
    // If this is the selected product, update it
    if (selectedProduct && selectedProduct.id === product.id) {
      setSelectedProduct({
        ...selectedProduct,
        status: newStatus
      });
    }
  };
  
  // Group products by type
  const groupedProducts = products.reduce((acc, product) => {
    const type = product.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(product);
    return acc;
  }, {});
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Deposit Product Management
        </h3>
        <button
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlusCircle className="mr-1.5 h-4 w-4" />
          New Product
        </button>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="flex">
          {/* Product List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700">Product List</h4>
            </div>
            <div className="overflow-y-auto max-h-96">
              {Object.entries(groupedProducts).map(([type, typeProducts]) => (
                <div key={type}>
                  <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                    <h5 className="text-xs font-medium text-gray-700 uppercase">
                      {type === 'savings' ? 'Savings Accounts' : 'Time Deposits'}
                    </h5>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {typeProducts.map((product) => (
                      <li 
                        key={product.id}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                          selectedProduct?.id === product.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">
                              {formatPercentage(product.interestRate)} interest rate
                            </div>
                          </div>
                          <div>
                            <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                              product.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="w-2/3 px-4 py-4">
            {!selectedProduct ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-gray-400 mb-2">
                    <FiInfo className="mx-auto h-12 w-12" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">No product selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a product from the list to view details and make changes
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{selectedProduct.name}</h3>
                    <p className="text-sm text-gray-500">Product ID: {selectedProduct.id}</p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiEdit className="mr-1.5 h-4 w-4" />
                      {editMode ? 'Cancel Edit' : 'Edit Product'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(selectedProduct)}
                      className={`inline-flex items-center px-3 py-1.5 border shadow-sm text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        selectedProduct.status === 'active'
                          ? 'border-red-300 text-red-700 bg-white hover:bg-red-50 focus:ring-red-500'
                          : 'border-green-300 text-green-700 bg-white hover:bg-green-50 focus:ring-green-500'
                      }`}
                    >
                      {selectedProduct.status === 'active' ? (
                        <>
                          <FiToggleRight className="mr-1.5 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <FiToggleLeft className="mr-1.5 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {editMode ? (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={editedProduct.name}
                          onChange={handleInputChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                          Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          name="interestRate"
                          id="interestRate"
                          value={editedProduct.interestRate}
                          onChange={handleInputChange}
                          step="0.1"
                          min="0"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="minimumBalance" className="block text-sm font-medium text-gray-700">
                          Minimum Balance
                        </label>
                        <input
                          type="number"
                          name="minimumBalance"
                          id="minimumBalance"
                          value={editedProduct.minimumBalance || ''}
                          onChange={handleInputChange}
                          min="0"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="minimumInitialDeposit" className="block text-sm font-medium text-gray-700">
                          Minimum Initial Deposit
                        </label>
                        <input
                          type="number"
                          name="minimumInitialDeposit"
                          id="minimumInitialDeposit"
                          value={editedProduct.minimumInitialDeposit}
                          onChange={handleInputChange}
                          min="0"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      <div>
                        <label htmlFor="maintenanceFee" className="block text-sm font-medium text-gray-700">
                          Maintenance Fee
                        </label>
                        <input
                          type="number"
                          name="maintenanceFee"
                          id="maintenanceFee"
                          value={editedProduct.maintenanceFee}
                          onChange={handleInputChange}
                          min="0"
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      {editedProduct.type === 'time_deposit' && (
                        <>
                          <div>
                            <label htmlFor="term" className="block text-sm font-medium text-gray-700">
                              Term (months)
                            </label>
                            <input
                              type="number"
                              name="term"
                              id="term"
                              value={editedProduct.term}
                              onChange={handleInputChange}
                              min="1"
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                          <div>
                            <label htmlFor="earlyWithdrawalPenalty" className="block text-sm font-medium text-gray-700">
                              Early Withdrawal Penalty (%)
                            </label>
                            <input
                              type="number"
                              name="earlyWithdrawalPenalty"
                              id="earlyWithdrawalPenalty"
                              value={editedProduct.earlyWithdrawalPenalty || ''}
                              onChange={handleInputChange}
                              step="0.1"
                              min="0"
                              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mb-4">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        rows="3"
                        value={editedProduct.description}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      ></textarea>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-gray-50 rounded-md p-4 mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500">Product Type</div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.type === 'savings' ? 'Savings Account' : 'Time Deposit'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Interest Rate</div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPercentage(selectedProduct.interestRate)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Minimum Balance</div>
                          <div className="text-sm font-medium text-gray-900">
                            {selectedProduct.minimumBalance ? formatCurrency(selectedProduct.minimumBalance) : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Minimum Initial Deposit</div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedProduct.minimumInitialDeposit)}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Maintenance Fee</div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(selectedProduct.maintenanceFee)}
                          </div>
                        </div>
                        {selectedProduct.type === 'time_deposit' && (
                          <>
                            <div>
                              <div className="text-sm text-gray-500">Term</div>
                              <div className="text-sm font-medium text-gray-900">
                                {selectedProduct.term} months
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Early Withdrawal Penalty</div>
                              <div className="text-sm font-medium text-gray-900">
                                {selectedProduct.earlyWithdrawalPenalty ? formatPercentage(selectedProduct.earlyWithdrawalPenalty) : 'N/A'}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                      <p className="text-sm text-gray-600">
                        {selectedProduct.description}
                      </p>
                    </div>
                    
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Product Performance</h4>
                      <div className="bg-gray-50 rounded-md p-4">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-xs text-gray-500">Total Accounts</div>
                            <div className="text-sm font-medium text-gray-900">
                              {selectedProduct.type === 'savings' ? '42' : '18'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Total Balance</div>
                            <div className="text-sm font-medium text-gray-900">
                              {selectedProduct.type === 'savings' 
                                ? formatCurrency(2350000) 
                                : formatCurrency(4500000)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Growth Rate</div>
                            <div className="text-sm font-medium text-gray-900">
                              {selectedProduct.type === 'savings' ? '+8.5%' : '+12.3%'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositProductManagement;
