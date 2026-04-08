const { PrismaClient } = require('@prisma/client');
const socketService = require('./socket.service');

const prisma = new PrismaClient();

/**
 * Create a notification and send it via WebSocket
 * @param {Object} notification - Notification data
 * @param {number} notification.userId - User ID to send notification to
 * @param {string} notification.title - Notification title
 * @param {string} notification.message - Notification message
 * @param {string} notification.notificationType - Type of notification
 * @param {string} notification.link - Optional link to redirect to
 * @returns {Promise<Object>} Created notification
 */
const createNotification = async (notification) => {
  try {
    // Create notification in database
    const createdNotification = await prisma.notification.create({
      data: {
        userId: notification.userId,
        title: notification.title,
        message: notification.message,
        notificationType: notification.notificationType,
        link: notification.link,
        isRead: false,
      },
    });

    // Send notification via WebSocket
    socketService.sendNotificationToUser(notification.userId, createdNotification);

    return createdNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Create notifications for multiple users
 * @param {Array} users - Array of user IDs
 * @param {Object} notificationData - Notification data without userId
 * @returns {Promise<Array>} Created notifications
 */
const createNotificationForUsers = async (users, notificationData) => {
  try {
    const notifications = [];

    for (const userId of users) {
      const notification = await createNotification({
        userId,
        ...notificationData,
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error('Error creating notifications for users:', error);
    throw error;
  }
};

/**
 * Create notifications for users with specific role
 * @param {string} role - User role
 * @param {Object} notificationData - Notification data without userId
 * @returns {Promise<Array>} Created notifications
 */
const createNotificationForRole = async (role, notificationData) => {
  try {
    // Get all users with the specified role
    const users = await prisma.user.findMany({
      where: { role },
      select: { id: true },
    });

    const userIds = users.map(user => user.id);
    
    // Create notifications for each user
    const notifications = await createNotificationForUsers(userIds, notificationData);
    
    // Also send a broadcast to all users with this role
    socketService.sendNotificationToRole(role, {
      ...notificationData,
      broadcast: true,
    });

    return notifications;
  } catch (error) {
    console.error('Error creating notifications for role:', error);
    throw error;
  }
};

/**
 * Get unread notifications for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Unread notifications
 */
const getUnreadNotifications = async (userId) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        isRead: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return notifications;
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    throw error;
  }
};

/**
 * Get all notifications for a user
 * @param {number} userId - User ID
 * @param {number} limit - Maximum number of notifications to return
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} Notifications and count
 */
const getUserNotifications = async (userId, limit = 20, offset = 0) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const count = await prisma.notification.count({
      where: {
        userId,
      },
    });

    return {
      notifications,
      count,
    };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
const markNotificationAsRead = async (notificationId) => {
  try {
    const notification = await prisma.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Count of updated notifications
 */
const markAllNotificationsAsRead = async (userId) => {
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return result;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

module.exports = {
  createNotification,
  createNotificationForUsers,
  createNotificationForRole,
  getUnreadNotifications,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
