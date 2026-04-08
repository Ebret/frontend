const { calculateMonthlyPayment, calculateTotalInterest, calculateLatePaymentFee, applyPayment } = require('../../src/services/loanService');

describe('Loan Calculations', () => {
  // Test data
  const loanAmount = 50000;
  const interestRate = 12; // 12% annual interest rate
  const term = 12; // 12 months
  const gracePeriod = 3; // 3 days grace period
  const latePaymentFee = 500; // ₱500 late payment fee
  
  describe('Monthly Payment Calculation', () => {
    it('should calculate the correct monthly payment for a loan', () => {
      const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, term);
      
      // Expected monthly payment for a ₱50,000 loan at 12% annual interest for 12 months
      // Formula: P = L[i(1+i)^n]/[(1+i)^n-1] where L is loan amount, i is monthly interest rate, n is term
      const expectedMonthlyPayment = 4442.44; // Calculated using the formula
      
      expect(monthlyPayment).toBeCloseTo(expectedMonthlyPayment, 2);
    });
    
    it('should handle zero interest rate', () => {
      const monthlyPayment = calculateMonthlyPayment(loanAmount, 0, term);
      
      // With 0% interest, the monthly payment is simply the loan amount divided by the term
      const expectedMonthlyPayment = loanAmount / term;
      
      expect(monthlyPayment).toBeCloseTo(expectedMonthlyPayment, 2);
    });
    
    it('should handle different loan terms', () => {
      const shortTermPayment = calculateMonthlyPayment(loanAmount, interestRate, 6);
      const longTermPayment = calculateMonthlyPayment(loanAmount, interestRate, 24);
      
      // Shorter term should have higher monthly payments
      expect(shortTermPayment).toBeGreaterThan(longTermPayment);
    });
  });
  
  describe('Total Interest Calculation', () => {
    it('should calculate the total interest paid over the life of the loan', () => {
      const totalInterest = calculateTotalInterest(loanAmount, interestRate, term);
      
      // Total interest is the difference between total payments and principal
      const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, term);
      const totalPayments = monthlyPayment * term;
      const expectedTotalInterest = totalPayments - loanAmount;
      
      expect(totalInterest).toBeCloseTo(expectedTotalInterest, 2);
    });
    
    it('should return zero interest for zero interest rate', () => {
      const totalInterest = calculateTotalInterest(loanAmount, 0, term);
      expect(totalInterest).toBeCloseTo(0, 2);
    });
  });
  
  describe('Late Payment Fee Calculation', () => {
    it('should apply no late fee within grace period', () => {
      const dueDate = new Date('2023-05-01');
      const paymentDate = new Date('2023-05-03'); // Within 3-day grace period
      
      const lateFee = calculateLatePaymentFee(dueDate, paymentDate, latePaymentFee, gracePeriod);
      expect(lateFee).toBe(0);
    });
    
    it('should apply late fee after grace period', () => {
      const dueDate = new Date('2023-05-01');
      const paymentDate = new Date('2023-05-05'); // 4 days late, outside grace period
      
      const lateFee = calculateLatePaymentFee(dueDate, paymentDate, latePaymentFee, gracePeriod);
      expect(lateFee).toBe(latePaymentFee);
    });
    
    it('should not apply late fee for early payments', () => {
      const dueDate = new Date('2023-05-01');
      const paymentDate = new Date('2023-04-28'); // 3 days early
      
      const lateFee = calculateLatePaymentFee(dueDate, paymentDate, latePaymentFee, gracePeriod);
      expect(lateFee).toBe(0);
    });
  });
  
  describe('Payment Application', () => {
    it('should apply payment correctly to principal and interest', () => {
      // Create a loan with one payment already made
      const loan = {
        amount: loanAmount,
        interestRate: interestRate,
        term: term,
        remainingPrincipal: 45000, // After one payment
        paymentsMade: 1,
        nextPaymentDue: new Date('2023-05-01'),
      };
      
      const paymentAmount = 4442.44; // Regular monthly payment
      const paymentDate = new Date('2023-05-01'); // On time
      
      const result = applyPayment(loan, paymentAmount, paymentDate);
      
      // Check that payment was applied correctly
      expect(result.principalPaid).toBeGreaterThan(0);
      expect(result.interestPaid).toBeGreaterThan(0);
      expect(result.lateFee).toBe(0);
      expect(result.principalPaid + result.interestPaid).toBeCloseTo(paymentAmount, 2);
      
      // Check that remaining principal decreased
      expect(result.newRemainingPrincipal).toBeLessThan(loan.remainingPrincipal);
      
      // Check that payments made increased
      expect(result.newPaymentsMade).toBe(loan.paymentsMade + 1);
    });
    
    it('should apply late payment with fee correctly', () => {
      // Create a loan with one payment already made
      const loan = {
        amount: loanAmount,
        interestRate: interestRate,
        term: term,
        remainingPrincipal: 45000, // After one payment
        paymentsMade: 1,
        nextPaymentDue: new Date('2023-05-01'),
      };
      
      const paymentAmount = 4442.44 + latePaymentFee; // Regular payment + late fee
      const paymentDate = new Date('2023-05-10'); // 9 days late
      
      const result = applyPayment(loan, paymentAmount, paymentDate, latePaymentFee, gracePeriod);
      
      // Check that payment was applied correctly
      expect(result.principalPaid).toBeGreaterThan(0);
      expect(result.interestPaid).toBeGreaterThan(0);
      expect(result.lateFee).toBe(latePaymentFee);
      expect(result.principalPaid + result.interestPaid + result.lateFee).toBeCloseTo(paymentAmount, 2);
      
      // Check that remaining principal decreased
      expect(result.newRemainingPrincipal).toBeLessThan(loan.remainingPrincipal);
      
      // Check that payments made increased
      expect(result.newPaymentsMade).toBe(loan.paymentsMade + 1);
    });
    
    it('should handle partial payments correctly', () => {
      // Create a loan with one payment already made
      const loan = {
        amount: loanAmount,
        interestRate: interestRate,
        term: term,
        remainingPrincipal: 45000, // After one payment
        paymentsMade: 1,
        nextPaymentDue: new Date('2023-05-01'),
      };
      
      const paymentAmount = 2000; // Partial payment
      const paymentDate = new Date('2023-05-01'); // On time
      
      const result = applyPayment(loan, paymentAmount, paymentDate);
      
      // Check that payment was applied correctly
      expect(result.principalPaid).toBeGreaterThan(0);
      expect(result.interestPaid).toBeGreaterThan(0);
      expect(result.lateFee).toBe(0);
      expect(result.principalPaid + result.interestPaid).toBeCloseTo(paymentAmount, 2);
      
      // Check that remaining principal decreased but not by as much as a full payment
      expect(result.newRemainingPrincipal).toBeLessThan(loan.remainingPrincipal);
      expect(result.newRemainingPrincipal).toBeGreaterThan(loan.remainingPrincipal - 4000);
      
      // Check that payments made did not increase for partial payment
      expect(result.newPaymentsMade).toBe(loan.paymentsMade);
    });
    
    it('should handle final payment correctly', () => {
      // Create a loan with almost all payments made
      const loan = {
        amount: loanAmount,
        interestRate: interestRate,
        term: term,
        remainingPrincipal: 4000, // Last payment
        paymentsMade: 11,
        nextPaymentDue: new Date('2023-05-01'),
      };
      
      const paymentAmount = 4442.44; // Regular monthly payment
      const paymentDate = new Date('2023-05-01'); // On time
      
      const result = applyPayment(loan, paymentAmount, paymentDate);
      
      // Check that payment was applied correctly
      expect(result.principalPaid).toBeCloseTo(4000, 2); // All remaining principal
      expect(result.interestPaid).toBeGreaterThan(0);
      expect(result.lateFee).toBe(0);
      
      // Check that remaining principal is now zero
      expect(result.newRemainingPrincipal).toBeCloseTo(0, 2);
      
      // Check that payments made increased
      expect(result.newPaymentsMade).toBe(loan.paymentsMade + 1);
      
      // Check that loan is marked as paid
      expect(result.loanPaid).toBe(true);
    });
  });
});
