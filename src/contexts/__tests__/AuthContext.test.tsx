import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../AuthContext';
import { api } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  api: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    logout: jest.fn(),
  },
}));

// Test component that uses the auth context
const TestComponent = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    register, 
    logout 
  } = useAuth();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'No User'}</div>
      <button onClick={() => login({ email: 'test@example.com', password: 'password' })}>Login</button>
      <button onClick={() => register({ 
        email: 'test@example.com', 
        password: 'password', 
        firstName: 'Test', 
        lastName: 'User',
        role: 'MEMBER'
      })}>Register</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Clear localStorage
    window.localStorage.clear();
  });

  it('should provide initial state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('user')).toHaveTextContent('No User');
  });

  it('should handle login success', async () => {
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
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    await act(async () => {
      userEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password' 
      });
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });
  });

  it('should handle login failure', async () => {
    (api.login as jest.Mock).mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      userEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password' 
      });
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });

  it('should handle registration success', async () => {
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
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    
    await act(async () => {
      userEvent.click(registerButton);
    });

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password', 
        firstName: 'Test', 
        lastName: 'User',
        role: 'MEMBER'
      });
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(window.localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });
  });

  it('should handle registration failure', async () => {
    (api.register as jest.Mock).mockRejectedValue(new Error('Registration failed'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    
    await act(async () => {
      userEvent.click(registerButton);
    });

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password', 
        firstName: 'Test', 
        lastName: 'User',
        role: 'MEMBER'
      });
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
    });
  });

  it('should handle logout', async () => {
    // First login to set the user
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
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      userEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
    });

    // Now logout
    const logoutButton = screen.getByText('Logout');
    
    await act(async () => {
      userEvent.click(logoutButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });

  it('should restore user from localStorage on mount', async () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'MEMBER',
    };

    // Set user in localStorage
    window.localStorage.setItem('user', JSON.stringify(mockUser));
    window.localStorage.setItem('token', 'mock-token');

    // Mock getCurrentUser to return the user
    const mockResponse = {
      status: 'success',
      data: {
        user: mockUser,
      },
    };

    (api.getCurrentUser as jest.Mock).mockResolvedValue(mockResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially it should be loading
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent(JSON.stringify(mockUser));
      expect(api.getCurrentUser).toHaveBeenCalled();
    });
  });

  it('should handle getCurrentUser failure', async () => {
    // Set user in localStorage
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'MEMBER',
    };

    window.localStorage.setItem('user', JSON.stringify(mockUser));
    window.localStorage.setItem('token', 'mock-token');

    // Mock getCurrentUser to fail
    (api.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Failed to get user'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('user')).toHaveTextContent('No User');
      expect(api.getCurrentUser).toHaveBeenCalled();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(window.localStorage.removeItem).toHaveBeenCalledWith('user');
    });
  });
});
