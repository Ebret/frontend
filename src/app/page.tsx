import React, { lazy, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Metadata } from 'next';
import LandingLayout from '@/components/LandingLayout';
import SectionHeading from '@/components/landing/SectionHeading';
import FeatureCard from '@/components/landing/FeatureCard';
import CTAButton from '@/components/landing/CTAButton';
import CustomerLogos from '@/components/landing/CustomerLogos';
import { Spinner } from '@/components/ui';
import LazyLoad from '@/components/performance/LazyLoad';
import CookieConsent from '@/components/CookieConsent';
import PerformanceMonitor from '@/components/performance/PerformanceMonitor';
import AccessibilityMenu from '@/components/accessibility/AccessibilityMenu';
import StructuredData from '@/components/seo/StructuredData';
import AdvancedAnalytics from '@/components/analytics/AdvancedAnalytics';
import FloatingContactButton from '@/components/contact/FloatingContactButton';
import { PageLoadProgressBar } from '@/components/ui';
import { generateLandingPageMetadata } from './metadata';
import { trackEvent } from '@/utils/analytics';

// Generate metadata for the page
export const metadata: Metadata = generateLandingPageMetadata();

// Dynamically import components that aren't needed for initial render
const AnimatedCounter = dynamic(() => import('@/components/landing/AnimatedCounter'), {
  ssr: false,
  loading: () => <span className="text-4xl font-bold text-blue-600">0</span>
});

const TestimonialCard = dynamic(() => import('@/components/landing/TestimonialCard'), {
  loading: () => (
    <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  )
});

const FeatureShowcase = dynamic(() => import('@/components/landing/FeatureShowcase'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      <div className="h-16 bg-gray-200"></div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mb-6"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
              ))}
            </div>
          </div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    </div>
  )
});

const SuccessStories = dynamic(() => import('@/components/landing/SuccessStories'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-24 bg-gray-200 rounded w-full"></div>
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-lg h-64"></div>
        </div>
      </div>
    </div>
  )
});

const FeatureComparisonTable = dynamic(() => import('@/components/landing/FeatureComparisonTable'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="flex flex-wrap justify-center mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-200 rounded-md mx-2 mb-2"></div>
          ))}
        </div>
        <div className="h-40 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

const FAQSection = dynamic(() => import('@/components/landing/FAQSection'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-b border-gray-200 pb-4">
              <div className="flex justify-between items-center">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-0"></div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-40 mx-auto"></div>
        </div>
      </div>
    </div>
  )
});

const PricingCalculator = dynamic(() => import('@/components/landing/PricingCalculator'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded-full w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-4 w-4 bg-gray-200 rounded mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg space-y-6">
            <div className="text-center space-y-1">
              <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="mt-2 h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
});

