'use client';

import React, { useState } from 'react';
import { FiPieChart, FiBarChart2, FiCreditCard, FiCalendar, FiActivity } from 'react-icons/fi';

/**
 * Member Segmentation Component
 * 
 * Displays member segmentation by different criteria:
 * - Membership type
 * - Product usage
 * - Credit score
 * - Tenure
 * - Activity level
 * 
 * @param {Array} members - Array of member objects
 */
const MemberSegmentation = ({ members }) => {
  // State for active segmentation view
  const [activeSegment, setActiveSegment] = useState('membership');
  
  // Calculate membership type segmentation
  const getMembershipSegmentation = () => {
    const segments = {};
    
    members.forEach(member => {
      const type = member.membershipType;
      segments[type] = (segments[type] || 0) + 1;
    });
    
    return Object.entries(segments).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: (count / members.length) * 100
    }));
  };
  
  // Calculate product usage segmentation
  const getProductSegmentation = () => {
    const products = {
      savings: 0,
      loan: 0,
      time_deposit: 0,
      insurance: 0,
      investment: 0
    };
    
    members.forEach(member => {
      member.products.forEach(product => {
        if (products[product] !== undefined) {
          products[product]++;
        }
      });
    });
    
    return Object.entries(products).map(([product, count]) => ({
      name: product.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      percentage: (count / members.length) * 100
    }));
  };
  
  // Calculate credit score segmentation
  const getCreditScoreSegmentation = () => {
    const segments = {
      excellent: 0, // 90-100
      good: 0,      // 80-89
      fair: 0,      // 60-79
      poor: 0,      // 40-59
      bad: 0        // 0-39
    };
    
    members.forEach(member => {
      const score = member.creditScore;
      
      if (score >= 90) segments.excellent++;
      else if (score >= 80) segments.good++;
      else if (score >= 60) segments.fair++;
      else if (score >= 40) segments.poor++;
      else segments.bad++;
    });
    
    return Object.entries(segments).map(([category, count]) => ({
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count,
      percentage: (count / members.length) * 100
    }));
  };
  
  // Calculate tenure segmentation
  const getTenureSegmentation = () => {
    const segments = {
      'Less than 1 year': 0,
      '1-2 years': 0,
      '2-5 years': 0,
      '5+ years': 0
    };
    
    const today = new Date();
    
    members.forEach(member => {
      const joinDate = new Date(member.joinDate);
      const yearDiff = today.getFullYear() - joinDate.getFullYear();
      
      if (yearDiff < 1) segments['Less than 1 year']++;
      else if (yearDiff < 2) segments['1-2 years']++;
      else if (yearDiff < 5) segments['2-5 years']++;
      else segments['5+ years']++;
    });
    
    return Object.entries(segments).map(([category, count]) => ({
      name: category,
      count,
      percentage: (count / members.length) * 100
    }));
  };
  
  // Calculate activity level segmentation
  const getActivitySegmentation = () => {
    const segments = {
      'Very Active': 0,   // Activity in last 7 days
      'Active': 0,        // Activity in last 30 days
      'Occasional': 0,    // Activity in last 90 days
      'Inactive': 0       // No activity in 90+ days
    };
    
    const today = new Date();
    const day = 24 * 60 * 60 * 1000; // milliseconds in a day
    
    members.forEach(member => {
      const lastActivity = new Date(member.lastActivity);
      const dayDiff = Math.round((today - lastActivity) / day);
      
      if (dayDiff <= 7) segments['Very Active']++;
      else if (dayDiff <= 30) segments['Active']++;
      else if (dayDiff <= 90) segments['Occasional']++;
      else segments['Inactive']++;
    });
    
    return Object.entries(segments).map(([category, count]) => ({
      name: category,
      count,
      percentage: (count / members.length) * 100
    }));
  };
  
  // Get active segmentation data
  const getActiveSegmentData = () => {
    switch (activeSegment) {
      case 'membership':
        return getMembershipSegmentation();
      case 'products':
        return getProductSegmentation();
      case 'creditScore':
        return getCreditScoreSegmentation();
      case 'tenure':
        return getTenureSegmentation();
      case 'activity':
        return getActivitySegmentation();
      default:
        return [];
    }
  };
  
  // Get segment color
  const getSegmentColor = (index) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    
    return colors[index % colors.length];
  };
  
  // Get segment icon
  const getSegmentIcon = () => {
    switch (activeSegment) {
      case 'membership':
        return <FiPieChart className="h-5 w-5" />;
      case 'products':
        return <FiCreditCard className="h-5 w-5" />;
      case 'creditScore':
        return <FiBarChart2 className="h-5 w-5" />;
      case 'tenure':
        return <FiCalendar className="h-5 w-5" />;
      case 'activity':
        return <FiActivity className="h-5 w-5" />;
      default:
        return <FiPieChart className="h-5 w-5" />;
    }
  };
  
  const segmentData = getActiveSegmentData();
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2 text-gray-500">
            {getSegmentIcon()}
          </div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Member Segmentation
          </h3>
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setActiveSegment('membership')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeSegment === 'membership'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Membership
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('products')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeSegment === 'products'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('creditScore')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeSegment === 'creditScore'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Credit Score
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('tenure')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeSegment === 'tenure'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tenure
          </button>
          <button
            type="button"
            onClick={() => setActiveSegment('activity')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md ${
              activeSegment === 'activity'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Activity
          </button>
        </div>
      </div>
      
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col md:flex-row">
          {/* Bar Chart */}
          <div className="flex-1 min-h-[200px] flex items-end space-x-4 justify-center">
            {segmentData.map((segment, index) => (
              <div key={segment.name} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">{segment.percentage.toFixed(1)}%</div>
                <div 
                  className={`${getSegmentColor(index)} rounded-t w-16`} 
                  style={{ height: `${Math.max(segment.percentage, 5)}%` }}
                ></div>
                <div className="text-xs font-medium text-gray-700 mt-2 w-16 text-center truncate" title={segment.name}>
                  {segment.name}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="md:w-64 mt-6 md:mt-0 md:ml-6 flex flex-col justify-center">
            <h4 className="text-sm font-medium text-gray-900 mb-4">
              {activeSegment.charAt(0).toUpperCase() + activeSegment.slice(1)} Breakdown
            </h4>
            <div className="space-y-3">
              {segmentData.map((segment, index) => (
                <div key={segment.name} className="flex items-center">
                  <div className={`h-3 w-3 ${getSegmentColor(index)} rounded-full mr-2`}></div>
                  <div className="text-sm text-gray-700 flex-1">{segment.name}</div>
                  <div className="text-sm font-medium text-gray-900">{segment.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberSegmentation;
