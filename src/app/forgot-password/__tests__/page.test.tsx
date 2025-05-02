import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordPage from '../page';
import { WhiteLabelProvider } from '@/contexts/WhiteLabelContext';
import { api } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    getWhiteLabelConfig: jest.fn(),
    // We'll add forgotPassword when we implement it
  },
}));

// Mock the Layout component
jest.mock('@/components/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

describe('ForgotPasswordPage', () => {
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

  it('should render the forgot password form', async () => {
    render(
      <WhiteLabelProvider>
        <ForgotPasswordPage />
      </WhiteLabelProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });

    // Check form elements
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
    expect(screen.getByText(/create account/i)).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    render(
      <WhiteLabelProvider>
        <ForgotPasswordPage />
      </WhiteLabelProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });

    // Fill in the form
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /send reset link/i }));
    });

    // Check that the success message is displayed
    await waitFor(() => {
      expect(screen.getByText(/if an account with that email exists/i)).toBeInTheDocument();
    });

    // The email field should be cleared
    expect(screen.getByLabelText(/email address/i)).toHaveValue('');
  });

  it('should redirect to login page when clicking back to login link', async () => {
    render(
      <WhiteLabelProvider>
        <ForgotPasswordPage />
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

  it('should redirect to register page when clicking create account link', async () => {
    render(
      <WhiteLabelProvider>
        <ForgotPasswordPage />
      </WhiteLabelProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Reset your password')).toBeInTheDocument();
    });

    // Click the create account link
    const createAccountLink = screen.getByText(/create account/i);
    expect(createAccountLink).toHaveAttribute('href', '/register');
  });
});
