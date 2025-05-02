'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  notificationType: string;
  link?: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token');
      
      if (!token) return;
      
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
        auth: { token },
      });
      
      socketInstance.on('connect', () => {
        console.log('Socket connected');
      });
      
      socketInstance.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
        setError('Failed to connect to notification service');
      });
      
      socketInstance.on('notification', (notification: Notification) => {
        // Add new notification to the list
        setNotifications(prev => [notification, ...prev]);
        
        // Update unread count
        setUnreadCount(prev => prev + 1);
        
        // Show browser notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
          });
        }
      });
      
      setSocket(socketInstance);
      
      // Clean up on unmount
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getNotifications();
      setNotifications(response.data.notifications);
      
      const unreadResponse = await api.getUnreadNotifications();
      setUnreadCount(unreadResponse.data.count);
      
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: number) => {
    try {
      await api.markNotificationAsRead(id);
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id
            ? { ...notification, isRead: true, readAt: new Date().toISOString() }
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err: any) {
      setError(err.message || 'Failed to mark notification as read');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev =>
        prev.map(notification => ({
          ...notification,
          isRead: true,
          readAt: new Date().toISOString(),
        }))
      );
      
      // Reset unread count
      setUnreadCount(0);
    } catch (err: any) {
      setError(err.message || 'Failed to mark all notifications as read');
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};
