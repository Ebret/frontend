import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import DamayanAssistanceForm from '../DamayanAssistanceForm';
import { useAuth } from '@/contexts/AuthContext';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';
import { getAllDamayanFunds, requestAssistance } from '@/services/damayanService';
import { toast } from 'react-hot-toast';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-hook-form', () => ({
  useForm: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/WhiteLabelContext', () => ({
  useWhiteLabel: jest.fn(),
}));

jest.mock('@/services/damayanService', () => ({
  getAllDamayanFunds: jest.fn(),
  requestAssistance: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('DamayanAssistanceForm Component', () => {
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

  const mockRouter = {
    push: jest.fn(),
  };

  const mockRegister = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockFormState = {
    errors: {},
  };

  const mockFunds = [
    {
      id: '1',
      name: 'Medical Assistance Fund',
      description: 'Fund for members requiring medical assistance',
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Education Support Fund',
      description: 'Fund to support children of members for educational expenses',
      status: 'ACTIVE',
    },
  ];

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup default mocks
    (useAuth as jest.Mock).mockReturnValue({ user: mockUser });
    (useWhiteLabel as jest.Mock).mockReturnValue({ config: mockConfig });
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useForm as jest.Mock).mockReturnValue({
      register: mockRegister,
      handleSubmit: mockHandleSubmit,
      formState: mockFormState,
    });
    (getAllDamayanFunds as jest.Mock).mockResolvedValue(mockFunds);
  });

  it('renders loading spinner when data is loading', () => {
    render(<DamayanAssistanceForm />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders form with fund options when data is loaded', async () => {
    render(<DamayanAssistanceForm />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check for form elements
    expect(screen.getByText('Request Assistance')).toBeInTheDocument();
    expect(screen.getByLabelText(/Damayan Fund/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Reason for Assistance/i)).toBeInTheDocument();
    expect(screen.getByText('Supporting Documents')).toBeInTheDocument();
    
    // Check for fund options
    expect(screen.getByText('Medical Assistance Fund')).toBeInTheDocument();
    expect(screen.getByText('Education Support Fund')).toBeInTheDocument();
  });

  it('displays message when no active funds are available', async () => {
    // Mock empty funds array
    (getAllDamayanFunds as jest.Mock).mockResolvedValue([]);
    
    render(<DamayanAssistanceForm />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Check for no funds message
    expect(screen.getByText('No Active Damayan Funds')).toBeInTheDocument();
    expect(screen.getByText('There are no active Damayan funds available at the moment.')).toBeInTheDocument();
    
    // Check for back button
    const backButton = screen.getByRole('button', { name: /Back to Damayan Dashboard/i });
    expect(backButton).toBeInTheDocument();
    
    // Click back button
    fireEvent.click(backButton);
    expect(mockRouter.push).toHaveBeenCalledWith('/damayan');
  });

  it('handles file upload correctly', async () => {
    render(<DamayanAssistanceForm />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Mock file upload
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Upload files/i);
    
    Object.defineProperty(fileInput, 'files', {
      value: [file],
    });
    
    fireEvent.change(fileInput);
    
    // Check that file is displayed
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });
    
    // Test file removal
    const removeButton = screen.getByRole('button', { name: /Remove/i });
    fireEvent.click(removeButton);
    
    // Check that file is removed
    await waitFor(() => {
      expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    });
  });

  it('submits form with correct data', async () => {
    // Mock successful form submission
    const mockOnSubmit = jest.fn();
    (mockHandleSubmit as jest.Mock).mockImplementation((callback) => {
      return (e) => {
        e.preventDefault();
        callback({
          fundId: '1',
          reason: 'Test reason for assistance',
        });
        mockOnSubmit();
      };
    });
    
    (requestAssistance as jest.Mock).mockResolvedValue({
      id: '1',
      status: 'PENDING',
    });
    
    render(<DamayanAssistanceForm />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Submit Request/i });
    fireEvent.click(submitButton);
    
    // Check that form was submitted
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(requestAssistance).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith('Your assistance request has been submitted successfully');
      expect(mockRouter.push).toHaveBeenCalledWith('/damayan');
    });
  });

  it('handles form submission error', async () => {
    // Mock form submission error
    const mockOnSubmit = jest.fn();
    (mockHandleSubmit as jest.Mock).mockImplementation((callback) => {
      return (e) => {
        e.preventDefault();
        callback({
          fundId: '1',
          reason: 'Test reason for assistance',
        });
        mockOnSubmit();
      };
    });
    
    const mockError = new Error('API error');
    (requestAssistance as jest.Mock).mockRejectedValue(mockError);
    
    render(<DamayanAssistanceForm />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: /Submit Request/i });
    fireEvent.click(submitButton);
    
    // Check that error was handled
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
      expect(requestAssistance).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it('handles cancel button click', async () => {
    render(<DamayanAssistanceForm />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
    
    // Click cancel button
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);
    
    // Check that router.push was called
    expect(mockRouter.push).toHaveBeenCalledWith('/damayan');
  });
});
