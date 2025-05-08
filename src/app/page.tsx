import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cooperative E-Wallet - Modern Financial Solutions',
  description: 'A comprehensive e-wallet solution for cooperatives with loan management, savings accounts, and advanced reporting capabilities.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Modern Credit <span className="text-blue-200">Cooperative</span> System
            </h1>
            <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
              A comprehensive financial management solution for credit cooperatives.
              Streamline operations, enhance member experience, and drive growth with
              our integrated platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/register" 
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </a>
              <a 
                href="/demo" 
                className="px-8 py-3 bg-transparent text-white border border-white rounded-md font-semibold hover:bg-white/10 transition-colors"
              >
                Request Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Comprehensive Features for Modern Cooperatives
            </h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our system provides a complete suite of tools to manage all aspects of your credit cooperative operations efficiently and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Loan Management</h3>
              <p className="text-gray-600">
                Streamline the entire loan lifecycle from application to disbursement and repayment tracking with automated workflows.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Savings Accounts</h3>
              <p className="text-gray-600">
                Manage various types of savings accounts with automated interest calculations and detailed member statements.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Reporting & Analytics</h3>
              <p className="text-gray-600">
                Generate comprehensive reports and gain insights into your cooperative's financial performance with advanced analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Cooperative?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join hundreds of credit cooperatives that have enhanced their operations
            and member experience with our system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/register" 
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md shadow hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </a>
            <a 
              href="/contact" 
              className="px-8 py-3 bg-transparent text-white border border-white rounded-md font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Cooperative E-Wallet</h3>
              <p className="text-gray-400">
                A comprehensive financial management solution for credit cooperatives.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/features/loan-management" className="hover:text-white">Loan Management</a></li>
                <li><a href="/features/savings-accounts" className="hover:text-white">Savings Accounts</a></li>
                <li><a href="/features/reporting" className="hover:text-white">Reporting & Analytics</a></li>
                <li><a href="/features/mobile-access" className="hover:text-white">Mobile Access</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/resources/documentation" className="hover:text-white">Documentation</a></li>
                <li><a href="/resources/api" className="hover:text-white">API Reference</a></li>
                <li><a href="/resources/guides" className="hover:text-white">Guides</a></li>
                <li><a href="/resources/blog" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white">About Us</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
                <li><a href="/careers" className="hover:text-white">Careers</a></li>
                <li><a href="/legal" className="hover:text-white">Legal</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Cooperative E-Wallet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
