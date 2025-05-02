import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EWalletRegisterPage from '@/app/e-wallet/register/page';
import { api } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    register: jest.fn(),
  },
}));

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the contexts
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    register: jest.fn().mockResolvedValue({}),
    isAuthenticated: false,
    isLoading: false,
  }),
}));

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

describe('E-Wallet Registration Flow (E2E)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes the multi-step registration process successfully', async () => {
    // Mock successful registration
    const mockRegister = jest.fn().mockResolvedValue({});
    (useAuth as jest.Mock).mockReturnValue({
      register: mockRegister,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<EWalletRegisterPage />);

    // Step 1: Fill out basic information
    await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/last name/i), 'User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Move to next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    // Step 2: Fill out additional information
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/complete address/i), '123 Test St');
    
    // Select ID type
    const idTypeSelect = screen.getByLabelText(/id type/i);
    await userEvent.selectOptions(idTypeSelect, 'passport');
    
    await userEvent.type(screen.getByLabelText(/id number/i), 'AB123456');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');

    // Accept the privacy agreement
    const privacyCheckbox = screen.getByLabelText(/i agree to the data privacy agreement/i);
    await userEvent.click(privacyCheckbox);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    // Verify the API was called with the correct data
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123!',
        phoneNumber: '+1234567890',
        address: '123 Test St',
        dateOfBirth: '1990-01-01',
        idType: 'passport',
        idNumber: 'AB123456',
        accountType: 'e-wallet',
      }));
    });

    // Verify success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  it('validates each step before proceeding', async () => {
    render(<EWalletRegisterPage />);

    // Try to proceed without filling out Step 1
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    // Verify validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });

    // Fill out Step 1 with valid data
    await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/last name/i), 'User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Move to next step
    await userEvent.click(nextButton);

    // Try to submit Step 2 without filling it out
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    // Verify validation errors for Step 2
    await waitFor(() => {
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/id type is required/i)).toBeInTheDocument();
      expect(screen.getByText(/id number is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('requires privacy agreement acceptance before submission', async () => {
    render(<EWalletRegisterPage />);

    // Fill out Step 1
    await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/last name/i), 'User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Move to next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    // Fill out Step 2 without accepting privacy agreement
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/complete address/i), '123 Test St');
    await userEvent.selectOptions(screen.getByLabelText(/id type/i), 'passport');
    await userEvent.type(screen.getByLabelText(/id number/i), 'AB123456');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');

    // Submit without accepting privacy agreement
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    // Verify privacy agreement error is displayed
    await waitFor(() => {
      expect(screen.getByText(/you must agree to the data privacy agreement/i)).toBeInTheDocument();
    });
  });

  it('allows navigation between steps', async () => {
    render(<EWalletRegisterPage />);

    // Fill out Step 1
    await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/last name/i), 'User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Move to next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    // Verify we're on Step 2
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    // Go back to Step 1
    const backButton = screen.getByRole('button', { name: /back/i });
    await userEvent.click(backButton);

    // Verify we're back on Step 1
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
    });

    // Verify the data is preserved
    expect(screen.getByLabelText(/first name/i)).toHaveValue('Test');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('User');
    expect(screen.getByLabelText(/email address/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('+1234567890');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('1990-01-01');
  });

  it('opens and closes the e-wallet privacy agreement modal', async () => {
    render(<EWalletRegisterPage />);

    // Fill out Step 1 and move to Step 2
    await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/last name/i), 'User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);

    // Open the privacy agreement modal
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    const privacyLink = screen.getByRole('button', { name: /data privacy agreement/i });
    await userEvent.click(privacyLink);

    // Verify the modal is open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/data privacy agreement for test cooperative e-wallet/i)).toBeInTheDocument();
    });

    // Close the modal
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);

    // Verify the modal is closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
