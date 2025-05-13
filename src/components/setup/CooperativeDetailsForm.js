'use client';

import React from 'react';

/**
 * Cooperative Details Form Component
 * 
 * Form for entering cooperative details during setup
 * 
 * @param {Object} props
 * @param {Object} props.formData - Form data object
 * @param {Function} props.onChange - Function to call when form fields change
 */
const CooperativeDetailsForm = ({ formData, onChange }) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Cooperative Details</h3>
      <p className="text-sm text-gray-500 mb-6">
        Enter the basic information about your cooperative.
      </p>
      
      <div className="space-y-4">
        {/* Cooperative Name */}
        <div>
          <label htmlFor="cooperativeName" className="block text-sm font-medium text-gray-700">
            Cooperative Name *
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="cooperativeName"
              name="cooperativeName"
              value={formData.cooperativeName}
              onChange={onChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        {/* Cooperative Address */}
        <div>
          <label htmlFor="cooperativeAddress" className="block text-sm font-medium text-gray-700">
            Address *
          </label>
          <div className="mt-1">
            <textarea
              id="cooperativeAddress"
              name="cooperativeAddress"
              rows="3"
              value={formData.cooperativeAddress}
              onChange={onChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
        </div>
        
        {/* Cooperative Contact Information */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Phone */}
          <div>
            <label htmlFor="cooperativePhone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="mt-1">
              <input
                type="tel"
                id="cooperativePhone"
                name="cooperativePhone"
                value={formData.cooperativePhone}
                onChange={onChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="cooperativeEmail" className="block text-sm font-medium text-gray-700">
              Email Address *
            </label>
            <div className="mt-1">
              <input
                type="email"
                id="cooperativeEmail"
                name="cooperativeEmail"
                value={formData.cooperativeEmail}
                onChange={onChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Cooperative Type:</h4>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-sm text-gray-900">
              {formData.cooperativeType === 'CREDIT' ? 'Credit Cooperative' : 'Multi-Purpose Cooperative'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formData.cooperativeType === 'CREDIT'
                ? 'Focused on providing financial services, loans, and savings products to members.'
                : 'Combines financial services with consumer, producer, or marketing activities.'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Fields marked with * are required.
      </div>
    </div>
  );
};

export default CooperativeDetailsForm;
