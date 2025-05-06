import { Metadata } from 'next';

// Default metadata for the application
export const defaultMetadata: Metadata = {
  title: {
    default: 'Cooperative E-Wallet - Modern Financial Solutions',
    template: '%s | Cooperative E-Wallet'
  },
  description: 'A comprehensive e-wallet solution for cooperatives with loan management, savings accounts, and advanced reporting capabilities.',
  keywords: [
    'cooperative',
    'credit union',
    'e-wallet',
    'financial management',
    'loan management',
    'savings accounts',
    'reporting',
    'analytics',
    'mobile banking',
    'philippines'
  ],
  authors: [{ name: 'Cooperative E-Wallet Team' }],
  creator: 'Cooperative E-Wallet',
  publisher: 'Cooperative E-Wallet',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cooperative-ewallet.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'fil-PH': '/fil-PH',
    },
  },
  openGraph: {
    title: 'Cooperative E-Wallet - Modern Financial Solutions',
    description: 'A comprehensive e-wallet solution for cooperatives with loan management, savings accounts, and advanced reporting capabilities.',
    url: 'https://cooperative-ewallet.com',
    siteName: 'Cooperative E-Wallet',
    images: [
      {
        url: 'https://cooperative-ewallet.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Cooperative E-Wallet - Modern Financial Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cooperative E-Wallet - Modern Financial Solutions',
    description: 'A comprehensive e-wallet solution for cooperatives with loan management, savings accounts, and advanced reporting capabilities.',
    creator: '@coopewallet',
    images: ['https://cooperative-ewallet.com/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        url: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        url: '/favicon-16x16.png',
      },
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      me: ['info@cooperative-ewallet.com'],
    },
  },
  category: 'finance',
};

// Generate metadata for the landing page
export function generateLandingPageMetadata(): Metadata {
  return {
    ...defaultMetadata,
    title: 'Cooperative E-Wallet - Modern Financial Solutions for Credit Cooperatives',
    description: 'A comprehensive financial management solution for credit cooperatives. Streamline operations, enhance member experience, and drive growth with our integrated platform.',
    openGraph: {
      ...defaultMetadata.openGraph,
      title: 'Cooperative E-Wallet - Modern Financial Solutions for Credit Cooperatives',
      description: 'A comprehensive financial management solution for credit cooperatives. Streamline operations, enhance member experience, and drive growth with our integrated platform.',
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: 'Cooperative E-Wallet - Modern Financial Solutions for Credit Cooperatives',
      description: 'A comprehensive financial management solution for credit cooperatives. Streamline operations, enhance member experience, and drive growth with our integrated platform.',
    },
  };
}
