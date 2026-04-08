/**
 * Loan Service
 * Handles loan calculations, payment processing, and loan management
 */

/**
 * Calculate the monthly payment for a loan
 * @param {number} loanAmount - The principal loan amount
 * @param {number} annualInterestRate - Annual interest rate as a percentage (e.g., 12 for 12%)
 * @param {number} termMonths - Loan term in months
 * @returns {number} - Monthly payment amount
 */
function calculateMonthlyPayment(loanAmount, annualInterestRate, termMonths) {
  // Handle edge case of zero interest
  if (annualInterestRate === 0) {
    return loanAmount / termMonths;
  }

  // Convert annual interest rate to monthly decimal rate
  const monthlyInterestRate = annualInterestRate / 100 / 12;

  // Calculate monthly payment using the formula: P = L[i(1+i)^n]/[(1+i)^n-1]
  // Where P is payment, L is loan amount, i is interest rate, n is term
  const numerator = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termMonths);
  const denominator = Math.pow(1 + monthlyInterestRate, termMonths) - 1;

  return loanAmount * (numerator / denominator);
}

/**
 * Calculate the total interest paid over the life of the loan
 * @param {number} loanAmount - The principal loan amount
 * @param {number} annualInterestRate - Annual interest rate as a percentage
 * @param {number} termMonths - Loan term in months
 * @returns {number} - Total interest paid
 */
function calculateTotalInterest(loanAmount, annualInterestRate, termMonths) {
  // Handle edge case of zero interest
  if (annualInterestRate === 0) {
    return 0;
  }

  const monthlyPayment = calculateMonthlyPayment(loanAmount, annualInterestRate, termMonths);
  const totalPayments = monthlyPayment * termMonths;

  return totalPayments - loanAmount;
}

/**
 * Calculate the amortization schedule for a loan
 * @param {number} loanAmount - The principal loan amount
 * @param {number} annualInterestRate - Annual interest rate as a percentage
 * @param {number} termMonths - Loan term in months
 * @param {Date} startDate - The date of loan disbursement
 * @returns {Array} - Array of payment objects with details for each payment
 */
function calculateAmortizationSchedule(loanAmount, annualInterestRate, termMonths, startDate) {
  const monthlyPayment = calculateMonthlyPayment(loanAmount, annualInterestRate, termMonths);
  const monthlyInterestRate = annualInterestRate / 100 / 12;

  let remainingPrincipal = loanAmount;
  const schedule = [];

  // Create a date object from the start date
  const paymentDate = new Date(startDate);

  for (let month = 1; month <= termMonths; month++) {
    // Calculate interest for this payment
    const interestPayment = remainingPrincipal * monthlyInterestRate;

    // Calculate principal for this payment
    let principalPayment = monthlyPayment - interestPayment;

    // Adjust the last payment to account for rounding errors
    if (month === termMonths) {
      principalPayment = remainingPrincipal;
    }

    // Update remaining principal
    remainingPrincipal -= principalPayment;

    // Ensure remaining principal doesn't go below zero due to rounding
    if (remainingPrincipal < 0) {
      remainingPrincipal = 0;
    }

    // Calculate the due date for this payment
    paymentDate.setMonth(paymentDate.getMonth() + 1);

    // Add payment to schedule
    schedule.push({
      paymentNumber: month,
      dueDate: new Date(paymentDate),
      paymentAmount: monthlyPayment,
      principalPayment: principalPayment,
      interestPayment: interestPayment,
      remainingPrincipal: remainingPrincipal,
    });
  }

  return schedule;
}

/**
 * Calculate late payment fee based on payment date and due date
 * @param {Date} dueDate - The date the payment was due
 * @param {Date} paymentDate - The date the payment was made
 * @param {number} lateFee - The standard late payment fee
 * @param {number} gracePeriod - Number of days grace period after due date
 * @returns {number} - The late payment fee to apply
 */
function calculateLatePaymentFee(dueDate, paymentDate, lateFee, gracePeriod) {
  // Convert dates to timestamps for comparison
  const dueTime = new Date(dueDate).getTime();
  const paymentTime = new Date(paymentDate).getTime();

  // Calculate days late
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysLate = Math.floor((paymentTime - dueTime) / millisecondsPerDay);

  // Apply late fee if payment is made after grace period
  if (daysLate > gracePeriod) {
    return lateFee;
  }

  return 0;
}

