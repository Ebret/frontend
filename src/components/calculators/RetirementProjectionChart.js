'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Retirement Projection Chart Component
 * 
 * A visual representation of retirement savings over time showing
 * the accumulation phase and withdrawal phase.
 */
const RetirementProjectionChart = ({ 
  currentAge, 
  retirementAge, 
  lifeExpectancy, 
  currentSavings, 
  monthlyContribution, 
  annualReturnRate, 
  inflationRate,
  desiredMonthlyIncome
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
  
  // Calculate retirement projection data for the chart
  const calculateRetirementProjection = () => {
    const data = [];
    
    // Calculate years until retirement
    const yearsUntilRetirement = retirementAge - currentAge;
    
    // Calculate years in retirement
    const yearsInRetirement = lifeExpectancy - retirementAge;
    
    // Calculate total years to project
    const totalYears = yearsUntilRetirement + yearsInRetirement;
    
    // Initialize variables
    let age = currentAge;
    let savings = currentSavings;
    let isRetired = false;
    
    // Generate data points for each year
    for (let year = 0; year <= totalYears; year++) {
      // Check if retired
      if (age >= retirementAge) {
        isRetired = true;
      }
      
      // Add data point for current age
      data.push({
        age,
        savings,
        isRetired
      });
      
      // Update age for next iteration
      age++;
      
      // If not retired, add contributions and calculate returns
      if (!isRetired) {
        // Add annual contributions
        const annualContribution = monthlyContribution * 12;
        savings += annualContribution;
        
        // Calculate investment returns
        const returns = savings * (annualReturnRate / 100);
        savings += returns;
      } 
      // If retired, subtract withdrawals and calculate returns
      else {
        // Calculate annual withdrawal (adjusted for inflation)
        const yearsRetired = age - retirementAge;
        const inflationFactor = Math.pow(1 + inflationRate / 100, yearsRetired);
        const annualWithdrawal = desiredMonthlyIncome * 12 * inflationFactor;
        
        // Subtract withdrawal
        savings -= annualWithdrawal;
        
        // Calculate investment returns
        const returns = Math.max(0, savings) * (annualReturnRate / 100);
        savings += returns;
        
        // Ensure savings don't go below zero
        savings = Math.max(0, savings);
      }
    }
    
    return data;
  };
  
  // Draw the chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const projectionData = calculateRetirementProjection();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const chartWidth = canvas.width - 80; // Leave space for y-axis labels
    const chartHeight = canvas.height - 60; // Leave space for x-axis labels
    const chartX = 70; // X-axis starting position
    const chartY = 20; // Y-axis starting position
    
    // Find maximum value for scaling
    const maxValue = Math.max(...projectionData.map(d => d.savings));
    const scaleFactor = chartHeight / maxValue;
    
    // Colors
    const accumulationColor = '#4f46e5'; // Indigo
    const withdrawalColor = '#7c3aed'; // Purple
    const retirementLineColor = '#ef4444'; // Red
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX, chartY + chartHeight);
    
    // X-axis
    ctx.moveTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
    ctx.stroke();
    
    // Draw Y-axis labels and grid lines
    const yLabelCount = 5;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = '12px Arial';
    ctx.fillStyle = '#6b7280';
    
    for (let i = 0; i <= yLabelCount; i++) {
      const y = chartY + chartHeight - (i * chartHeight / yLabelCount);
      const value = (i * maxValue / yLabelCount);
      
      // Grid line
      ctx.beginPath();
      ctx.strokeStyle = '#e5e7eb';
      ctx.moveTo(chartX, y);
      ctx.lineTo(chartX + chartWidth, y);
      ctx.stroke();
      
      // Label
      ctx.fillText(formatCurrency(value), chartX - 10, y);
    }
    
    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    // Determine step size for x-axis labels
    const xLabelStep = Math.ceil(projectionData.length / 10);
    
    projectionData.forEach((data, index) => {
      // Only draw labels at intervals
      if (index % xLabelStep === 0 || data.age === retirementAge) {
        const x = chartX + (index * chartWidth / projectionData.length);
        
        // Draw age label
        ctx.fillStyle = '#6b7280';
        ctx.fillText(`${data.age}`, x, chartY + chartHeight + 10);
        
        // Draw vertical line at retirement age
        if (data.age === retirementAge) {
          ctx.beginPath();
          ctx.strokeStyle = retirementLineColor;
          ctx.setLineDash([5, 5]);
          ctx.moveTo(x, chartY);
          ctx.lineTo(x, chartY + chartHeight);
          ctx.stroke();
          ctx.setLineDash([]);
          
          // Label for retirement age
          ctx.fillStyle = retirementLineColor;
          ctx.fillText('Retirement', x, chartY + chartHeight + 30);
        }
      }
    });
    
    // Draw the savings line
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = accumulationColor;
    
    projectionData.forEach((data, index) => {
      const x = chartX + (index * chartWidth / projectionData.length);
      const y = chartY + chartHeight - (data.savings * scaleFactor);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        // Change color at retirement
        if (data.isRetired && !projectionData[index - 1].isRetired) {
          ctx.stroke();
          ctx.beginPath();
          ctx.strokeStyle = withdrawalColor;
          
          const prevX = chartX + ((index - 1) * chartWidth / projectionData.length);
          const prevY = chartY + chartHeight - (projectionData[index - 1].savings * scaleFactor);
          
          ctx.moveTo(prevX, prevY);
        }
        
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Draw area under the line
    ctx.beginPath();
    ctx.fillStyle = `${accumulationColor}20`; // 20% opacity
    
    // Find index of retirement age
    const retirementIndex = projectionData.findIndex(d => d.age === retirementAge);
    
    // Draw accumulation phase area
    projectionData.slice(0, retirementIndex + 1).forEach((data, index) => {
      const x = chartX + (index * chartWidth / projectionData.length);
      const y = chartY + chartHeight - (data.savings * scaleFactor);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Complete the area
    const retirementX = chartX + (retirementIndex * chartWidth / projectionData.length);
    ctx.lineTo(retirementX, chartY + chartHeight);
    ctx.lineTo(chartX, chartY + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw withdrawal phase area
    ctx.beginPath();
    ctx.fillStyle = `${withdrawalColor}20`; // 20% opacity
    
    projectionData.slice(retirementIndex).forEach((data, index) => {
      const actualIndex = retirementIndex + index;
      const x = chartX + (actualIndex * chartWidth / projectionData.length);
      const y = chartY + chartHeight - (data.savings * scaleFactor);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Complete the area
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
    ctx.lineTo(retirementX, chartY + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw legend
    const legendY = chartY + chartHeight + 40;
    
    // Accumulation legend
    ctx.fillStyle = accumulationColor;
    ctx.fillRect(chartX, legendY, 15, 15);
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.fillText('Accumulation Phase', chartX + 25, legendY + 7);
    
    // Withdrawal legend
    ctx.fillStyle = withdrawalColor;
    ctx.fillRect(chartX + 180, legendY, 15, 15);
    ctx.fillStyle = '#374151';
    ctx.fillText('Withdrawal Phase', chartX + 205, legendY + 7);
    
  }, [
    currentAge, 
    retirementAge, 
    lifeExpectancy, 
    currentSavings, 
    monthlyContribution, 
    annualReturnRate, 
    inflationRate,
    desiredMonthlyIncome
  ]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Retirement Savings Projection</h3>
      <div className="relative">
        <canvas ref={canvasRef} width={600} height={350} className="w-full" />
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">
        This chart shows how your retirement savings will grow during your working years and be drawn down during retirement.
      </p>
    </div>
  );
};

export default RetirementProjectionChart;
