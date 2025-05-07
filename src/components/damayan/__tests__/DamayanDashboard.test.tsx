import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DamayanDashboard from '../DamayanDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/WhiteLabelContext', () => ({
  useWhiteLabel: jest.fn(),
}));

jest.mock('@/utils/formatters', () => ({
  formatCurrency: jest.fn((value) => `₱${value.toLocaleString()}`),
  formatNumber: jest.fn((value) => value.toLocaleString()),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
  },
}));

// Mock Chart.js to avoid errors
jest.mock('chart.js', () => ({
  Chart: {
    register: jest.fn(),
  },
  ArcElement: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
}));

jest.mock('react-chartjs-2', () => ({
  Doughnut: () => <div data-testid="mock-doughnut-chart">Doughnut Chart</div>,
  Line: () => <div data-testid="mock-line-chart">Line Chart</div>,
  Bar: () => <div data-testid="mock-bar-chart">Bar Chart</div>,
}));

describe('DamayanDashboard Component', () => {
  const mockUser = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  };

  const mockConfig = {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    logoUrl: '/logo.png',
    organizationName: 'Test Cooperative',
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mocks
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useWhiteLabel as jest.Mock).mockReturnValue({ config: mockConfig });
  });

  it('renders loading spinner when data is loading', () => {
    render(<DamayanDashboard />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders dashboard with overview tab by default', async () => {
    render(<DamayanDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check for overview tab content
    expect(screen.getByText(/The Damayan program is a mutual aid initiative/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Funds/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Contributions/i)).toBeInTheDocument();
  });

  it('renders admin dashboard with additional information when isAdmin=true', async () => {
    render(<DamayanDashboard isAdmin={true} />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check for admin-specific elements
    expect(screen.getByText(/Fund Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Assistance Requests/i)).toBeInTheDocument();
  });

  it('switches between tabs correctly', async () => {
    render(<DamayanDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click on Funds tab
    const fundsTab = screen.getByRole('button', { name: /funds/i });
    fundsTab.click();
    
    // Check that Funds tab content is displayed
    expect(screen.getByText(/Available Funds/i)).toBeInTheDocument();
    
    // Click on Contributions tab
    const contributionsTab = screen.getByRole('button', { name: /contributions/i });
    contributionsTab.click();
    
    // Check that Contributions tab content is displayed
    expect(screen.getByText(/Your Contributions/i)).toBeInTheDocument();
    
    // Click on Requests tab
    const requestsTab = screen.getByRole('button', { name: /assistance requests/i });
    requestsTab.click();
    
    // Check that Requests tab content is displayed
    expect(screen.getByText(/Your Assistance Requests/i)).toBeInTheDocument();
  });

  it('displays error message when there is an error', async () => {
    // Mock error state
    jest.spyOn(React, 'useState').mockImplementationOnce(() => [false, jest.fn()]);
    jest.spyOn(React, 'useState').mockImplementationOnce(() => ['Error loading data', jest.fn()]);
    
    render(<DamayanDashboard />);
    
    // Check for error message
    expect(screen.getByText(/Error loading data/i)).toBeInTheDocument();
  });

  it('formats currency values correctly', async () => {
    render(<DamayanDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check that formatCurrency was called
    expect(formatCurrency).toHaveBeenCalled();
  });

  it('formats number values correctly', async () => {
    render(<DamayanDashboard />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check that formatNumber was called
    expect(formatNumber).toHaveBeenCalled();
  });
});
