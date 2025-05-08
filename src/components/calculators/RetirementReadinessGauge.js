'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Retirement Readiness Gauge Component
 * 
 * A visual gauge that shows how prepared the user is for retirement
 * based on their projected savings vs. required savings.
 */
const RetirementReadinessGauge = ({ 
  projectedSavings, 
  requiredSavings 
}) => {
  const canvasRef = useRef(null);
  
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Calculate readiness percentage
  const calculateReadinessPercentage = () => {
    if (requiredSavings <= 0) return 100;
    const percentage = (projectedSavings / requiredSavings) * 100;
    return Math.min(100, Math.max(0, percentage));
  };
  
  // Get readiness status and color
  const getReadinessStatus = (percentage) => {
    if (percentage >= 90) {
      return { status: 'Excellent', color: '#10b981' }; // Green
    } else if (percentage >= 75) {
      return { status: 'Good', color: '#6366f1' }; // Indigo
    } else if (percentage >= 50) {
      return { status: 'Fair', color: '#f59e0b' }; // Amber
    } else if (percentage >= 25) {
      return { status: 'Needs Attention', color: '#f97316' }; // Orange
    } else {
      return { status: 'Critical', color: '#ef4444' }; // Red
    }
  };
  
  // Draw the gauge
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate readiness percentage
    const readinessPercentage = calculateReadinessPercentage();
    const { status, color } = getReadinessStatus(readinessPercentage);
    
    // Gauge dimensions
    const centerX = canvas.width / 2;
    const centerY = canvas.height - 30;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Draw gauge background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
    ctx.lineWidth = 20;
    ctx.strokeStyle = '#e5e7eb';
    ctx.stroke();
    
    // Draw gauge value
    ctx.beginPath();
    const startAngle = Math.PI;
    const endAngle = Math.PI - (Math.PI * (readinessPercentage / 100));
    ctx.arc(centerX, centerY, radius, startAngle, endAngle, true);
    ctx.lineWidth = 20;
    ctx.strokeStyle = color;
    ctx.stroke();
    
    // Draw gauge center point
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#6b7280';
    ctx.fill();
    
    // Draw gauge ticks
    for (let i = 0; i <= 10; i++) {
      const angle = Math.PI - (Math.PI * (i / 10));
      const tickLength = i % 5 === 0 ? 15 : 7;
      
      const startX = centerX + Math.cos(angle) * (radius - 10);
      const startY = centerY + Math.sin(angle) * (radius - 10);
      const endX = centerX + Math.cos(angle) * (radius - 10 - tickLength);
      const endY = centerY + Math.sin(angle) * (radius - 10 - tickLength);
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = i % 5 === 0 ? 2 : 1;
      ctx.strokeStyle = '#6b7280';
      ctx.stroke();
      
      // Draw tick labels for major ticks
      if (i % 5 === 0) {
        const labelX = centerX + Math.cos(angle) * (radius - 35);
        const labelY = centerY + Math.sin(angle) * (radius - 35);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#6b7280';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${i * 10}%`, labelX, labelY);
      }
    }
    
    // Draw gauge needle
    const needleLength = radius - 20;
    const needleAngle = Math.PI - (Math.PI * (readinessPercentage / 100));
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * needleLength,
      centerY + Math.sin(needleAngle) * needleLength
    );
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1f2937';
    ctx.stroke();
    
    // Draw gauge value text
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(readinessPercentage)}%`, centerX, centerY - radius / 2);
    
    // Draw gauge status text
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#1f2937';
    ctx.fillText(status, centerX, centerY - radius / 2 + 30);
    
    // Draw gauge title
    ctx.font = 'bold 14px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('Retirement Readiness', centerX, 20);
    
    // Draw savings comparison
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'left';
    ctx.fillText(`Projected: ${formatCurrency(projectedSavings)}`, 20, canvas.height - 20);
    
    ctx.textAlign = 'right';
    ctx.fillText(`Required: ${formatCurrency(requiredSavings)}`, canvas.width - 20, canvas.height - 20);
    
  }, [projectedSavings, requiredSavings]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="relative">
        <canvas ref={canvasRef} width={300} height={200} className="w-full" />
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Retirement Readiness Assessment</h3>
        <p className="text-sm text-gray-600">
          This gauge shows how prepared you are for retirement based on your projected savings compared to your required savings.
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-xs text-gray-600">90-100%: Excellent - You're on track for a comfortable retirement</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></span>
            <span className="text-xs text-gray-600">75-89%: Good - You're making good progress</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-amber-500 rounded-full mr-2"></span>
            <span className="text-xs text-gray-600">50-74%: Fair - Consider increasing your contributions</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
            <span className="text-xs text-gray-600">25-49%: Needs Attention - You may need to make significant changes</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span className="text-xs text-gray-600">0-24%: Critical - Immediate action recommended</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementReadinessGauge;
