const express = require('express');
const loanController = require('../controllers/loan.controller');
const loanApplicationController = require('../controllers/loanApplicationController');
const loanManagementController = require('../controllers/loanManagementController');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all loans - Admin, Manager, Credit Officer
router.get(
  '/',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'CREDIT_OFFICER'])(req, res, next),
  (req, res) => loanController.getAllLoans(req, res)
);

// Get loan products - Public for authenticated users
router.get('/products', (req, res) => loanController.getLoanProducts(req, res));

// Create loan product - Admin only
router.post(
  '/products',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => loanController.createLoanProduct(req, res)
);

// Update loan product - Admin only
router.put(
  '/products/:id',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => loanController.updateLoanProduct(req, res)
);

// Delete loan product - Admin only
router.delete(
  '/products/:id',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => loanController.deleteLoanProduct(req, res)
);

// ===== Enhanced Loan Application Routes =====
router.post('/applications', loanApplicationController.createLoanApplication);
router.get('/applications/me', loanApplicationController.getLoanApplicationsByUserId);
router.get(
  '/applications/pending',
  (req, res, next) => authorize(['ADMIN', 'CREDIT_OFFICER', 'MANAGER'])(req, res, next),
  loanApplicationController.getPendingLoanApplications
);
router.get(
  '/applications/statistics',
  (req, res, next) => authorize(['ADMIN', 'CREDIT_OFFICER', 'MANAGER', 'BOARD_MEMBER'])(req, res, next),
  loanApplicationController.getLoanApplicationStatistics
);
router.get('/applications/:id', loanApplicationController.getLoanApplicationById);
router.post(
  '/applications/:id/review',
  (req, res, next) => authorize(['ADMIN', 'CREDIT_OFFICER', 'MANAGER'])(req, res, next),
  loanApplicationController.reviewLoanApplication
);

// ===== Enhanced Loan Management Routes =====
router.get('/me', loanManagementController.getLoansByUserId);
router.get(
  '/status/:status',
  (req, res, next) => authorize(['ADMIN', 'CREDIT_OFFICER', 'MANAGER', 'ACCOUNTANT'])(req, res, next),
  loanManagementController.getLoansByStatus
);
router.get(
  '/statistics',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER'])(req, res, next),
  loanManagementController.getLoanStatistics
);
router.get(
  '/reports/delinquency',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER', 'CREDIT_OFFICER'])(req, res, next),
  loanManagementController.generateDelinquencyReport
);
router.get(
  '/reports/performance',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER'])(req, res, next),
  loanManagementController.generateLoanPerformanceReport
);
router.get('/:id', loanManagementController.getLoanById);
router.get('/:id/schedule', loanManagementController.getPaymentSchedule);
router.get('/:id/history', loanManagementController.getLoanHistory);
router.post(
  '/:id/disburse',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'ACCOUNTANT'])(req, res, next),
  loanManagementController.disburseLoan
);
router.post('/:id/payments', loanManagementController.recordPayment);

// Legacy routes - will be deprecated
router.get('/user/:userId', (req, res) => loanController.getLoansByUserId(req, res));
router.post('/', (req, res) => loanController.createLoan(req, res));
router.put(
  '/:id/status',
  (req, res, next) => authorize(['ADMIN', 'MANAGER', 'CREDIT_OFFICER'])(req, res, next),
  (req, res) => loanController.updateLoanStatus(req, res)
);
router.post('/:loanId/payments', (req, res) => loanController.addLoanPayment(req, res));

module.exports = router;
