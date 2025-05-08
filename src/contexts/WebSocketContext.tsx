'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

// Define a notification type to avoid the browser's Notification API conflict
interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  userId: string;
}

interface WebSocketContextType {
  isConnected: boolean;
  lastPing: Date | null;
  error: string | null;
  reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { fetchNotifications } = useNotifications();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize WebSocket connection
  const initializeSocket = () => {
    if (!isAuthenticated || !user) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Close existing socket if any
      if (socket) {
        socket.disconnect();
      }

      // Create new socket connection
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Socket event handlers
      socketInstance.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
      });

      socketInstance.on('disconnect', (reason) => {
        console.log(`WebSocket disconnected: ${reason}`);
        setIsConnected(false);
      });

      socketInstance.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        setIsConnected(false);
        setError(`Connection error: ${err.message}`);
      });

      socketInstance.on('ping', () => {
        setLastPing(new Date());
      });

      // Handle real-time notifications
      socketInstance.on('notification', (notification: AppNotification) => {
        console.log('New notification received:', notification);

        // Refresh notifications list
        fetchNotifications();

        // Show browser notification if supported and permission granted
        if ('Notification' in window && window.Notification.permission === 'granted') {
          new window.Notification(notification.title, {
            body: notification.message,
            icon: '/logo.png',
          });
        }
      });

      setSocket(socketInstance);

      // Clean up on unmount
      return () => {
        socketInstance.disconnect();
      };
    } catch (err) {
      console.error('Error initializing WebSocket:', err);
      setError('Failed to initialize WebSocket connection');
    }
  };

  // Initialize socket when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket();
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && window.Notification.permission !== 'denied') {
      window.Notification.requestPermission();
    }
  }, []);

  // Reconnect function
  const reconnect = () => {
    if (socket) {
      socket.disconnect();
    }
    initializeSocket();
  };

  // Context value
  const value = {
    isConnected,
    lastPing,
    error,
    reconnect,
  };

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};

// Custom hook to use the WebSocket context
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
