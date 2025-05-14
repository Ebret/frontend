import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MobileNavigation from '../MobileNavigation';
import { useScreenSize } from '../ResponsiveWrapper';
import { usePathname } from 'next/navigation';

// Mock the ResponsiveWrapper hook
jest.mock('../ResponsiveWrapper', () => ({
  useScreenSize: jest.fn(),
}));

// Mock the next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

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

describe('MobileNavigation', () => {
  const mockItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    {
      label: 'Services',
      href: '/services',
      children: [
        { label: 'Service 1', href: '/services/1' },
        { label: 'Service 2', href: '/services/2' },
      ],
    },
    { label: 'Contact', href: '/contact' },
  ];
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default to desktop screen size
    useScreenSize.mockReturnValue('desktop');
    
    // Default pathname
    usePathname.mockReturnValue('/');
  });
  
  test('renders navigation with logo text when no logo URL is provided', () => {
    render(
      <MobileNavigation
        items={mockItems}
        logoAlt="Test Logo"
      />
    );
    
    expect(screen.getByText('Test Logo')).toBeInTheDocument();
  });
  
  test('renders navigation with logo image when logo URL is provided', () => {
    render(
      <MobileNavigation
        items={mockItems}
        logo="/logo.png"
        logoAlt="Test Logo"
      />
    );
    
    const logoImg = screen.getByAltText('Test Logo');
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', '/logo.png');
  });
  
  test('renders desktop navigation items when on desktop', () => {
    useScreenSize.mockReturnValue('desktop');
    
    render(
      <MobileNavigation
        items={mockItems}
      />
    );
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    
    // Mobile menu button should not be visible
    expect(screen.queryByRole('button', { name: /open menu/i })).not.toBeInTheDocument();
  });
  
  test('renders mobile menu button when on mobile', () => {
    useScreenSize.mockReturnValue('mobile');
    
    render(
      <MobileNavigation
        items={mockItems}
      />
    );
    
    // Mobile menu button should be visible
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
    
    // Navigation items should not be visible initially
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
  
  test('opens mobile menu when menu button is clicked', () => {
    useScreenSize.mockReturnValue('mobile');
    
    render(
      <MobileNavigation
        items={mockItems}
      />
    );
    
    // Click the menu button
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    
    // Navigation items should now be visible
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    
    // Close button should be visible
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument();
  });
  
  test('toggles submenu when clicked on desktop', () => {
    useScreenSize.mockReturnValue('desktop');
    
    render(
      <MobileNavigation
        items={mockItems}
      />
    );
    
    // Submenu items should not be visible initially
    expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
    
    // Click the Services menu item
    fireEvent.click(screen.getByText('Services'));
    
    // Submenu items should now be visible
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
    
    // Click the Services menu item again to close the submenu
    fireEvent.click(screen.getByText('Services'));
    
    // Submenu items should not be visible anymore
    expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
  });
  
  test('toggles submenu when clicked on mobile', () => {
    useScreenSize.mockReturnValue('mobile');
    
    render(
      <MobileNavigation
        items={mockItems}
      />
    );
    
    // Open the mobile menu
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    
    // Submenu items should not be visible initially
    expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
    
    // Click the Services menu item
    fireEvent.click(screen.getByText('Services'));
    
    // Submenu items should now be visible
    expect(screen.getByText('Service 1')).toBeInTheDocument();
    expect(screen.getByText('Service 2')).toBeInTheDocument();
    
    // Click the Services menu item again to close the submenu
    fireEvent.click(screen.getByText('Services'));
    
    // Submenu items should not be visible anymore
    expect(screen.queryByText('Service 1')).not.toBeInTheDocument();
  });
  
  test('highlights active menu item based on current path', () => {
    usePathname.mockReturnValue('/about');
    
    render(
      <MobileNavigation
        items={mockItems}
      />
    );
    
    // Get all navigation links
    const links = screen.getAllByTestId('next-link');
    
    // Find the About link
    const aboutLink = links.find(link => link.textContent === 'About');
    
    // Check that it has the active class
    expect(aboutLink).toHaveClass('border-indigo-500');
  });
  
  test('applies dark mode styles when dark prop is true', () => {
    render(
      <MobileNavigation
        items={mockItems}
        dark={true}
      />
    );
    
    // Check that the navigation has dark mode classes
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-gray-900');
    
    // Check that the logo has dark mode text color
    const logo = screen.getByText('Logo');
    expect(logo).toHaveClass('text-white');
  });
  
  test('renders right content when provided', () => {
    render(
      <MobileNavigation
        items={mockItems}
        rightContent={<button>Sign In</button>}
      />
    );
    
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });
  
  test('applies sticky class when sticky prop is true', () => {
    render(
      <MobileNavigation
        items={mockItems}
        sticky={true}
      />
    );
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('sticky top-0 z-50');
  });
  
  test('applies transparent styles when transparent prop is true', () => {
    render(
      <MobileNavigation
        items={mockItems}
        transparent={true}
      />
    );
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('bg-transparent');
  });
  
  test('closes mobile menu when route changes', () => {
    useScreenSize.mockReturnValue('mobile');
    
    const { rerender } = render(
      <MobileNavigation
        items={mockItems}
      />
    );
    
    // Open the mobile menu
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }));
    
    // Navigation items should now be visible
    expect(screen.getByText('Home')).toBeInTheDocument();
    
    // Change the pathname
    usePathname.mockReturnValue('/about');
    
    // Rerender the component
    rerender(
      <MobileNavigation
        items={mockItems}
      />
    );
    
    // Navigation items should not be visible anymore
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });
});
