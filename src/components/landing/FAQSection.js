import React, { useState } from 'react';
import { trackEvent } from '@/utils/analytics';

const FAQSection = ({ faqs = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  // Default FAQs if none provided
  const defaultFaqs = [
    {
      question: 'What is the Cooperative E-Wallet system?',
      answer: 'The Cooperative E-Wallet is a comprehensive financial management solution designed specifically for credit cooperatives. It includes features for loan management, savings accounts, mobile access, reporting and analytics, and more, all tailored to the unique needs of cooperatives.',
    },
    {
      question: 'How secure is the platform?',
      answer: 'Security is our top priority. The platform uses bank-level encryption, multi-factor authentication, role-based access control, and regular security audits to ensure your data is protected. We comply with all relevant data privacy regulations and industry best practices.',
    },
    {
      question: 'Can the system be customized for our cooperative?',
      answer: 'Yes, the system is highly customizable. You can configure it to match your cooperative\'s branding, workflows, loan products, interest rates, and more. We also offer custom development services for specific requirements.',
    },
    {
      question: 'How long does implementation take?',
      answer: 'The typical implementation timeline is 4-6 weeks, depending on the size of your cooperative and the complexity of your requirements. This includes system configuration, data migration, user training, and testing.',
    },
    {
      question: 'Do you offer training and support?',
      answer: 'Yes, we provide comprehensive training for all users, from administrators to tellers. Our support team is available via phone, email, and chat during business hours, and we offer 24/7 emergency support for critical issues.',
    },
    {
      question: 'Can members access their accounts online?',
      answer: 'Yes, members can access their accounts through a web portal or mobile app. They can view their account balances, transaction history, loan status, make payments, and apply for loans online.',
    },
    {
      question: 'How is data migrated from our existing system?',
      answer: 'We have a structured data migration process that includes data extraction, transformation, validation, and loading. Our team works closely with you to ensure all your historical data is accurately migrated to the new system.',
    },
    {
      question: 'What kind of reports can the system generate?',
      answer: 'The system can generate a wide range of reports, including financial statements, loan portfolio analysis, member statistics, compliance reports, and more. You can also create custom reports based on your specific requirements.',
    },
  ];

  // Use provided FAQs or default ones
  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  // Toggle FAQ
  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
    
    // Track event if opening
    if (openIndex !== index) {
      trackEvent('FAQ', 'Question Opened', displayFaqs[index].question);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
              <button
                className="flex justify-between items-center w-full text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
                onClick={() => toggleFaq(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              
              <div
                id={`faq-answer-${index}`}
                className={`mt-2 transition-all duration-200 overflow-hidden ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={openIndex !== index}
              >
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Still have questions? We're here to help.
          </p>
          <button
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => trackEvent('FAQ', 'Contact Support Clicked')}
          >
            Contact Support
            <svg
              className="ml-2 -mr-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