/**
 * Apply a payment to a loan
 * @param {Object} loan - The loan object with current state
 * @param {number} paymentAmount - The amount being paid
 * @param {Date} paymentDate - The date of the payment
 * @param {number} lateFee - The standard late payment fee (optional)
 * @param {number} gracePeriod - Number of days grace period (optional)
 * @returns {Object} - Result of payment application
 */
function applyPayment(loan, paymentAmount, paymentDate, lateFee = 0, gracePeriod = 0) {
  // Calculate monthly interest
  const monthlyInterestRate = loan.interestRate / 100 / 12;

  // Calculate interest due for this payment
  const interestDue = loan.remainingPrincipal * monthlyInterestRate;

  // Calculate late fee if applicable
  const lateFeeAmount = lateFee && gracePeriod ?
    calculateLatePaymentFee(loan.nextPaymentDue, paymentDate, lateFee, gracePeriod) : 0;

  // Determine how much of the payment goes to each component
  let paymentRemaining = paymentAmount;

  // First, apply payment to late fee if any
  paymentRemaining -= lateFeeAmount;

  // Next, apply payment to interest
  const interestPaid = Math.min(interestDue, paymentRemaining);
  paymentRemaining -= interestPaid;

  // Finally, apply remaining payment to principal
  const principalPaid = Math.min(loan.remainingPrincipal, paymentRemaining);

  // Calculate new remaining principal
  const newRemainingPrincipal = loan.remainingPrincipal - principalPaid;

  // Determine if this counts as a full payment
  const monthlyPayment = calculateMonthlyPayment(loan.amount, loan.interestRate, loan.term);
  const isFullPayment = (principalPaid + interestPaid) >= (monthlyPayment - 0.01); // Allow for rounding

  // Determine if this is the final payment (remaining principal is zero or nearly zero)
  const isFinalPayment = newRemainingPrincipal <= 0.01;

  // Increment payments made if this is a full payment or the final payment
  const newPaymentsMade = (isFullPayment || isFinalPayment) ? loan.paymentsMade + 1 : loan.paymentsMade;

  // Calculate next payment due date (one month after current due date)
  const nextPaymentDue = new Date(loan.nextPaymentDue);
  if (isFullPayment) {
    nextPaymentDue.setMonth(nextPaymentDue.getMonth() + 1);
  }

  // Determine if loan is paid off
  const loanPaid = newRemainingPrincipal <= 0.01; // Allow for rounding errors

  return {
    principalPaid,
    interestPaid,
    lateFee: lateFeeAmount,
    newRemainingPrincipal,
    newPaymentsMade,
    nextPaymentDue,
    loanPaid,
    isFullPayment
  };
}

/**
 * Calculate the payoff amount for a loan
 * @param {Object} loan - The loan object with current state
 * @param {Date} payoffDate - The date of the payoff
 * @returns {Object} - Payoff details
 */
function calculatePayoffAmount(loan, payoffDate) {
  // Calculate monthly interest
  const monthlyInterestRate = loan.interestRate / 100 / 12;

  // Calculate interest accrued since last payment
  const lastPaymentDate = new Date(loan.nextPaymentDue);
  lastPaymentDate.setMonth(lastPaymentDate.getMonth() - 1);

  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  const daysAccrued = Math.max(0, Math.floor(
    (new Date(payoffDate).getTime() - lastPaymentDate.getTime()) / millisecondsPerDay
  ));

  // Calculate daily interest rate
  const dailyInterestRate = monthlyInterestRate / 30; // Approximate days in month

  // Calculate interest accrued
  const interestAccrued = loan.remainingPrincipal * dailyInterestRate * daysAccrued;

  // Calculate payoff amount
  const payoffAmount = loan.remainingPrincipal + interestAccrued;

  return {
    remainingPrincipal: loan.remainingPrincipal,
    interestAccrued,
    payoffAmount,
    payoffDate
  };
}

module.exports = {
  calculateMonthlyPayment,
  calculateTotalInterest,
  calculateAmortizationSchedule,
  calculateLatePaymentFee,
  applyPayment,
  calculatePayoffAmount
};
