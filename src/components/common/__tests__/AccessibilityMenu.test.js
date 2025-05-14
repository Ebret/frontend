import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccessibilityMenu from '../AccessibilityMenu';

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => {
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock document.documentElement
const originalDocumentElement = document.documentElement;
const mockDocumentElement = {
  ...originalDocumentElement,
  style: {
    fontSize: '',
  },
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
  },
};

describe('AccessibilityMenu', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset localStorage
    localStorageMock.clear();
    
    // Reset document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: mockDocumentElement,
      writable: true,
    });
  });
  
  afterAll(() => {
    // Restore document.documentElement
    Object.defineProperty(document, 'documentElement', {
      value: originalDocumentElement,
      writable: true,
    });
  });
  
  test('renders accessibility button', () => {
    render(<AccessibilityMenu />);
    
    // Check that the accessibility button is rendered
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    expect(accessibilityButton).toBeInTheDocument();
  });
  
  test('opens menu when button is clicked', () => {
    render(<AccessibilityMenu />);
    
    // Click the accessibility button
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    fireEvent.click(accessibilityButton);
    
    // Check that the menu is opened
    expect(screen.getByText('Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Font Size')).toBeInTheDocument();
    expect(screen.getByText('Contrast')).toBeInTheDocument();
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
  });
  
  test('closes menu when close button is clicked', () => {
    render(<AccessibilityMenu />);
    
    // Open the menu
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    fireEvent.click(accessibilityButton);
    
    // Click the close button
    const closeButton = screen.getByRole('button', { name: /close accessibility menu/i });
    fireEvent.click(closeButton);
    
    // Check that the menu is closed
    expect(screen.queryByText('Accessibility')).not.toBeInTheDocument();
  });
  
  test('increases font size when increase button is clicked', () => {
    render(<AccessibilityMenu />);
    
    // Open the menu
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    fireEvent.click(accessibilityButton);
    
    // Check initial font size
    expect(screen.getByText('16px')).toBeInTheDocument();
    
    // Click the increase font size button
    const increaseButton = screen.getByRole('button', { name: /increase font size/i });
    fireEvent.click(increaseButton);
    
    // Check that the font size is increased
    expect(screen.getByText('17px')).toBeInTheDocument();
    
    // Check that localStorage is updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'accessibilitySettings',
      expect.stringContaining('"fontSize":17')
    );
  });
  
  test('decreases font size when decrease button is clicked', () => {
    render(<AccessibilityMenu />);
    
    // Open the menu
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    fireEvent.click(accessibilityButton);
    
    // Check initial font size
    expect(screen.getByText('16px')).toBeInTheDocument();
    
    // Click the decrease font size button
    const decreaseButton = screen.getByRole('button', { name: /decrease font size/i });
    fireEvent.click(decreaseButton);
    
    // Check that the font size is decreased
    expect(screen.getByText('15px')).toBeInTheDocument();
    
    // Check that localStorage is updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'accessibilitySettings',
      expect.stringContaining('"fontSize":15')
    );
  });
  
  test('resets font size when reset button is clicked', () => {
    render(<AccessibilityMenu />);
    
    // Open the menu
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    fireEvent.click(accessibilityButton);
    
    // Increase font size
    const increaseButton = screen.getByRole('button', { name: /increase font size/i });
    fireEvent.click(increaseButton);
    
    // Check that the font size is increased
    expect(screen.getByText('17px')).toBeInTheDocument();
    
    // Click the reset font size button
    const resetButton = screen.getByRole('button', { name: /reset font size/i });
    fireEvent.click(resetButton);
    
    // Check that the font size is reset
    expect(screen.getByText('16px')).toBeInTheDocument();
    
    // Check that localStorage is updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'accessibilitySettings',
      expect.stringContaining('"fontSize":16')
    );
  });
  
  test('toggles contrast when contrast button is clicked', () => {
    render(<AccessibilityMenu />);
    
    // Open the menu
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    fireEvent.click(accessibilityButton);
    
    // Check initial contrast
    expect(screen.getByText('Normal Contrast')).toBeInTheDocument();
    
    // Click the contrast button
    const contrastButton = screen.getByText('Normal Contrast').closest('button');
    fireEvent.click(contrastButton);
    
    // Check that the contrast is changed to high contrast
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
    
    // Check that localStorage is updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'accessibilitySettings',
      expect.stringContaining('"contrast":"high-contrast"')
    );
    
    // Check that the high contrast class is added to the document
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('high-contrast');
    
    // Click the contrast button again
    fireEvent.click(contrastButton);
    
    // Check that the contrast is changed to low contrast
    expect(screen.getByText('Low Contrast')).toBeInTheDocument();
    
    // Check that localStorage is updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'accessibilitySettings',
      expect.stringContaining('"contrast":"low-contrast"')
    );
    
    // Check that the high contrast class is removed and low contrast class is added
    expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('high-contrast');
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('low-contrast');
  });
  
  test('toggles reduced motion when reduced motion checkbox is clicked', () => {
    render(<AccessibilityMenu />);
    
    // Open the menu
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    fireEvent.click(accessibilityButton);
    
    // Check initial reduced motion state
    const reducedMotionCheckbox = screen.getByLabelText('Reduced Motion');
    expect(reducedMotionCheckbox).not.toBeChecked();
    
    // Click the reduced motion checkbox
    fireEvent.click(reducedMotionCheckbox);
    
    // Check that the reduced motion checkbox is checked
    expect(reducedMotionCheckbox).toBeChecked();
    
    // Check that localStorage is updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'accessibilitySettings',
      expect.stringContaining('"reducedMotion":true')
    );
    
    // Check that the reduced motion class is added to the document
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('reduced-motion');
    
    // Click the reduced motion checkbox again
    fireEvent.click(reducedMotionCheckbox);
    
    // Check that the reduced motion checkbox is unchecked
    expect(reducedMotionCheckbox).not.toBeChecked();
    
    // Check that localStorage is updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'accessibilitySettings',
      expect.stringContaining('"reducedMotion":false')
    );
    
    // Check that the reduced motion class is removed from the document
    expect(mockDocumentElement.classList.remove).toHaveBeenCalledWith('reduced-motion');
  });
  
  test('loads settings from localStorage on mount', () => {
    // Set up localStorage with accessibility settings
    const settings = {
      fontSize: 18,
      contrast: 'high-contrast',
      reducedMotion: true,
    };
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(settings));
    
    render(<AccessibilityMenu />);
    
    // Open the menu
    const accessibilityButton = screen.getByRole('button', { name: /accessibility options/i });
    fireEvent.click(accessibilityButton);
    
    // Check that the settings are loaded
    expect(screen.getByText('18px')).toBeInTheDocument();
    expect(screen.getByText('High Contrast')).toBeInTheDocument();
    expect(screen.getByLabelText('Reduced Motion')).toBeChecked();
    
    // Check that the settings are applied to the document
    expect(mockDocumentElement.style.fontSize).toBe('18px');
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('high-contrast');
    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith('reduced-motion');
  });
});
