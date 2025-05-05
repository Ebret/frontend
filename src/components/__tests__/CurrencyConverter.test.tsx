import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CurrencyConverter from '../CurrencyConverter';

describe('CurrencyConverter Component', () => {
  it('renders the component with default values', () => {
    render(<CurrencyConverter />);
    
    // Check if the component title is displayed
    expect(screen.getByText('Currency Converter')).toBeInTheDocument();
    
    // Check if the input fields are displayed with default values
    const amountInput = screen.getByLabelText('Amount (₱)');
    expect(amountInput).toBeInTheDocument();
    expect(amountInput).toHaveValue('0');
    
    // Check if the conversion result is displayed with default value
    expect(screen.getByText(/Converted Amount:/)).toBeInTheDocument();
    expect(screen.getByText(/₱0.00/)).toBeInTheDocument();
  });
  
  it('converts Philippine Peso to US Dollar correctly', () => {
    render(<CurrencyConverter />);
    
    // Enter an amount in PHP
    const amountInput = screen.getByLabelText('Amount (₱)');
    fireEvent.change(amountInput, { target: { value: '1000' } });
    
    // Select USD as the target currency
    const currencySelect = screen.getByLabelText('Convert to');
    fireEvent.change(currencySelect, { target: { value: 'USD' } });
    
    // Click the convert button
    const convertButton = screen.getByRole('button', { name: 'Convert' });
    fireEvent.click(convertButton);
    
    // Check if the conversion result is displayed correctly
    // Assuming 1 PHP = 0.018 USD
    expect(screen.getByText(/Converted Amount: \$18.00/)).toBeInTheDocument();
  });
  
  it('converts Philippine Peso to Euro correctly', () => {
    render(<CurrencyConverter />);
    
    // Enter an amount in PHP
    const amountInput = screen.getByLabelText('Amount (₱)');
    fireEvent.change(amountInput, { target: { value: '1000' } });
    
    // Select EUR as the target currency
    const currencySelect = screen.getByLabelText('Convert to');
    fireEvent.change(currencySelect, { target: { value: 'EUR' } });
    
    // Click the convert button
    const convertButton = screen.getByRole('button', { name: 'Convert' });
    fireEvent.click(convertButton);
    
    // Check if the conversion result is displayed correctly
    // Assuming 1 PHP = 0.016 EUR
    expect(screen.getByText(/Converted Amount: €16.00/)).toBeInTheDocument();
  });
  
  it('converts Philippine Peso to Japanese Yen correctly', () => {
    render(<CurrencyConverter />);
    
    // Enter an amount in PHP
    const amountInput = screen.getByLabelText('Amount (₱)');
    fireEvent.change(amountInput, { target: { value: '1000' } });
    
    // Select JPY as the target currency
    const currencySelect = screen.getByLabelText('Convert to');
    fireEvent.change(currencySelect, { target: { value: 'JPY' } });
    
    // Click the convert button
    const convertButton = screen.getByRole('button', { name: 'Convert' });
    fireEvent.click(convertButton);
    
    // Check if the conversion result is displayed correctly
    // Assuming 1 PHP = 2.5 JPY
    expect(screen.getByText(/Converted Amount: ¥2,500.00/)).toBeInTheDocument();
  });
  
  it('handles invalid input gracefully', () => {
    render(<CurrencyConverter />);
    
    // Enter an invalid amount
    const amountInput = screen.getByLabelText('Amount (₱)');
    fireEvent.change(amountInput, { target: { value: 'abc' } });
    
    // Click the convert button
    const convertButton = screen.getByRole('button', { name: 'Convert' });
    fireEvent.click(convertButton);
    
    // Check if an error message is displayed
    expect(screen.getByText('Please enter a valid number')).toBeInTheDocument();
  });
});
