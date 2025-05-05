import { formatCurrency } from '../formatCurrency';

describe('formatCurrency Utility', () => {
  it('should format currency with Philippine Peso symbol', () => {
    expect(formatCurrency(1000)).toBe('₱1,000.00');
    expect(formatCurrency(1000.5)).toBe('₱1,000.50');
    expect(formatCurrency(1000.55)).toBe('₱1,000.55');
    expect(formatCurrency(1000.555)).toBe('₱1,000.56'); // Rounds to 2 decimal places
  });
  
  it('should handle zero correctly', () => {
    expect(formatCurrency(0)).toBe('₱0.00');
  });
  
  it('should handle negative values correctly', () => {
    expect(formatCurrency(-1000)).toBe('-₱1,000.00');
    expect(formatCurrency(-1000.5)).toBe('-₱1,000.50');
  });
  
  it('should handle large numbers correctly', () => {
    expect(formatCurrency(1000000)).toBe('₱1,000,000.00');
    expect(formatCurrency(1000000000)).toBe('₱1,000,000,000.00');
  });
  
  it('should handle small decimal values correctly', () => {
    expect(formatCurrency(0.01)).toBe('₱0.01');
    expect(formatCurrency(0.1)).toBe('₱0.10');
  });
  
  it('should handle string inputs correctly', () => {
    expect(formatCurrency('1000' as any)).toBe('₱1,000.00');
    expect(formatCurrency('1000.5' as any)).toBe('₱1,000.50');
  });
  
  it('should handle invalid inputs gracefully', () => {
    expect(formatCurrency(NaN)).toBe('₱0.00');
    expect(formatCurrency(undefined as any)).toBe('₱0.00');
    expect(formatCurrency(null as any)).toBe('₱0.00');
  });
});
