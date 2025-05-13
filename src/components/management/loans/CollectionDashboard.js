'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FiPhone, FiMail, FiMessageSquare, FiFileText, FiCalendar, FiClock } from 'react-icons/fi';

/**
 * Collection Dashboard Component
 * 
 * Provides tools for managing overdue loans:
 * - Prioritized collection list
 * - Communication tools
 * - Payment plan generator
 * 
 * @param {Array} loans - Array of overdue loan objects
 */
const CollectionDashboard = ({ loans }) => {
  // State for selected loan
  const [selectedLoan, setSelectedLoan] = useState(null);
  
  // State for payment plan
  const [paymentPlan, setPaymentPlan] = useState(null);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
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
  
  // Get priority class
  const getPriorityClass = (daysOverdue) => {
    if (daysOverdue > 90) return 'bg-red-100 text-red-800';
    if (daysOverdue > 60) return 'bg-orange-100 text-orange-800';
    if (daysOverdue > 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };
  
  // Generate payment plan
  const generatePaymentPlan = (loan) => {
    // In a real app, this would use more sophisticated logic
    const remainingBalance = loan.remainingBalance;
    const monthlyPayment = loan.nextPaymentAmount;
    
    // Simple restructuring: extend by 3 months with reduced payments
    const extendedMonths = 3;
    const newMonthlyPayment = (remainingBalance / (extendedMonths + 1)).toFixed(2);
    
    const plan = {
      originalPayment: monthlyPayment,
      newPayment: parseFloat(newMonthlyPayment),
      totalMonths: extendedMonths + 1,
      totalAmount: remainingBalance,
      schedule: []
    };
    
    // Generate payment schedule
    const today = new Date();
    for (let i = 0; i < plan.totalMonths; i++) {
      const paymentDate = new Date(today);
      paymentDate.setMonth(today.getMonth() + i + 1);
      
      plan.schedule.push({
        number: i + 1,
        date: paymentDate.toISOString().split('T')[0],
        amount: plan.newPayment,
        status: 'pending'
      });
    }
    
    return plan;
  };
  
  // Handle loan selection
  const handleLoanSelect = (loan) => {
    setSelectedLoan(loan);
    setPaymentPlan(null); // Reset payment plan when selecting a new loan
  };
  
  // Handle generate payment plan
  const handleGeneratePaymentPlan = () => {
    if (!selectedLoan) return;
    
    const plan = generatePaymentPlan(selectedLoan);
    setPaymentPlan(plan);
  };
  
  // Sort loans by priority (days overdue)
  const prioritizedLoans = [...loans].sort((a, b) => b.daysOverdue - a.daysOverdue);
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Collection Dashboard
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Manage overdue loans and collection activities
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Collection List */}
        <div className="col-span-1 border-r border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700">Prioritized Collection List</h4>
          </div>
          <div className="overflow-y-auto max-h-96">
            <ul className="divide-y divide-gray-200">
              {prioritizedLoans.length === 0 ? (
                <li className="px-4 py-4 text-sm text-gray-500">
                  No overdue loans found.
                </li>
              ) : (
                prioritizedLoans.map((loan) => (
                  <li 
                    key={loan.id}
                    className={`px-4 py-4 cursor-pointer hover:bg-gray-50 ${selectedLoan?.id === loan.id ? 'bg-blue-50' : ''}`}
                    onClick={() => handleLoanSelect(loan)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loan.memberName}</div>
                        <div className="text-xs text-gray-500">{loan.id}</div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getPriorityClass(loan.daysOverdue)}`}>
                          {loan.daysOverdue} days
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <div className="text-sm text-gray-500">
                        Due: {formatCurrency(loan.nextPaymentAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Balance: {formatCurrency(loan.remainingBalance)}
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        
        {/* Collection Details */}
        <div className="col-span-2 px-4 py-4">
          {!selectedLoan ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-gray-400 mb-2">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">No loan selected</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Select a loan from the list to view details and collection options
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{selectedLoan.memberName}</h3>
                  <p className="text-sm text-gray-500">Loan ID: {selectedLoan.id}</p>
                </div>
                <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getPriorityClass(selectedLoan.daysOverdue)}`}>
                  {selectedLoan.daysOverdue} days overdue
                </span>
              </div>
              
              {/* Loan Details */}
              <div className="bg-gray-50 rounded-md p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Loan Amount</div>
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(selectedLoan.amount)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Remaining Balance</div>
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(selectedLoan.remainingBalance)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Next Payment Due</div>
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(selectedLoan.nextPaymentAmount)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Payment Date</div>
                    <div className="text-sm font-medium text-gray-900">{formatDate(selectedLoan.nextPaymentDate)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Payments On Time</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLoan.paymentsOnTime}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Payments Late</div>
                    <div className="text-sm font-medium text-gray-900">{selectedLoan.paymentsLate}</div>
                  </div>
                </div>
              </div>
              
              {/* Communication Tools */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Communication Tools</h4>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiPhone className="mr-2 h-4 w-4 text-gray-500" />
                    Call Member
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiMail className="mr-2 h-4 w-4 text-gray-500" />
                    Send Email
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiMessageSquare className="mr-2 h-4 w-4 text-gray-500" />
                    Send SMS
                  </button>
                </div>
              </div>
              
              {/* Collection Actions */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Collection Actions</h4>
                <div className="flex space-x-2">
                  <Link
                    href={`/management/loans/${selectedLoan.id}/payment`}
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiDollarSign className="mr-2 h-4 w-4" />
                    Record Payment
                  </Link>
                  <button
                    type="button"
                    onClick={handleGeneratePaymentPlan}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiCalendar className="mr-2 h-4 w-4 text-gray-500" />
                    Generate Payment Plan
                  </button>
                  <Link
                    href={`/management/loans/${selectedLoan.id}/restructure`}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FiFileText className="mr-2 h-4 w-4 text-gray-500" />
                    Restructure Loan
                  </Link>
                </div>
              </div>
              
              {/* Payment Plan */}
              {paymentPlan && (
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-700">Suggested Payment Plan</h4>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiClock className="mr-1 h-3 w-3" />
                      Apply Plan
                    </button>
                  </div>
                  
                  <div className="bg-blue-50 rounded-md p-4 mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-gray-500">Original Payment</div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(paymentPlan.originalPayment)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">New Payment</div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(paymentPlan.newPayment)}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Total Months</div>
                        <div className="text-sm font-medium text-gray-900">{paymentPlan.totalMonths}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Total Amount</div>
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(paymentPlan.totalAmount)}</div>
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-100">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              #
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Date
                            </th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {paymentPlan.schedule.map((payment) => (
                            <tr key={payment.number}>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                {payment.number}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                {formatDate(payment.date)}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                {formatCurrency(payment.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Collection History */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Collection History</h4>
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="text-sm text-gray-500 text-center">
                    No collection activities recorded yet.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDashboard;
