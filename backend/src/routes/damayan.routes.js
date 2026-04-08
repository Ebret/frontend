const express = require('express');
const router = express.Router();
const damayanController = require('../controllers/damayan.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

// Fund management routes (admin only)
router.post('/funds', authenticate, authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER']), damayanController.createDamayanFund);
router.put('/funds/:id', authenticate, authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER']), damayanController.updateDamayanFund);

// Fund information routes (accessible to all authenticated users)
router.get('/funds', authenticate, damayanController.getAllDamayanFunds);
router.get('/funds/:id', authenticate, damayanController.getDamayanFundById);
router.get('/funds/:fundId/statistics', authenticate, damayanController.getDamayanFundStatistics);
router.get('/funds/:fundId/contributions', authenticate, damayanController.getContributionsByFundId);

// Contribution routes
router.post('/contributions', authenticate, damayanController.makeContribution);
router.get('/users/:userId/contributions', authenticate, damayanController.getContributionsByUserId);

// Assistance request routes
router.post('/assistance', authenticate, damayanController.requestAssistance);
router.get('/users/:userId/assistance', authenticate, damayanController.getAssistanceRequestsByUserId);
router.get('/assistance/pending', authenticate, authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER']), damayanController.getPendingAssistanceRequests);
router.put('/assistance/:requestId/review', authenticate, authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER']), damayanController.reviewAssistanceRequest);
router.put('/assistance/:requestId/disburse', authenticate, authorize(['ADMIN', 'MANAGER', 'ACCOUNTANT']), damayanController.disburseAssistance);

// User summary route
router.get('/users/:userId/summary', authenticate, damayanController.getUserDamayanSummary);

// User settings routes
router.get('/users/:userId/settings', authenticate, damayanController.getUserDamayanSettings);
router.put('/users/:userId/settings', authenticate, damayanController.updateUserDamayanSettings);

// Report routes
router.get('/reports/generate', authenticate, authorize(['ADMIN', 'MANAGER', 'BOARD_MEMBER', 'ACCOUNTANT']), damayanController.generateDamayanReport);

module.exports = router;
