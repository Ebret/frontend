import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UnifiedDashboard from '../UnifiedDashboard';
import { useCooperative } from '@/contexts/CooperativeContext';

// Mock the CooperativeContext
jest.mock('@/contexts/CooperativeContext', () => ({
  useCooperative: jest.fn(),
}));

// Mock the FinancialDashboard component
jest.mock('../FinancialDashboard', () => {
  return function MockFinancialDashboard(props) {
    return (
      <div data-testid="financial-dashboard">
        <div data-testid="financial-period">{props.period}</div>
        <button 
          data-testid="change-period-button" 
          onClick={() => props.onPeriodChange && props.onPeriodChange('yearly')}
        >
          Change Period
        </button>
      </div>
    );
  };
});

// Mock data
const mockMetrics = {
  members: { value: '1,254', change: '+12%', changeType: 'increase' },
  loans: { value: '487', change: '+5%', changeType: 'increase' },
  deposits: { value: '₱24.5M', change: '+8%', changeType: 'increase' },
  disbursements: { value: '₱3.2M', change: '-3%', changeType: 'decrease' },
};

const mockFinancialData = {
  revenue: {
    total: 1250000,
    previousPeriod: 1150000,
    byCategory: {
      'Grocery': 625000,
      'Appliances': 312500,
    },
  },
  expenses: {
    total: 875000,
    previousPeriod: 805000,
    byCategory: {
      'Cost of Goods': 700000,
      'Salaries': 100000,
    },
  },
  profit: {
    total: 375000,
    previousPeriod: 345000,
  },
  transactions: {
    count: 3250,
    previousPeriod: 3000,
    byPaymentMethod: {
      'Cash': 1950,
      'Credit Card': 975,
    },
  },
  topProducts: [
    { id: 1, name: 'Rice (25kg)', quantity: 500, revenue: 625000 },
    { id: 2, name: 'Cooking Oil (1L)', quantity: 1200, revenue: 144000 },
  ],
};

const mockPendingApprovals = [
  { id: 1, type: 'Loan Application', name: 'Juan Dela Cruz', amount: '₱50,000', submittedAt: '2023-06-22 10:15:30' },
  { id: 2, type: 'Rate Change', name: 'Business Loan - 2 years', amount: '15% → 14.5%', submittedAt: '2023-06-22 11:30:45' },
];

const mockRecentActivity = [
  { id: 1, action: 'Loan Approved', user: 'Maria Santos', target: 'Pedro Reyes - ₱30,000', timestamp: '2023-06-22 15:45:22' },
  { id: 2, action: 'Rate Updated', user: 'Juan Dela Cruz', target: 'Time Deposit - 1 year: 4.5% → 5%', timestamp: '2023-06-22 14:30:15' },
];

