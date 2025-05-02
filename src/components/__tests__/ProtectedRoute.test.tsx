import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    getCurrentUser: jest.fn(),
  },
}));

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => {
  const originalModule = jest.requireActual('@/contexts/AuthContext');
  return {
    ...originalModule,
    useAuth: jest.fn(),
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when authenticated', async () => {
    // Mock the useAuth hook to return authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 1, name: 'Test User' },
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // Check that the protected content is rendered
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show loading state when loading', async () => {
    // Mock the useAuth hook to return loading
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // Check that the loading indicator is shown
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // The protected content should not be rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', async () => {
    // Mock the useAuth hook to return not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // The protected content should not be rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    
    // Check that the router was called to redirect to login
    const { useRouter } = require('next/navigation');
    expect(useRouter().push).toHaveBeenCalledWith('/login');
  });

  it('should integrate with AuthProvider', async () => {
    // Mock the getCurrentUser API to return a user
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
      },
    };

    (api.getCurrentUser as jest.Mock).mockResolvedValue(mockResponse);

    // Set user in localStorage
    window.localStorage.setItem('user', JSON.stringify(mockUser));
    window.localStorage.setItem('token', 'mock-token');

    // Use the real AuthProvider
    (useAuth as jest.Mock).mockRestore();

    render(
      <AuthProvider>
        <ProtectedRoute>
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </AuthProvider>
    );

    // Initially it should be loading
    expect(screen.getByRole('status')).toBeInTheDocument();

    // After loading, the protected content should be rendered
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });
  });
});
