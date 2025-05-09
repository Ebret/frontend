'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FiSave, FiX } from 'react-icons/fi';

/**
 * Collateral Form Component
 * 
 * Form for adding or editing collateral items
 * 
 * @param {Object} collateral - Collateral data for editing (null for new collateral)
 * @param {boolean} isEditing - Whether we're editing an existing collateral
 * @param {Function} onCancel - Callback when form is canceled
 * @param {Function} onSuccess - Callback when form is successfully submitted
 */
const CollateralForm = ({ collateral = null, isEditing = false, onCancel, onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'real_estate',
    estimated_value: '',
    status: 'pending_verification',
    owner: '',
    location: '',
    registration_number: '',
    acquisition_date: '',
    // Type-specific fields in metadata
    metadata: {
      // Real estate
      property_type: '',
      property_size: '',
      property_address: '',
      
      // Vehicle
      make: '',
      model: '',
      year: '',
      plate_number: '',
      
      // Equipment
      manufacturer: '',
      model_number: '',
      serial_number: '',
      
      // Investment
      investment_type: '',
      institution: '',
      account_number: '',
      maturity_date: ''
    }
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Initialize form with collateral data if editing
  useEffect(() => {
    if (isEditing && collateral) {
      setFormData({
        name: collateral.name || '',
        description: collateral.description || '',
        type: collateral.type || 'real_estate',
        estimated_value: collateral.estimated_value || '',
        status: collateral.status || 'pending_verification',
        owner: collateral.owner?._id || '',
        location: collateral.location || '',
        registration_number: collateral.registration_number || '',
        acquisition_date: collateral.acquisition_date ? new Date(collateral.acquisition_date).toISOString().split('T')[0] : '',
        metadata: {
          ...formData.metadata,
          ...(collateral.metadata || {})
        }
      });
    }
  }, [collateral, isEditing]);
  
  // Mock list of members for owner selection
  const members = [
    { _id: 'M001', name: 'Juan Dela Cruz', member_id: 'M001' },
    { _id: 'M002', name: 'Maria Santos', member_id: 'M002' },
    { _id: 'M003', name: 'Pedro Reyes', member_id: 'M003' },
    { _id: 'M004', name: 'Ana Lim', member_id: 'M004' },
    { _id: 'M005', name: 'Jose Garcia', member_id: 'M005' }
  ];
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle metadata input change
  const handleMetadataChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [name]: value
      }
    }));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    
    if (!formData.estimated_value) {
      newErrors.estimated_value = 'Estimated value is required';
    } else if (isNaN(formData.estimated_value) || parseFloat(formData.estimated_value) <= 0) {
      newErrors.estimated_value = 'Estimated value must be a positive number';
    }
    
    if (!formData.owner) {
      newErrors.owner = 'Owner is required';
    }
    
    // Type-specific validations
    if (formData.type === 'real_estate' && !formData.location) {
      newErrors.location = 'Location is required for real estate';
    }
    
    if (formData.type === 'vehicle' && !formData.registration_number) {
      newErrors.registration_number = 'Registration number is required for vehicles';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch(
      //   isEditing ? `/api/collaterals/${collateral._id}` : '/api/collaterals',
      //   {
      //     method: isEditing ? 'PUT' : 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify(formData)
      //   }
      // );
      // const data = await response.json();
      
      // Mock successful submission
      const mockResponse = {
        success: true,
        message: isEditing ? 'Collateral updated successfully' : 'Collateral created successfully',
        data: {
          ...formData,
          _id: isEditing ? collateral._id : `COLL${Date.now()}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
      
      toast.success(mockResponse.message);
      
      // Call success callback with the updated/created collateral
      if (onSuccess) {
        onSuccess(mockResponse.data);
      }
    } catch (err) {
      console.error('Error submitting collateral:', err);
      toast.error(isEditing ? 'Failed to update collateral' : 'Failed to create collateral');
    } finally {
      setLoading(false);
    }
  };
  
  // Render type-specific fields based on collateral type
  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'real_estate':
        return (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Real Estate Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700">
                  Property Type
                </label>
                <select
                  id="property_type"
                  name="property_type"
                  value={formData.metadata.property_type || ''}
                  onChange={handleMetadataChange}
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
              
              <div className="sm:col-span-3">
                <label htmlFor="property_size" className="block text-sm font-medium text-gray-700">
                  Property Size (sqm)
                </label>
                <input
                  type="number"
                  name="property_size"
                  id="property_size"
                  value={formData.metadata.property_size || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="property_address" className="block text-sm font-medium text-gray-700">
                  Complete Property Address
                </label>
                <input
                  type="text"
                  name="property_address"
                  id="property_address"
                  value={formData.metadata.property_address || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
        
      case 'vehicle':
        return (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Vehicle Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="make" className="block text-sm font-medium text-gray-700">
                  Make
                </label>
                <input
                  type="text"
                  name="make"
                  id="make"
                  value={formData.metadata.make || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                  Model
                </label>
                <input
                  type="text"
                  name="model"
                  id="model"
                  value={formData.metadata.model || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  id="year"
                  value={formData.metadata.year || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-4">
                <label htmlFor="plate_number" className="block text-sm font-medium text-gray-700">
                  Plate Number
                </label>
                <input
                  type="text"
                  name="plate_number"
                  id="plate_number"
                  value={formData.metadata.plate_number || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
        
      case 'equipment':
        return (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Equipment Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
                  Manufacturer
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  id="manufacturer"
                  value={formData.metadata.manufacturer || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="model_number" className="block text-sm font-medium text-gray-700">
                  Model Number
                </label>
                <input
                  type="text"
                  name="model_number"
                  id="model_number"
                  value={formData.metadata.model_number || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serial_number"
                  id="serial_number"
                  value={formData.metadata.serial_number || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
        
      case 'investment':
        return (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900">Investment Details</h3>
            <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="investment_type" className="block text-sm font-medium text-gray-700">
                  Investment Type
                </label>
                <select
                  id="investment_type"
                  name="investment_type"
                  value={formData.metadata.investment_type || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select Investment Type</option>
                  <option value="time_deposit">Time Deposit</option>
                  <option value="bonds">Bonds</option>
                  <option value="stocks">Stocks</option>
                  <option value="mutual_funds">Mutual Funds</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                  Institution
                </label>
                <input
                  type="text"
                  name="institution"
                  id="institution"
                  value={formData.metadata.institution || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="account_number" className="block text-sm font-medium text-gray-700">
                  Account/Certificate Number
                </label>
                <input
                  type="text"
                  name="account_number"
                  id="account_number"
                  value={formData.metadata.account_number || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="maturity_date" className="block text-sm font-medium text-gray-700">
                  Maturity Date
                </label>
                <input
                  type="date"
                  name="maturity_date"
                  id="maturity_date"
                  value={formData.metadata.maturity_date || ''}
                  onChange={handleMetadataChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="px-4 py-5 sm:p-6">
      <form onSubmit={handleSubmit}>
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.name ? 'border-red-300' : ''
                }`}
              />
              {errors.name && (
                <p className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.type ? 'border-red-300' : ''
                }`}
              >
                <option value="real_estate">Real Estate</option>
                <option value="vehicle">Vehicle</option>
                <option value="equipment">Equipment</option>
                <option value="inventory">Inventory</option>
                <option value="cash">Cash</option>
                <option value="investment">Investment</option>
                <option value="other">Other</option>
              </select>
              {errors.type && (
                <p className="mt-2 text-sm text-red-600">{errors.type}</p>
              )}
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              ></textarea>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="estimated_value" className="block text-sm font-medium text-gray-700">
                Estimated Value (₱) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">₱</span>
                </div>
                <input
                  type="number"
                  name="estimated_value"
                  id="estimated_value"
                  value={formData.estimated_value}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className={`focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md ${
                    errors.estimated_value ? 'border-red-300' : ''
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.estimated_value && (
                <p className="mt-2 text-sm text-red-600">{errors.estimated_value}</p>
              )}
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="owner" className="block text-sm font-medium text-gray-700">
                Owner <span className="text-red-500">*</span>
              </label>
              <select
                id="owner"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                className={`mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.owner ? 'border-red-300' : ''
                }`}
              >
                <option value="">Select Owner</option>
                {members.map(member => (
                  <option key={member._id} value={member._id}>
                    {member.name} ({member.member_id})
                  </option>
                ))}
              </select>
              {errors.owner && (
                <p className="mt-2 text-sm text-red-600">{errors.owner}</p>
              )}
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location {formData.type === 'real_estate' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.location ? 'border-red-300' : ''
                }`}
              />
              {errors.location && (
                <p className="mt-2 text-sm text-red-600">{errors.location}</p>
              )}
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700">
                Registration Number {formData.type === 'vehicle' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="registration_number"
                id="registration_number"
                value={formData.registration_number}
                onChange={handleInputChange}
                className={`mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                  errors.registration_number ? 'border-red-300' : ''
                }`}
              />
              {errors.registration_number && (
                <p className="mt-2 text-sm text-red-600">{errors.registration_number}</p>
              )}
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="acquisition_date" className="block text-sm font-medium text-gray-700">
                Acquisition Date
              </label>
              <input
                type="date"
                name="acquisition_date"
                id="acquisition_date"
                value={formData.acquisition_date}
                onChange={handleInputChange}
                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="pending_verification">Pending Verification</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="rejected">Rejected</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Type-specific fields */}
        {renderTypeSpecificFields()}
        
        {/* Form actions */}
        <div className="mt-8 pt-5 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiX className="inline-block mr-2 h-5 w-5" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditing ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                <>
                  <FiSave className="inline-block mr-2 h-5 w-5" />
                  {isEditing ? 'Update Collateral' : 'Save Collateral'}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CollateralForm;
