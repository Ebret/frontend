import React, { useState } from 'react';
import { trackEvent } from '@/utils/analytics';

const FeatureComparisonTable = () => {
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Plans data
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '₱4,999',
      period: '/month',
      description: 'Essential features for small cooperatives',
      memberLimit: 'Up to 500 members',
      highlight: false,
      cta: 'Get Started',
    },
    {
      id: 'standard',
      name: 'Standard',
      price: '₱9,999',
      period: '/month',
      description: 'Complete solution for growing cooperatives',
      memberLimit: 'Up to 2,000 members',
      highlight: true,
      cta: 'Start Free Trial',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '₱19,999',
      period: '/month',
      description: 'Advanced features for large cooperatives',
      memberLimit: 'Up to 10,000 members',
      highlight: false,
      cta: 'Contact Sales',
    },
  ];

  // Feature categories
  const featureCategories = [
    {
      name: 'Core Features',
      features: [
        {
          name: 'Loan Management',
          basic: true,
          standard: true,
          premium: true,
          tooltip: 'Process loan applications, approvals, disbursements, and repayments',
        },
        {
          name: 'Savings Accounts',
          basic: true,
          standard: true,
          premium: true,
          tooltip: 'Manage various types of savings accounts with automated interest calculations',
        },
        {
          name: 'Member Portal',
          basic: true,
          standard: true,
          premium: true,
          tooltip: 'Self-service portal for members to view accounts and transactions',
        },
        {
          name: 'Basic Reporting',
          basic: true,
          standard: true,
          premium: true,
          tooltip: 'Standard reports for loans, savings, and member information',
        },
      ],
    },
    {
      name: 'Advanced Features',
      features: [
        {
          name: 'Mobile Access',
          basic: false,
          standard: true,
          premium: true,
          tooltip: 'Mobile app for members to access accounts and services on the go',
        },
        {
          name: 'Advanced Reporting',
          basic: false,
          standard: true,
          premium: true,
          tooltip: 'Comprehensive reporting with customizable dashboards and analytics',
        },
        {
          name: 'Document Management',
          basic: false,
          standard: true,
          premium: true,
          tooltip: 'Store and manage digital documents with version control',
        },
        {
          name: 'Multi-branch Support',
          basic: false,
          standard: false,
          premium: true,
          tooltip: 'Support for multiple branches with consolidated reporting',
        },
      ],
    },
    {
      name: 'Security & Compliance',
      features: [
        {
          name: 'Role-based Access Control',
          basic: true,
          standard: true,
          premium: true,
          tooltip: 'Control access to features and data based on user roles',
        },
        {
          name: 'Data Encryption',
          basic: true,
          standard: true,
          premium: true,
          tooltip: 'Encrypt sensitive data at rest and in transit',
        },
        {
          name: 'Audit Trails',
          basic: false,
          standard: true,
          premium: true,
          tooltip: 'Track all user actions for security and compliance',
        },
        {
          name: 'Multi-factor Authentication',
          basic: false,
          standard: false,
          premium: true,
          tooltip: 'Additional security layer requiring multiple verification methods',
        },
      ],
    },
    {
      name: 'Support & Services',
      features: [
        {
          name: 'Email Support',
          basic: true,
          standard: true,
          premium: true,
          tooltip: 'Support via email during business hours',
        },
        {
          name: 'Phone Support',
          basic: false,
          standard: true,
          premium: true,
          tooltip: 'Support via phone during business hours',
        },
        {
          name: 'Priority Support',
          basic: false,
          standard: false,
          premium: true,
          tooltip: 'Priority response times and dedicated support representative',
        },
        {
          name: 'Onboarding & Training',
          basic: 'Basic',
          standard: 'Standard',
          premium: 'Premium',
          tooltip: 'Training and onboarding services for staff and administrators',
        },
      ],
    },
  ];

  // Additional features (hidden by default)
  const additionalFeatureCategories = [
    {
      name: 'Customization',
      features: [
        {
          name: 'White-label Branding',
          basic: false,
          standard: true,
          premium: true,
          tooltip: 'Customize the platform with your cooperative\'s branding',
        },
        {
          name: 'Custom Loan Products',
          basic: '2 types',
          standard: '5 types',
          premium: 'Unlimited',
          tooltip: 'Create and configure custom loan products with different terms',
        },
        {
          name: 'Custom Workflows',
          basic: false,
          standard: 'Basic',
          premium: 'Advanced',
          tooltip: 'Customize approval workflows and business processes',
        },
        {
          name: 'API Access',
          basic: false,
          standard: false,
          premium: true,
          tooltip: 'Access to APIs for integration with other systems',
        },
      ],
    },
    {
      name: 'Additional Services',
      features: [
        {
          name: 'SMS Notifications',
          basic: false,
          standard: 'Add-on',
          premium: 'Included',
          tooltip: 'Send SMS notifications to members for important updates',
        },
        {
          name: 'Payment Gateway',
          basic: 'Add-on',
          standard: 'Add-on',
          premium: 'Included',
          tooltip: 'Integration with payment gateways for online payments',
        },
        {
          name: 'Data Migration',
          basic: 'Add-on',
          standard: 'Basic Included',
          premium: 'Premium Included',
          tooltip: 'Migration of data from existing systems',
        },
        {
          name: 'Custom Development',
          basic: false,
          standard: 'Add-on',
          premium: 'Discounted',
          tooltip: 'Custom development services for specific requirements',
        },
      ],
    },
  ];

  // All feature categories (core + additional)
  const allFeatureCategories = showAllFeatures
    ? [...featureCategories, ...additionalFeatureCategories]
    : featureCategories;

  // Handle plan selection
  const handlePlanSelect = (planId) => {
    setSelectedPlan(planId);
    trackEvent('Feature Comparison', 'Plan Selected', planId);
  };

  // Handle show all features toggle
  const handleShowAllFeatures = () => {
    setShowAllFeatures(!showAllFeatures);
    trackEvent('Feature Comparison', 'Toggle All Features', !showAllFeatures ? 'Show All' : 'Show Less');
  };

  // Handle CTA click
  const handleCtaClick = (planId) => {
    trackEvent('Feature Comparison', 'CTA Click', planId);
  };

  // Render check mark or text based on feature availability
  const renderFeatureValue = (value) => {
    if (value === true) {
      return (
        <svg className="w-5 h-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    } else if (value === false) {
      return (
        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    } else {
      return <span className="text-sm text-gray-700">{value}</span>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Compare Plans</h3>
        
        {/* Plan Selection Tabs */}
        <div className="flex flex-wrap justify-center mb-8">
          {plans.map((plan) => (
            <button
              key={plan.id}
              className={`px-6 py-3 text-sm font-medium rounded-md transition-colors mx-2 mb-2 ${
                selectedPlan === plan.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.name}
            </button>
          ))}
        </div>
        
        {/* Selected Plan Details */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h4 className="text-xl font-bold text-blue-800 mb-2">
              {plans.find(p => p.id === selectedPlan).name} Plan
            </h4>
            <div className="text-3xl font-bold text-blue-900 mb-1">
              {plans.find(p => p.id === selectedPlan).price}
              <span className="text-lg font-medium text-blue-700">
                {plans.find(p => p.id === selectedPlan).period}
              </span>
            </div>
            <p className="text-blue-700 mb-4">
              {plans.find(p => p.id === selectedPlan).description}
            </p>
            <p className="text-sm text-blue-600 mb-6">
              {plans.find(p => p.id === selectedPlan).memberLimit}
            </p>
            <button
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => handleCtaClick(selectedPlan)}
            >
              {plans.find(p => p.id === selectedPlan).cta}
            </button>
          </div>
        </div>
        
        {/* Feature Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 w-1/3">
                  Feature
                </th>
                {plans.map((plan) => (
                  <th
                    key={plan.id}
                    className={`py-3 px-4 text-center text-sm font-medium uppercase tracking-wider border-b border-gray-200 ${
                      selectedPlan === plan.id ? 'bg-blue-50 text-blue-800' : 'text-gray-500'
                    }`}
                  >
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allFeatureCategories.map((category, categoryIndex) => (
                <React.Fragment key={category.name}>
                  {/* Category Header */}
                  <tr className="bg-gray-50">
                    <td
                      colSpan={plans.length + 1}
                      className="py-2 px-4 text-sm font-medium text-gray-700 border-b border-gray-200"
                    >
                      {category.name}
                    </td>
                  </tr>
                  
                  {/* Features */}
                  {category.features.map((feature, featureIndex) => (
                    <tr
                      key={`${category.name}-${feature.name}`}
                      className={`hover:bg-gray-50 ${
                        featureIndex === category.features.length - 1 && categoryIndex !== allFeatureCategories.length - 1
                          ? 'border-b border-gray-200'
                          : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-sm text-gray-800 border-b border-gray-100 relative group">
                        {feature.name}
                        {feature.tooltip && (
                          <div className="hidden group-hover:block absolute z-10 left-0 top-full mt-1 w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg">
                            {feature.tooltip}
                          </div>
                        )}
                      </td>
                      {plans.map((plan) => (
                        <td
                          key={`${feature.name}-${plan.id}`}
                          className={`py-3 px-4 text-center border-b border-gray-100 ${
                            selectedPlan === plan.id ? 'bg-blue-50' : ''
                          }`}
                        >
                          {renderFeatureValue(feature[plan.id])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Show All Features Toggle */}
        <div className="mt-6 text-center">
          <button
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mx-auto"
            onClick={handleShowAllFeatures}
          >
            {showAllFeatures ? 'Show Less Features' : 'Show All Features'}
            <svg
              className={`ml-1 h-4 w-4 transform transition-transform ${
                showAllFeatures ? 'rotate-180' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* Contact CTA */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Need a custom plan for your specific requirements?
          </p>
          <button
            className="px-6 py-2 bg-gray-800 text-white font-medium rounded-md hover:bg-gray-700 transition-colors"
            onClick={() => trackEvent('Feature Comparison', 'Contact for Custom Plan')}
          >
            Contact for Custom Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureComparisonTable;
