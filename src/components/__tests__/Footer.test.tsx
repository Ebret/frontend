import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

// Mock the WhiteLabelContext
jest.mock('@/contexts/WhiteLabelContext', () => ({
  useWhiteLabel: () => ({
    config: {
      name: 'Test Cooperative',
      primaryColor: '#3B82F6',
      logoUrl: '/logo.png',
      domain: 'testcoop.com',
    },
  }),
}));

describe('Footer Component', () => {
  it('renders the footer with cooperative name', () => {
    render(<Footer />);

    // Check if the cooperative name is displayed
    // Use getAllByText since the name appears multiple times
    const nameElements = screen.getAllByText(/Test Cooperative/i);
    expect(nameElements.length).toBeGreaterThan(0);
  });

  it('displays the current year in the copyright notice', () => {
    render(<Footer />);

    // Get the current year
    const currentYear = new Date().getFullYear().toString();

    // Check if the copyright notice includes the current year
    expect(screen.getByText(new RegExp(`© ${currentYear}`, 'i'))).toBeInTheDocument();
  });

  it('includes links to important pages', () => {
    render(<Footer />);

    // Check if the links are displayed
    const homeLink = screen.getByRole('link', { name: /home/i });
    const loansLink = screen.getByRole('link', { name: /loans/i });

    expect(homeLink).toBeInTheDocument();
    expect(loansLink).toBeInTheDocument();

    // Check if the links have the correct href attributes
    expect(homeLink).toHaveAttribute('href', '/');
    expect(loansLink).toHaveAttribute('href', '/loans');
  });
});