export default function Home() {
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
                <AnimatedCounter end={500} suffix="+" />
              </div>
              <p className="mt-2 text-gray-600">Cooperatives</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">
                <AnimatedCounter end={1.5} suffix="M+" decimals={1} />
              </div>
              <p className="mt-2 text-gray-600">Members Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">
                <AnimatedCounter end={10} suffix="B+" prefix="₱" />
              </div>
              <p className="mt-2 text-gray-600">Loans Processed</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600">
                <AnimatedCounter end={99.9} suffix="%" decimals={1} />
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
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              }
              title="Mobile Access"
              description="Provide members with secure mobile access to their accounts, loan applications, and transaction history anytime, anywhere."
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
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
              title="Security & Compliance"
              description="Ensure data security and regulatory compliance with role-based access control, audit trails, and encryption."
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
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              }
              title="White-Label Solution"
              description="Customize the platform with your cooperative's branding, colors, and logo for a seamless member experience."
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
              <FeatureShowcase />
            </LazyLoad>
          </div>

          <div className="mt-12 text-center">
            <CTAButton
              href="/features"
              variant="primary"
              onClick={() => handleCtaClick('explore_features')}
            >
              Explore All Features
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="What Our Clients Say"
            subtitle="Hear from credit cooperatives that have transformed their operations with our system."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <TestimonialCard
              quote="This system has revolutionized how we manage our cooperative. The loan processing time has been reduced by 60%, and our members love the online access to their accounts."
              name="John Doe"
              title="CEO"
              company="ABC Cooperative"
              rating={5}
            />

            <TestimonialCard
              quote="The reporting capabilities are outstanding. We can now make data-driven decisions and have improved our financial performance significantly. The white-label feature allows us to maintain our brand identity."
              name="Jane Smith"
              title="Manager"
              company="XYZ Credit Union"
              rating={5}
            />

            <TestimonialCard
              quote="The mobile access feature has been a game-changer for our members. They can now check their accounts, apply for loans, and make payments from anywhere. Our member satisfaction has increased dramatically."
              name="Robert Johnson"
              title="IT Director"
              company="PQR Cooperative"
              rating={4}
            />
          </div>

          {/* Success Stories */}
          <LazyLoad
            onVisible={() => trackEvent('Landing Page', 'Success Stories Viewed', 'Testimonials Section')}
          >
            <SuccessStories />
          </LazyLoad>

          {/* Customer Logos */}
          <div className="mt-16">
            <LazyLoad>
              <CustomerLogos
                title="Trusted by leading credit cooperatives"
                darkMode={false}
              />
            </LazyLoad>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Transparent Pricing"
            subtitle="Choose the plan that fits your cooperative's needs and budget. No hidden fees, no surprises."
          />

          {/* Pricing Calculator */}
          <LazyLoad
            placeholder={
              <div className="bg-white rounded-lg shadow-xl overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="h-64 bg-gray-200 rounded"></div>
                    <div className="h-64 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </div>
            }
            onVisible={() => trackEvent('Landing Page', 'Pricing Calculator Viewed', 'Pricing Section')}
          >
            <PricingCalculator />
          </LazyLoad>

          {/* Additional Pricing Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
              <p className="text-gray-600">
                We believe in transparent pricing. What you see is what you pay, with no surprise charges or hidden fees.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Scaling</h3>
              <p className="text-gray-600">
                Our pricing scales with your cooperative. Only pay for what you need, and easily upgrade as you grow.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Support</h3>
              <p className="text-gray-600">
                All plans include our standard support package. Need more? Premium support options are available.
              </p>
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="mt-16">
            <LazyLoad
              onVisible={() => trackEvent('Landing Page', 'Feature Comparison Viewed', 'Pricing Section')}
            >
              <FeatureComparisonTable />
            </LazyLoad>
          </div>

          <div className="mt-12 text-center">
            <CTAButton
              href="/pricing"
              variant="primary"
              size="lg"
              onClick={() => handleCtaClick('view_pricing_details')}
            >
              View Detailed Pricing
            </CTAButton>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="How It Works"
            subtitle="Getting started with our cooperative system is simple and straightforward."
          />

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-blue-200 hidden md:block"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative bg-gray-50 p-6 rounded-lg shadow-md text-center">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Sign Up</h3>
                  <p className="text-gray-600">
                    Create your account and set up your cooperative's profile with basic information.
                  </p>
                </div>
              </div>

              <div className="relative bg-gray-50 p-6 rounded-lg shadow-md text-center">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Customize</h3>
                  <p className="text-gray-600">
                    Configure your system settings, add users, and customize the platform to match your branding.
                  </p>
                </div>
              </div>

              <div className="relative bg-gray-50 p-6 rounded-lg shadow-md text-center">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Go Live</h3>
                  <p className="text-gray-600">
                    Import your data, train your staff, and start managing your cooperative more efficiently.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <CTAButton
              href="/demo"
              variant="primary"
              size="lg"
              onClick={() => handleCtaClick('schedule_demo')}
            >
              Schedule a Demo
            </CTAButton>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about our cooperative system."
          />

          <LazyLoad
            onVisible={() => trackEvent('Landing Page', 'FAQ Section Viewed')}
          >
            <FAQSection />
          </LazyLoad>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-800"></div>

        {/* Background pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Cooperative?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join hundreds of credit cooperatives that have enhanced their operations
            and member experience with our system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton
              href="/register"
              variant="white"
              size="lg"
              className="font-semibold"
              onClick={() => handleCtaClick('get_started_free')}
            >
              Get Started Free
            </CTAButton>
            <CTAButton
              href="/contact"
              variant="outline"
              size="lg"
              className="text-white border-white hover:bg-white/10 font-semibold"
              onClick={() => handleCtaClick('contact_sales')}
            >
              Contact Sales
            </CTAButton>
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

      {/* Structured Data for SEO */}
      <StructuredData
        type="Organization"
        data={{
          name: 'Cooperative E-Wallet',
          url: 'https://cooperative-ewallet.com',
        }}
      />
      <StructuredData
        type="Product"
        data={{
          name: 'Cooperative E-Wallet System',
          description: 'A comprehensive financial management solution for credit cooperatives. Streamline operations, enhance member experience, and drive growth with our integrated platform.',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
          }
        }}
      />
      <StructuredData
        type="FAQPage"
        data={{
          questions: [
            {
              question: 'What is the Cooperative E-Wallet system?',
              answer: 'The Cooperative E-Wallet is a comprehensive financial management solution designed specifically for credit cooperatives. It includes features for loan management, savings accounts, mobile access, reporting and analytics, and more, all tailored to the unique needs of cooperatives.'
            },
            {
              question: 'How secure is the platform?',
              answer: 'Security is our top priority. The platform uses bank-level encryption, multi-factor authentication, role-based access control, and regular security audits to ensure your data is protected. We comply with all relevant data privacy regulations and industry best practices.'
            },
            {
              question: 'Can the system be customized for our cooperative?',
              answer: 'Yes, the system is highly customizable. You can configure it to match your cooperative\'s branding, workflows, loan products, interest rates, and more. We also offer custom development services for specific requirements.'
            }
          ]
        }}
      />
    </LandingLayout>
  );
}
