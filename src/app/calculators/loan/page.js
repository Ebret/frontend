'use client';

import React from 'react';
import LoanCalculator from '@/components/calculators/LoanCalculator';
import LoanComparison from '@/components/calculators/LoanComparison';
import CalculatorNav from '@/components/navigation/CalculatorNav';
import CalculatorHeader from '@/components/navigation/CalculatorHeader';

/**
 * Loan Calculator Page
 *
 * This page displays the loan calculator component with additional
 * information about loan terms and conditions.
 */
const LoanCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <CalculatorHeader />

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Loan Calculator
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Plan your loan with our easy-to-use calculator. Estimate your monthly payments,
            total interest, and view a complete amortization schedule.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <CalculatorNav />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <LoanCalculator />

            <div className="mt-16">
              <LoanComparison />
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Terms and Conditions</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Interest Rates</h3>
              <p className="text-gray-600">
                Our cooperative offers competitive interest rates starting from 10% per annum.
                Rates may vary based on loan type, term length, and your membership status.
                Members with good standing may qualify for preferential rates.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Loan Terms</h3>
              <p className="text-gray-600">
                Loan terms range from 3 months to 5 years depending on the loan type and amount.
                Shorter terms result in higher monthly payments but lower total interest paid.
                Longer terms offer more affordable monthly payments but higher total interest.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Fees and Charges</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Processing Fee: 1-2% of the loan amount</li>
                <li>Insurance Fee: 0.5-1% of the loan amount</li>
                <li>Documentary Stamp Tax: As required by law</li>
                <li>Late Payment Fee: 3% of the amount due or ₱500, whichever is higher</li>
                <li>Pre-termination Fee: 3% of the remaining principal balance</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Eligibility Requirements</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Must be an active member of the cooperative for at least 6 months</li>
                <li>Must have regular contributions to the cooperative</li>
                <li>Must have a good credit standing</li>
                <li>Must have the capacity to pay the loan</li>
                <li>Must provide required documents (valid ID, proof of income, etc.)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Apply</h3>
              <ol className="list-decimal pl-5 text-gray-600 space-y-2">
                <li>Fill out the loan application form online or at our office</li>
                <li>Submit the required documents</li>
                <li>Wait for the loan approval (usually within 3-5 business days)</li>
                <li>Sign the loan agreement</li>
                <li>Receive the loan proceeds</li>
              </ol>
            </div>

            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
              <p className="text-blue-700">
                Our loan officers are available to assist you with your loan application.
                Visit our office or contact us at (02) 8123-4567 or email us at loans@cooperative.com.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Ready to Apply?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/loans/apply"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              Apply for a Loan
            </a>
            <a
              href="/contact"
              className="px-8 py-3 bg-white text-blue-600 border border-blue-600 font-semibold rounded-md hover:bg-blue-50 transition-colors"
            >
              Contact a Loan Officer
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoanCalculatorPage;
