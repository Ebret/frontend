import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DamayanNotification from '../DamayanNotification';
import { useAuth } from '@/contexts/AuthContext';
import { makeContribution } from '@/services/damayanService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/damayanService', () => ({
  makeContribution: jest.fn(),
}));

jest.mock('@/utils/frontendErrorHandler', () => ({
  formatApiError: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DamayanNotification Component', () => {
  const mockNotification = {
    id: 1,
    title: 'Test Notification',
    message: 'This is a test notification',
    notificationType: 'DAMAYAN_REQUEST',
    createdAt: '2023-05-01T12:00:00Z',
    metadata: {
      fundId: 1,
      fundName: 'Test Fund',
    },
  };

  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

  const mockOnClose = jest.fn();
  const mockOnAction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    formatApiError.mockReturnValue('Error message');
  });

  test('renders notification correctly', () => {
    render(
      <DamayanNotification
        notification={mockNotification}
        onClose={mockOnClose}
        onAction={mockOnAction}
      />
    );

    expect(screen.getByText('Test Notification')).toBeInTheDocument();
    expect(screen.getByText('This is a test notification')).toBeInTheDocument();
    expect(screen.getByText('May 1, 2023 12:00 PM')).toBeInTheDocument();
  });

  test('handles contribution action successfully', async () => {
    makeContribution.mockResolvedValue({ success: true });

    render(
      <DamayanNotification
        notification={mockNotification}
        onClose={mockOnClose}
        onAction={mockOnAction}
      />
    );

    const contributeButton = screen.getByText('Contribute ₱10');
    fireEvent.click(contributeButton);

    await waitFor(() => {
      expect(makeContribution).toHaveBeenCalledWith({
        userId: mockUser.id,
        damayanFundId: mockNotification.metadata.fundId,
        amount: 10,
        contributionType: 'MANUAL',
      });
      expect(toast.success).toHaveBeenCalledWith(
        'Thank you for your contribution to the Damayan fund!'
      );
      expect(mockOnAction).toHaveBeenCalledWith('contribute', { amount: 10 });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('handles contribution error', async () => {
    const mockError = new Error('API error');
    makeContribution.mockRejectedValue(mockError);

    render(
      <DamayanNotification
        notification={mockNotification}
        onClose={mockOnClose}
        onAction={mockOnAction}
      />
    );

    const contributeButton = screen.getByText('Contribute ₱10');
    fireEvent.click(contributeButton);

    await waitFor(() => {
      expect(makeContribution).toHaveBeenCalled();
      expect(formatApiError).toHaveBeenCalledWith(mockError);
      expect(toast.error).toHaveBeenCalledWith('Error message');
      expect(mockOnAction).not.toHaveBeenCalled();
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  test('toggles details view when View Details button is clicked', () => {
    render(
      <DamayanNotification
        notification={mockNotification}
        onClose={mockOnClose}
        onAction={mockOnAction}
      />
    );

    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);

    // Details should be visible
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByText('Fund Id')).toBeInTheDocument();
    expect(screen.getByText('Fund Name')).toBeInTheDocument();

    // Click again to hide details
    const hideDetailsButton = screen.getByText('Hide Details');
    fireEvent.click(hideDetailsButton);

    // Details should be hidden
    expect(screen.queryByText('Details')).not.toBeInTheDocument();
  });

  test('handles view details action for assistance notifications', () => {
    const assistanceNotification = {
      ...mockNotification,
      metadata: {
        ...mockNotification.metadata,
        assistanceId: 123,
      },
    };

    render(
      <DamayanNotification
        notification={assistanceNotification}
        onClose={mockOnClose}
        onAction={mockOnAction}
      />
    );

    const viewDetailsButton = screen.getByText('View Details');
    fireEvent.click(viewDetailsButton);

    expect(mockOnAction).toHaveBeenCalledWith('viewDetails', { assistanceId: 123 });
  });

  test('handles dismiss action', () => {
    render(
      <DamayanNotification
        notification={mockNotification}
        onClose={mockOnClose}
        onAction={mockOnAction}
      />
    );

    const dismissButton = screen.getByText('Dismiss');
    fireEvent.click(dismissButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test('shows error when user is not logged in', () => {
    useAuth.mockReturnValue({ user: null });

    render(
      <DamayanNotification
        notification={mockNotification}
        onClose={mockOnClose}
        onAction={mockOnAction}
      />
    );

    const contributeButton = screen.getByText('Contribute ₱10');
    fireEvent.click(contributeButton);

    expect(toast.error).toHaveBeenCalledWith('You must be logged in to make a contribution');
    expect(makeContribution).not.toHaveBeenCalled();
  });

  test('shows error when fund information is missing', () => {
    const invalidNotification = {
      ...mockNotification,
      metadata: {},
    };

    render(
      <DamayanNotification
        notification={invalidNotification}
        onClose={mockOnClose}
        onAction={mockOnAction}
      />
    );

    const contributeButton = screen.getByText('Contribute ₱10');
    fireEvent.click(contributeButton);

    expect(toast.error).toHaveBeenCalledWith('Invalid fund information');
    expect(makeContribution).not.toHaveBeenCalled();
  });
});
