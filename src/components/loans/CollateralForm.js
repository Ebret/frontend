'use client';

import React, { useState } from 'react';

/**
 * Collateral Form Component
 * 
 * Allows users to add collateral information when applying for a loan.
 * Supports different types of collateral (real estate, vehicle, etc.)
 * with appropriate fields for each type.
 * 
 * @param {Function} onCollateralChange - Callback when collateral data changes
 * @param {Object} initialData - Initial collateral data (if any)
 */
const CollateralForm = ({ onCollateralChange, initialData = {} }) => {
  // State for collateral data
  const [collateralData, setCollateralData] = useState({
    hasCollateral: initialData.hasCollateral || false,
    type: initialData.type || '',
    description: initialData.description || '',
    value: initialData.value || '',
    ownershipStatus: initialData.ownershipStatus || 'Owned',
    documentationStatus: initialData.documentationStatus || 'Complete',
    documents: initialData.documents || [],
    appraisalDate: initialData.appraisalDate || '',
    appraisedBy: initialData.appraisedBy || '',
    location: initialData.location || '',
    registrationNumber: initialData.registrationNumber || '',
    yearAcquired: initialData.yearAcquired || '',
    ...initialData
  });
  
  // Available collateral types
  const collateralTypes = [
    { id: 'real_estate', name: 'Real Estate' },
    { id: 'vehicle', name: 'Vehicle' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'inventory', name: 'Inventory' },
    { id: 'investment', name: 'Investment' },
    { id: 'other', name: 'Other' }
  ];
  
  // Ownership status options
  const ownershipStatusOptions = [
    'Owned',
    'Mortgaged',
    'Co-owned',
    'Under Loan'
  ];
  
  // Documentation status options
  const documentationStatusOptions = [
    'Complete',
    'Partial',
    'Pending',
    'Not Available'
  ];
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    const updatedData = {
      ...collateralData,
      [name]: newValue
    };
    
    setCollateralData(updatedData);
    
    // Call the callback with the updated data
    if (onCollateralChange) {
      onCollateralChange(updatedData);
    }
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const fileNames = files.map(file => file.name);
    
    const updatedData = {
      ...collateralData,
      documents: [...collateralData.documents, ...fileNames]
    };
    
    setCollateralData(updatedData);
    
    // Call the callback with the updated data
    if (onCollateralChange) {
      onCollateralChange(updatedData);
    }
  };
  
  // Remove a document
  const handleRemoveDocument = (index) => {
    const updatedDocuments = [...collateralData.documents];
    updatedDocuments.splice(index, 1);
    
    const updatedData = {
      ...collateralData,
      documents: updatedDocuments
    };
    
    setCollateralData(updatedData);
    
    // Call the callback with the updated data
    if (onCollateralChange) {
      onCollateralChange(updatedData);
    }
  };
  
  // Render fields based on collateral type
  const renderTypeSpecificFields = () => {
    switch (collateralData.type) {
      case 'real_estate':
        return (
          <>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Property Address
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={collateralData.location}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700">
                Property Type
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={collateralData.propertyType || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Property Type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="agricultural">Agricultural</option>
                <option value="industrial">Industrial</option>
                <option value="vacant_land">Vacant Land</option>
              </select>
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="lotArea" className="block text-sm font-medium text-gray-700">
                Lot Area (sqm)
              </label>
              <input
                type="number"
                name="lotArea"
                id="lotArea"
                value={collateralData.lotArea || ''}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700">
                Year Built
              </label>
              <input
                type="number"
                name="yearBuilt"
                id="yearBuilt"
                value={collateralData.yearBuilt || ''}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </>
        );
        
      case 'vehicle':
        return (
          <>
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                Make
              </label>
              <input
                type="text"
                name="make"
                id="make"
                value={collateralData.make || ''}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                name="model"
                id="model"
                value={collateralData.model || ''}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                name="year"
                id="year"
                value={collateralData.year || ''}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                Registration Number
              </label>
              <input
                type="text"
                name="registrationNumber"
                id="registrationNumber"
                value={collateralData.registrationNumber}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Collateral Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Provide details about the collateral you are offering for this loan.
        </p>
      </div>
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="mb-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="hasCollateral"
                name="hasCollateral"
                type="checkbox"
                checked={collateralData.hasCollateral}
                onChange={handleInputChange}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="hasCollateral" className="font-medium text-gray-700">
                I want to provide collateral for this loan
              </label>
              <p className="text-gray-500">
                Providing collateral may increase your loan limit and improve your chances of approval.
              </p>
            </div>
          </div>
        </div>
        
        {collateralData.hasCollateral && (
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Collateral Type
              </label>
              <select
                id="type"
                name="type"
                value={collateralData.type}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select Collateral Type</option>
                {collateralTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={collateralData.description}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="Provide a detailed description of the collateral"
              ></textarea>
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                Estimated Value (₱)
              </label>
              <input
                type="number"
                name="value"
                id="value"
                value={collateralData.value}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="ownershipStatus" className="block text-sm font-medium text-gray-700">
                Ownership Status
              </label>
              <select
                id="ownershipStatus"
                name="ownershipStatus"
                value={collateralData.ownershipStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {ownershipStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            {/* Render type-specific fields */}
            {collateralData.type && renderTypeSpecificFields()}
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="yearAcquired" className="block text-sm font-medium text-gray-700">
                Year Acquired
              </label>
              <input
                type="number"
                name="yearAcquired"
                id="yearAcquired"
                value={collateralData.yearAcquired}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="documentationStatus" className="block text-sm font-medium text-gray-700">
                Documentation Status
              </label>
              <select
                id="documentationStatus"
                name="documentationStatus"
                value={collateralData.documentationStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {documentationStatusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Supporting Documents
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        multiple
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, PDF up to 10MB
                  </p>
                </div>
              </div>
            </div>
            
            {/* Document list */}
            {collateralData.documents.length > 0 && (
              <div className="col-span-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {collateralData.documents.map((doc, index) => (
                    <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                        </svg>
                        <span className="ml-2 flex-1 w-0 truncate">{doc}</span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleRemoveDocument(index)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      
      {collateralData.hasCollateral && (
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
          <div className="text-sm">
            <span className="font-medium text-gray-900">Note:</span>{' '}
            <span className="text-gray-500">
              Collateral may be subject to appraisal by the cooperative before loan approval.
              The loan amount may be up to 70% of the appraised value of the collateral.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollateralForm;
