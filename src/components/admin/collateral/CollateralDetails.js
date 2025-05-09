'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiEdit, FiArrowLeft, FiDownload, FiUpload, FiTrash2, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import DeleteConfirmationModal from '@/components/common/DeleteConfirmationModal';

/**
 * Collateral Details Component
 * 
 * Displays detailed information about a collateral item
 * 
 * @param {Object} collateral - Collateral data to display
 * @param {Function} onBack - Callback when back button is clicked
 * @param {Function} onEdit - Callback when edit button is clicked
 */
const CollateralDetails = ({ collateral, onBack, onEdit }) => {
  // State for document upload
  const [uploading, setUploading] = useState(false);
  
  // State for verification
  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState({
    appraised_value: '',
    verification_notes: ''
  });
  
  // State for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // State for showing verification form
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  
  // Handle document upload
  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    
    try {
      // In a real app, this would be an API call with FormData
      // const formData = new FormData();
      // formData.append('document', file);
      // await fetch(`/api/collaterals/${collateral._id}/documents`, {
      //   method: 'POST',
      //   body: formData
      // });
      
      // Mock successful upload
      toast.success('Document uploaded successfully');
      
      // Refresh collateral data (would be handled by parent component in real app)
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };
  
  // Handle document delete
  const handleDeleteDocument = async (documentId) => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/collaterals/${collateral._id}/documents/${documentId}`, {
      //   method: 'DELETE'
      // });
      
      // Mock successful deletion
      toast.success('Document deleted successfully');
      
      // Refresh collateral data (would be handled by parent component in real app)
    } catch (err) {
      console.error('Error deleting document:', err);
      toast.error('Failed to delete document');
    }
  };
  
  // Handle verification input change
  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle verification submit
  const handleVerify = async (e) => {
    e.preventDefault();
    
    setVerifying(true);
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/collaterals/${collateral._id}/verify`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(verificationData)
      // });
      
      // Mock successful verification
      toast.success('Collateral verified successfully');
      
      // Reset form and hide it
      setShowVerificationForm(false);
      
      // Refresh collateral data (would be handled by parent component in real app)
    } catch (err) {
      console.error('Error verifying collateral:', err);
      toast.error('Failed to verify collateral');
    } finally {
      setVerifying(false);
    }
  };
  
  // Handle delete collateral
  const handleDeleteCollateral = async () => {
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/collaterals/${collateral._id}`, {
      //   method: 'DELETE'
      // });
      
      // Mock successful deletion
      toast.success('Collateral deleted successfully');
      
      // Go back to list
      onBack();
    } catch (err) {
      console.error('Error deleting collateral:', err);
      toast.error('Failed to delete collateral');
    } finally {
      setShowDeleteModal(false);
    }
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending_verification':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'archived':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get type label
  const getTypeLabel = (type) => {
    switch (type) {
      case 'real_estate':
        return 'Real Estate';
      case 'vehicle':
        return 'Vehicle';
      case 'equipment':
        return 'Equipment';
      case 'inventory':
        return 'Inventory';
      case 'cash':
        return 'Cash';
      case 'investment':
        return 'Investment';
      case 'other':
        return 'Other';
      default:
        return type;
    }
  };
  
  // Mock documents for demo
  const documents = [
    { id: 1, name: 'Property_Title.pdf', upload_date: '2023-06-15T10:30:00Z', file_type: 'application/pdf', size: 1024000 },
    { id: 2, name: 'Appraisal_Report.docx', upload_date: '2023-06-16T14:45:00Z', file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 512000 },
    { id: 3, name: 'Property_Photo.jpg', upload_date: '2023-06-17T09:15:00Z', file_type: 'image/jpeg', size: 2048000 }
  ];
  
  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  return (
    <div className="px-4 py-5 sm:p-6">
      {/* Header with actions */}
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiArrowLeft className="mr-2 h-5 w-5" />
          Back to List
        </button>
        
        <div className="flex space-x-3">
          {collateral.status === 'pending_verification' && (
            <button
              type="button"
              onClick={() => setShowVerificationForm(!showVerificationForm)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <FiCheckCircle className="mr-2 h-5 w-5" />
              Verify Collateral
            </button>
          )}
          
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiEdit className="mr-2 h-5 w-5" />
            Edit
          </button>
          
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FiTrash2 className="mr-2 h-5 w-5" />
            Delete
          </button>
        </div>
      </div>
      
      {/* Verification Form */}
      {showVerificationForm && (
        <div className="mb-6 bg-green-50 p-4 rounded-md border border-green-200">
          <h3 className="text-lg font-medium text-green-900 mb-3">Verify Collateral</h3>
          <form onSubmit={handleVerify}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="appraised_value" className="block text-sm font-medium text-gray-700">
                  Appraised Value (₱)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₱</span>
                  </div>
                  <input
                    type="number"
                    name="appraised_value"
                    id="appraised_value"
                    value={verificationData.appraised_value}
                    onChange={handleVerificationChange}
                    min="0"
                    step="0.01"
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder={collateral.estimated_value}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to use the estimated value ({formatCurrency(collateral.estimated_value)})
                </p>
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="verification_notes" className="block text-sm font-medium text-gray-700">
                  Verification Notes
                </label>
                <textarea
                  id="verification_notes"
                  name="verification_notes"
                  rows="3"
                  value={verificationData.verification_notes}
                  onChange={handleVerificationChange}
                  className="mt-1 focus:ring-green-500 focus:border-green-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add notes about the verification process"
                ></textarea>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowVerificationForm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FiXCircle className="mr-2 h-5 w-5" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={verifying}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {verifying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2 h-5 w-5" />
                    Verify Collateral
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Collateral Details */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{collateral.name}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {getTypeLabel(collateral.type)} • ID: {collateral._id}
            </p>
          </div>
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(collateral.status)}`}>
            {collateral.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {collateral.description || 'No description provided'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Estimated Value</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatCurrency(collateral.estimated_value)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Owner</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {collateral.owner.first_name} {collateral.owner.last_name} ({collateral.owner.member_id})
              </dd>
            </div>
            {collateral.location && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {collateral.location}
                </dd>
              </div>
            )}
            {collateral.registration_number && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {collateral.registration_number}
                </dd>
              </div>
            )}
            {collateral.acquisition_date && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Acquisition Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatDate(collateral.acquisition_date)}
                </dd>
              </div>
            )}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(collateral.created_at)}
              </dd>
            </div>
            
            {/* Type-specific details */}
            {collateral.type === 'real_estate' && collateral.metadata && (
              <>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">Property Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {collateral.metadata.property_type ? collateral.metadata.property_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                  </dd>
                </div>
                {collateral.metadata.property_size && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Property Size</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {collateral.metadata.property_size} sqm
                    </dd>
                  </div>
                )}
                {collateral.metadata.property_address && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Property Address</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {collateral.metadata.property_address}
                    </dd>
                  </div>
                )}
              </>
            )}
            
            {collateral.type === 'vehicle' && collateral.metadata && (
              <>
                {collateral.metadata.make && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Make</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {collateral.metadata.make}
                    </dd>
                  </div>
                )}
                {collateral.metadata.model && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Model</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {collateral.metadata.model}
                    </dd>
                  </div>
                )}
                {collateral.metadata.year && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Year</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {collateral.metadata.year}
                    </dd>
                  </div>
                )}
                {collateral.metadata.plate_number && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                    <dt className="text-sm font-medium text-gray-500">Plate Number</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {collateral.metadata.plate_number}
                    </dd>
                  </div>
                )}
              </>
            )}
            
            {/* Documents section */}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Documents</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {documents.length > 0 ? (
                    documents.map((document) => (
                      <li key={document.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-2 flex-1 w-0 truncate">
                            {document.name}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                          <span className="text-xs text-gray-500">
                            {formatFileSize(document.size)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(document.upload_date)}
                          </span>
                          <button
                            type="button"
                            className="font-medium text-blue-600 hover:text-blue-500"
                            onClick={() => {/* Download logic would go here */}}
                          >
                            <FiDownload className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            className="font-medium text-red-600 hover:text-red-500"
                            onClick={() => handleDeleteDocument(document.id)}
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="pl-3 pr-4 py-3 text-sm text-gray-500">
                      No documents uploaded yet.
                    </li>
                  )}
                  <li className="pl-3 pr-4 py-3">
                    <div className="flex items-center justify-center">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        <span className="inline-flex items-center">
                          <FiUpload className="mr-2 h-5 w-5" />
                          {uploading ? 'Uploading...' : 'Upload Document'}
                        </span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          onChange={handleDocumentUpload}
                          disabled={uploading}
                        />
                      </label>
                    </div>
                  </li>
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Collateral"
        message={`Are you sure you want to delete the collateral "${collateral.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        onConfirm={handleDeleteCollateral}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default CollateralDetails;
