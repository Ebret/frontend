import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '@/app/register/page';
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

describe('Registration Flow (E2E)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('completes the registration process successfully', async () => {
    // Mock successful registration
    (api.register as jest.Mock).mockResolvedValue({
      status: 'success',
      message: 'Registration successful',
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
      },
    });

    render(<RegisterPage />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/last name/i), 'User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Test St');

    // Accept the privacy agreement
    const privacyCheckbox = screen.getByLabelText(/i agree to the data privacy agreement/i);
    await userEvent.click(privacyCheckbox);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    // Verify the API was called with the correct data
    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'Password123!',
        phoneNumber: '+1234567890',
        address: '123 Test St',
      }));
    });

    // Verify success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  it('displays validation errors for invalid inputs', async () => {
    render(<RegisterPage />);

    // Submit the form without filling it out
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    // Verify validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    // Fill out the form with invalid data
    await userEvent.type(screen.getByLabelText(/email address/i), 'invalid-email');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'short');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'different');

    // Submit the form again
    await userEvent.click(submitButton);

    // Verify validation errors for invalid data
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('requires privacy agreement acceptance', async () => {
    render(<RegisterPage />);

    // Fill out the form with valid data
    await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/last name/i), 'User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Test St');

    // Submit without accepting privacy agreement
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    // Verify privacy agreement error is displayed
    await waitFor(() => {
      expect(screen.getByText(/you must agree to the data privacy agreement/i)).toBeInTheDocument();
    });

    // Accept the privacy agreement
    const privacyCheckbox = screen.getByLabelText(/i agree to the data privacy agreement/i);
    await userEvent.click(privacyCheckbox);

    // Submit again
    await userEvent.click(submitButton);

    // Verify the API was called
    await waitFor(() => {
      expect(api.register).toHaveBeenCalled();
    });
  });

  it('handles API errors during registration', async () => {
    // Mock API error
    (api.register as jest.Mock).mockRejectedValue(new Error('Email already exists'));

    render(<RegisterPage />);

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
    await userEvent.type(screen.getByLabelText(/last name/i), 'User');
    await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await userEvent.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await userEvent.type(screen.getByLabelText(/address/i), '123 Test St');

    // Accept the privacy agreement
    const privacyCheckbox = screen.getByLabelText(/i agree to the data privacy agreement/i);
    await userEvent.click(privacyCheckbox);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await userEvent.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  it('opens and closes the privacy agreement modal', async () => {
    render(<RegisterPage />);

    // Open the privacy agreement modal
    const privacyLink = screen.getByRole('button', { name: /data privacy agreement/i });
    await userEvent.click(privacyLink);

    // Verify the modal is open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/data privacy agreement/i)).toBeInTheDocument();
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
