import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ErrorFallback,
  NetworkErrorFallback,
  NotFoundFallback,
  UnauthorizedFallback,
  LoadingFallback,
  EmptyStateFallback,
} from '../FallbackUI';

describe('FallbackUI Components', () => {
  describe('ErrorFallback', () => {
    test('renders with default props', () => {
      render(<ErrorFallback error={new Error('Test error')} />);
      
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(/We've encountered an error/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
    });
    
    test('renders with custom props', () => {
      render(
        <ErrorFallback
          error={new Error('Test error')}
          title="Custom Error Title"
          message="Custom error message"
          buttonText="Custom Button"
        />
      );
      
      expect(screen.getByText('Custom Error Title')).toBeInTheDocument();
      expect(screen.getByText('Custom error message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Custom Button' })).toBeInTheDocument();
    });
    
    test('calls resetErrorBoundary when button is clicked', () => {
      const resetErrorBoundary = jest.fn();
      
      render(
        <ErrorFallback
          error={new Error('Test error')}
          resetErrorBoundary={resetErrorBoundary}
        />
      );
      
      fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
      
      expect(resetErrorBoundary).toHaveBeenCalledTimes(1);
    });
    
    test('hides reset button when showReset is false', () => {
      render(
        <ErrorFallback
          error={new Error('Test error')}
          showReset={false}
        />
      );
      
      expect(screen.queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument();
    });
    
    test('shows error details in development environment', () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      render(<ErrorFallback error={new Error('Test error')} />);
      
      expect(screen.getByText('Error details')).toBeInTheDocument();
      
      process.env.NODE_ENV = originalNodeEnv;
    });
  });
  
  describe('NetworkErrorFallback', () => {
    test('renders with default props', () => {
      render(<NetworkErrorFallback onRetry={() => {}} />);
      
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(screen.getByText(/We're having trouble connecting/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
    
    test('renders with custom props', () => {
      render(
        <NetworkErrorFallback
          onRetry={() => {}}
          title="Custom Network Error"
          message="Custom network error message"
          buttonText="Custom Retry"
        />
      );
      
      expect(screen.getByText('Custom Network Error')).toBeInTheDocument();
      expect(screen.getByText('Custom network error message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Custom Retry' })).toBeInTheDocument();
    });
    
    test('calls onRetry when button is clicked', () => {
      const onRetry = jest.fn();
      
      render(<NetworkErrorFallback onRetry={onRetry} />);
      
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });
  
  describe('NotFoundFallback', () => {
    test('renders with default props', () => {
      render(<NotFoundFallback />);
      
      expect(screen.getByText('Page not found')).toBeInTheDocument();
      expect(screen.getByText(/Sorry, we couldn't find the page/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go back home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go back home' })).toHaveAttribute('href', '/');
    });
    
    test('renders with custom props', () => {
      render(
        <NotFoundFallback
          title="Custom Not Found"
          message="Custom not found message"
          buttonText="Custom Home"
          buttonHref="/custom"
        />
      );
      
      expect(screen.getByText('Custom Not Found')).toBeInTheDocument();
      expect(screen.getByText('Custom not found message')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Custom Home' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Custom Home' })).toHaveAttribute('href', '/custom');
    });
  });
  
  describe('UnauthorizedFallback', () => {
    test('renders with default props', () => {
      render(<UnauthorizedFallback />);
      
      expect(screen.getByText('Access denied')).toBeInTheDocument();
      expect(screen.getByText(/Sorry, you don't have permission/)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go back' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Go back' })).toHaveAttribute('href', '/');
    });
    
    test('renders with custom props', () => {
      render(
        <UnauthorizedFallback
          title="Custom Unauthorized"
          message="Custom unauthorized message"
          buttonText="Custom Back"
          buttonHref="/custom"
        />
      );
      
      expect(screen.getByText('Custom Unauthorized')).toBeInTheDocument();
      expect(screen.getByText('Custom unauthorized message')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Custom Back' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Custom Back' })).toHaveAttribute('href', '/custom');
    });
  });
  
  describe('LoadingFallback', () => {
    test('renders with default props', () => {
      render(<LoadingFallback />);
      
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
    
    test('renders with custom message', () => {
      render(<LoadingFallback message="Custom loading message" />);
      
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });
    
    test('renders as full page when fullPage is true', () => {
      render(<LoadingFallback fullPage={true} />);
      
      const container = screen.getByText('Loading...').closest('div');
      expect(container).toHaveClass('min-h-full');
    });
    
    test('applies custom className', () => {
      render(<LoadingFallback className="custom-class" />);
      
      const container = screen.getByText('Loading...').closest('div');
      expect(container).toHaveClass('custom-class');
    });
  });
  
  describe('EmptyStateFallback', () => {
    test('renders with default props', () => {
      render(<EmptyStateFallback />);
      
      expect(screen.getByText('No items found')).toBeInTheDocument();
      expect(screen.getByText('Get started by creating a new item.')).toBeInTheDocument();
    });
    
    test('renders with custom props', () => {
      render(
        <EmptyStateFallback
          title="Custom Empty State"
          message="Custom empty state message"
          buttonText="Custom Action"
          onAction={() => {}}
        />
      );
      
      expect(screen.getByText('Custom Empty State')).toBeInTheDocument();
      expect(screen.getByText('Custom empty state message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Custom Action' })).toBeInTheDocument();
    });
    
    test('calls onAction when button is clicked', () => {
      const onAction = jest.fn();
      
      render(
        <EmptyStateFallback
          buttonText="Add Item"
          onAction={onAction}
        />
      );
      
      fireEvent.click(screen.getByRole('button', { name: 'Add Item' }));
      
      expect(onAction).toHaveBeenCalledTimes(1);
    });
    
    test('does not render button when buttonText is not provided', () => {
      render(
        <EmptyStateFallback
          onAction={() => {}}
        />
      );
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    
    test('does not render button when onAction is not provided', () => {
      render(
        <EmptyStateFallback
          buttonText="Add Item"
        />
      );
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
    
    test('applies custom className', () => {
      render(<EmptyStateFallback className="custom-class" />);
      
      const container = screen.getByText('No items found').closest('div');
      expect(container).toHaveClass('custom-class');
    });
  });
});
