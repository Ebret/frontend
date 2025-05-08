/**
 * Dashboard Page
 * 
 * This is the main dashboard page that displays an overview of the user's account.
 */

import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './Dashboard.css';

/**
 * Dashboard Page Component
 * @returns {JSX.Element} Dashboard page component
 */
const Dashboard = () => {
  const { themeData } = useTheme();
  
  // Sample data
  const accountBalance = 25000;
  const loanBalance = 15000;
  const savingsBalance = 10000;
  const damayanContribution = 500;
  
  // Recent transactions
  const recentTransactions = [
    { id: 1, date: '2023-06-15', description: 'Loan Payment', amount: -2500, type: 'payment' },
    { id: 2, date: '2023-06-10', description: 'Savings Deposit', amount: 5000, type: 'deposit' },
    { id: 3, date: '2023-06-05', description: 'Damayan Contribution', amount: -500, type: 'damayan' },
    { id: 4, date: '2023-06-01', description: 'Loan Disbursement', amount: 20000, type: 'loan' }
  ];
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Welcome, John Doe</h2>
        <p className="last-login">Last login: June 15, 2023, 10:30 AM</p>
      </div>
      
      <div className="account-summary">
        <Card className="balance-card">
          <Card.Body>
            <h3 className="balance-title">Total Balance</h3>
            <p className="balance-amount">{formatCurrency(accountBalance)}</p>
            <div className="balance-actions">
              <Button variant="primary" size="sm">Transfer</Button>
              <Button variant="outline-primary" size="sm">Withdraw</Button>
            </div>
          </Card.Body>
        </Card>
        
        <Card className="balance-card">
          <Card.Body>
            <h3 className="balance-title">Loan Balance</h3>
            <p className="balance-amount">{formatCurrency(loanBalance)}</p>
            <div className="balance-actions">
              <Button variant="primary" size="sm">Pay Loan</Button>
              <Button variant="outline-primary" size="sm">View Details</Button>
            </div>
          </Card.Body>
        </Card>
        
        <Card className="balance-card">
          <Card.Body>
            <h3 className="balance-title">Savings</h3>
            <p className="balance-amount">{formatCurrency(savingsBalance)}</p>
            <div className="balance-actions">
              <Button variant="primary" size="sm">Deposit</Button>
              <Button variant="outline-primary" size="sm">View History</Button>
            </div>
          </Card.Body>
        </Card>
        
        <Card className="balance-card">
          <Card.Body>
            <h3 className="balance-title">Damayan Fund</h3>
            <p className="balance-amount">{formatCurrency(damayanContribution)}</p>
            <div className="balance-actions">
              <Button variant="primary" size="sm">Contribute</Button>
              <Button variant="outline-primary" size="sm">View Status</Button>
            </div>
          </Card.Body>
        </Card>
      </div>
      
      <div className="dashboard-content">
        <div className="dashboard-section">
          <Card>
            <Card.Header title="Recent Transactions" action={<Button variant="link" size="sm">View All</Button>} />
            <Card.Body>
              <div className="transactions-list">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className={`transaction-item transaction-${transaction.type}`}>
                    <div className="transaction-info">
                      <p className="transaction-date">{transaction.date}</p>
                      <p className="transaction-description">{transaction.description}</p>
                    </div>
                    <p className={`transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                      {formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>
        
        <div className="dashboard-section">
          <Card>
            <Card.Header title="Quick Actions" />
            <Card.Body>
              <div className="quick-actions">
                <Button variant="outline-primary" className="quick-action-button">
                  <span className="quick-action-icon">💰</span>
                  <span className="quick-action-label">Apply for Loan</span>
                </Button>
                
                <Button variant="outline-primary" className="quick-action-button">
                  <span className="quick-action-icon">💳</span>
                  <span className="quick-action-label">E-Wallet</span>
                </Button>
                
                <Button variant="outline-primary" className="quick-action-button">
                  <span className="quick-action-icon">📝</span>
                  <span className="quick-action-label">Update Profile</span>
                </Button>
                
                <Button variant="outline-primary" className="quick-action-button">
                  <span className="quick-action-icon">🤝</span>
                  <span className="quick-action-label">Damayan</span>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
