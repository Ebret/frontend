'use client';

import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

interface EWalletDataPrivacyAgreementProps {
  onAgree?: () => void;
  standalone?: boolean;
}

const EWalletDataPrivacyAgreement: React.FC<EWalletDataPrivacyAgreementProps> = ({ 
  onAgree,
  standalone = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const { config } = useWhiteLabel();
  
  const eWalletName = `${config.name} E-Wallet`;
  const effectiveDate = "April 30, 2025";
  
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  
  const handleAgree = () => {
    setIsAgreed(true);
    if (onAgree) {
      onAgree();
    }
    closeModal();
  };

  return (
    <>
      {!standalone ? (
        <button
          type="button"
          onClick={openModal}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline"
        >
          Data Privacy Agreement
        </button>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={openModal}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            View Data Privacy Agreement
          </button>
        </div>
      )}

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
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Data Privacy Agreement for {eWalletName}
                    </Dialog.Title>
                    <div className="flex-shrink-0">
                      <img 
                        src="/images/ph-data-privacy-logo.svg" 
                        alt="Philippines Data Privacy Act Logo" 
                        className="h-16 w-16"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-2 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="text-sm text-gray-500 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md inline-block">
                          In compliance with Republic Act No. 10173 - Data Privacy Act of 2012
                        </div>
                        <div className="text-right">
                          <strong>Effective Date:</strong> {effectiveDate}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">1. Introduction</h4>
                        <p>
                          {eWalletName} ("we," "our," or "us") values your privacy and is committed to protecting your personal data. This Data Privacy Agreement outlines how we collect, use, store, and disclose your personal information in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and its Implementing Rules and Regulations.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">2. Collection and Use of Personal Data</h4>
                        <p>
                          We collect and process your personal data to:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Create and manage your e-wallet account: This includes verifying your identity and ensuring compliance with legal requirements.</li>
                          <li>Facilitate transactions: Such as sending or receiving money, paying bills, and purchasing goods or services.</li>
                          <li>Enhance user experience: By analyzing usage patterns to improve our services.</li>
                        </ul>
                        <p className="mt-2">
                          The personal data we collect may include:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Full name</li>
                          <li>Date of birth</li>
                          <li>Address</li>
                          <li>Contact information (e.g., phone number, email address)</li>
                          <li>Government-issued identification details</li>
                          <li>Financial information necessary for transactions</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">3. Data Sharing and Disclosure</h4>
                        <p>
                          We may share your personal data with third parties, including:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Service providers: Who assist in operating our platform and providing services to you.</li>
                          <li>Regulatory authorities: To comply with legal obligations, such as anti-money laundering laws.</li>
                        </ul>
                        <p className="mt-2">
                          All third parties are required to handle your data in accordance with this agreement and applicable laws.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">4. Data Protection Measures</h4>
                        <p>
                          We implement appropriate organizational, technical, and physical security measures to safeguard your personal data against unauthorized access, disclosure, alteration, or destruction.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">5. Data Retention</h4>
                        <p>
                          Your personal data will be retained only for as long as necessary to fulfill the purposes outlined in this agreement, unless a longer retention period is required or permitted by law.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">6. Your Rights</h4>
                        <p>
                          Under the Data Privacy Act, you have the right to:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li><strong>Access:</strong> Request access to your personal data.</li>
                          <li><strong>Correction:</strong> Request correction of inaccurate or outdated data.</li>
                          <li><strong>Erasure:</strong> Request deletion of your data under certain circumstances.</li>
                          <li><strong>Object:</strong> Object to the processing of your data.</li>
                          <li><strong>Data Portability:</strong> Obtain a copy of your data in a commonly used format.</li>
                        </ul>
                        <p className="mt-2">
                          To exercise these rights, please contact our Data Protection Officer at:
                        </p>
                        <p className="mt-2">
                          <strong>Email:</strong> dpo@{config.domain}<br />
                          <strong>Address:</strong> {config.address || '[Insert Physical Address]'}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-gray-900 font-medium mb-2">7. Consent</h4>
                        <p>
                          By clicking the "Agree" button below, you acknowledge that you have read, understood, and consented to the terms of this Data Privacy Agreement.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    {standalone && (
                      <div className="flex items-start mb-4">
                        <div className="flex items-center h-5">
                          <input
                            id="privacy-agreement"
                            name="privacy-agreement"
                            type="checkbox"
                            checked={isAgreed}
                            onChange={(e) => setIsAgreed(e.target.checked)}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="privacy-agreement" className="font-medium text-gray-700">
                            I have read and agree to the Data Privacy Agreement.
                          </label>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      
                      {standalone && (
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                          onClick={handleAgree}
                          disabled={!isAgreed}
                        >
                          Agree
                        </button>
                      )}
                    </div>
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

export default EWalletDataPrivacyAgreement;
