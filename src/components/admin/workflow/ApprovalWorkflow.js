'use client';

import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiAlertTriangle, FiEye, FiMessageSquare } from 'react-icons/fi';
import { useCooperative } from '@/contexts/CooperativeContext';

/**
 * Approval Workflow Component
 * 
 * Provides a workflow for approving various operations in the system:
 * - Purchase orders
 * - Inventory adjustments
 * - Price changes
 * - Supplier onboarding
 * 
 * @param {Object} props
 * @param {Array} props.pendingItems - List of items pending approval
 * @param {Function} props.onApprove - Function to call when an item is approved
 * @param {Function} props.onReject - Function to call when an item is rejected
 * @param {string} props.workflowType - Type of workflow (purchase, inventory, price, supplier)
 */
const ApprovalWorkflow = ({ 
  pendingItems = [], 
  onApprove, 
  onReject, 
  workflowType = 'purchase' 
}) => {
  const { cooperativeType, isLoading } = useCooperative();
  
  // State for selected item
  const [selectedItem, setSelectedItem] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get workflow title based on type
  const getWorkflowTitle = () => {
    switch (workflowType) {
      case 'purchase':
        return 'Purchase Order Approvals';
      case 'inventory':
        return 'Inventory Adjustment Approvals';
      case 'price':
        return 'Price Change Approvals';
      case 'supplier':
        return 'Supplier Onboarding Approvals';
      default:
        return 'Pending Approvals';
    }
  };
  
  // Get item title based on type
  const getItemTitle = (item) => {
    switch (workflowType) {
      case 'purchase':
        return `PO-${item.id}: ${item.supplierName}`;
      case 'inventory':
        return `ADJ-${item.id}: ${item.reason}`;
      case 'price':
        return `PRICE-${item.id}: ${item.productName}`;
      case 'supplier':
        return `SUP-${item.id}: ${item.name}`;
      default:
        return `Item #${item.id}`;
    }
  };
  
  // Get item description based on type
  const getItemDescription = (item) => {
    switch (workflowType) {
      case 'purchase':
        return `${item.items?.length || 0} items, Total: ₱${item.totalAmount?.toLocaleString() || '0'}`;
      case 'inventory':
        return `${item.items?.length || 0} items, Reason: ${item.reason}`;
      case 'price':
        return `Old: ₱${item.oldPrice?.toLocaleString() || '0'} → New: ₱${item.newPrice?.toLocaleString() || '0'}`;
      case 'supplier':
        return `${item.businessType}, Contact: ${item.contactPerson}`;
      default:
        return `Submitted on ${new Date(item.createdAt).toLocaleDateString()}`;
    }
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Handle approve button click
  const handleApproveClick = (item) => {
    setSelectedItem(item);
    setApprovalNote('');
    setShowApprovalDialog(true);
  };
  
  // Handle reject button click
  const handleRejectClick = (item) => {
    setSelectedItem(item);
    setRejectionReason('');
    setShowRejectionDialog(true);
  };
  
  // Handle approval submission
  const handleApproveSubmit = async () => {
    if (!selectedItem) return;
    
    try {
      setIsSubmitting(true);
      
      // Call the approve function
      await onApprove(selectedItem.id, approvalNote);
      
      setShowApprovalDialog(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error approving item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle rejection submission
  const handleRejectSubmit = async () => {
    if (!selectedItem || !rejectionReason) return;
    
    try {
      setIsSubmitting(true);
      
      // Call the reject function
      await onReject(selectedItem.id, rejectionReason);
      
      setShowRejectionDialog(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error rejecting item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    setShowApprovalDialog(false);
    setShowRejectionDialog(false);
    setSelectedItem(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not a multi-purpose cooperative and trying to access multi-purpose workflows
  if (cooperativeType === 'CREDIT' && ['purchase', 'inventory', 'price', 'supplier'].includes(workflowType)) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              This approval workflow is only available for Multi-Purpose Cooperatives. Please contact your administrator to change your cooperative type.
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
          <FiClock className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {getWorkflowTitle()}
          </h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {pendingItems.filter(item => item.status === 'pending').length} pending
        </span>
      </div>
      
      <div className="border-t border-gray-200">
        {pendingItems.length === 0 ? (
          <div className="px-4 py-5 sm:p-6 text-center">
            <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Pending Approvals</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no items waiting for your approval at this time.
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto" style={{ maxHeight: '600px' }}>
            <ul className="divide-y divide-gray-200">
              {pendingItems.map((item) => (
                <li key={item.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">{getItemTitle(item)}</h4>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{getItemDescription(item)}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Submitted by {item.submittedBy} on {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {item.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleApproveClick(item)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <FiCheckCircle className="mr-1 h-3 w-3" />
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectClick(item)}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <FiXCircle className="mr-1 h-3 w-3" />
                          Reject
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FiEye className="mr-1 h-3 w-3" />
                          View
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Approval Dialog */}
      {showApprovalDialog && selectedItem && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiCheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Approve {getItemTitle(selectedItem)}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to approve this item? This action cannot be undone.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="approvalNote" className="block text-sm font-medium text-gray-700">
                          Approval Note (Optional)
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="approvalNote"
                            name="approvalNote"
                            rows="3"
                            value={approvalNote}
                            onChange={(e) => setApprovalNote(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Add any notes or comments about this approval"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleApproveSubmit}
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Approve'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Rejection Dialog */}
      {showRejectionDialog && selectedItem && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiXCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Reject {getItemTitle(selectedItem)}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to reject this item? This action cannot be undone.
                      </p>
                      <div className="mt-4">
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                          Rejection Reason <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="rejectionReason"
                            name="rejectionReason"
                            rows="3"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            placeholder="Please provide a reason for rejection"
                            required
                          ></textarea>
                        </div>
                        {showRejectionDialog && !rejectionReason && (
                          <p className="mt-1 text-sm text-red-600">
                            A rejection reason is required.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleRejectSubmit}
                  disabled={isSubmitting || !rejectionReason}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    isSubmitting || !rejectionReason ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Processing...' : 'Reject'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalWorkflow;
