'use client';

import React, { useState } from 'react';
import { FiFileText, FiUpload, FiCalendar, FiCheckCircle, FiAlertTriangle, FiClock, FiDownload, FiEye } from 'react-icons/fi';

/**
 * Document Management Component
 * 
 * Provides tools for managing collateral documents:
 * - Document tracking
 * - Expiry monitoring
 * - Document upload
 * 
 * @param {Array} collaterals - Array of collateral objects
 */
const DocumentManagement = ({ collaterals }) => {
  // State for selected collateral
  const [selectedCollateral, setSelectedCollateral] = useState(null);
  
  // State for document upload
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    documentType: '',
    documentName: '',
    expiryDate: '',
    file: null
  });
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get document status badge class
  const getDocumentStatusBadgeClass = (status) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expiring_soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'verification_pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get document status label
  const getDocumentStatusLabel = (status) => {
    switch (status) {
      case 'valid':
        return 'Valid';
      case 'expiring_soon':
        return 'Expiring Soon';
      case 'expired':
        return 'Expired';
      case 'verified':
        return 'Verified';
      case 'verification_pending':
        return 'Verification Pending';
      default:
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };
  
  // Get document type label
  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case 'title_deed':
        return 'Title Deed';
      case 'appraisal_report':
        return 'Appraisal Report';
      case 'insurance':
        return 'Insurance Policy';
      case 'registration':
        return 'Registration';
      case 'certificate':
        return 'Certificate';
      case 'assignment':
        return 'Assignment of Rights';
      case 'purchase_receipt':
        return 'Purchase Receipt';
      case 'tax_declaration':
        return 'Tax Declaration';
      default:
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };
  
  // Get document icon
  const getDocumentIcon = (type) => {
    switch (type) {
      case 'title_deed':
        return <FiFileText className="h-5 w-5 text-blue-500" />;
      case 'appraisal_report':
        return <FiFileText className="h-5 w-5 text-green-500" />;
      case 'insurance':
        return <FiFileText className="h-5 w-5 text-purple-500" />;
      case 'registration':
        return <FiFileText className="h-5 w-5 text-yellow-500" />;
      case 'certificate':
        return <FiFileText className="h-5 w-5 text-indigo-500" />;
      case 'assignment':
        return <FiFileText className="h-5 w-5 text-pink-500" />;
      case 'purchase_receipt':
        return <FiFileText className="h-5 w-5 text-orange-500" />;
      case 'tax_declaration':
        return <FiFileText className="h-5 w-5 text-teal-500" />;
      default:
        return <FiFileText className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Calculate days until expiry
  const calculateDaysUntilExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };
  
  // Get expiry status text
  const getExpiryStatusText = (expiryDate) => {
    const daysUntil = calculateDaysUntilExpiry(expiryDate);
    
    if (daysUntil === null) return 'No Expiry';
    if (daysUntil < 0) return `Expired ${Math.abs(daysUntil)} days ago`;
    if (daysUntil === 0) return 'Expires Today';
    if (daysUntil <= 30) return `Expires in ${daysUntil} days`;
    return `Expires in ${daysUntil} days`;
  };
  
  // Get expiry status class
  const getExpiryStatusClass = (expiryDate) => {
    const daysUntil = calculateDaysUntilExpiry(expiryDate);
    
    if (daysUntil === null) return 'text-gray-500';
    if (daysUntil < 0) return 'text-red-600';
    if (daysUntil <= 30) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Get documents requiring attention
  const getDocumentsRequiringAttention = () => {
    const documents = [];
    
    collaterals.forEach(collateral => {
      if (!collateral.documents) return;
      
      collateral.documents.forEach(doc => {
        if (doc.status === 'expired' || doc.status === 'expiring_soon' || doc.status === 'verification_pending') {
          documents.push({
            ...doc,
            collateralId: collateral.id,
            collateralDescription: collateral.description,
            memberName: collateral.memberName
          });
        }
      });
    });
    
    // Sort by priority: expired, then expiring soon, then verification pending
    return documents.sort((a, b) => {
      const priorityOrder = { expired: 0, expiring_soon: 1, verification_pending: 2 };
      return priorityOrder[a.status] - priorityOrder[b.status];
    });
  };
  
  // Handle upload form change
  const handleUploadFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'file' && files.length > 0) {
      setUploadFormData(prev => ({
        ...prev,
        file: files[0]
      }));
    } else {
      setUploadFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle upload form submit
  const handleUploadFormSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would upload the file to the server
    console.log('Uploading document:', uploadFormData);
    
    // Reset form
    setUploadFormData({
      documentType: '',
      documentName: '',
      expiryDate: '',
      file: null
    });
    
    setShowUploadForm(false);
  };
  
  const documentsRequiringAttention = getDocumentsRequiringAttention();
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <FiFileText className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Document Management
          </h3>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documents Requiring Attention */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-700">Documents Requiring Attention</h4>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {documentsRequiringAttention.length} documents
                </span>
              </div>
              
              {documentsRequiringAttention.length === 0 ? (
                <div className="bg-gray-50 rounded-md p-4 text-sm text-gray-500 text-center">
                  <FiCheckCircle className="mx-auto h-8 w-8 text-green-500 mb-2" />
                  <p>All documents are up-to-date.</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {documentsRequiringAttention.map((doc) => (
                      <li key={doc.id} className="py-3">
                        <div className="flex items-start">
                          <div className="mr-3 mt-1">
                            {doc.status === 'expired' ? (
                              <FiAlertTriangle className="h-5 w-5 text-red-500" />
                            ) : doc.status === 'expiring_soon' ? (
                              <FiClock className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <FiFileText className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDocumentStatusBadgeClass(doc.status)}`}>
                                {getDocumentStatusLabel(doc.status)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {getDocumentTypeLabel(doc.type)} | {doc.collateralDescription}
                            </div>
                            {doc.expiryDate && (
                              <div className={`text-xs ${getExpiryStatusClass(doc.expiryDate)} mt-1`}>
                                {getExpiryStatusText(doc.expiryDate)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {
                              const collateral = collaterals.find(c => c.id === doc.collateralId);
                              setSelectedCollateral(collateral);
                            }}
                          >
                            <FiEye className="mr-1 h-3 w-3" />
                            View
                          </button>
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={() => {
                              setShowUploadForm(true);
                              const collateral = collaterals.find(c => c.id === doc.collateralId);
                              setSelectedCollateral(collateral);
                              setUploadFormData(prev => ({
                                ...prev,
                                documentType: doc.type,
                                documentName: `Updated ${doc.name}`
                              }));
                            }}
                          >
                            <FiUpload className="mr-1 h-3 w-3" />
                            Update
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Document Management */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-medium text-gray-700">Document Management</h4>
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadForm(true);
                    setUploadFormData({
                      documentType: '',
                      documentName: '',
                      expiryDate: '',
                      file: null
                    });
                  }}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FiUpload className="mr-1.5 h-4 w-4" />
                  Upload Document
                </button>
              </div>
              
              {showUploadForm ? (
                <div className="bg-gray-50 rounded-md p-4">
                  <form onSubmit={handleUploadFormSubmit}>
                    <div className="mb-4">
                      <label htmlFor="collateral" className="block text-sm font-medium text-gray-700">
                        Collateral
                      </label>
                      <select
                        id="collateral"
                        name="collateral"
                        value={selectedCollateral ? selectedCollateral.id : ''}
                        onChange={(e) => {
                          const selected = collaterals.find(c => c.id === e.target.value);
                          setSelectedCollateral(selected || null);
                        }}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">Select a collateral item</option>
                        {collaterals.map(collateral => (
                          <option key={collateral.id} value={collateral.id}>
                            {collateral.description} ({collateral.memberName})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
                          Document Type
                        </label>
                        <select
                          id="documentType"
                          name="documentType"
                          value={uploadFormData.documentType}
                          onChange={handleUploadFormChange}
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          required
                        >
                          <option value="">Select a document type</option>
                          <option value="title_deed">Title Deed</option>
                          <option value="appraisal_report">Appraisal Report</option>
                          <option value="insurance">Insurance Policy</option>
                          <option value="registration">Registration</option>
                          <option value="certificate">Certificate</option>
                          <option value="assignment">Assignment of Rights</option>
                          <option value="purchase_receipt">Purchase Receipt</option>
                          <option value="tax_declaration">Tax Declaration</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="documentName" className="block text-sm font-medium text-gray-700">
                          Document Name
                        </label>
                        <input
                          type="text"
                          id="documentName"
                          name="documentName"
                          value={uploadFormData.documentName}
                          onChange={handleUploadFormChange}
                          className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                        Expiry Date (if applicable)
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="date"
                          id="expiryDate"
                          name="expiryDate"
                          value={uploadFormData.expiryDate}
                          onChange={handleUploadFormChange}
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Document File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload a file</span>
                              <input 
                                id="file" 
                                name="file" 
                                type="file" 
                                className="sr-only" 
                                onChange={handleUploadFormChange}
                                required
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PDF, PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowUploadForm(false)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Upload Document
                      </button>
                    </div>
                  </form>
                </div>
              ) : selectedCollateral ? (
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-900">{selectedCollateral.description}</h5>
                    <p className="text-xs text-gray-500">
                      {getTypeLabel(selectedCollateral.type)} | Owner: {selectedCollateral.memberName}
                    </p>
                  </div>
                  
                  <h6 className="text-xs font-medium text-gray-700 mb-2">Documents</h6>
                  {selectedCollateral.documents && selectedCollateral.documents.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {selectedCollateral.documents.map((doc) => (
                        <li key={doc.id} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="mr-3">
                              {getDocumentIcon(doc.type)}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                              <div className="text-xs text-gray-500">
                                {getDocumentTypeLabel(doc.type)}
                              </div>
                              {doc.expiryDate && (
                                <div className={`text-xs ${getExpiryStatusClass(doc.expiryDate)} mt-1`}>
                                  {getExpiryStatusText(doc.expiryDate)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiDownload className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiEye className="h-3 w-3" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No documents found for this collateral.</p>
                  )}
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadForm(true);
                        setUploadFormData({
                          documentType: '',
                          documentName: '',
                          expiryDate: '',
                          file: null
                        });
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiUpload className="mr-1.5 h-4 w-4" />
                      Add Document
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-md p-8 text-center">
                  <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Collateral Selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a collateral item to view and manage its documents.
                  </p>
                  <div className="mt-6">
                    <select
                      value=""
                      onChange={(e) => {
                        const selected = collaterals.find(c => c.id === e.target.value);
                        setSelectedCollateral(selected || null);
                      }}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Select a collateral item</option>
                      {collaterals.map(collateral => (
                        <option key={collateral.id} value={collateral.id}>
                          {collateral.description} ({collateral.memberName})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
