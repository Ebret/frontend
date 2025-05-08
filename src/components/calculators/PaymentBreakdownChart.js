'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Payment Breakdown Chart Component
 * 
 * A visual representation of the loan payment breakdown showing
 * the proportion of principal, interest, and fees.
 */
const PaymentBreakdownChart = ({ 
  loanAmount, 
  totalInterest, 
  processingFee, 
  insuranceFee 
}) => {
  const canvasRef = useRef(null);
  
  // Calculate total payment
  const totalPayment = loanAmount + totalInterest;
  const totalFees = processingFee + insuranceFee;
  
  // Calculate percentages
  const principalPercentage = (loanAmount / (totalPayment + totalFees)) * 100;
  const interestPercentage = (totalInterest / (totalPayment + totalFees)) * 100;
  const feesPercentage = (totalFees / (totalPayment + totalFees)) * 100;
  
  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Draw the pie chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Define colors
    const colors = {
      principal: '#3b82f6', // Blue
      interest: '#ef4444',  // Red
      fees: '#f59e0b'       // Amber
    };
    
    // Draw pie chart
    let startAngle = 0;
    
    // Draw principal slice
    const principalAngle = (principalPercentage / 100) * 2 * Math.PI;
    ctx.fillStyle = colors.principal;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + principalAngle);
    ctx.closePath();
    ctx.fill();
    
    startAngle += principalAngle;
    
    // Draw interest slice
    const interestAngle = (interestPercentage / 100) * 2 * Math.PI;
    ctx.fillStyle = colors.interest;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + interestAngle);
    ctx.closePath();
    ctx.fill();
    
    startAngle += interestAngle;
    
    // Draw fees slice
    const feesAngle = (feesPercentage / 100) * 2 * Math.PI;
    ctx.fillStyle = colors.fees;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, startAngle + feesAngle);
    ctx.closePath();
    ctx.fill();
    
    // Draw center circle (optional, for donut chart)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.5, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    
    // Add text in center
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Payment', centerX, centerY - 10);
    ctx.fillText('Breakdown', centerX, centerY + 10);
    
  }, [loanAmount, totalInterest, processingFee, insuranceFee]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Breakdown</h3>
      
      <div className="flex flex-col md:flex-row items-center">
        <div className="relative">
          <canvas ref={canvasRef} width={200} height={200} />
        </div>
        
        <div className="mt-6 md:mt-0 md:ml-8 flex-1">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-gray-700">Principal:</span>
              <span className="ml-auto font-medium">{formatCurrency(loanAmount)} ({principalPercentage.toFixed(1)}%)</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span>
              <span className="text-gray-700">Interest:</span>
              <span className="ml-auto font-medium">{formatCurrency(totalInterest)} ({interestPercentage.toFixed(1)}%)</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-4 h-4 bg-amber-500 rounded-full mr-2"></span>
              <span className="text-gray-700">Fees:</span>
              <span className="ml-auto font-medium">{formatCurrency(totalFees)} ({feesPercentage.toFixed(1)}%)</span>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center font-bold">
                <span className="text-gray-700">Total Cost:</span>
                <span className="ml-auto">{formatCurrency(totalPayment + totalFees)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentBreakdownChart;
