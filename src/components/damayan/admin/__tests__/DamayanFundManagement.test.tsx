import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import DamayanFundManagement from '../DamayanFundManagement';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { 
  getAllDamayanFunds, 
  createDamayanFund, 
  updateDamayanFund,
  fetchDamayanFundStatistics
} from '@/services/damayanService';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/WhiteLabelContext', () => ({
  useWhiteLabel: jest.fn(),
}));

jest.mock('@/services/damayanService', () => ({
  getAllDamayanFunds: jest.fn(),
  createDamayanFund: jest.fn(),
  updateDamayanFund: jest.fn(),
  fetchDamayanFundStatistics: jest.fn(),
}));

jest.mock('@/utils/formatters', () => ({
  formatCurrency: jest.fn((value) => `₱${value.toLocaleString()}`),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('DamayanFundManagement Component', () => {
  const mockUser = {
    id: '123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'ADMIN',
  };

  const mockConfig = {
    primaryColor: '#3b82f6',
    secondaryColor: '#1e40af',
    logoUrl: '/logo.png',
    organizationName: 'Test Cooperative',
  };

  const mockRouter = {
    push: jest.fn(),
  };

  const mockFunds = [
    {
      id: '1',
      name: 'Medical Assistance Fund',
      description: 'Fund for members requiring medical assistance',
      balance: 150000,
      status: 'ACTIVE',
      createdAt: '2023-01-15T00:00:00Z',
      updatedAt: '2023-07-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Education Support Fund',
      description: 'Fund to support children of members for educational expenses',
      balance: 100000,
      status: 'ACTIVE',
      createdAt: '2023-03-20T00:00:00Z',
      updatedAt: '2023-07-05T00:00:00Z',
    },
  ];

  const mockFundStatistics = {
    totalContributions: 200000,
    contributionsCount: 75,
    totalDisbursements: 50000,
    disbursementsCount: 5,
    currentBalance: 150000,
    pendingRequestsCount: 3,
    uniqueContributorsCount: 50,
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mocks
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useWhiteLabel as jest.Mock).mockReturnValue({ config: mockConfig });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (getAllDamayanFunds as jest.Mock).mockResolvedValue(mockFunds);
    (fetchDamayanFundStatistics as jest.Mock).mockResolvedValue(mockFundStatistics);
  });

  it('renders loading spinner when data is loading', () => {
    render(<DamayanFundManagement />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders fund management interface when data is loaded', async () => {
    render(<DamayanFundManagement />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check for fund management elements
    expect(screen.getByText('Damayan Fund Management')).toBeInTheDocument();
    expect(screen.getByText('Create and manage Damayan funds')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create New Fund/i })).toBeInTheDocument();
    
    // Check for fund selection dropdown
    expect(screen.getByLabelText(/Select Fund/i)).toBeInTheDocument();
    
    // Check for fund details
    expect(screen.getByText('Medical Assistance Fund')).toBeInTheDocument();
    expect(screen.getByText('Fund for members requiring medical assistance')).toBeInTheDocument();
    
    // Check for fund statistics
    expect(screen.getByText('Current Balance')).toBeInTheDocument();
    expect(screen.getByText('Total Contributions')).toBeInTheDocument();
    expect(screen.getByText('Total Disbursements')).toBeInTheDocument();
    
    // Check for fund table
    expect(screen.getByText('All Funds')).toBeInTheDocument();
    expect(screen.getAllByText('ACTIVE').length).toBeGreaterThan(0);
  });

  it('displays empty state when no funds are available', async () => {
    // Mock empty funds array
    (getAllDamayanFunds as jest.Mock).mockResolvedValue([]);
    
    render(<DamayanFundManagement />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check for empty state message
    expect(screen.getByText('No Damayan funds')).toBeInTheDocument();
    expect(screen.getByText('Get started by creating a new Damayan fund.')).toBeInTheDocument();
  });

  it('opens create fund modal when create button is clicked', async () => {
    render(<DamayanFundManagement />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click create fund button
    const createButton = screen.getByRole('button', { name: /Create New Fund/i });
    fireEvent.click(createButton);
    
    // Check that modal is displayed
    expect(screen.getByText('Create New Damayan Fund')).toBeInTheDocument();
    expect(screen.getByLabelText(/Fund Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
  });

  it('creates a new fund successfully', async () => {
    // Mock successful fund creation
    (createDamayanFund as jest.Mock).mockResolvedValue({
      id: '3',
      name: 'New Test Fund',
      description: 'Test fund description',
      status: 'ACTIVE',
    });
    
    render(<DamayanFundManagement />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click create fund button
    const createButton = screen.getByRole('button', { name: /Create New Fund/i });
    fireEvent.click(createButton);
    
    // Fill out form
    const nameInput = screen.getByLabelText(/Fund Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    
    fireEvent.change(nameInput, { target: { value: 'New Test Fund' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test fund description' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Create Fund/i });
    fireEvent.click(submitButton);
    
    // Check that createDamayanFund was called
    await waitFor(() => {
      expect(createDamayanFund).toHaveBeenCalledWith({
        name: 'New Test Fund',
        description: 'Test fund description',
        status: 'ACTIVE',
        cooperativeId: null,
      });
      expect(toast.success).toHaveBeenCalledWith('Damayan fund created successfully');
    });
  });

  it('opens edit fund modal when edit button is clicked', async () => {
    render(<DamayanFundManagement />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click edit fund button
    const editButton = screen.getAllByText('Edit')[0];
    fireEvent.click(editButton);
    
    // Check that modal is displayed
    expect(screen.getByText('Edit Damayan Fund')).toBeInTheDocument();
    
    // Check that form is pre-filled
    const nameInput = screen.getByLabelText(/Fund Name/i);
    expect(nameInput).toHaveValue('Medical Assistance Fund');
  });

  it('updates a fund successfully', async () => {
    // Mock successful fund update
    (updateDamayanFund as jest.Mock).mockResolvedValue({
      id: '1',
      name: 'Updated Fund Name',
      description: 'Updated description',
      status: 'ACTIVE',
    });
    
    render(<DamayanFundManagement />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click edit fund button
    const editButton = screen.getAllByText('Edit')[0];
    fireEvent.click(editButton);
    
    // Update form
    const nameInput = screen.getByLabelText(/Fund Name/i);
    const descriptionInput = screen.getByLabelText(/Description/i);
    
    fireEvent.change(nameInput, { target: { value: 'Updated Fund Name' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated description' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Update Fund/i });
    fireEvent.click(submitButton);
    
    // Check that updateDamayanFund was called
    await waitFor(() => {
      expect(updateDamayanFund).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Damayan fund updated successfully');
    });
  });

  it('handles fund selection change', async () => {
    render(<DamayanFundManagement />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Change selected fund
    const selectFund = screen.getByLabelText(/Select Fund/i);
    fireEvent.change(selectFund, { target: { value: '2' } });
    
    // Check that fetchDamayanFundStatistics was called with new fund ID
    await waitFor(() => {
      expect(fetchDamayanFundStatistics).toHaveBeenCalled();
    });
  });

  it('handles form validation errors', async () => {
    render(<DamayanFundManagement />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click create fund button
    const createButton = screen.getByRole('button', { name: /Create New Fund/i });
    fireEvent.click(createButton);
    
    // Submit form without filling required fields
    const submitButton = screen.getByRole('button', { name: /Create Fund/i });
    fireEvent.click(submitButton);
    
    // Check that error toast was shown
    expect(toast.error).toHaveBeenCalledWith('Fund name is required');
  });
});
