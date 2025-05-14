import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TextInput, TextArea, Select, Checkbox } from '../ResponsiveInputs';
import { useScreenSize } from '../ResponsiveWrapper';

// Mock the ResponsiveWrapper hook
jest.mock('../ResponsiveWrapper', () => ({
  useScreenSize: jest.fn(),
}));

describe('ResponsiveInputs', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default to desktop screen size
    useScreenSize.mockReturnValue('desktop');
  });
  
  describe('TextInput Component', () => {
    test('renders input with label', () => {
      render(
        <TextInput
          id="test-input"
          name="test"
          label="Test Input"
          value=""
          onChange={() => {}}
        />
      );
      
      expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
    });
    
    test('calls onChange when input value changes', () => {
      const handleChange = jest.fn();
      
      render(
        <TextInput
          id="test-input"
          name="test"
          label="Test Input"
          value=""
          onChange={handleChange}
        />
      );
      
      fireEvent.change(screen.getByLabelText('Test Input'), { target: { value: 'New Value' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
    
    test('displays error message when error is provided', () => {
      render(
        <TextInput
          id="test-input"
          name="test"
          label="Test Input"
          value=""
          onChange={() => {}}
          error="This field is required"
        />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Input')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Test Input')).toHaveAttribute('aria-describedby', 'test-input-error');
    });
    
    test('displays hint when hint is provided and no error', () => {
      render(
        <TextInput
          id="test-input"
          name="test"
          label="Test Input"
          value=""
          onChange={() => {}}
          hint="Enter your full name"
        />
      );
      
      expect(screen.getByText('Enter your full name')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Input')).toHaveAttribute('aria-describedby', 'test-input-hint');
    });
    
    test('adds required indicator when required is true', () => {
      render(
        <TextInput
          id="test-input"
          name="test"
          label="Test Input"
          value=""
          onChange={() => {}}
          required={true}
        />
      );
      
      const label = screen.getByText('Test Input');
      expect(label.nextSibling).toHaveTextContent('*');
    });
    
    test('applies different styles on mobile', () => {
      // Mock mobile screen size
      useScreenSize.mockReturnValue('mobile');
      
      render(
        <TextInput
          id="test-input"
          name="test"
          label="Test Input"
          value=""
          onChange={() => {}}
        />
      );
      
      const input = screen.getByLabelText('Test Input');
      expect(input).toHaveClass('text-base py-2.5');
    });
    
    test('disables input when disabled is true', () => {
      render(
        <TextInput
          id="test-input"
          name="test"
          label="Test Input"
          value=""
          onChange={() => {}}
          disabled={true}
        />
      );
      
      expect(screen.getByLabelText('Test Input')).toBeDisabled();
    });
  });
  
  describe('TextArea Component', () => {
    test('renders textarea with label', () => {
      render(
        <TextArea
          id="test-textarea"
          name="test"
          label="Test TextArea"
          value=""
          onChange={() => {}}
        />
      );
      
      expect(screen.getByLabelText('Test TextArea')).toBeInTheDocument();
    });
    
    test('calls onChange when textarea value changes', () => {
      const handleChange = jest.fn();
      
      render(
        <TextArea
          id="test-textarea"
          name="test"
          label="Test TextArea"
          value=""
          onChange={handleChange}
        />
      );
      
      fireEvent.change(screen.getByLabelText('Test TextArea'), { target: { value: 'New Value' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
    
    test('sets rows attribute', () => {
      render(
        <TextArea
          id="test-textarea"
          name="test"
          label="Test TextArea"
          value=""
          onChange={() => {}}
          rows={6}
        />
      );
      
      expect(screen.getByLabelText('Test TextArea')).toHaveAttribute('rows', '6');
    });
    
    test('applies different styles on mobile', () => {
      // Mock mobile screen size
      useScreenSize.mockReturnValue('mobile');
      
      render(
        <TextArea
          id="test-textarea"
          name="test"
          label="Test TextArea"
          value=""
          onChange={() => {}}
        />
      );
      
      const textarea = screen.getByLabelText('Test TextArea');
      expect(textarea).toHaveClass('text-base');
    });
  });
  
  describe('Select Component', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ];
    
    test('renders select with label and options', () => {
      render(
        <Select
          id="test-select"
          name="test"
          label="Test Select"
          value="option1"
          onChange={() => {}}
          options={options}
        />
      );
      
      expect(screen.getByLabelText('Test Select')).toBeInTheDocument();
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
    
    test('calls onChange when select value changes', () => {
      const handleChange = jest.fn();
      
      render(
        <Select
          id="test-select"
          name="test"
          label="Test Select"
          value="option1"
          onChange={handleChange}
          options={options}
        />
      );
      
      fireEvent.change(screen.getByLabelText('Test Select'), { target: { value: 'option2' } });
      
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
    
    test('applies different styles on mobile', () => {
      // Mock mobile screen size
      useScreenSize.mockReturnValue('mobile');
      
      render(
        <Select
          id="test-select"
          name="test"
          label="Test Select"
          value="option1"
          onChange={() => {}}
          options={options}
        />
      );
      
      const select = screen.getByLabelText('Test Select');
      expect(select).toHaveClass('text-base py-2.5');
    });
  });
  
  describe('Checkbox Component', () => {
    test('renders checkbox with label', () => {
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          label="Test Checkbox"
          checked={false}
          onChange={() => {}}
        />
      );
      
      expect(screen.getByLabelText('Test Checkbox')).toBeInTheDocument();
    });
    
    test('calls onChange when checkbox is clicked', () => {
      const handleChange = jest.fn();
      
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          label="Test Checkbox"
          checked={false}
          onChange={handleChange}
        />
      );
      
      fireEvent.click(screen.getByLabelText('Test Checkbox'));
      
      expect(handleChange).toHaveBeenCalledTimes(1);
    });
    
    test('displays error message when error is provided', () => {
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          label="Test Checkbox"
          checked={false}
          onChange={() => {}}
          error="This field is required"
        />
      );
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Checkbox')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Test Checkbox')).toHaveAttribute('aria-describedby', 'test-checkbox-error');
    });
    
    test('displays hint when hint is provided and no error', () => {
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          label="Test Checkbox"
          checked={false}
          onChange={() => {}}
          hint="Check this box to agree"
        />
      );
      
      expect(screen.getByText('Check this box to agree')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Checkbox')).toHaveAttribute('aria-describedby', 'test-checkbox-hint');
    });
    
    test('adds required indicator when required is true', () => {
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          label="Test Checkbox"
          checked={false}
          onChange={() => {}}
          required={true}
        />
      );
      
      const label = screen.getByText('Test Checkbox');
      expect(label.nextSibling).toHaveTextContent('*');
    });
    
    test('disables checkbox when disabled is true', () => {
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          label="Test Checkbox"
          checked={false}
          onChange={() => {}}
          disabled={true}
        />
      );
      
      expect(screen.getByLabelText('Test Checkbox')).toBeDisabled();
      expect(screen.getByText('Test Checkbox').parentElement).toHaveClass('opacity-50');
    });
  });
});
