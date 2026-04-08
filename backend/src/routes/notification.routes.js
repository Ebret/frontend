const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get user notifications
router.get('/', (req, res) => notificationController.getUserNotifications(req, res));

// Get unread notifications
router.get('/unread', (req, res) => notificationController.getUnreadNotifications(req, res));

// Mark notification as read
router.put('/:id/read', (req, res) => notificationController.markNotificationAsRead(req, res));

// Mark all notifications as read
router.put('/read-all', (req, res) => notificationController.markAllNotificationsAsRead(req, res));

// Admin only routes
router.post(
  '/',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => notificationController.createNotification(req, res)
);

router.post(
  '/role',
  (req, res, next) => authorize(['ADMIN'])(req, res, next),
  (req, res) => notificationController.createNotificationForRole(req, res)
);

module.exports = router;
