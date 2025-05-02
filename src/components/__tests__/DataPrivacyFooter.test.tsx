import React from 'react';
import { render, screen } from '@testing-library/react';
import DataPrivacyFooter from '../DataPrivacyFooter';

// Mock the WhiteLabelContext
jest.mock('@/contexts/WhiteLabelContext', () => ({
  ...jest.requireActual('@/contexts/WhiteLabelContext'),
  useWhiteLabel: () => ({
    config: {
      name: 'Test Cooperative',
      primaryColor: '#3B82F6',
      logoUrl: '/logo.png',
      domain: 'testcoop.com',
    },
  }),
}));

describe('DataPrivacyFooter', () => {
  it('renders the footer with the cooperative name', () => {
    render(<DataPrivacyFooter />);
    
    expect(screen.getByText(/test cooperative complies with the data privacy act of 2012/i)).toBeInTheDocument();
  });

  it('displays the Philippines Data Privacy Act logo', () => {
    render(<DataPrivacyFooter />);
    
    const logo = screen.getByAltText('Philippines Data Privacy Act Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/images/ph-data-privacy-logo.svg');
  });

  it('includes links to privacy policy and terms of service', () => {
    render(<DataPrivacyFooter />);
    
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
    const termsLink = screen.getByRole('link', { name: /terms of service/i });
    
    expect(privacyLink).toBeInTheDocument();
    expect(termsLink).toBeInTheDocument();
    
    expect(privacyLink).toHaveAttribute('href', '/privacy-policy');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  it('displays the current year in the copyright notice', () => {
    render(<DataPrivacyFooter />);
    
    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${currentYear} test cooperative`, 'i'))).toBeInTheDocument();
  });
});
