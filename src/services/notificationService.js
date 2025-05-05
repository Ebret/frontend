import api from './api';

/**
 * Fetch all notifications for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - List of notifications
 */
export const fetchNotifications = async (userId) => {
  try {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data.data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Fetch Damayan-specific notifications for a user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - List of Damayan notifications
 */
export const fetchDamayanNotifications = async (userId) => {
  try {
    const response = await api.get(`/notifications/user/${userId}`, {
      params: {
        type: 'DAMAYAN'
      }
    });
    return response.data.data.notifications;
  } catch (error) {
    console.error('Error fetching Damayan notifications:', error);
    throw error;
  }
};

/**
 * Mark a notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} - Updated notification
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data.data.notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Result
 */
export const markAllNotificationsAsRead = async (userId) => {
  try {
    const response = await api.put(`/notifications/user/${userId}/read-all`);
    return response.data.data;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 * @param {number} notificationId - Notification ID
 * @returns {Promise<Object>} - Result
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Get unread notification count for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Count data
 */
export const getUnreadNotificationCount = async (userId) => {
  try {
    const response = await api.get(`/notifications/user/${userId}/unread-count`);
    return response.data.data;
  } catch (error) {
    console.error('Error getting unread notification count:', error);
    throw error;
  }
};

/**
 * Get unread Damayan notification count for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - Count data
 */
export const getUnreadDamayanNotificationCount = async (userId) => {
  try {
    const response = await api.get(`/notifications/user/${userId}/unread-count`, {
      params: {
        type: 'DAMAYAN'
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error getting unread Damayan notification count:', error);
    throw error;
  }
};
