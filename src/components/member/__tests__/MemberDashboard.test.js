import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MemberDashboard from '../MemberDashboard';
import { useScreenSize } from '../../common/ResponsiveWrapper';

// Mock the ResponsiveWrapper hook
jest.mock('../../common/ResponsiveWrapper', () => ({
  useScreenSize: jest.fn(),
}));

// Mock the MobileNavigation component
jest.mock('../../common/MobileNavigation', () => {
  return function MockMobileNavigation(props) {
    return (
      <nav data-testid="mobile-navigation">
        <ul>
          {props.items.map((item, index) => (
            <li key={index}>{item.label}</li>
          ))}
        </ul>
        {props.rightContent}
      </nav>
    );
  };
});

// Mock the AccessibilityMenu component
jest.mock('../../common/AccessibilityMenu', () => {
  return function MockAccessibilityMenu() {
    return <div data-testid="accessibility-menu" />;
  };
});

// Mock the SkipToContent component
jest.mock('../../common/SkipToContent', () => {
  return function MockSkipToContent() {
    return <div data-testid="skip-to-content" />;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return (
      <a href={href} data-testid="next-link">
        {children}
      </a>
    );
  };
});

describe('MemberDashboard', () => {
  // Mock data
  const mockUser = {
    firstName: 'John',
    lastName: 'Doe',
    memberId: 'M12345',
  };
  
  const mockAccountSummary = {
    totalSavings: 50000,
    totalLoans: 100000,
    availableBalance: 25000,
    nextPaymentDue: '2023-07-15',
  };
  
  const mockRecentTransactions = [
    {
      id: 1,
      description: 'Loan Payment',
      date: '2023-06-30',
      amount: 5000,
      type: 'debit',
      category: 'Loan',
      status: 'Completed',
    },
    {
      id: 2,
      description: 'Savings Deposit',
      date: '2023-06-28',
      amount: 10000,
      type: 'credit',
      category: 'Savings',
      status: 'Completed',
    },
  ];
  
  const mockActiveLoans = [
    {
      id: 'L12345',
      type: 'Personal Loan',
      status: 'Current',
      principal: 100000,
      balance: 75000,
      nextPayment: 5000,
      dueDate: '2023-07-15',
    },
  ];
  
  const mockNotifications = [
    {
      id: 1,
      title: 'Payment Reminder',
      message: 'Your loan payment is due in 5 days.',
      date: '2023-06-30',
      type: 'warning',
    },
    {
      id: 2,
      title: 'Deposit Successful',
      message: 'Your deposit of ₱10,000 has been processed.',
      date: '2023-06-28',
      type: 'success',
    },
  ];
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default to mobile screen size
    useScreenSize.mockReturnValue('mobile');
  });
  
  test('renders dashboard with user information', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      />
    );
    
    // Check that user information is displayed
    expect(screen.getByText(`Welcome, ${mockUser.firstName}`)).toBeInTheDocument();
    expect(screen.getByText(`Member ID: ${mockUser.memberId}`)).toBeInTheDocument();
  });
  
  test('renders account summary with correct values', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      />
    );
    
    // Check that account summary is displayed
    expect(screen.getByText('Account Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Savings')).toBeInTheDocument();
    expect(screen.getByText('Total Loans')).toBeInTheDocument();
    expect(screen.getByText('Available Balance')).toBeInTheDocument();
    expect(screen.getByText('Next Payment Due')).toBeInTheDocument();
    
    // Check that the values are formatted correctly
    expect(screen.getByText('₱50,000.00')).toBeInTheDocument();
    expect(screen.getByText('₱100,000.00')).toBeInTheDocument();
    expect(screen.getByText('₱25,000.00')).toBeInTheDocument();
    expect(screen.getByText('2023-07-15')).toBeInTheDocument();
  });
  
  test('renders quick action buttons', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      />
    );
    
    // Check that quick action buttons are displayed
    expect(screen.getByText('Transfer')).toBeInTheDocument();
    expect(screen.getByText('Withdraw')).toBeInTheDocument();
    expect(screen.getByText('Deposit')).toBeInTheDocument();
  });
  
  test('renders overview tab by default', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      />
    );
    
    // Check that overview tab is active
    expect(screen.getByRole('button', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    
    // Check that active loans are displayed
    expect(screen.getByText('Active Loans')).toBeInTheDocument();
    expect(screen.getByText('Personal Loan')).toBeInTheDocument();
    expect(screen.getByText('Loan ID: L12345')).toBeInTheDocument();
  });
  
  test('switches to transactions tab when clicked', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      />
    );
    
    // Click the transactions tab
    fireEvent.click(screen.getByRole('button', { name: 'Transactions' }));
    
    // Check that transactions tab is active
    expect(screen.getByRole('button', { name: 'Transactions' })).toHaveAttribute('aria-current', 'page');
    
    // Check that recent transactions are displayed
    expect(screen.getByText('Recent Transactions')).toBeInTheDocument();
    expect(screen.getByText('Loan Payment')).toBeInTheDocument();
    expect(screen.getByText('Savings Deposit')).toBeInTheDocument();
  });
  
  test('switches to notifications tab when clicked', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      />
    );
    
    // Click the notifications tab
    fireEvent.click(screen.getByRole('button', { name: /Notifications/ }));
    
    // Check that notifications tab is active
    expect(screen.getByRole('button', { name: /Notifications/ })).toHaveAttribute('aria-current', 'page');
    
    // Check that notifications are displayed
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Payment Reminder')).toBeInTheDocument();
    expect(screen.getByText('Deposit Successful')).toBeInTheDocument();
  });
  
  test('displays notification count badge', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      />
    );
    
    // Check that notification count badge is displayed
    expect(screen.getByText('2')).toBeInTheDocument();
  });
  
  test('renders empty state when no active loans', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={[]}
        notifications={mockNotifications}
      />
    );
    
    // Check that empty state is displayed
    expect(screen.getByText('You have no active loans.')).toBeInTheDocument();
  });
  
  test('renders empty state when no recent transactions', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={[]}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      />
    );
    
    // Click the transactions tab
    fireEvent.click(screen.getByRole('button', { name: 'Transactions' }));
    
    // Check that empty state is displayed
    expect(screen.getByText('No recent transactions.')).toBeInTheDocument();
  });
  
  test('renders empty state when no notifications', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={[]}
      />
    );
    
    // Click the notifications tab
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
    
    // Check that empty state is displayed
    expect(screen.getByText('No notifications.')).toBeInTheDocument();
  });
  
  test('renders children content', () => {
    render(
      <MemberDashboard
        user={mockUser}
        accountSummary={mockAccountSummary}
        recentTransactions={mockRecentTransactions}
        activeLoans={mockActiveLoans}
        notifications={mockNotifications}
      >
        <div data-testid="child-content">Additional Content</div>
      </MemberDashboard>
    );
    
    // Check that children content is displayed
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Additional Content')).toBeInTheDocument();
  });
});
