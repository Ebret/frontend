'use client';

import React from 'react';
import Layout from '@/components/Layout';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

const TermsPage: React.FC = () => {
  const { config } = useWhiteLabel();
  
  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Terms of Service</h1>
            <p className="mt-2 text-sm text-gray-500">
              Please read these terms carefully before using our services
            </p>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="prose max-w-none">
                    <h2>1. Introduction</h2>
                    <p>
                      Welcome to {config.name}. These Terms of Service govern your use of our website, mobile applications, and services. By accessing or using our services, you agree to be bound by these Terms.
                    </p>
                    
                    <h2>2. Definitions</h2>
                    <p>
                      <strong>"Cooperative"</strong> refers to {config.name}, a duly registered cooperative under Philippine laws.
                    </p>
                    <p>
                      <strong>"Services"</strong> refers to all financial and non-financial services offered by the Cooperative, including but not limited to savings, loans, and other member benefits.
                    </p>
                    <p>
                      <strong>"Member"</strong> refers to individuals who have been admitted to membership in the Cooperative in accordance with its By-laws.
                    </p>
                    
                    <h2>3. Membership</h2>
                    <p>
                      Membership in the Cooperative is open to all individuals who meet the qualifications set forth in the Cooperative's By-laws. Members are entitled to all the rights and privileges of membership, including the right to vote and be voted upon, and to avail of the Cooperative's services.
                    </p>
                    
                    <h2>4. Services</h2>
                    <p>
                      The Cooperative offers various services to its members, including but not limited to:
                    </p>
                    <ul>
                      <li>Savings and deposit accounts</li>
                      <li>Loan facilities</li>
                      <li>Insurance coverage</li>
                      <li>Financial education and training</li>
                    </ul>
                    <p>
                      The terms and conditions for each service are governed by separate agreements that members must agree to before availing of such services.
                    </p>
                    
                    <h2>5. Use of Digital Platforms</h2>
                    <p>
                      The Cooperative provides digital platforms for members to access services and information. When using these platforms, members agree to:
                    </p>
                    <ul>
                      <li>Provide accurate and complete information</li>
                      <li>Maintain the security of their account credentials</li>
                      <li>Use the platforms only for lawful purposes</li>
                      <li>Not attempt to disrupt or compromise the security of the platforms</li>
                    </ul>
                    
                    <h2>6. Privacy and Data Protection</h2>
                    <p>
                      The Cooperative collects and processes personal information in accordance with the Data Privacy Act of 2012 (RA 10173). For details on how we collect, use, and protect your information, please refer to our Privacy Policy.
                    </p>
                    
                    <h2>7. Intellectual Property</h2>
                    <p>
                      All content on the Cooperative's digital platforms, including but not limited to text, graphics, logos, and software, is the property of the Cooperative or its licensors and is protected by intellectual property laws.
                    </p>
                    
                    <h2>8. Limitation of Liability</h2>
                    <p>
                      To the maximum extent permitted by law, the Cooperative shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of its services.
                    </p>
                    
                    <h2>9. Changes to Terms</h2>
                    <p>
                      The Cooperative reserves the right to modify these Terms at any time. Members will be notified of significant changes, and continued use of the services after such modifications constitutes acceptance of the updated Terms.
                    </p>
                    
                    <h2>10. Governing Law</h2>
                    <p>
                      These Terms shall be governed by and construed in accordance with the laws of the Republic of the Philippines, without regard to its conflict of law provisions.
                    </p>
                    
                    <p className="text-sm text-gray-500 mt-8">
                      Last updated: {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default TermsPage;
