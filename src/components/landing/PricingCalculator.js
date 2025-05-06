import React, { useState, useEffect } from 'react';
import { trackEvent } from '@/utils/analytics';

const PricingCalculator = () => {
  // State for calculator inputs
  const [memberCount, setMemberCount] = useState(500);
  const [features, setFeatures] = useState({
    loanManagement: true,
    savingsAccounts: true,
    mobileAccess: true,
    reporting: true,
    security: false,
    customization: false,
  });
  const [plan, setPlan] = useState('standard');
  
  // State for calculated price
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [yearlyPrice, setYearlyPrice] = useState(0);
  const [savings, setSavings] = useState(0);

  // Feature pricing
  const featurePricing = {
    loanManagement: { base: 50, perMember: 0.1 },
    savingsAccounts: { base: 50, perMember: 0.1 },
    mobileAccess: { base: 30, perMember: 0.05 },
    reporting: { base: 40, perMember: 0.05 },
    security: { base: 60, perMember: 0.08 },
    customization: { base: 100, perMember: 0.02 },
  };

  // Plan multipliers
  const planMultipliers = {
    basic: 0.8,
    standard: 1.0,
    premium: 1.3,
  };

  // Calculate price based on inputs
  useEffect(() => {
    // Calculate base price from selected features
    let basePrice = 0;
    let perMemberPrice = 0;

    Object.keys(features).forEach((feature) => {
      if (features[feature]) {
        basePrice += featurePricing[feature].base;
        perMemberPrice += featurePricing[feature].perMember;
      }
    });

    // Apply member count
    const rawMonthlyPrice = basePrice + (perMemberPrice * memberCount);
    
    // Apply plan multiplier
    const adjustedMonthlyPrice = rawMonthlyPrice * planMultipliers[plan];
    
    // Calculate yearly price (10% discount)
    const calculatedYearlyPrice = adjustedMonthlyPrice * 12 * 0.9;
    
    // Calculate savings
    const calculatedSavings = (adjustedMonthlyPrice * 12) - calculatedYearlyPrice;
    
    // Update state with formatted prices
    setMonthlyPrice(Math.round(adjustedMonthlyPrice));
    setYearlyPrice(Math.round(calculatedYearlyPrice));
    setSavings(Math.round(calculatedSavings));
  }, [memberCount, features, plan]);

  // Handle member count change
  const handleMemberCountChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setMemberCount(value);
    
    // Track event
    trackEvent('Pricing Calculator', 'Member Count Changed', 'Member Count', value);
  };

  // Handle feature toggle
  const handleFeatureToggle = (feature) => {
    setFeatures({
      ...features,
      [feature]: !features[feature],
    });
    
    // Track event
    trackEvent('Pricing Calculator', 'Feature Toggled', feature, features[feature] ? 0 : 1);
  };

  // Handle plan change
  const handlePlanChange = (newPlan) => {
    setPlan(newPlan);
    
    // Track event
    trackEvent('Pricing Calculator', 'Plan Changed', newPlan);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Pricing Calculator</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Inputs */}
          <div>
            {/* Member Count Slider */}
            <div className="mb-6">
              <label htmlFor="member-count" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Members: <span className="font-bold">{memberCount.toLocaleString()}</span>
              </label>
              <input
                id="member-count"
                type="range"
                min="100"
                max="10000"
                step="100"
                value={memberCount}
                onChange={handleMemberCountChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>100</span>
                <span>5,000</span>
                <span>10,000</span>
              </div>
            </div>
            
            {/* Plan Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Plan
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    plan === 'basic'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                  onClick={() => handlePlanChange('basic')}
                >
                  Basic
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    plan === 'standard'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                  onClick={() => handlePlanChange('standard')}
                >
                  Standard
                </button>
                <button
                  type="button"
                  className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    plan === 'premium'
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                  onClick={() => handlePlanChange('premium')}
                >
                  Premium
                </button>
              </div>
            </div>
            
            {/* Features Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Features
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="feature-loan"
                    type="checkbox"
                    checked={features.loanManagement}
                    onChange={() => handleFeatureToggle('loanManagement')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="feature-loan" className="ml-3 text-sm text-gray-700">
                    Loan Management
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="feature-savings"
                    type="checkbox"
                    checked={features.savingsAccounts}
                    onChange={() => handleFeatureToggle('savingsAccounts')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="feature-savings" className="ml-3 text-sm text-gray-700">
                    Savings Accounts
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="feature-mobile"
                    type="checkbox"
                    checked={features.mobileAccess}
                    onChange={() => handleFeatureToggle('mobileAccess')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="feature-mobile" className="ml-3 text-sm text-gray-700">
                    Mobile Access
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="feature-reporting"
                    type="checkbox"
                    checked={features.reporting}
                    onChange={() => handleFeatureToggle('reporting')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="feature-reporting" className="ml-3 text-sm text-gray-700">
                    Reporting & Analytics
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="feature-security"
                    type="checkbox"
                    checked={features.security}
                    onChange={() => handleFeatureToggle('security')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="feature-security" className="ml-3 text-sm text-gray-700">
                    Advanced Security
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="feature-customization"
                    type="checkbox"
                    checked={features.customization}
                    onChange={() => handleFeatureToggle('customization')}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="feature-customization" className="ml-3 text-sm text-gray-700">
                    White-Label Customization
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Price Display */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="text-center mb-6">
              <h4 className="text-lg font-medium text-gray-700 mb-1">Estimated Price</h4>
              <p className="text-sm text-gray-500">
                Based on your selections
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Monthly Price */}
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Monthly</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">₱{monthlyPrice.toLocaleString()}</span>
                    <span className="text-gray-500 text-sm">/month</span>
                  </div>
                </div>
              </div>
              
              {/* Yearly Price */}
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-blue-700">Yearly</span>
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">Save 10%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-700">₱{yearlyPrice.toLocaleString()}</span>
                    <span className="text-blue-600 text-sm">/year</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-blue-600">
                  You save: ₱{savings.toLocaleString()} per year
                </div>
              </div>
              
              {/* Note */}
              <div className="text-xs text-gray-500 italic">
                * This is an estimate. Contact our sales team for a detailed quote tailored to your specific needs.
              </div>
              
              {/* CTA Button */}
              <button
                type="button"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                onClick={() => trackEvent('Pricing Calculator', 'CTA Click', 'Get Custom Quote')}
              >
                Get Custom Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
