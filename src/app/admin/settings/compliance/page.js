'use client';

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import ComplianceSettings from '@/components/admin/settings/ComplianceSettings';
import { FiShield, FiFileText, FiAlertTriangle } from 'react-icons/fi';

/**
 * Compliance Settings Page
 * 
 * Provides tools for managing compliance settings and regulatory requirements
 */
const ComplianceSettingsPage = () => {
  return (
    <AdminLayout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900">Compliance Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Compliance Settings */}
          <div className="lg:col-span-2">
            <ComplianceSettings />
          </div>
          
          {/* Compliance Resources */}
          <div>
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex items-center">
                <FiFileText className="h-5 w-5 text-gray-400 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Compliance Resources
                </h3>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Regulatory Documents</h4>
                  
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiFileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3 text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          CDA Memorandum Circular 2022-01
                        </a>
                        <p className="text-gray-500">
                          Guidelines on the conduct of cooperative annual general assembly meetings.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiFileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3 text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Data Privacy Act Compliance Checklist
                        </a>
                        <p className="text-gray-500">
                          Checklist for ensuring compliance with the Data Privacy Act of 2012.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiFileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3 text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Anti-Money Laundering Guidelines
                        </a>
                        <p className="text-gray-500">
                          Guidelines for implementing anti-money laundering measures in cooperatives.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiFileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3 text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          BIR Revenue Regulations for Cooperatives
                        </a>
                        <p className="text-gray-500">
                          Tax regulations and reporting requirements for cooperatives.
                        </p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <div className="flex-shrink-0">
                        <FiFileText className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3 text-sm">
                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                          Consumer Protection Act Guidelines
                        </a>
                        <p className="text-gray-500">
                          Guidelines for ensuring compliance with consumer protection laws.
                        </p>
                      </div>
                    </li>
                  </ul>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Compliance Calendar</h4>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                            30
                          </span>
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="font-medium text-gray-900">
                            Annual CDA Report Submission
                          </p>
                          <p className="text-gray-500">
                            Due within 30 days after the annual general assembly.
                          </p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                            15
                          </span>
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="font-medium text-gray-900">
                            Quarterly BIR Tax Filing
                          </p>
                          <p className="text-gray-500">
                            Due on the 15th day after the end of each quarter.
                          </p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                            60
                          </span>
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="font-medium text-gray-900">
                            Annual Data Privacy Audit
                          </p>
                          <p className="text-gray-500">
                            To be conducted within 60 days after the fiscal year end.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Compliance Contacts</h4>
                    
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <FiShield className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="font-medium text-gray-900">
                            Cooperative Development Authority
                          </p>
                          <p className="text-gray-500">
                            Email: info@cda.gov.ph | Phone: (02) 8725-6450
                          </p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <FiShield className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="font-medium text-gray-900">
                            National Privacy Commission
                          </p>
                          <p className="text-gray-500">
                            Email: info@privacy.gov.ph | Phone: (02) 8234-2228
                          </p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <div className="flex-shrink-0">
                          <FiShield className="h-5 w-5 text-purple-500" />
                        </div>
                        <div className="ml-3 text-sm">
                          <p className="font-medium text-gray-900">
                            Bureau of Internal Revenue
                          </p>
                          <p className="text-gray-500">
                            Email: contact_us@bir.gov.ph | Phone: (02) 8981-7000
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex items-center">
                <FiAlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Compliance Alerts
                </h3>
              </div>
              
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          Annual CDA Report due in 15 days. Please ensure all required documents are prepared.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <FiCheckCircle className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          Quarterly BIR Tax Filing completed successfully. Next filing due on April 15, 2024.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ComplianceSettingsPage;
