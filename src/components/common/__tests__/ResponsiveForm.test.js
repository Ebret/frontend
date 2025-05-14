import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResponsiveForm, { FormGroup, FormLabel, FormControl } from '../ResponsiveForm';
import { useScreenSize } from '../ResponsiveWrapper';

// Mock the ResponsiveWrapper hook
jest.mock('../ResponsiveWrapper', () => ({
  useScreenSize: jest.fn(),
}));

describe('ResponsiveForm', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default to desktop screen size
    useScreenSize.mockReturnValue('desktop');
  });
  
  describe('ResponsiveForm Component', () => {
    test('renders form with children', () => {
      render(
        <ResponsiveForm>
          <div data-testid="form-content">Form Content</div>
        </ResponsiveForm>
      );
      
      expect(screen.getByTestId('form-content')).toBeInTheDocument();
    });
    
    test('calls onSubmit when form is submitted', () => {
      const handleSubmit = jest.fn();
      
      render(
        <ResponsiveForm onSubmit={handleSubmit}>
          <div>Form Content</div>
        </ResponsiveForm>
      );
      
      fireEvent.submit(screen.getByRole('form'));
      
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
    
    test('does not call onSubmit when form is submitted and loading is true', () => {
      const handleSubmit = jest.fn();
      
      render(
        <ResponsiveForm onSubmit={handleSubmit} loading={true}>
          <div>Form Content</div>
        </ResponsiveForm>
      );
      
      fireEvent.submit(screen.getByRole('form'));
      
      expect(handleSubmit).not.toHaveBeenCalled();
    });
    
    test('renders submit button with custom text', () => {
      render(
        <ResponsiveForm submitText="Save Changes">
          <div>Form Content</div>
        </ResponsiveForm>
      );
      
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });
    
    test('disables submit button when loading is true', () => {
      render(
        <ResponsiveForm loading={true}>
          <div>Form Content</div>
        </ResponsiveForm>
      );
      
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
    
    test('applies compact class when compact is true', () => {
      render(
        <ResponsiveForm compact={true}>
          <div>Form Content</div>
        </ResponsiveForm>
      );
      
      const form = screen.getByRole('form');
      expect(form).toHaveClass('max-w-md');
    });
    
    test('applies different spacing on mobile', () => {
      // Mock mobile screen size
      useScreenSize.mockReturnValue('mobile');
      
      render(
        <ResponsiveForm>
          <div>Form Content</div>
        </ResponsiveForm>
      );
      
      const form = screen.getByRole('form');
      expect(form).toHaveClass('space-y-4');
    });
  });
  
  describe('FormGroup Component', () => {
    test('renders with children', () => {
      render(
        <FormGroup>
          <div data-testid="group-content">Group Content</div>
        </FormGroup>
      );
      
      expect(screen.getByTestId('group-content')).toBeInTheDocument();
    });
    
    test('applies vertical layout when layout is vertical', () => {
      render(
        <FormGroup layout="vertical">
          <div>Group Content</div>
        </FormGroup>
      );
      
      const group = screen.getByText('Group Content').parentElement;
      expect(group).toHaveClass('flex flex-col space-y-2');
    });
    
    test('applies horizontal layout when layout is horizontal', () => {
      render(
        <FormGroup layout="horizontal">
          <div>Group Content</div>
        </FormGroup>
      );
      
      const group = screen.getByText('Group Content').parentElement;
      expect(group).toHaveClass('sm:flex sm:items-start sm:gap-4');
    });
    
    test('applies vertical layout on mobile when layout is responsive', () => {
      // Mock mobile screen size
      useScreenSize.mockReturnValue('mobile');
      
      render(
        <FormGroup layout="responsive">
          <div>Group Content</div>
        </FormGroup>
      );
      
      const group = screen.getByText('Group Content').parentElement;
      expect(group).toHaveClass('flex flex-col space-y-2');
    });
    
    test('applies horizontal layout on desktop when layout is responsive', () => {
      // Mock desktop screen size
      useScreenSize.mockReturnValue('desktop');
      
      render(
        <FormGroup layout="responsive">
          <div>Group Content</div>
        </FormGroup>
      );
      
      const group = screen.getByText('Group Content').parentElement;
      expect(group).toHaveClass('sm:flex sm:items-start sm:gap-4');
    });
  });
  
  describe('FormLabel Component', () => {
    test('renders label with text', () => {
      render(
        <FormLabel htmlFor="test-input">Test Label</FormLabel>
      );
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });
    
    test('adds required indicator when required is true', () => {
      render(
        <FormLabel htmlFor="test-input" required={true}>Test Label</FormLabel>
      );
      
      const label = screen.getByText('Test Label');
      expect(label.nextSibling).toHaveTextContent('*');
    });
    
    test('applies vertical layout when layout is vertical', () => {
      render(
        <FormLabel htmlFor="test-input" layout="vertical">Test Label</FormLabel>
      );
      
      const label = screen.getByText('Test Label').parentElement;
      expect(label).not.toHaveClass('sm:w-1/3 sm:text-right sm:pt-2');
    });
    
    test('applies horizontal layout when layout is horizontal', () => {
      render(
        <FormLabel htmlFor="test-input" layout="horizontal">Test Label</FormLabel>
      );
      
      const label = screen.getByText('Test Label').parentElement;
      expect(label).toHaveClass('sm:w-1/3 sm:text-right sm:pt-2');
    });
    
    test('applies vertical layout on mobile when layout is responsive', () => {
      // Mock mobile screen size
      useScreenSize.mockReturnValue('mobile');
      
      render(
        <FormLabel htmlFor="test-input" layout="responsive">Test Label</FormLabel>
      );
      
      const label = screen.getByText('Test Label').parentElement;
      expect(label).not.toHaveClass('sm:w-1/3 sm:text-right sm:pt-2');
    });
    
    test('applies horizontal layout on desktop when layout is responsive', () => {
      // Mock desktop screen size
      useScreenSize.mockReturnValue('desktop');
      
      render(
        <FormLabel htmlFor="test-input" layout="responsive">Test Label</FormLabel>
      );
      
      const label = screen.getByText('Test Label').parentElement;
      expect(label).toHaveClass('sm:w-1/3 sm:text-right sm:pt-2');
    });
  });
  
  describe('FormControl Component', () => {
    test('renders with children', () => {
      render(
        <FormControl>
          <div data-testid="control-content">Control Content</div>
        </FormControl>
      );
      
      expect(screen.getByTestId('control-content')).toBeInTheDocument();
    });
    
    test('displays error message when error is provided', () => {
      render(
        <FormControl error="This field is required">
          <div>Control Content</div>
        </FormControl>
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
    
    test('displays hint when hint is provided and no error', () => {
      render(
        <FormControl hint="Enter your full name">
          <div>Control Content</div>
        </FormControl>
      );
      
      expect(screen.getByText('Enter your full name')).toBeInTheDocument();
    });
    
    test('prioritizes error over hint when both are provided', () => {
      render(
        <FormControl error="This field is required" hint="Enter your full name">
          <div>Control Content</div>
        </FormControl>
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.queryByText('Enter your full name')).not.toBeInTheDocument();
    });
    
    test('applies vertical layout when layout is vertical', () => {
      render(
        <FormControl layout="vertical">
          <div>Control Content</div>
        </FormControl>
      );
      
      const control = screen.getByText('Control Content').parentElement;
      expect(control).toHaveClass('w-full');
    });
    
    test('applies horizontal layout when layout is horizontal', () => {
      render(
        <FormControl layout="horizontal">
          <div>Control Content</div>
        </FormControl>
      );
      
      const control = screen.getByText('Control Content').parentElement;
      expect(control).toHaveClass('sm:w-2/3');
    });
    
    test('applies vertical layout on mobile when layout is responsive', () => {
      // Mock mobile screen size
      useScreenSize.mockReturnValue('mobile');
      
      render(
        <FormControl layout="responsive">
          <div>Control Content</div>
        </FormControl>
      );
      
      const control = screen.getByText('Control Content').parentElement;
      expect(control).toHaveClass('w-full');
    });
    
    test('applies horizontal layout on desktop when layout is responsive', () => {
      // Mock desktop screen size
      useScreenSize.mockReturnValue('desktop');
      
      render(
        <FormControl layout="responsive">
          <div>Control Content</div>
        </FormControl>
      );
      
      const control = screen.getByText('Control Content').parentElement;
      expect(control).toHaveClass('sm:w-2/3');
    });
  });
});
