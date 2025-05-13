'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useCooperative } from '@/contexts/CooperativeContext';
import { FiShoppingCart, FiAlertTriangle, FiPlus, FiMinus, FiTrash2, FiCreditCard, FiDollarSign } from 'react-icons/fi';

/**
 * Point of Sale Page
 * 
 * Provides POS features for Multi-Purpose Cooperatives:
 * - Product search and selection
 * - Cart management
 * - Payment processing
 * - Receipt generation
 */
const PointOfSalePage = () => {
  const { isMultiPurpose, isLoading } = useCooperative();
  
  // State for cart items
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Rice (25kg)', price: 1250, quantity: 1, total: 1250 },
    { id: 2, name: 'Cooking Oil (1L)', price: 120, quantity: 2, total: 240 },
  ]);
  
  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState('cash');
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.12; // 12% VAT
  const total = subtotal + tax;
  
  // Handle quantity change
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: newQuantity,
          total: item.price * newQuantity
        };
      }
      return item;
    }));
  };
  
  // Handle item removal
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  // Redirect or show error if not a multi-purpose cooperative
  if (!isLoading && !isMultiPurpose) {
    return (
      <AdminLayout>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                This feature is only available for Multi-Purpose Cooperatives. Please contact your administrator to change your cooperative type.
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Point of Sale</h2>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Open Drawer
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              New Transaction
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Product Search and Categories */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Products</h3>
                <div className="flex space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Search products..."
                    />
                  </div>
                  <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                    <option>All Categories</option>
                    <option>Groceries</option>
                    <option>Household</option>
                    <option>Electronics</option>
                    <option>Clothing</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                  {/* Product Cards */}
                  <div className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <FiShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Rice (25kg)</h4>
                    <p className="text-sm text-gray-500">₱1,250.00</p>
                    <p className="text-xs text-green-600">In stock: 42</p>
                  </div>
                  
                  <div className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <FiShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Cooking Oil (1L)</h4>
                    <p className="text-sm text-gray-500">₱120.00</p>
                    <p className="text-xs text-green-600">In stock: 85</p>
                  </div>
                  
                  <div className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <FiShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Sugar (1kg)</h4>
                    <p className="text-sm text-gray-500">₱65.00</p>
                    <p className="text-xs text-green-600">In stock: 120</p>
                  </div>
                  
                  <div className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <FiShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Electric Fan</h4>
                    <p className="text-sm text-gray-500">₱1,500.00</p>
                    <p className="text-xs text-red-600">In stock: 5</p>
                  </div>
                  
                  <div className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <FiShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Detergent (1kg)</h4>
                    <p className="text-sm text-gray-500">₱95.00</p>
                    <p className="text-xs text-green-600">In stock: 68</p>
                  </div>
                  
                  <div className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="h-24 bg-gray-100 rounded-md mb-2 flex items-center justify-center">
                      <FiShoppingCart className="h-8 w-8 text-gray-400" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Canned Goods</h4>
                    <p className="text-sm text-gray-500">₱45.00</p>
                    <p className="text-xs text-green-600">In stock: 150</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </a>
                  <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </a>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">248</span> products
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        1
                      </a>
                      <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                        2
                      </a>
                      <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cart and Payment */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Current Transaction</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Transaction #1254
                </span>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPlus className="mr-1 h-3 w-3" />
                    Add Item
                  </button>
                </div>
                
                <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
                  <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={item.id} className="px-4 py-3">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">₱{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <FiMinus className="h-4 w-4" />
                            </button>
                            <span className="mx-2 text-sm text-gray-700">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-gray-500"
                            >
                              <FiPlus className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="ml-2 p-1 text-red-400 hover:text-red-500"
                            >
                              <FiTrash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1 flex justify-end">
                          <p className="text-sm font-medium text-gray-900">₱{item.total.toFixed(2)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">Tax (12% VAT)</span>
                    <span className="text-gray-900">₱{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-medium mt-4">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₱{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Method</h4>
                  <div className="flex space-x-3 mb-4">
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange('cash')}
                      className={`flex-1 inline-flex items-center justify-center px-3 py-2 border ${
                        paymentMethod === 'cash'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700'
                      } text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      <FiDollarSign className="mr-1.5 h-4 w-4" />
                      Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePaymentMethodChange('card')}
                      className={`flex-1 inline-flex items-center justify-center px-3 py-2 border ${
                        paymentMethod === 'card'
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700'
                      } text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      <FiCreditCard className="mr-1.5 h-4 w-4" />
                      Card
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Complete Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PointOfSalePage;
