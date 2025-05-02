'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

interface DataPrivacyAgreementProps {
  cooperativeName: string;
}

const DataPrivacyAgreement: React.FC<DataPrivacyAgreementProps> = ({ cooperativeName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline"
      >
        View Data Privacy Agreement
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <img
                          src="/images/dpo-dps-logo.png"
                          alt="DPO/DPS Registered"
                          className="h-16 w-14"
                        />
                      </div>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Cooperative Data Privacy Agreement
                      </Dialog.Title>
                    </div>
                  </div>

                  <div className="mt-2 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="text-sm text-gray-500 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md inline-block">
                          DPO/DPS Registered - In compliance with Republic Act No. 10173 - Data Privacy Act of 2012
                        </div>
                        <div className="text-right">
                          <strong>Effective Date:</strong> {currentDate}<br />
                          <strong>Version:</strong> 1.0
                        </div>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">1. Purpose</h4>
                        <p>
                          This Data Privacy Agreement outlines how {cooperativeName} ("the Cooperative") collects, uses, stores, shares, and protects personal data of its stakeholders, including members, employees, officers, and partners, in accordance with the Data Privacy Act of 2012 (RA 10173) and its Implementing Rules and Regulations.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">2. Scope</h4>
                        <p>
                          This agreement applies to all individuals interacting with the Cooperative's systems, including but not limited to:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Members</li>
                          <li>Employees (e.g., Admins, Tellers, Credit Officers, Accountants, Compliance Officers)</li>
                          <li>Board of Directors and Managers</li>
                          <li>Third-Party Partners (e.g., service providers, consultants)</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">3. Data Collected</h4>
                        <p>
                          Depending on the user's role and interaction with the Cooperative, the following personal data may be collected:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li><strong>Personal Information:</strong> Full name, date of birth, gender, civil status, nationality, address, contact details, government-issued IDs.</li>
                          <li><strong>Financial Information:</strong> Bank account details, income sources, loan records, transaction histories.</li>
                          <li><strong>Employment Details:</strong> Position, department, employment history, performance evaluations.</li>
                          <li><strong>Digital Information:</strong> IP addresses, device information, login credentials, usage logs.</li>
                          <li><strong>Biometric Data:</strong> Photographs, signatures, fingerprints (if applicable).</li>
                          <li><strong>Other Sensitive Information:</strong> Health records, if required for specific services.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">4. Purpose of Data Processing</h4>
                        <p>
                          The Cooperative processes personal data for the following purposes:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li><strong>Membership Management:</strong> Enrollment, verification, and maintenance of member records.</li>
                          <li><strong>Service Provision:</strong> Processing of loans, savings, and other financial services.</li>
                          <li><strong>Human Resources:</strong> Employee recruitment, payroll, performance management.</li>
                          <li><strong>Compliance and Reporting:</strong> Adherence to legal and regulatory requirements.</li>
                          <li><strong>Communication:</strong> Dissemination of announcements, updates, and promotional materials.</li>
                          <li><strong>Security:</strong> Monitoring and ensuring the security of Cooperative premises and systems.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">5. Data Sharing and Disclosure</h4>
                        <p>
                          Personal data may be shared with:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li><strong>Regulatory Bodies:</strong> Such as the Cooperative Development Authority (CDA), Bangko Sentral ng Pilipinas (BSP), and the National Privacy Commission (NPC), as required by law.</li>
                          <li><strong>Third-Party Service Providers:</strong> For services like IT support, auditing, and payment processing, under strict confidentiality agreements.</li>
                          <li><strong>Partner Institutions:</strong> For collaborative programs, subject to Data Sharing Agreements in compliance with NPC Circulars.</li>
                        </ul>
                        <p className="mt-2">
                          All data sharing activities will adhere to the principles of transparency, legitimate purpose, and proportionality.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">6. Data Retention</h4>
                        <p>
                          Personal data will be retained only for as long as necessary to fulfill the purposes stated above or as required by law. Upon expiration of the retention period, data will be securely disposed of to prevent unauthorized access.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">7. Data Subject Rights</h4>
                        <p>
                          In accordance with RA 10173, data subjects have the following rights:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li><strong>Right to be Informed:</strong> About the collection and use of their personal data.</li>
                          <li><strong>Right to Access:</strong> Their personal data held by the Cooperative.</li>
                          <li><strong>Right to Rectification:</strong> To correct inaccurate or outdated data.</li>
                          <li><strong>Right to Erasure or Blocking:</strong> Of data that is no longer necessary or unlawfully processed.</li>
                          <li><strong>Right to Object:</strong> To processing of data for marketing, profiling, or other purposes.</li>
                          <li><strong>Right to Data Portability:</strong> To obtain a copy of their data in a structured format.</li>
                          <li><strong>Right to File a Complaint:</strong> With the NPC for any violations of their data privacy rights.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">8. Security Measures</h4>
                        <p>
                          The Cooperative implements appropriate organizational, technical, and physical measures to safeguard personal data, including:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li><strong>Access Controls:</strong> Limiting data access to authorized personnel.</li>
                          <li><strong>Encryption:</strong> Of sensitive data during storage and transmission.</li>
                          <li><strong>Regular Audits:</strong> To assess and enhance data protection measures.</li>
                          <li><strong>Employee Training:</strong> On data privacy principles and practices.</li>
                          <li><strong>Incident Response Protocols:</strong> For timely management of data breaches.</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">9. Consent</h4>
                        <p>
                          By signing this agreement or using the Cooperative's services, you, as our valued Kapamilya member, consent to the collection, processing, and sharing of your personal data as outlined herein.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">10. Contact Information</h4>
                        <p>
                          For inquiries, concerns, or requests related to data privacy, please contact:
                        </p>
                        <p className="mt-2">
                          <strong>Data Protection Officer</strong><br />
                          [Name]<br />
                          [Contact Number]<br />
                          [Email Address]<br />
                          [Office Address]
                        </p>
                        <p className="mt-2">
                          This agreement is subject to periodic review and may be updated to reflect changes in legal requirements or Cooperative policies.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DataPrivacyAgreement;
