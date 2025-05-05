'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Layout from '@/components/Layout';
import DamayanNotification from '@/components/damayan/DamayanNotification';
import { useAuth } from '@/contexts/AuthContext';
import { fetchDamayanNotifications, markNotificationAsRead } from '@/services/notificationService';
import { formatApiError } from '@/utils/frontendErrorHandler';
import { Spinner } from '@/components/ui';
import { withAuth } from '@/utils/withAuth';

const DamayanNotificationsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      
      try {
        const data = await fetchDamayanNotifications(user.id);
        setNotifications(data);
      } catch (error) {
        console.error('Error loading Damayan notifications:', error);
        toast.error(formatApiError(error));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotifications();
  }, [user]);
  
  const handleDismissNotification = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      
      // Remove the notification from the list
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error dismissing notification:', error);
      toast.error(formatApiError(error));
    }
  };
  
  const handleNotificationAction = (notificationId, action, data) => {
    if (action === 'viewDetails' && data.assistanceId) {
      router.push(`/damayan/assistance/${data.assistanceId}`);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <Spinner size="lg" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Damayan Notifications</h1>
          <p className="mt-1 text-sm text-gray-500">
            Stay updated on Damayan fund activities
          </p>
          
          <div className="mt-6">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <DamayanNotification
                    key={notification.id}
                    notification={notification}
                    onClose={() => handleDismissNotification(notification.id)}
                    onAction={(action, data) => handleNotificationAction(notification.id, action, data)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white shadow-md rounded-lg p-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any Damayan notifications at the moment.
                </p>
                <div className="mt-6">
                  <a
                    href="/damayan"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back to Damayan Dashboard
                  </a>
                </div>
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="mt-6">
              <a
                href="/damayan"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Damayan Dashboard
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(DamayanNotificationsPage);
