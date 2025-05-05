import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

// Mock the AuthContext
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: {
      firstName: 'Test',
      lastName: 'User',
      role: 'ADMIN',
    },
    logout: jest.fn(),
  }),
}));

// Mock the WhiteLabelContext
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

// Mock the NotificationContext
jest.mock('@/contexts/NotificationContext', () => ({
  useNotifications: () => ({
    unreadCount: 3,
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/dashboard',
}));

describe('Header Component', () => {
  it('renders the header with cooperative name', () => {
    render(<Header />);

    // Check if the cooperative name is displayed
    expect(screen.getByText('Test Cooperative')).toBeInTheDocument();
  });

  it('displays user information when authenticated', () => {
    render(<Header />);

    // Check if the user's first name is displayed
    expect(screen.getByText(/Hello, Test/i)).toBeInTheDocument();

    // Check if the user menu button is displayed
    const userMenuButton = screen.getByRole('button', { name: /open user menu/i });
    expect(userMenuButton).toBeInTheDocument();
  });

  it('shows notification count', () => {
    render(<Header />);

    // Check if the notification count is displayed
    expect(screen.getByText('3')).toBeInTheDocument();

    // Check if the notification bell has the correct aria label
    const notificationBell = screen.getByText('View notifications');
    expect(notificationBell).toBeInTheDocument();
  });

  it('has a logout button', () => {
    render(<Header />);

    // Check if the logout button is displayed
    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
  });
});
