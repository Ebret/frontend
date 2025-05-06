'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { api } from '@/lib/api';
import { Spinner } from '@/components/ui';
import DocumentUploadContainer from '@/components/documents/DocumentUploadContainer';

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

interface FormData {
  loanProductId: string;
  amount: string;
  term: string;
  purpose: string;
  collateral: string;
  coMakerName: string;
  coMakerRelationship: string;
  coMakerContactNumber: string;
  employmentStatus: string;
  monthlyIncome: string;
  otherLoans: string;
  acceptedTerms: boolean;
}

const EnhancedLoanApplicationForm: React.FC = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { config } = useWhiteLabel();

  // State for steps
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const [documentsComplete, setDocumentsComplete] = useState(false);

  // State for loan products and loading
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // State for form data
  const [formData, setFormData] = useState<FormData>({
    loanProductId: '',
    amount: '',
    term: '',
    purpose: '',
    collateral: '',
    coMakerName: '',
    coMakerRelationship: '',
    coMakerContactNumber: '',
    employmentStatus: 'employed',
    monthlyIncome: '',
    otherLoans: '',
    acceptedTerms: false,
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
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const response = await api.createLoan({
        userId: user?.id,
        loanProductId: parseInt(formData.loanProductId, 10),
        amount: parseFloat(formData.amount),
        term: parseInt(formData.term, 10),
        purpose: formData.purpose,
        collateral: formData.collateral,
        coMakerName: formData.coMakerName,
        coMakerRelationship: formData.coMakerRelationship,
        coMakerContactNumber: formData.coMakerContactNumber,
        employmentStatus: formData.employmentStatus,
        monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
        otherLoans: formData.otherLoans,
      });

      setSuccess('Loan application submitted successfully!');

      // Redirect to loans page after a short delay
      setTimeout(() => {
        router.push('/loans');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit loan application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate monthly payment and total repayment
  const calculatePayments = () => {
    if (!selectedProduct || !formData.amount || !formData.term) {
      return { monthlyPayment: 0, totalRepayment: 0, totalInterest: 0, processingFee: 0, netProceeds: 0 };
    }

    const principal = parseFloat(formData.amount);
    const interestRate = selectedProduct.interestRate / 12; // Monthly interest rate
    const numberOfPayments = parseInt(formData.term, 10);

    // Calculate monthly payment using the formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const monthlyPayment = principal * interestRate * Math.pow(1 + interestRate, numberOfPayments) / (Math.pow(1 + interestRate, numberOfPayments) - 1);
    const totalRepayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalRepayment - principal;
    const processingFee = selectedProduct.processingFee || 0;
    const netProceeds = principal - processingFee;

    return {
      monthlyPayment: isNaN(monthlyPayment) ? 0 : monthlyPayment,
      totalRepayment: isNaN(totalRepayment) ? 0 : totalRepayment,
      totalInterest: isNaN(totalInterest) ? 0 : totalInterest,
      processingFee,
      netProceeds,
    };
  };

  const { monthlyPayment, totalRepayment, totalInterest, processingFee, netProceeds } = calculatePayments();

  // Navigate to next step
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Navigate to previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 1: // Loan Type Selection
        return formData.loanProductId !== '';
      case 2: // Loan Details
        return (
          formData.amount !== '' &&
          formData.term !== '' &&
          formData.purpose.trim().length >= 10
        );
      case 3: // Additional Information
        return (
          formData.employmentStatus !== '' &&
          formData.monthlyIncome !== '' &&
          formData.collateral.trim().length > 0
        );
      case 4: // Document Upload
        return documentsComplete;
      case 5: // Review and Submit
        return formData.acceptedTerms;
      default:
        return false;
    }
  };

  if (isLoading && loanProducts.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h2 className="text-xl font-bold" style={{ color: config.primaryColor }}>
          Loan Application
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Please complete all steps to submit your loan application.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="w-full flex items-center">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <React.Fragment key={index}>
                <div className="relative flex flex-col items-center">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      currentStep > index + 1
                        ? 'bg-green-500'
                        : currentStep === index + 1
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                    style={
                      currentStep === index + 1
                        ? { backgroundColor: config?.primaryColor || '#3b82f6' }
                        : currentStep > index + 1
                        ? { backgroundColor: '#10b981' }
                        : {}
                    }
                  >
                    {currentStep > index + 1 ? (
                      <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-white font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="text-xs mt-1 text-center">
                    {index === 0 && 'Loan Type'}
                    {index === 1 && 'Loan Details'}
                    {index === 2 && 'Additional Info'}
                    {index === 3 && 'Documents'}
                    {index === 4 && 'Review & Submit'}
                  </div>
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    style={
                      currentStep > index + 1
                        ? { backgroundColor: '#10b981' }
                        : {}
                    }
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 border-l-4 border-red-400 p-4">
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
        <div className="mx-4 mt-4 bg-green-50 border-l-4 border-green-400 p-4">
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

      {/* Form Content */}
      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Step 1: Loan Type Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
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
                  disabled={isLoading || submitting}
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
                        <span className="font-medium">Amount Range:</span> ₱{selectedProduct.minAmount.toLocaleString()} - ₱{selectedProduct.maxAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Term Range:</span> {selectedProduct.minTerm} - {selectedProduct.maxTerm} months
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Processing Fee:</span> {selectedProduct.processingFee ? `₱${selectedProduct.processingFee.toLocaleString()}` : 'None'}
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
            </div>
          )}

          {/* Step 2: Loan Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Loan Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₱</span>
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
                      disabled={isLoading || !selectedProduct || submitting}
                    />
                  </div>
                  {selectedProduct && (
                    <p className="mt-1 text-xs text-gray-500">
                      Min: ₱{selectedProduct.minAmount.toLocaleString()}, Max: ₱{selectedProduct.maxAmount.toLocaleString()}
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
                    disabled={isLoading || !selectedProduct || submitting}
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
                  disabled={isLoading || submitting}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Please provide a detailed explanation of how you plan to use the loan.
                </p>
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
                        ₱{monthlyPayment.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Repayment:</span>
                      </p>
                      <p className="text-xl font-bold" style={{ color: config.primaryColor }}>
                        ₱{totalRepayment.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Interest:</span>
                      </p>
                      <p className="text-xl font-bold" style={{ color: config.primaryColor }}>
                        ₱{totalInterest.toFixed(2)}
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
            </div>
          )}

          {/* Step 3: Additional Information */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="employmentStatus" className="block text-sm font-medium text-gray-700">
                    Employment Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="employmentStatus"
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    required
                    disabled={submitting}
                  >
                    <option value="employed">Employed</option>
                    <option value="self-employed">Self-Employed</option>
                    <option value="business-owner">Business Owner</option>
                    <option value="retired">Retired</option>
                    <option value="unemployed">Unemployed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700">
                    Monthly Income <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">₱</span>
                    </div>
                    <input
                      type="number"
                      name="monthlyIncome"
                      id="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="collateral" className="block text-sm font-medium text-gray-700">
                  Collateral <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="collateral"
                  name="collateral"
                  rows={2}
                  value={formData.collateral}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="Describe any collateral you're offering for this loan"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="otherLoans" className="block text-sm font-medium text-gray-700">
                  Other Existing Loans
                </label>
                <textarea
                  id="otherLoans"
                  name="otherLoans"
                  rows={2}
                  value={formData.otherLoans}
                  onChange={handleChange}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  placeholder="List any other loans you currently have"
                  disabled={submitting}
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Co-Maker Information
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  A co-maker is someone who agrees to pay your loan if you are unable to make payments.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="coMakerName" className="block text-sm font-medium text-gray-700">
                      Co-Maker Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="coMakerName"
                      id="coMakerName"
                      value={formData.coMakerName}
                      onChange={handleChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="coMakerRelationship" className="block text-sm font-medium text-gray-700">
                      Relationship to Co-Maker <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="coMakerRelationship"
                      id="coMakerRelationship"
                      value={formData.coMakerRelationship}
                      onChange={handleChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      placeholder="e.g., Spouse, Parent, Sibling"
                      required
                      disabled={submitting}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="coMakerContactNumber" className="block text-sm font-medium text-gray-700">
                    Co-Maker Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="coMakerContactNumber"
                    id="coMakerContactNumber"
                    value={formData.coMakerContactNumber}
                    onChange={handleChange}
                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="e.g., 09123456789"
                    required
                    disabled={submitting}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">
                Please upload the required documents for your loan application. All documents must be clear and legible.
              </p>

              <DocumentUploadContainer
                entityType="loan"
                onComplete={setDocumentsComplete}
                disabled={submitting}
              />

              {!documentsComplete && (
                <div className="bg-yellow-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Required Documents
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Please upload all required documents to proceed to the next step.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Review and Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Review Your Application
                </h3>

                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Loan Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Loan Product:</span> {selectedProduct?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Loan Amount:</span> ₱{parseFloat(formData.amount).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Loan Term:</span> {formData.term} months
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Interest Rate:</span> {selectedProduct ? (selectedProduct.interestRate * 100).toFixed(2) : 0}%
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Monthly Payment:</span> ₱{monthlyPayment.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Total Repayment:</span> ₱{totalRepayment.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Purpose:</span> {formData.purpose}
                    </p>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-4 mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Employment Status:</span> {formData.employmentStatus}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Monthly Income:</span> ₱{parseFloat(formData.monthlyIncome).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Collateral:</span> {formData.collateral}
                      </p>
                      {formData.otherLoans && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Other Loans:</span> {formData.otherLoans}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Co-Maker Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Name:</span> {formData.coMakerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Relationship:</span> {formData.coMakerRelationship}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Contact Number:</span> {formData.coMakerContactNumber}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Loan Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Loan Amount:</span>
                    </p>
                    <p className="text-xl font-bold" style={{ color: config.primaryColor }}>
                      ₱{parseFloat(formData.amount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Processing Fee:</span>
                    </p>
                    <p className="text-xl font-bold" style={{ color: config.primaryColor }}>
                      ₱{processingFee.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900">
                      Net Loan Proceeds:
                    </p>
                    <p className="text-xl font-bold" style={{ color: config.primaryColor }}>
                      ₱{netProceeds.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Important Notice
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        By submitting this application, you confirm that all information provided is accurate and complete.
                        False information may result in rejection of your application or legal consequences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="acceptedTerms"
                    name="acceptedTerms"
                    type="checkbox"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    disabled={submitting}
                    style={{ color: config.primaryColor }}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="acceptedTerms" className="font-medium text-gray-700">
                    I agree to the terms and conditions
                  </label>
                  <p className="text-gray-500">
                    I confirm that all information provided is accurate and I agree to the loan terms and conditions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Form Navigation */}
      <div className="px-4 py-4 sm:px-6 border-t border-gray-200 flex justify-between">
        <button
          type="button"
          onClick={handlePrevStep}
          disabled={currentStep === 1 || submitting}
          className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            currentStep === 1 || submitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={handleNextStep}
            disabled={!isCurrentStepValid() || submitting}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isCurrentStepValid() && !submitting ? '' : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !isCurrentStepValid()}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              submitting || !isCurrentStepValid() ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{ backgroundColor: config?.primaryColor || '#3b82f6' }}
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default EnhancedLoanApplicationForm;
