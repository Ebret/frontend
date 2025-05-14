import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary, { withErrorBoundary } from '../ErrorBoundary';

// Mock console.error to avoid test output pollution
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

// Component that throws an error
const BuggyComponent = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Working Component</div>;
};

describe('ErrorBoundary', () => {
  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  
  test('renders fallback UI when an error occurs', () => {
    // Suppress React's error boundary warning in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );
    
    // Restore console.error
    console.error = originalError;
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We've encountered an error/)).toBeInTheDocument();
  });
  
  test('renders custom fallback when provided', () => {
    // Suppress React's error boundary warning in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    const customFallback = (error, resetErrorBoundary) => (
      <div>
        <h2>Custom Error UI</h2>
        <p>{error.message}</p>
        <button onClick={resetErrorBoundary}>Reset</button>
      </div>
    );
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <BuggyComponent />
      </ErrorBoundary>
    );
    
    // Restore console.error
    console.error = originalError;
    
    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
  
  test('calls onError when an error occurs', () => {
    // Suppress React's error boundary warning in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    const handleError = jest.fn();
    
    render(
      <ErrorBoundary onError={handleError}>
        <BuggyComponent />
      </ErrorBoundary>
    );
    
    // Restore console.error
    console.error = originalError;
    
    expect(handleError).toHaveBeenCalledTimes(1);
    expect(handleError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(handleError.mock.calls[0][0].message).toBe('Test error');
  });
  
  test('resets error state when reset button is clicked', () => {
    // Suppress React's error boundary warning in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);
      
      return (
        <div>
          <button onClick={() => setShouldThrow(false)}>Fix Bug</button>
          <ErrorBoundary>
            <BuggyComponent shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </div>
      );
    };
    
    render(<TestComponent />);
    
    // Restore console.error
    console.error = originalError;
    
    // Error boundary should show fallback UI
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Click the reset button
    fireEvent.click(screen.getByText('Try again'));
    
    // Click the fix bug button to prevent the error from happening again
    fireEvent.click(screen.getByText('Fix Bug'));
    
    // Component should now render without error
    expect(screen.getByText('Working Component')).toBeInTheDocument();
  });
  
  test('hides reset button when showReset is false', () => {
    // Suppress React's error boundary warning in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    render(
      <ErrorBoundary showReset={false}>
        <BuggyComponent />
      </ErrorBoundary>
    );
    
    // Restore console.error
    console.error = originalError;
    
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });
});

describe('withErrorBoundary HOC', () => {
  test('wraps component with error boundary', () => {
    // Suppress React's error boundary warning in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    const WrappedBuggyComponent = withErrorBoundary(BuggyComponent);
    
    render(<WrappedBuggyComponent />);
    
    // Restore console.error
    console.error = originalError;
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
  
  test('passes error boundary props to ErrorBoundary', () => {
    // Suppress React's error boundary warning in test output
    const originalError = console.error;
    console.error = jest.fn();
    
    const customFallback = (error, resetErrorBoundary) => (
      <div>
        <h2>Custom Error UI from HOC</h2>
        <p>{error.message}</p>
        <button onClick={resetErrorBoundary}>Reset</button>
      </div>
    );
    
    const WrappedBuggyComponent = withErrorBoundary(BuggyComponent, {
      fallback: customFallback,
    });
    
    render(<WrappedBuggyComponent />);
    
    // Restore console.error
    console.error = originalError;
    
    expect(screen.getByText('Custom Error UI from HOC')).toBeInTheDocument();
  });
  
  test('passes component props to wrapped component', () => {
    const WrappedComponent = withErrorBoundary(({ message }) => <div>{message}</div>);
    
    render(<WrappedComponent message="Hello World" />);
    
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
  
  test('sets correct display name', () => {
    const NamedComponent = () => <div>Named Component</div>;
    NamedComponent.displayName = 'CustomName';
    
    const WrappedNamedComponent = withErrorBoundary(NamedComponent);
    
    expect(WrappedNamedComponent.displayName).toBe('withErrorBoundary(CustomName)');
    
    const UnnamedComponent = () => <div>Unnamed Component</div>;
    const WrappedUnnamedComponent = withErrorBoundary(UnnamedComponent);
    
    expect(WrappedUnnamedComponent.displayName).toBe('withErrorBoundary(UnnamedComponent)');
  });
});
