import React, { useState } from 'react';

interface CurrencyConverterProps {
  className?: string;
}

interface CurrencyOption {
  value: string;
  label: string;
  symbol: string;
  rate: number;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({ className = '' }) => {
  const [amount, setAmount] = useState<string>('0');
  const [targetCurrency, setTargetCurrency] = useState<string>('USD');
  const [convertedAmount, setConvertedAmount] = useState<string>('₱0.00');
  const [error, setError] = useState<string | null>(null);

  // Currency conversion rates (1 PHP to other currencies)
  const currencyOptions: CurrencyOption[] = [
    { value: 'USD', label: 'US Dollar', symbol: '$', rate: 0.018 },
    { value: 'EUR', label: 'Euro', symbol: '€', rate: 0.016 },
    { value: 'JPY', label: 'Japanese Yen', symbol: '¥', rate: 2.5 },
    { value: 'GBP', label: 'British Pound', symbol: '£', rate: 0.014 },
    { value: 'AUD', label: 'Australian Dollar', symbol: 'A$', rate: 0.026 },
    { value: 'CAD', label: 'Canadian Dollar', symbol: 'C$', rate: 0.024 },
    { value: 'SGD', label: 'Singapore Dollar', symbol: 'S$', rate: 0.024 },
    { value: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$', rate: 0.14 },
  ];

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
    setError(null);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTargetCurrency(e.target.value);
    setError(null);
  };

  const handleConvert = () => {
    // Validate input
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      setError('Please enter a valid number');
      return;
    }

    // Find the selected currency
    const selectedCurrency = currencyOptions.find(
      (currency) => currency.value === targetCurrency
    );

    if (!selectedCurrency) {
      setError('Invalid currency selected');
      return;
    }

    // Convert the amount
    const converted = numericAmount * selectedCurrency.rate;

    // Format the converted amount
    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);

    // Update the state
    setConvertedAmount(formattedAmount);
    setError(null);
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Currency Converter</h2>
      
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount (₱)
        </label>
        <input
          type="text"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
          Convert to
        </label>
        <select
          id="currency"
          value={targetCurrency}
          onChange={handleCurrencyChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {currencyOptions.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label} ({currency.symbol})
            </option>
          ))}
        </select>
      </div>
      
      <button
        onClick={handleConvert}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Convert
      </button>
      
      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}
      
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <p className="text-lg font-medium">Converted Amount: {convertedAmount}</p>
        <p className="text-xs text-gray-500 mt-1">
          Exchange rates are approximate and for informational purposes only.
        </p>
      </div>
    </div>
  );
};

export default CurrencyConverter;
