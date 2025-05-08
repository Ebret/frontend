'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Savings Growth Chart Component
 * 
 * A visual representation of savings growth over time showing
 * the breakdown between contributions and interest.
 */
const SavingsGrowthChart = ({ 
  initialDeposit, 
  monthlyContribution, 
  interestRate, 
  savingsTerm 
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
  
  // Calculate savings data for the chart
  const calculateSavingsData = () => {
    const data = [];
    let balance = initialDeposit;
    let totalContributions = initialDeposit;
    let totalInterest = 0;
    
    // Calculate data points for each year
    const years = Math.ceil(savingsTerm / 12);
    
    for (let year = 0; year <= years; year++) {
      if (year === 0) {
        data.push({
          year,
          balance,
          contributions: totalContributions,
          interest: totalInterest
        });
        continue;
      }
      
      // Calculate for each month in the year
      for (let month = 1; month <= 12; month++) {
        const currentMonth = (year - 1) * 12 + month;
        
        // Stop if we've reached the end of the term
        if (currentMonth > savingsTerm) break;
        
        // Add monthly contribution
        balance += monthlyContribution;
        totalContributions += monthlyContribution;
        
        // Calculate and add monthly interest
        const monthlyInterest = balance * (interestRate / 100 / 12);
        balance += monthlyInterest;
        totalInterest += monthlyInterest;
      }
      
      // Add data point for this year
      data.push({
        year,
        balance,
        contributions: totalContributions,
        interest: totalInterest
      });
    }
    
    return data;
  };
  
  // Draw the chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const savingsData = calculateSavingsData();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const chartWidth = canvas.width - 80; // Leave space for y-axis labels
    const chartHeight = canvas.height - 60; // Leave space for x-axis labels
    const chartX = 70; // X-axis starting position
    const chartY = 20; // Y-axis starting position
    
    // Find maximum value for scaling
    const maxValue = Math.max(...savingsData.map(d => d.balance));
    const scaleFactor = chartHeight / maxValue;
    
    // Calculate bar width
    const barWidth = chartWidth / savingsData.length / 2;
    const barSpacing = barWidth / 2;
    
    // Colors
    const contributionsColor = '#3b82f6'; // Blue
    const interestColor = '#10b981'; // Green
    
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
    
    // Draw bars and X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    savingsData.forEach((data, index) => {
      const x = chartX + (index * (barWidth * 2 + barSpacing));
      
      // Contributions bar
      const contributionsHeight = data.contributions * scaleFactor;
      ctx.fillStyle = contributionsColor;
      ctx.fillRect(
        x, 
        chartY + chartHeight - contributionsHeight, 
        barWidth, 
        contributionsHeight
      );
      
      // Interest bar
      const interestHeight = (data.balance - data.contributions) * scaleFactor;
      ctx.fillStyle = interestColor;
      ctx.fillRect(
        x + barWidth, 
        chartY + chartHeight - contributionsHeight - interestHeight, 
        barWidth, 
        interestHeight
      );
      
      // X-axis label
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`Year ${data.year}`, x + barWidth / 2, chartY + chartHeight + 10);
    });
    
    // Draw legend
    const legendY = chartY + chartHeight + 40;
    
    // Contributions legend
    ctx.fillStyle = contributionsColor;
    ctx.fillRect(chartX, legendY, 15, 15);
    ctx.fillStyle = '#374151';
    ctx.textAlign = 'left';
    ctx.fillText('Contributions', chartX + 25, legendY + 7);
    
    // Interest legend
    ctx.fillStyle = interestColor;
    ctx.fillRect(chartX + 150, legendY, 15, 15);
    ctx.fillStyle = '#374151';
    ctx.fillText('Interest', chartX + 175, legendY + 7);
    
  }, [initialDeposit, monthlyContribution, interestRate, savingsTerm]);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Savings Growth Over Time</h3>
      <div className="relative">
        <canvas ref={canvasRef} width={600} height={350} className="w-full" />
      </div>
      <p className="text-sm text-gray-500 mt-4 text-center">
        This chart shows how your savings will grow over time, with the breakdown between your contributions and the interest earned.
      </p>
    </div>
  );
};

export default SavingsGrowthChart;
