const express = require('express');
const savingsController = require('../controllers/savings.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all savings accounts - Admin, Manager, Accountant
router.get(
  '/',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'ACCOUNTANT'])(req, res, next),
  (req, res) => savingsController.getAllSavings(req, res)
);

// Get savings products - Public for authenticated users
router.get('/products', (req, res) => savingsController.getSavingsProducts(req, res));

// Create savings product - Admin only
router.post(
  '/products',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => savingsController.createSavingsProduct(req, res)
);

// Update savings product - Admin only
router.put(
  '/products/:id',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => savingsController.updateSavingsProduct(req, res)
);

// Delete savings product - Admin only
router.delete(
  '/products/:id',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => savingsController.deleteSavingsProduct(req, res)
);

// Get savings accounts by user ID - Admin, Manager, Accountant, or the user themselves
router.get('/user/:userId', (req, res) => savingsController.getSavingsByUserId(req, res));

// Get savings account by ID - Admin, Manager, Accountant, or the user themselves
router.get('/:id', (req, res) => savingsController.getSavingsById(req, res));

// Create a new savings account
router.post('/', (req, res) => savingsController.createSavings(req, res));

// Update savings account status - Admin, Manager, Accountant
router.put(
  '/:id/status',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'ACCOUNTANT'])(req, res, next),
  (req, res) => savingsController.updateSavingsStatus(req, res)
);

// Make a deposit
router.post('/:id/deposit', (req, res) => savingsController.makeDeposit(req, res));

// Make a withdrawal
router.post('/:id/withdraw', (req, res) => savingsController.makeWithdrawal(req, res));

module.exports = router;
