/**
 * Formats a number as Philippine Peso currency
 * @param amount The amount to format
 * @returns Formatted currency string with Philippine Peso symbol (₱)
 */
export const formatCurrency = (amount: number): string => {
  // Handle invalid inputs
  if (amount === undefined || amount === null || isNaN(amount)) {
    amount = 0;
  }
  
  // Determine if the amount is negative
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);
  
  // Format the number with commas and 2 decimal places
  const formatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  // Format the absolute amount
  const formatted = formatter.format(absoluteAmount);
  
  // Replace the currency code or symbol with the Philippine Peso symbol
  const withPesoSymbol = formatted.replace(/PHP|₱|\$/, '₱');
  
  // Add the negative sign if needed
  return isNegative ? `-${withPesoSymbol}` : withPesoSymbol;
};
