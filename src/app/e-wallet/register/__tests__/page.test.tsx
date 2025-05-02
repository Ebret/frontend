import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EWalletRegisterPage from '../page';
import { logDataPrivacyAgreementAccepted, logEWalletCreation } from '@/lib/auditLogger';

// Mock the necessary dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    register: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
    isAuthenticated: false,
    isLoading: false,
  }),
}));

jest.mock('@/contexts/WhiteLabelContext', () => ({
  useWhiteLabel: () => ({
    config: {
      name: 'Test Cooperative',
      logoUrl: '/logo.png',
      primaryColor: '#3B82F6',
      domain: 'testcoop.com',
    },
  }),
}));

jest.mock('@/lib/auditLogger', () => ({
  logDataPrivacyAgreementAccepted: jest.fn().mockResolvedValue({}),
  logEWalletCreation: jest.fn().mockResolvedValue({}),
}));

describe('EWalletRegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the registration form with all required fields', () => {
    render(<EWalletRegisterPage />);

    // Step 1 fields should be visible
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();

    // Next button should be visible
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('validates required fields in step 1 before proceeding', async () => {
    render(<EWalletRegisterPage />);

    // Try to proceed without filling out the form
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Error messages should be displayed
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  it('proceeds to step 2 when step 1 is valid', async () => {
    render(<EWalletRegisterPage />);

    // Fill out step 1
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Proceed to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Step 2 fields should be visible
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/id type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/id number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      // Check for the privacy checkbox by ID instead of text
      expect(screen.getByRole('checkbox', { name: /i agree to the/i })).toBeInTheDocument();
    });
  });

  it('validates required fields in step 2 before submission', async () => {
    render(<EWalletRegisterPage />);

    // Fill out step 1
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Proceed to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Try to submit without filling out step 2
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    // Submit the form without filling out required fields
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Verify that we're still on step 2 (form didn't submit)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });
  });

  it('requires privacy agreement acceptance before submission', async () => {
    render(<EWalletRegisterPage />);

    // Fill out step 1
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Proceed to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Fill out step 2 without accepting privacy agreement
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/complete address/i), '123 Main St');
    await userEvent.selectOptions(screen.getByLabelText(/id type/i), 'passport');
    await userEvent.type(screen.getByLabelText(/id number/i), 'AB123456');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');

    // Try to submit without accepting privacy agreement
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Verify that we're still on step 2 (form didn't submit)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
      expect(screen.getByRole('checkbox', { name: /i agree to the/i })).toBeInTheDocument();
    });
  });

  it('submits the form and logs audit events when all fields are valid', async () => {
    // Mock the register function
    const mockRegister = jest.fn().mockResolvedValue({ id: 1, email: 'john.doe@example.com' });
    jest.mock('@/contexts/AuthContext', () => ({
      useAuth: () => ({
        register: mockRegister,
        isAuthenticated: false,
        isLoading: false,
      }),
    }));

    // Reset the mocks for audit logging
    (logDataPrivacyAgreementAccepted as jest.Mock).mockClear();
    (logEWalletCreation as jest.Mock).mockClear();

    render(<EWalletRegisterPage />);

    // Fill out step 1
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Proceed to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Fill out step 2
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/complete address/i), '123 Main St');
    await userEvent.selectOptions(screen.getByLabelText(/id type/i), 'passport');
    await userEvent.type(screen.getByLabelText(/id number/i), 'AB123456');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');

    // Accept privacy agreement
    const privacyCheckbox = screen.getByRole('checkbox', { name: /i agree to the/i });
    fireEvent.click(privacyCheckbox);

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    // Verify that the audit log functions were called
    await waitFor(() => {
      expect(logDataPrivacyAgreementAccepted).toHaveBeenCalled();
      expect(logEWalletCreation).toHaveBeenCalled();
    });

    // Success message should be displayed
    await waitFor(() => {
      expect(screen.getByText(/your e-wallet account has been created successfully/i)).toBeInTheDocument();
    });
  });

  it('allows navigation between steps', async () => {
    render(<EWalletRegisterPage />);

    // Fill out step 1
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    // Proceed to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Verify we're on step 2
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    // Go back to step 1
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    // Verify we're back on step 1
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    // Verify the data is preserved
    expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/email address/i)).toHaveValue('john.doe@example.com');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('+1234567890');
    expect(screen.getByLabelText(/date of birth/i)).toHaveValue('1990-01-01');
  });

  it('displays the data privacy agreement checkbox in step 2', async () => {
    render(<EWalletRegisterPage />);

    // Fill out step 1 and proceed to step 2
    await userEvent.type(screen.getByLabelText(/first name/i), 'John');
    await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
    await userEvent.type(screen.getByLabelText(/email address/i), 'john.doe@example.com');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/date of birth/i), '1990-01-01');

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    // Wait for step 2 to be visible
    await waitFor(() => {
      expect(screen.getByLabelText(/complete address/i)).toBeInTheDocument();
    });

    // Verify that the privacy checkbox is present
    expect(screen.getByRole('checkbox', { name: /i agree to the/i })).toBeInTheDocument();

    // Verify that the compliance text is displayed
    expect(screen.getByText(/in compliance with/i)).toBeInTheDocument();
  });
});
