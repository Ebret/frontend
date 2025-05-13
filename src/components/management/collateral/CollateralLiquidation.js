'use client';

import React, { useState } from 'react';
import { FiAlertTriangle, FiDollarSign, FiCalendar, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';

/**
 * Collateral Liquidation Component
 * 
 * Provides tools for managing foreclosed collateral:
 * - Liquidation workflow
 * - Auction management
 * - Settlement tracking
 * 
 * @param {Array} collaterals - Array of foreclosed collateral objects
 */
const CollateralLiquidation = ({ collaterals }) => {
  // State for selected collateral
  const [selectedCollateral, setSelectedCollateral] = useState(null);
  
  // State for liquidation stage
  const [liquidationStage, setLiquidationStage] = useState('assessment');
  
  // State for auction details
  const [auctionDetails, setAuctionDetails] = useState({
    startingBid: '',
    auctionDate: '',
    location: '',
    description: ''
  });
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get liquidation stages
  const getLiquidationStages = () => {
    return [
      { id: 'assessment', name: 'Assessment', description: 'Evaluate collateral condition and market value' },
      { id: 'notice', name: 'Notice', description: 'Send formal notice to borrower' },
      { id: 'preparation', name: 'Preparation', description: 'Prepare legal documents and marketing materials' },
      { id: 'auction', name: 'Auction', description: 'Conduct public auction or sealed bid process' },
      { id: 'settlement', name: 'Settlement', description: 'Complete sale and settle outstanding loan' }
    ];
  };
  
  // Get liquidation progress
  const getLiquidationProgress = (stage) => {
    const stages = getLiquidationStages();
    const currentIndex = stages.findIndex(s => s.id === stage);
    return ((currentIndex + 1) / stages.length) * 100;
  };
  
  // Handle auction details change
  const handleAuctionDetailsChange = (e) => {
    const { name, value } = e.target;
    setAuctionDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle auction form submit
  const handleAuctionFormSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would save the auction details to the server
    console.log('Saving auction details:', auctionDetails);
    
    // Move to next stage
    setLiquidationStage('auction');
  };
  
  // Get liquidation timeline
  const getLiquidationTimeline = () => {
    // In a real app, this would be fetched from the backend
    return [
      { stage: 'assessment', date: '2023-06-15', completed: true },
      { stage: 'notice', date: '2023-06-20', completed: true },
      { stage: 'preparation', date: '2023-07-05', completed: false },
      { stage: 'auction', date: '2023-07-25', completed: false },
      { stage: 'settlement', date: '2023-08-10', completed: false }
    ];
  };
  
  const liquidationStages = getLiquidationStages();
  const liquidationTimeline = getLiquidationTimeline();
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            <FiAlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Collateral Liquidation
          </h3>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="px-4 py-5 sm:p-6">
          {collaterals.length === 0 ? (
            <div className="text-center py-8">
              <FiCheckCircle className="mx-auto h-12 w-12 text-green-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Foreclosed Collateral</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are currently no collateral items in foreclosure.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Foreclosed Collateral List */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Foreclosed Collateral</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <ul className="divide-y divide-gray-200">
                    {collaterals.map((collateral) => (
                      <li 
                        key={collateral.id} 
                        className={`py-3 cursor-pointer hover:bg-gray-100 ${
                          selectedCollateral?.id === collateral.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedCollateral(collateral)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{collateral.description}</div>
                            <div className="text-xs text-gray-500">
                              {collateral.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | 
                              Owner: {collateral.memberName}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(collateral.estimatedValue)}
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between items-center">
                          <div className="text-xs text-gray-500">
                            Loan ID: {collateral.loanId}
                          </div>
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCollateral(collateral);
                            }}
                          >
                            Manage Liquidation
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Liquidation Workflow */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-4">Liquidation Workflow</h4>
                
                {selectedCollateral ? (
                  <div className="bg-gray-50 rounded-md p-4">
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-900">{selectedCollateral.description}</h5>
                      <p className="text-xs text-gray-500">
                        {selectedCollateral.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} | 
                        Estimated Value: {formatCurrency(selectedCollateral.estimatedValue)}
                      </p>
                    </div>
                    
                    {/* Liquidation Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Liquidation Progress</span>
                        <span className="text-xs font-medium text-gray-700">
                          {Math.round(getLiquidationProgress(liquidationStage))}%
                        </span>
                      </div>
                      <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                        <div 
                          style={{ width: `${getLiquidationProgress(liquidationStage)}%` }} 
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                        ></div>
                      </div>
                    </div>
                    
                    {/* Liquidation Stages */}
                    <div className="mb-6">
                      <h6 className="text-xs font-medium text-gray-700 mb-2">Liquidation Stages</h6>
                      <div className="space-y-3">
                        {liquidationStages.map((stage) => (
                          <div 
                            key={stage.id}
                            className={`p-3 rounded-md border ${
                              liquidationStage === stage.id 
                                ? 'border-blue-300 bg-blue-50' 
                                : 'border-gray-200'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center mr-3 ${
                                  liquidationTimeline.find(t => t.stage === stage.id)?.completed
                                    ? 'bg-green-100 text-green-600'
                                    : liquidationStage === stage.id
                                      ? 'bg-blue-100 text-blue-600'
                                      : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {liquidationTimeline.find(t => t.stage === stage.id)?.completed ? (
                                    <FiCheckCircle className="h-4 w-4" />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {liquidationStages.findIndex(s => s.id === stage.id) + 1}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{stage.name}</div>
                                  <div className="text-xs text-gray-500">{stage.description}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(liquidationTimeline.find(t => t.stage === stage.id)?.date)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stage-specific Actions */}
                    {liquidationStage === 'assessment' && (
                      <div className="border-t border-gray-200 pt-4">
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Assessment Actions</h6>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Schedule Property Inspection</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiCalendar className="mr-1 h-3 w-3" />
                              Schedule
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Request Updated Appraisal</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiDollarSign className="mr-1 h-3 w-3" />
                              Request
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Complete Assessment</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => setLiquidationStage('notice')}
                            >
                              <FiCheckCircle className="mr-1 h-3 w-3" />
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {liquidationStage === 'notice' && (
                      <div className="border-t border-gray-200 pt-4">
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Notice Actions</h6>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Generate Notice Letter</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Generate
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Send Notice to Borrower</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Send
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Complete Notice Stage</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => setLiquidationStage('preparation')}
                            >
                              <FiCheckCircle className="mr-1 h-3 w-3" />
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {liquidationStage === 'preparation' && (
                      <div className="border-t border-gray-200 pt-4">
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Preparation Actions</h6>
                        <form onSubmit={handleAuctionFormSubmit}>
                          <div className="space-y-3">
                            <div>
                              <label htmlFor="startingBid" className="block text-xs font-medium text-gray-700">
                                Starting Bid
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">₱</span>
                                </div>
                                <input
                                  type="number"
                                  name="startingBid"
                                  id="startingBid"
                                  value={auctionDetails.startingBid}
                                  onChange={handleAuctionDetailsChange}
                                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                  placeholder="0.00"
                                  required
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="auctionDate" className="block text-xs font-medium text-gray-700">
                                Auction Date
                              </label>
                              <input
                                type="date"
                                name="auctionDate"
                                id="auctionDate"
                                value={auctionDetails.auctionDate}
                                onChange={handleAuctionDetailsChange}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="location" className="block text-xs font-medium text-gray-700">
                                Location
                              </label>
                              <input
                                type="text"
                                name="location"
                                id="location"
                                value={auctionDetails.location}
                                onChange={handleAuctionDetailsChange}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                required
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                                Auction Description
                              </label>
                              <textarea
                                name="description"
                                id="description"
                                rows="3"
                                value={auctionDetails.description}
                                onChange={handleAuctionDetailsChange}
                                className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                required
                              ></textarea>
                            </div>
                            
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Schedule Auction
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    {liquidationStage === 'auction' && (
                      <div className="border-t border-gray-200 pt-4">
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Auction Details</h6>
                        <div className="bg-blue-50 rounded-md p-3 mb-4">
                          <div className="flex items-center mb-2">
                            <FiClock className="h-4 w-4 text-blue-500 mr-2" />
                            <span className="text-sm font-medium text-blue-700">
                              Auction Scheduled: {formatDate(auctionDetails.auctionDate)}
                            </span>
                          </div>
                          <div className="text-sm text-blue-600">
                            Starting Bid: {formatCurrency(auctionDetails.startingBid)}
                          </div>
                          <div className="text-sm text-blue-600">
                            Location: {auctionDetails.location}
                          </div>
                        </div>
                        
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Auction Actions</h6>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Record Auction Results</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Record
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Complete Auction</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              onClick={() => setLiquidationStage('settlement')}
                            >
                              <FiCheckCircle className="mr-1 h-3 w-3" />
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {liquidationStage === 'settlement' && (
                      <div className="border-t border-gray-200 pt-4">
                        <h6 className="text-xs font-medium text-gray-700 mb-2">Settlement Actions</h6>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Record Sale Amount</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FiDollarSign className="mr-1 h-3 w-3" />
                              Record
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Process Loan Settlement</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Process
                            </button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Complete Liquidation</span>
                            <button
                              type="button"
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                              <FiCheckCircle className="mr-1 h-3 w-3" />
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-md p-8 text-center">
                    <FiAlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No Collateral Selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a foreclosed collateral item from the list to manage its liquidation process.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollateralLiquidation;
