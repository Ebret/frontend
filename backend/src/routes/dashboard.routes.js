const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get dashboard summary for current user
router.get('/', (req, res) => dashboardController.getDashboardSummary(req, res));

// Admin only routes
router.get(
  '/admin',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => dashboardController.getAdminDashboardSummary(req, res)
);

router.post(
  '/update/:userId',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => dashboardController.sendDashboardUpdate(req, res)
);

router.post(
  '/update-admin',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => dashboardController.sendAdminDashboardUpdate(req, res)
);

module.exports = router;
