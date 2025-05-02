'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';
import CooperativeCookieConsent from '@/components/CooperativeCookieConsent';

interface CookieConsentContextType {
  consentGiven: boolean;
  setConsentGiven: (value: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consentGiven, setConsentGiven] = useLocalStorage('cookie-consent', false);
  const router = useRouter();

  const handleLearnMore = () => {
    router.push('/privacy-policy');
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consentGiven,
        setConsentGiven,
      }}
    >
      {children}
      <CooperativeCookieConsent
        onAccept={() => setConsentGiven(true)}
        onDecline={() => setConsentGiven(true)} // Still mark as given even if declined
        onLearnMore={handleLearnMore}
      />
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = () => {
  const context = useContext(CookieConsentContext);

  if (context === undefined) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }

  return context;
};
