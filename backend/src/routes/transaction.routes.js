const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all transactions - Admin, Manager, Accountant
router.get(
  '/',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'ACCOUNTANT'])(req, res, next),
  (req, res) => transactionController.getAllTransactions(req, res)
);

// Get transactions by user ID - Admin, Manager, Accountant, or the user themselves
router.get('/user/:userId', (req, res) => transactionController.getTransactionsByUserId(req, res));

// Get transactions by savings account ID - Admin, Manager, Accountant, or the account owner
router.get('/savings/:savingsId', (req, res) => transactionController.getTransactionsBySavingsId(req, res));

// Get transaction by ID - Admin, Manager, Accountant, or the transaction owner
router.get('/:id', (req, res) => transactionController.getTransactionById(req, res));

// Create a new transaction - Admin, Manager, Accountant, Teller
router.post(
  '/',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'ACCOUNTANT', 'TELLER'])(req, res, next),
  (req, res) => transactionController.createTransaction(req, res)
);

// Update transaction status - Admin, Manager, Accountant
router.put(
  '/:id/status',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'ACCOUNTANT'])(req, res, next),
  (req, res) => transactionController.updateTransactionStatus(req, res)
);

module.exports = router;
