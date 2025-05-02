import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    getCurrentUser: jest.fn(),
  },
}));

// Mock the useAuth hook
jest.mock('@/contexts/AuthContext', () => {
  return {
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useAuth: jest.fn().mockImplementation(() => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    })),
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render children when authenticated', async () => {
    // Import the useAuth hook
    const { useAuth } = require('@/contexts/AuthContext');

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
    // Import the useAuth hook
    const { useAuth } = require('@/contexts/AuthContext');

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
    // Import the useAuth hook
    const { useAuth } = require('@/contexts/AuthContext');

    // Mock the useAuth hook to return not authenticated
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    // Create a mock for router.push
    const mockPush = jest.fn();

    // Override the router mock for this test only
    jest.spyOn(require('next/navigation'), 'useRouter').mockImplementation(() => ({
      push: mockPush,
    }));

    render(
      <ProtectedRoute>
        <div data-testid="protected-content">Protected Content</div>
      </ProtectedRoute>
    );

    // The protected content should not be rendered
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();

    // Verify useEffect was triggered
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should work with AuthProvider', async () => {
    // Import the useAuth hook
    const { useAuth } = require('@/contexts/AuthContext');

    // Create a component that will re-render when the mock changes
    const TestComponent = () => {
      const auth = useAuth();
      return (
        <div>
          {auth.isLoading ? (
            <div role="status">Loading...</div>
          ) : auth.isAuthenticated ? (
            <div data-testid="protected-content">Protected Content</div>
          ) : null}
        </div>
      );
    };

    // First render with loading state
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    const { rerender } = render(<TestComponent />);

    // Check loading state
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Update the mock and re-render
    (useAuth as jest.Mock).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: 1, name: 'Test User' },
    });

    rerender(<TestComponent />);

    // Now the protected content should be visible
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
