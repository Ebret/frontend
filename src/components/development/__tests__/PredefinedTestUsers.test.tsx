import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PredefinedTestUsers from '../PredefinedTestUsers';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('PredefinedTestUsers Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with all predefined test users', () => {
    render(<PredefinedTestUsers />);

    // Check title and password info
    expect(screen.getByText('Predefined Test Users')).toBeInTheDocument();
    expect(screen.getByText(/All users have the same password/i)).toBeInTheDocument();
    expect(screen.getByText('Password123!')).toBeInTheDocument();

    // Check for all roles
    expect(screen.getByText('Admin / System Administrator')).toBeInTheDocument();
    expect(screen.getByText('Board of Directors')).toBeInTheDocument();
    expect(screen.getByText('General Manager')).toBeInTheDocument();
    expect(screen.getByText('Credit Officer')).toBeInTheDocument();
    expect(screen.getByText('Accountant')).toBeInTheDocument();
    expect(screen.getByText('Teller')).toBeInTheDocument();
    expect(screen.getByText('Compliance Officer')).toBeInTheDocument();
    expect(screen.getByText('Regular Member')).toBeInTheDocument();
    expect(screen.getByText('Membership Officer')).toBeInTheDocument();
    expect(screen.getByText('Security Manager')).toBeInTheDocument();
    expect(screen.getByText('Marketing Officer')).toBeInTheDocument();
    expect(screen.getByText('Partner/Third-Party User')).toBeInTheDocument();
  });

  it('displays correct email addresses for each role', () => {
    render(<PredefinedTestUsers />);

    expect(screen.getByText('admin@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('director@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('manager@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('credit@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('accountant@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('teller@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('compliance@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('member@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('membership@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('security@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('marketing@kacooperatiba.com')).toBeInTheDocument();
    expect(screen.getByText('partner@kacooperatiba.com')).toBeInTheDocument();
  });

  it('copies email to clipboard when copy button is clicked', () => {
    render(<PredefinedTestUsers />);

    // Find all copy buttons
    const copyButtons = screen.getAllByText('Copy Email');

    // Click the first one (admin)
    fireEvent.click(copyButtons[0]);

    // Check if clipboard API was called with the correct email
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('admin@kacooperatiba.com');

    // Check if the button text changed to "Copied!"
    expect(screen.getByText('Copied!')).toBeInTheDocument();
  });

  it('shows instructions for seeding users', () => {
    render(<PredefinedTestUsers />);

    expect(screen.getByText(/To create these test users in your database/i)).toBeInTheDocument();
    // The text might be split across elements, so we'll check for parts of it
    expect(screen.getByText(/in the backend directory/i)).toBeInTheDocument();
  });
});
