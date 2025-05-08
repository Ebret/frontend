'use client';

import React from 'react';
import Image from 'next/image';
import LandingLayout from '@/components/LandingLayout';
import SectionHeading from '@/components/landing/SectionHeading';
import FeatureCard from '@/components/landing/FeatureCard';
import CTAButton from '@/components/landing/CTAButton';
import CustomerLogos from '@/components/landing/CustomerLogos';
import LazyLoad from '@/components/performance/LazyLoad';
import CookieConsent from '@/components/CookieConsent';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import AccessibilityMenu from '@/components/accessibility/AccessibilityMenu';
import StructuredData from '@/components/seo/StructuredData';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import FloatingContactButton from '@/components/contact/FloatingContactButton';
import { PageLoadProgressBar } from '@/components/ui';
import { trackEvent } from '@/utils/analytics';

// Import client components
import ClientAnimatedCounter from '@/components/landing/ClientAnimatedCounter';
import ClientTestimonialCard from '@/components/landing/ClientTestimonialCard';
import ClientFeatureShowcase from '@/components/landing/ClientFeatureShowcase';
import ClientSuccessStories from '@/components/landing/ClientSuccessStories';
import ClientFeatureComparisonTable from '@/components/landing/ClientFeatureComparisonTable';
import ClientFAQSection from '@/components/landing/ClientFAQSection';
import ClientPricingCalculator from '@/components/landing/ClientPricingCalculator';

export default function ClientHomePage() {
  // Track CTA clicks
  const handleCtaClick = (ctaType) => {
    trackEvent('Landing Page', 'CTA Click', ctaType);
  };

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800 opacity-90"></div>

        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in">
                Modern Credit <span className="text-blue-200">Cooperative</span> System
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 animate-slide-up animation-delay-200">
                A comprehensive financial management solution for credit cooperatives.
                Streamline operations, enhance member experience, and drive growth with
                our integrated platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up animation-delay-500">
                <CTAButton
                  href="/register"
                  variant="white"
                  size="lg"
                  className="font-semibold"
                  onClick={() => handleCtaClick('register')}
                >
                  Get Started Free
                </CTAButton>
                <CTAButton
                  href="/demo"
                  variant="outline"
                  size="lg"
                  className="text-white border-white hover:bg-white/10 font-semibold"
                  onClick={() => handleCtaClick('demo')}
                >
                  Request Demo
                  <svg
                    className="ml-2 -mr-1 w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </CTAButton>
              </div>
            </div>

            <div className="hidden lg:block relative animate-fade-in animation-delay-300">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-8 -right-8 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl transform -rotate-2 animate-float">
                <Image
                  src="/hero-image.svg"
                  alt="Cooperative Dashboard Preview"
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg"
                  priority
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="absolute -right-4 -bottom-4 bg-white rounded-lg shadow-xl p-4 transform rotate-3 animate-slide-up animation-delay-700">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Loan Approved</span>
                </div>
                <div className="mt-2 text-xl font-bold">₱25,000.00</div>
              </div>
            </div>
          </div>

          {/* Trusted by section */}
          <div className="mt-20">
            <LazyLoad>
              <CustomerLogos darkMode={true} />
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600">
                <ClientAnimatedCounter value={500} label="+" />
              </div>
              <p className="mt-2 text-gray-600">Cooperatives</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">
                <ClientAnimatedCounter value={1.5} label="M+" duration={2000} />
              </div>
              <p className="mt-2 text-gray-600">Members Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">
                <ClientAnimatedCounter value={10} label="B+" duration={2000} />
              </div>
              <p className="mt-2 text-gray-600">Loans Processed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">
                <ClientAnimatedCounter value={99.9} label="%" duration={2000} />
              </div>
              <p className="mt-2 text-gray-600">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Comprehensive Features for Modern Cooperatives"
            subtitle="Our system provides a complete suite of tools to manage all aspects of your credit cooperative operations efficiently and securely."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m-6-8h6M3 3h18a2 2 0 012 2v14a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z"
                  />
                </svg>
              }
              title="Loan Management"
              description="Streamline the entire loan lifecycle from application to disbursement and repayment tracking with automated workflows."
            />

            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              title="Savings Accounts"
              description="Manage various types of savings accounts with automated interest calculations and detailed member statements."
            />

            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              title="Reporting & Analytics"
              description="Generate comprehensive reports and gain insights into your cooperative's financial performance with advanced analytics."
            />
          </div>

          {/* Interactive Feature Showcase */}
          <div className="mt-16">
            <LazyLoad
              placeholder={
                <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
                  <div className="h-16 bg-gray-200"></div>
                  <div className="p-6 h-96"></div>
                </div>
              }
              onVisible={() => trackEvent('Landing Page', 'Feature Showcase Viewed', 'Feature Tabs')}
            >
              <ClientFeatureShowcase />
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Accessibility Menu */}
      <AccessibilityMenu />

      {/* Floating Contact Button */}
      <FloatingContactButton />

      {/* Performance Monitoring */}
      <PerformanceMonitor />

      {/* Advanced Analytics */}
      <AdvancedAnalytics />
    </LandingLayout>
  );
}
