import React, { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

type CooperativeCookieConsentProps = {
  onAccept?: () => void;
  onDecline?: () => void;
  onLearnMore?: () => void;
};

const CooperativeCookieConsent: React.FC<CooperativeCookieConsentProps> = ({
  onAccept,
  onDecline,
  onLearnMore,
}) => {
  const [consentGiven, setConsentGiven] = useLocalStorage('cookie-consent', false);
  const [isVisible, setIsVisible] = useState(false);
  const { config } = useWhiteLabel();

  useEffect(() => {
    // Show the banner if consent hasn't been given yet
    if (!consentGiven) {
      // Small delay to prevent the banner from flashing on page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [consentGiven]);

  const handleAccept = () => {
    setConsentGiven(true);
    setIsVisible(false);
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    // Even if declined, we need to remember this choice
    setConsentGiven(true);
    setIsVisible(false);
    if (onDecline) onDecline();
  };

  const handleLearnMore = () => {
    if (onLearnMore) onLearnMore();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative max-w-md w-full bg-black text-white p-6 rounded-lg shadow-lg">
        <button
          onClick={handleDecline}
          className="absolute top-2 right-2 text-white hover:text-gray-300"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-center mb-4">
          <div className="mr-4 flex-shrink-0">
            <img
              src="/images/dpo-dps-logo.png"
              alt="DPO/DPS Registered"
              width={100}
              height={120}
              className="object-contain"
            />
          </div>
          <div>
            <p className="text-xl font-medium mb-2">
              Welcome, Kacooperatiba!
            </p>
            <p className="text-base">
              We use cookies to improve your browsing experience. Continuing to use this site means you agree to our use of cookies.{' '}
              <button
                onClick={handleLearnMore}
                className="text-blue-400 hover:underline focus:outline-none"
              >
                Tell me more!
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAccept}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-150 ease-in-out"
          >
            I AGREE!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CooperativeCookieConsent;
