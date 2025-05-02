import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../page';
import { AuthProvider } from '@/contexts/AuthContext';
import { WhiteLabelProvider } from '@/contexts/WhiteLabelContext';
import { api } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    login: jest.fn(),
    getCurrentUser: jest.fn(),
    getWhiteLabelConfig: jest.fn(),
  },
}));

// Mock the Layout component
jest.mock('@/components/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
    
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

  it('should render the login form', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <LoginPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    // Check form elements
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
    expect(screen.getByText(/create a new account/i)).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'MEMBER',
    };

    const mockResponse = {
      status: 'success',
      data: {
        user: mockUser,
        token: 'mock-token',
      },
    };

    (api.login as jest.Mock).mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <LoginPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    // Fill in the form
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    // Check that the login API was called with the correct data
    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should handle login failure', async () => {
    (api.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <LoginPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    // Fill in the form
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    });

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <LoginPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    // Get the password input and toggle button
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Initially the password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the toggle button
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: '' }));
    });

    // Now the password should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click the toggle button again
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: '' }));
    });

    // The password should be hidden again
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should redirect to register page when clicking create account link', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <LoginPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    // Click the create account link
    const createAccountLink = screen.getByText(/create a new account/i);
    expect(createAccountLink).toHaveAttribute('href', '/register');
  });

  it('should redirect to forgot password page when clicking forgot password link', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <LoginPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    });

    // Click the forgot password link
    const forgotPasswordLink = screen.getByText(/forgot your password/i);
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
  });
});