describe('UnifiedDashboard', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders correctly for Credit Cooperative', () => {
    // Mock the cooperative context for Credit Cooperative
    useCooperative.mockReturnValue({
      cooperativeType: 'CREDIT',
      isLoading: false,
    });

    render(
      <UnifiedDashboard
        metrics={mockMetrics}
        financialData={mockFinancialData}
        financialPeriod="monthly"
        onFinancialPeriodChange={() => {}}
        pendingApprovals={mockPendingApprovals}
        recentActivity={mockRecentActivity}
      />
    );

    // Check that the overview tab is active by default
    expect(screen.getByText('Overview')).toBeInTheDocument();
    
    // Check that the financial tab is not present for Credit Cooperative
    expect(screen.queryByText('Financial')).not.toBeInTheDocument();
    
    // Check that metrics are displayed
    expect(screen.getByText('Total Members')).toBeInTheDocument();
    expect(screen.getByText(mockMetrics.members.value)).toBeInTheDocument();
    
    // Check that the financial dashboard is not rendered
    expect(screen.queryByTestId('financial-dashboard')).not.toBeInTheDocument();
  });

  test('renders correctly for Multi-Purpose Cooperative', () => {
    // Mock the cooperative context for Multi-Purpose Cooperative
    useCooperative.mockReturnValue({
      cooperativeType: 'MULTI_PURPOSE',
      isLoading: false,
    });

    render(
      <UnifiedDashboard
        metrics={mockMetrics}
        financialData={mockFinancialData}
        financialPeriod="monthly"
        onFinancialPeriodChange={() => {}}
        pendingApprovals={mockPendingApprovals}
        recentActivity={mockRecentActivity}
      />
    );

    // Check that the overview tab is active by default
    expect(screen.getByText('Overview')).toBeInTheDocument();
    
    // Check that the financial tab is present for Multi-Purpose Cooperative
    expect(screen.getByText('Financial')).toBeInTheDocument();
    
    // Check that metrics are displayed
    expect(screen.getByText('Total Members')).toBeInTheDocument();
    expect(screen.getByText(mockMetrics.members.value)).toBeInTheDocument();
    
    // Check that Multi-Purpose specific metrics are displayed
    expect(screen.getByText('Multi-Purpose Metrics')).toBeInTheDocument();
    expect(screen.getByText('Monthly Sales')).toBeInTheDocument();
  });

  test('switches tabs correctly', () => {
    // Mock the cooperative context for Multi-Purpose Cooperative
    useCooperative.mockReturnValue({
      cooperativeType: 'MULTI_PURPOSE',
      isLoading: false,
    });

    render(
      <UnifiedDashboard
        metrics={mockMetrics}
        financialData={mockFinancialData}
        financialPeriod="monthly"
        onFinancialPeriodChange={() => {}}
        pendingApprovals={mockPendingApprovals}
        recentActivity={mockRecentActivity}
      />
    );

    // Check that the overview tab is active by default
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Total Members')).toBeInTheDocument();
    
    // Switch to the financial tab
    fireEvent.click(screen.getByText('Financial'));
    
    // Check that the financial dashboard is rendered
    expect(screen.getByTestId('financial-dashboard')).toBeInTheDocument();
    
    // Switch to the approvals tab
    fireEvent.click(screen.getByText('Approvals'));
    
    // Check that the approvals content is rendered
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    expect(screen.getByText('Juan Dela Cruz')).toBeInTheDocument();
    
    // Switch to the activity tab
    fireEvent.click(screen.getByText('Activity'));
    
    // Check that the activity content is rendered
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  });

  test('calls onFinancialPeriodChange when period is changed', () => {
    // Mock the cooperative context for Multi-Purpose Cooperative
    useCooperative.mockReturnValue({
      cooperativeType: 'MULTI_PURPOSE',
      isLoading: false,
    });

    const mockOnFinancialPeriodChange = jest.fn();

    render(
      <UnifiedDashboard
        metrics={mockMetrics}
        financialData={mockFinancialData}
        financialPeriod="monthly"
        onFinancialPeriodChange={mockOnFinancialPeriodChange}
        pendingApprovals={mockPendingApprovals}
        recentActivity={mockRecentActivity}
      />
    );

    // Switch to the financial tab
    fireEvent.click(screen.getByText('Financial'));
    
    // Check that the financial dashboard is rendered
    expect(screen.getByTestId('financial-dashboard')).toBeInTheDocument();
    
    // Change the period
    fireEvent.click(screen.getByTestId('change-period-button'));
    
    // Check that onFinancialPeriodChange was called with the correct value
    expect(mockOnFinancialPeriodChange).toHaveBeenCalledWith('yearly');
  });

  test('shows loading state when isLoading is true', () => {
    // Mock the cooperative context with loading state
    useCooperative.mockReturnValue({
      cooperativeType: 'MULTI_PURPOSE',
      isLoading: true,
    });

    render(
      <UnifiedDashboard
        metrics={mockMetrics}
        financialData={mockFinancialData}
        financialPeriod="monthly"
        onFinancialPeriodChange={() => {}}
        pendingApprovals={mockPendingApprovals}
        recentActivity={mockRecentActivity}
      />
    );

    // Check that the loading spinner is displayed
    expect(screen.getByRole('status')).toBeInTheDocument();
    
    // Check that the content is not rendered
    expect(screen.queryByText('Overview')).not.toBeInTheDocument();
  });
});
