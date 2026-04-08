const notificationService = require('../services/notification.service');

// Get user notifications
exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    const result = await notificationService.getUserNotifications(
      userId,
      parseInt(limit, 10),
      parseInt(offset, 10)
    );

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    console.error('Get user notifications error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching notifications',
    });
  }
};

// Get unread notifications
exports.getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await notificationService.getUnreadNotifications(userId);

    return res.status(200).json({
      status: 'success',
      data: {
        notifications,
        count: notifications.length,
      },
    });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching unread notifications',
    });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notificationId = parseInt(id, 10);

    const notification = await notificationService.markNotificationAsRead(notificationId);

    return res.status(200).json({
      status: 'success',
      data: {
        notification,
      },
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while marking notification as read',
    });
  }
};

// Mark all notifications as read
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await notificationService.markAllNotificationsAsRead(userId);

    return res.status(200).json({
      status: 'success',
      data: {
        count: result.count,
      },
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while marking all notifications as read',
    });
  }
};

// Create notification (admin only)
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, notificationType, link } = req.body;

    if (!userId || !title || !message || !notificationType) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    const notification = await notificationService.createNotification({
      userId: parseInt(userId, 10),
      title,
      message,
      notificationType,
      link,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        notification,
      },
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating notification',
    });
  }
};

// Create notification for role (admin only)
exports.createNotificationForRole = async (req, res) => {
  try {
    const { role, title, message, notificationType, link } = req.body;

    if (!role || !title || !message || !notificationType) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    const notifications = await notificationService.createNotificationForRole(role, {
      title,
      message,
      notificationType,
      link,
    });

    return res.status(201).json({
      status: 'success',
      data: {
        count: notifications.length,
      },
    });
  } catch (error) {
    console.error('Create notification for role error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating notifications',
    });
  }
};
