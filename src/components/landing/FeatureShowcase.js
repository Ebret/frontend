import React, { useState } from 'react';
import Image from 'next/image';
import LazyLoad from '@/components/performance/LazyLoad';

const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState('loans');

  const features = {
    loans: {
      title: 'Loan Management',
      description: 'Streamline the entire loan lifecycle from application to disbursement and repayment tracking with automated workflows.',
      image: '/images/features/loan-management.png',
      alt: 'Loan Management Dashboard',
      highlights: [
        'Automated loan application processing',
        'Customizable loan products and terms',
        'Real-time loan status tracking',
        'Automated payment reminders',
        'Comprehensive repayment schedules'
      ]
    },
    savings: {
      title: 'Savings Accounts',
      description: 'Manage various types of savings accounts with automated interest calculations and detailed member statements.',
      image: '/images/features/savings-accounts.png',
      alt: 'Savings Account Dashboard',
      highlights: [
        'Multiple account types support',
        'Automated interest calculations',
        'Detailed transaction history',
        'Scheduled deposits and withdrawals',
        'Goal-based savings features'
      ]
    },
    reporting: {
      title: 'Reporting & Analytics',
      description: 'Generate comprehensive reports and gain insights into your cooperative\'s financial performance with advanced analytics.',
      image: '/images/features/reporting-analytics.png',
      alt: 'Reporting and Analytics Dashboard',
      highlights: [
        'Customizable report templates',
        'Real-time financial dashboards',
        'Trend analysis and forecasting',
        'Regulatory compliance reporting',
        'Export options (PDF, Excel, CSV)'
      ]
    },
    mobile: {
      title: 'Mobile Access',
      description: 'Provide members with secure mobile access to their accounts, loan applications, and transaction history anytime, anywhere.',
      image: '/images/features/mobile-access.png',
      alt: 'Mobile App Interface',
      highlights: [
        'Responsive web application',
        'Native mobile app experience',
        'Biometric authentication',
        'Offline transaction capability',
        'Push notifications for important updates'
      ]
    }
  };

  const activeFeature = features[activeTab];

  // Placeholder for when image is loading
  const imagePlaceholder = (
    <div className="bg-gray-200 animate-pulse rounded-lg w-full h-full min-h-[300px]"></div>
  );

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {Object.keys(features).map((key) => (
          <button
            key={key}
            className={`flex-1 py-4 px-4 text-center font-medium text-sm sm:text-base transition-colors ${
              activeTab === key
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab(key)}
            aria-selected={activeTab === key}
            role="tab"
          >
            {features[key].title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {activeFeature.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeFeature.description}
            </p>
            
            <ul className="space-y-3">
              {activeFeature.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start">
                  <svg
                    className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <LazyLoad placeholder={imagePlaceholder} className="rounded-lg overflow-hidden shadow-lg">
              {/* Using a placeholder image since we don't have the actual feature images */}
              <div className="bg-gray-200 rounded-lg w-full h-full min-h-[300px] flex items-center justify-center">
                <p className="text-gray-500 text-center p-4">
                  {activeFeature.alt}
                  <br />
                  <span className="text-sm">(Placeholder for {activeFeature.image})</span>
                </p>
              </div>
            </LazyLoad>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
