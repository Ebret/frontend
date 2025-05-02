'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { api } from '@/lib/api';

interface LoanProduct {
  id: number;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  minTerm: number;
  maxTerm: number;
  processingFee: number | null;
  requirements: string | null;
}

const LoanApplicationForm: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { config } = useWhiteLabel();
  
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    loanProductId: '',
    amount: '',
    term: '',
    purpose: '',
  });

  // Fetch loan products on component mount
  useEffect(() => {
    const fetchLoanProducts = async () => {
      try {
        setIsLoading(true);
        const response = await api.getLoanProducts();
        setLoanProducts(response.data.loanProducts);
        setIsLoading(false);
      } catch (err: any) {
        setError('Failed to fetch loan products. Please try again later.');
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLoanProducts();
    }
  }, [isAuthenticated]);

  // Update selected product when loanProductId changes
  useEffect(() => {
    if (formData.loanProductId) {
      const product = loanProducts.find(p => p.id === parseInt(formData.loanProductId, 10));
      setSelectedProduct(product || null);
      
      // Reset amount and term if they're outside the new product's limits
      if (product) {
        setFormData(prev => ({
          ...prev,
          amount: prev.amount ? 
            (parseFloat(prev.amount) < product.minAmount ? product.minAmount.toString() : 
             parseFloat(prev.amount) > product.maxAmount ? product.maxAmount.toString() : 
             prev.amount) : 
            '',
          term: prev.term ? 
            (parseInt(prev.term, 10) < product.minTerm ? product.minTerm.toString() : 
             parseInt(prev.term, 10) > product.maxTerm ? product.maxTerm.toString() : 
             prev.term) : 
            '',
        }));
      }
    } else {
      setSelectedProduct(null);
    }
  }, [formData.loanProductId, loanProducts]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Validate form
    if (!formData.loanProductId || !formData.amount || !formData.term || !formData.purpose) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!selectedProduct) {
      setError('Please select a valid loan product');
      return;
    }
    
    const amount = parseFloat(formData.amount);
    const term = parseInt(formData.term, 10);
    
    if (isNaN(amount) || amount < selectedProduct.minAmount || amount > selectedProduct.maxAmount) {
      setError(`Loan amount must be between ${selectedProduct.minAmount} and ${selectedProduct.maxAmount}`);
      return;
    }
    
    if (isNaN(term) || term < selectedProduct.minTerm || term > selectedProduct.maxTerm) {
      setError(`Loan term must be between ${selectedProduct.minTerm} and ${selectedProduct.maxTerm} months`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await api.createLoan({
        userId: user?.id,
        loanProductId: parseInt(formData.loanProductId, 10),
        amount,
        term,
        purpose: formData.purpose,
      });
      
      setSuccess('Loan application submitted successfully!');
      setFormData({
        loanProductId: '',
        amount: '',
        term: '',
        purpose: '',
      });
      
      // Redirect to loans page after a short delay
      setTimeout(() => {
        router.push('/loans');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit loan application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate monthly payment and total repayment
  const calculatePayments = () => {
    if (!selectedProduct || !formData.amount || !formData.term) {
      return { monthlyPayment: 0, totalRepayment: 0, totalInterest: 0 };
    }
    
    const principal = parseFloat(formData.amount);
    const interestRate = selectedProduct.interestRate / 12; // Monthly interest rate
    const numberOfPayments = parseInt(formData.term, 10);
    
    // Calculate monthly payment using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyPayment = principal * interestRate * Math.pow(1 + interestRate, numberOfPayments) / (Math.pow(1 + interestRate, numberOfPayments) - 1);
    const totalRepayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalRepayment - principal;
    
    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalRepayment: isNaN(totalRepayment) ? 0 : totalRepayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
    };
  };

  const { monthlyPayment, totalRepayment, totalInterest } = calculatePayments();

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6" style={{ color: config.primaryColor }}>
        Loan Application
      </h2>
      
      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="loanProductId" className="block text-sm font-medium text-gray-700">
            Loan Product <span className="text-red-500">*</span>
          </label>
          <select
            id="loanProductId"
            name="loanProductId"
            value={formData.loanProductId}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            required
            disabled={isLoading}
          >
            <option value="">Select a loan product</option>
            {loanProducts.map(product => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        
        {selectedProduct && (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedProduct.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {selectedProduct.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Interest Rate:</span> {(selectedProduct.interestRate * 100).toFixed(2)}%
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Amount Range:</span> ${selectedProduct.minAmount.toLocaleString()} - ${selectedProduct.maxAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Term Range:</span> {selectedProduct.minTerm} - {selectedProduct.maxTerm} months
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Processing Fee:</span> {selectedProduct.processingFee ? `$${selectedProduct.processingFee.toLocaleString()}` : 'None'}
                </p>
              </div>
            </div>
            {selectedProduct.requirements && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Requirements:</span> {selectedProduct.requirements}
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Loan Amount <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                value={formData.amount}
                onChange={handleChange}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                min={selectedProduct?.minAmount || 0}
                max={selectedProduct?.maxAmount || 0}
                step="0.01"
                required
                disabled={isLoading || !selectedProduct}
              />
            </div>
            {selectedProduct && (
              <p className="mt-1 text-xs text-gray-500">
                Min: ${selectedProduct.minAmount.toLocaleString()}, Max: ${selectedProduct.maxAmount.toLocaleString()}
              </p>
            )}
          </div>
          
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700">
              Loan Term (months) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="term"
              id="term"
              value={formData.term}
              onChange={handleChange}
              className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              min={selectedProduct?.minTerm || 0}
              max={selectedProduct?.maxTerm || 0}
              required
              disabled={isLoading || !selectedProduct}
            />
            {selectedProduct && (
              <p className="mt-1 text-xs text-gray-500">
                Min: {selectedProduct.minTerm} months, Max: {selectedProduct.maxTerm} months
              </p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
            Loan Purpose <span className="text-red-500">*</span>
          </label>
          <textarea
            id="purpose"
            name="purpose"
            rows={3}
            value={formData.purpose}
            onChange={handleChange}
            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            placeholder="Please describe the purpose of this loan"
            required
            disabled={isLoading}
          />
        </div>
        
        {selectedProduct && formData.amount && formData.term && (
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loan Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Monthly Payment:</span>
                </p>
                <p className="text-xl font-bold" style={{ color: config.primaryColor }}>
                  ${monthlyPayment.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Repayment:</span>
                </p>
                <p className="text-xl font-bold" style={{ color: config.primaryColor }}>
                  ${totalRepayment.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Interest:</span>
                </p>
                <p className="text-xl font-bold" style={{ color: config.primaryColor }}>
                  ${totalInterest.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">
                This is an estimate. Actual terms may vary based on approval.
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ backgroundColor: config.primaryColor }}
            disabled={isLoading}
          >
            {isLoading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoanApplicationForm;
