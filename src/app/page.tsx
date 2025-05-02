import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">
                Modern Credit Cooperative System
              </h1>
              <p className="text-xl mb-8">
                A comprehensive financial management solution for credit cooperatives.
                Streamline your operations, enhance member experience, and drive growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/about"
                  className="border border-white text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-white/10 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <Image
                src="/hero-image.svg"
                alt="Credit Cooperative System"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Key Features
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our system provides a comprehensive suite of tools to manage all aspects
              of your credit cooperative operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>
              <h3 className="text-xl font-semibold mb-2">Loan Management</h3>
              <p className="text-gray-600">
                Streamline the entire loan lifecycle from application to disbursement
                and repayment tracking.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>
              <h3 className="text-xl font-semibold mb-2">Savings Accounts</h3>
              <p className="text-gray-600">
                Manage various types of savings accounts with automated interest
                calculations and member statements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
              </div>
              <h3 className="text-xl font-semibold mb-2">Reporting & Analytics</h3>
              <p className="text-gray-600">
                Generate comprehensive reports and gain insights into your cooperative's
                financial performance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from credit cooperatives that have transformed their operations
              with our system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-medium">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-gray-600 text-sm">CEO, ABC Cooperative</p>
                </div>
              </div>
              <p className="text-gray-600">
                "This system has revolutionized how we manage our cooperative. The
                loan processing time has been reduced by 60%, and our members love
                the online access to their accounts."
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-medium">JS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Jane Smith</h4>
                  <p className="text-gray-600 text-sm">Manager, XYZ Credit Union</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The reporting capabilities are outstanding. We can now make data-driven
                decisions and have improved our financial performance significantly.
                The white-label feature allows us to maintain our brand identity."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Cooperative?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join hundreds of credit cooperatives that have enhanced their operations
            and member experience with our system.
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium text-lg hover:bg-gray-100 transition-colors inline-block"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </Layout>
  );
}
