import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../page';
import { AuthProvider } from '@/contexts/AuthContext';
import { WhiteLabelProvider } from '@/contexts/WhiteLabelContext';
import { api } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    getWhiteLabelConfig: jest.fn(),
  },
}));

// Mock the Layout component
jest.mock('@/components/Layout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

describe('RegisterPage', () => {
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

  it('should render the registration form', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <RegisterPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    // Check form elements
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('should handle successful registration', async () => {
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

    (api.register as jest.Mock).mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <RegisterPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    // Fill in the form
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
      await userEvent.type(screen.getByLabelText(/last name/i), 'User');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/phone number/i), '1234567890');
      await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Check that the register API was called with the correct data
    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        password: 'password123',
        phoneNumber: '1234567890',
        address: '123 Main St',
        role: 'MEMBER',
      });
    });
  });

  it('should handle registration failure', async () => {
    (api.register as jest.Mock).mockRejectedValue(new Error('Email already exists'));

    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <RegisterPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    // Fill in the form
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
      await userEvent.type(screen.getByLabelText(/last name/i), 'User');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
      await userEvent.type(screen.getByLabelText(/phone number/i), '1234567890');
      await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });

  it('should validate password match', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <RegisterPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    // Fill in the form with mismatched passwords
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
      await userEvent.type(screen.getByLabelText(/last name/i), 'User');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'password123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'password456');
      await userEvent.type(screen.getByLabelText(/phone number/i), '1234567890');
      await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });

    // The API should not be called
    expect(api.register).not.toHaveBeenCalled();
  });

  it('should validate password length', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <RegisterPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    // Fill in the form with a short password
    await act(async () => {
      await userEvent.type(screen.getByLabelText(/first name/i), 'Test');
      await userEvent.type(screen.getByLabelText(/last name/i), 'User');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'pass');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'pass');
      await userEvent.type(screen.getByLabelText(/phone number/i), '1234567890');
      await userEvent.type(screen.getByLabelText(/address/i), '123 Main St');
    });

    // Submit the form
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));
    });

    // Check that the error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });

    // The API should not be called
    expect(api.register).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <RegisterPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    // Get the password inputs and toggle buttons
    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    
    // Initially the passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Get all toggle buttons (there should be two)
    const toggleButtons = screen.getAllByRole('button', { name: '' });
    
    // Click the first toggle button (for password)
    await act(async () => {
      await userEvent.click(toggleButtons[0]);
    });

    // Now the password should be visible but confirm password still hidden
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Click the second toggle button (for confirm password)
    await act(async () => {
      await userEvent.click(toggleButtons[1]);
    });

    // Now both passwords should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('should redirect to login page when clicking sign in link', async () => {
    render(
      <AuthProvider>
        <WhiteLabelProvider>
          <RegisterPage />
        </WhiteLabelProvider>
      </AuthProvider>
    );

    // Wait for the page to load
    await waitFor(() => {
      expect(screen.getByText('Create an account')).toBeInTheDocument();
    });

    // Click the sign in link
    const signInLink = screen.getByText(/sign in/i);
    expect(signInLink).toHaveAttribute('href', '/login');
  });
});
