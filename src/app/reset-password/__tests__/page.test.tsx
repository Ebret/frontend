import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPasswordPage from '../page';
import { WhiteLabelProvider } from '@/contexts/WhiteLabelContext';
import { api } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    getWhiteLabelConfig: jest.fn(),
    // We'll add resetPassword when we implement it
  },
}));

// Mock the Layout component
jest.mock('@/components/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the WhiteLabel config
    (api.getWhiteLabelConfig as jest.Mock).mockResolvedValue({
      status: 'success',
      data: {
        config: {
          name: 'Credit Cooperative System',
          logo: '/logo.svg',
          primaryColor: '#007bff',
          secondaryColor: '#6c757d',
        },
      },
    });
  });

  it('should render the reset password form with valid token', async () => {
    // Mock the useSearchParams hook to return a token
    jest.mock('next/navigation', () => ({
      ...jest.requireActual('next/navigation'),
      useSearchParams: () => ({
        get: jest.fn().mockReturnValue('valid-token'),
      }),
    }));

    render(
      <WhiteLabelProvider>
        <ResetPasswordPage />
      </WhiteLabelProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });

    // Check form elements
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
  });

  it('should handle form submission with valid data', async () => {
    render(
      <WhiteLabelProvider>
        <ResetPasswordPage />
      </WhiteLabelProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });

    // Fill in the form
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/new password/i), 'newpassword123');
      await userEvent.type(screen.getByLabelText(/confirm new password/i), 'newpassword123');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });

    // Check that the success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/your password has been reset successfully/i)).toBeInTheDocument();
    });
  });

  it('should validate password match', async () => {
    render(
      <WhiteLabelProvider>
        <ResetPasswordPage />
      </WhiteLabelProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });

    // Fill in the form with mismatched passwords
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/new password/i), 'newpassword123');
      await userEvent.type(screen.getByLabelText(/confirm new password/i), 'differentpassword');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('should validate password length', async () => {
    render(
      <WhiteLabelProvider>
        <ResetPasswordPage />
      </WhiteLabelProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });

    // Fill in the form with a short password
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/new password/i), 'short');
      await userEvent.type(screen.getByLabelText(/confirm new password/i), 'short');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /reset password/i }));
    });

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });
  });

  it('should redirect to login page when clicking back to login link', async () => {
    render(
      <WhiteLabelProvider>
        <ResetPasswordPage />
      </WhiteLabelProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });

    // Click the back to login link
    const backToLoginLink = screen.getByText(/back to login/i);
    expect(backToLoginLink).toHaveAttribute('href', '/login');
  });
});
