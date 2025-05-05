import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DamayanWidget from '../DamayanWidget';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserDamayanSummary, makeContribution } from '@/services/damayanService';
import { getUnreadDamayanNotificationCount } from '@/services/notificationService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/services/damayanService', () => ({
  fetchUserDamayanSummary: jest.fn(),
  makeContribution: jest.fn(),
}));

jest.mock('@/services/notificationService', () => ({
  getUnreadDamayanNotificationCount: jest.fn(),
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

describe('DamayanWidget Component', () => {
  const mockUser = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  };

  const mockSummary = {
    summary: {
      totalContributions: 1000,
      contributionsCount: 5,
      totalAssistance: 500,
      assistanceCount: 1,
    },
    recentActivity: {
      contributions: [
        {
          id: 1,
          amount: 200,
          contributionDate: '2023-05-01T12:00:00Z',
          contributionType: 'MANUAL',
          damayanFundId: 1,
        },
      ],
      assistance: [
        {
          id: 1,
          amount: 500,
          requestDate: '2023-05-02T12:00:00Z',
          status: 'APPROVED',
          approvalDate: '2023-05-03T12:00:00Z',
        },
      ],
    },
  };

  const mockNotificationCount = {
    count: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: mockUser });
    fetchUserDamayanSummary.mockResolvedValue(mockSummary);
    getUnreadDamayanNotificationCount.mockResolvedValue(mockNotificationCount);
    formatApiError.mockReturnValue('Error message');
  });

  test('renders widget with loading state initially', () => {
    render(<DamayanWidget />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders widget with data after loading', async () => {
    render(<DamayanWidget />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
      expect(screen.getByText('Damayan')).toBeInTheDocument();
      expect(screen.getByText('Your Contributions')).toBeInTheDocument();
      expect(screen.getByText('₱1,000')).toBeInTheDocument();
      expect(screen.getByText('3 New')).toBeInTheDocument();
    });

    expect(fetchUserDamayanSummary).toHaveBeenCalledWith(mockUser.id);
    expect(getUnreadDamayanNotificationCount).toHaveBeenCalledWith(mockUser.id);
  });

  test('shows quick contribution form when Contribute button is clicked', async () => {
    render(<DamayanWidget />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const contributeButton = screen.getByText('Contribute');
    fireEvent.click(contributeButton);

    expect(screen.getByText('Quick Contribution')).toBeInTheDocument();
    expect(screen.getByText('₱10')).toBeInTheDocument();
    expect(screen.getByText('₱50')).toBeInTheDocument();
    expect(screen.getByText('₱100')).toBeInTheDocument();
    expect(screen.getByText('₱500')).toBeInTheDocument();
  });

  test('handles contribution successfully', async () => {
    makeContribution.mockResolvedValue({ success: true });
    fetchUserDamayanSummary.mockResolvedValueOnce(mockSummary).mockResolvedValueOnce({
      ...mockSummary,
      summary: {
        ...mockSummary.summary,
        totalContributions: 1100,
      },
    });

    render(<DamayanWidget />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const contributeButton = screen.getByText('Contribute');
    fireEvent.click(contributeButton);

    const amount100Button = screen.getByText('₱100');
    fireEvent.click(amount100Button);

    const submitButton = screen.getByText('Contribute ₱100');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(makeContribution).toHaveBeenCalledWith({
        userId: mockUser.id,
        damayanFundId: 1,
        amount: 100,
        contributionType: 'MANUAL',
      });
      expect(toast.success).toHaveBeenCalledWith('Thank you for your contribution to the Damayan fund!');
      expect(fetchUserDamayanSummary).toHaveBeenCalledTimes(2);
    });
  });

  test('handles contribution error', async () => {
    const mockError = new Error('API error');
    makeContribution.mockRejectedValue(mockError);

    render(<DamayanWidget />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const contributeButton = screen.getByText('Contribute');
    fireEvent.click(contributeButton);

    const submitButton = screen.getByText('Contribute ₱10');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(makeContribution).toHaveBeenCalled();
      expect(formatApiError).toHaveBeenCalledWith(mockError);
      expect(toast.error).toHaveBeenCalledWith('Error message');
    });
  });

  test('shows error when user is not logged in', async () => {
    useAuth.mockReturnValue({ user: null });

    render(<DamayanWidget />);

    // Should not show loading or content
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText('Damayan')).not.toBeInTheDocument();
  });

  test('shows error when contribution is attempted without fund information', async () => {
    const emptySummary = {
      summary: {
        totalContributions: 0,
        contributionsCount: 0,
      },
      recentActivity: {
        contributions: [],
        assistance: [],
      },
    };

    fetchUserDamayanSummary.mockResolvedValue(emptySummary);

    render(<DamayanWidget />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const contributeButton = screen.getByText('Contribute');
    fireEvent.click(contributeButton);

    const submitButton = screen.getByText('Contribute ₱10');
    fireEvent.click(submitButton);

    expect(toast.error).toHaveBeenCalledWith('No fund information available');
    expect(makeContribution).not.toHaveBeenCalled();
  });

  test('cancels contribution when Cancel button is clicked', async () => {
    render(<DamayanWidget />);

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    const contributeButton = screen.getByText('Contribute');
    fireEvent.click(contributeButton);

    expect(screen.getByText('Quick Contribution')).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Quick Contribution')).not.toBeInTheDocument();
    expect(makeContribution).not.toHaveBeenCalled();
  });
});
