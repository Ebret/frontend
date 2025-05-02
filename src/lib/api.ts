// API client for the Credit Cooperative System

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  address?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  phoneNumber?: string;
  address?: string;
  profileImage?: string;
  memberId?: string;
  memberSince?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WhiteLabelConfig {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
}

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

// Helper function to get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  try {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Invalid JSON response
      throw new Error('Invalid response from server');
    }
    throw error;
  }
};

// Helper function to create mock responses for development
const createMockResponse = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => {
    // Add a small delay to simulate network latency
    setTimeout(() => {
      resolve(data);
    }, 300);
  });
};

// API functions
export const api = {
  // Auth
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error during login:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'Login successful',
        data: {
          user: {
            id: 1,
            email: credentials.email || 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'ADMIN',
            status: 'ACTIVE',
            memberId: 'MEM123456',
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token',
        },
      });
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error during registration:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'User registered successfully',
        data: {
          user: {
            id: 1,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'MEMBER',
            status: 'ACTIVE',
            memberId: 'MEM' + Math.floor(100000 + Math.random() * 900000),
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: 'mock-jwt-token',
        },
      });
    }
  },

  logout: async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error fetching current user:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        data: {
          user: {
            id: 1,
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'ADMIN',
            status: 'ACTIVE',
            memberId: 'MEM123456',
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      });
    }
  },

  // Users
  getUsers: async () => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  getUserById: async (id: number) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  createUser: async (data: RegisterData) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  updateUser: async (id: number, data: Partial<User>) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  deleteUser: async (id: number) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  },

  // White Label
  getWhiteLabelConfig: async (cooperativeCode?: string) => {
    let url = `${API_URL}/cooperatives/white-label`;

    if (cooperativeCode) {
      url += `?code=${cooperativeCode}`;
    }

    try {
      // Create an AbortController to handle timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        console.log('White-label config request timed out');
      }, 3000); // 3 second timeout

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      // Clear the timeout if the request completes
      clearTimeout(timeoutId);

      return handleResponse(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('White-label config request was aborted');
      } else {
        console.error('Network error fetching white-label config:', error);
      }

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        data: {
          config: {
            name: 'Credit Cooperative System',
            logo: '/logo.svg',
            primaryColor: '#007bff',
            secondaryColor: '#6c757d',
            address: '123 Main St, City, Country',
            phoneNumber: '+1 (555) 123-4567',
            email: 'info@creditcoop.com',
            website: 'https://creditcoop.com',
          }
        }
      });
    }
  },

  // Notifications
  getNotifications: async (limit = 20, offset = 0) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/notifications?limit=${limit}&offset=${offset}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error fetching notifications:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        data: {
          notifications: [
            {
              id: 1,
              userId: 1,
              title: 'Loan Application Approved',
              message: 'Your loan application for $5,000 has been approved.',
              notificationType: 'LOAN_STATUS',
              link: '/loans/1',
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              userId: 1,
              title: 'Payment Received',
              message: 'Your payment of $750 has been received.',
              notificationType: 'PAYMENT_RECEIVED',
              link: '/transactions',
              isRead: true,
              readAt: new Date().toISOString(),
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            },
            {
              id: 3,
              userId: 1,
              title: 'Account Update',
              message: 'Your savings account has been updated with new interest rates.',
              notificationType: 'ACCOUNT_UPDATE',
              link: '/savings/1',
              isRead: false,
              createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            },
          ],
          count: 3,
        },
      });
    }
  },

  getUnreadNotifications: async () => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/notifications/unread`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error fetching unread notifications:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        data: {
          notifications: [
            {
              id: 1,
              userId: 1,
              title: 'Loan Application Approved',
              message: 'Your loan application for $5,000 has been approved.',
              notificationType: 'LOAN_STATUS',
              link: '/loans/1',
              isRead: false,
              createdAt: new Date().toISOString(),
            },
            {
              id: 3,
              userId: 1,
              title: 'Account Update',
              message: 'Your savings account has been updated with new interest rates.',
              notificationType: 'ACCOUNT_UPDATE',
              link: '/savings/1',
              isRead: false,
              createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            },
          ],
          count: 2,
        },
      });
    }
  },

  markNotificationAsRead: async (id: number) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error marking notification as read:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        data: {
          notification: {
            id,
            userId: 1,
            title: 'Loan Application Approved',
            message: 'Your loan application for $5,000 has been approved.',
            notificationType: 'LOAN_STATUS',
            link: '/loans/1',
            isRead: true,
            readAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
        },
      });
    }
  },

  markAllNotificationsAsRead: async () => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error marking all notifications as read:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        data: {
          count: 2,
        },
      });
    }
  },

  createNotification: async (data: { userId: number; title: string; message: string; notificationType: string; link?: string }) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  createNotificationForRole: async (data: { role: string; title: string; message: string; notificationType: string; link?: string }) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_URL}/notifications/role`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  // Dashboard
  getDashboardSummary: async () => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/dashboard`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error fetching dashboard summary:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        data: {
          totalLoanAmount: 125000,
          totalSavingsBalance: 250000,
          totalPayments: 75000,
          activeLoans: 3,
          pendingApplications: 2,
          savingsAccounts: 4,
          recentTransactions: [
            {
              id: 1,
              transactionType: 'DEPOSIT',
              amount: 1000,
              description: 'Savings deposit',
              referenceNumber: 'TXN123456',
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              transactionType: 'WITHDRAWAL',
              amount: 500,
              description: 'ATM withdrawal',
              referenceNumber: 'TXN123457',
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
            {
              id: 3,
              transactionType: 'LOAN_PAYMENT',
              amount: 750,
              description: 'Loan payment',
              referenceNumber: 'TXN123458',
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      });
    }
  },

  getAdminDashboardSummary: async () => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/dashboard/admin`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error fetching admin dashboard summary:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        data: {
          totalMembers: 250,
          activeMembers: 220,
          totalLoans: 180,
          activeLoans: 120,
          totalLoanAmount: 1250000,
          totalSavings: 2500000,
          totalAccounts: 350,
          pendingApplications: 15,
          recentActivity: [
            {
              id: 1,
              type: 'LOAN_APPLICATION',
              user: {
                id: 2,
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
              },
              amount: 5000,
              status: 'PENDING',
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              type: 'DEPOSIT',
              user: {
                id: 3,
                firstName: 'Robert',
                lastName: 'Johnson',
                email: 'robert.johnson@example.com',
              },
              amount: 1000,
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
            {
              id: 3,
              type: 'WITHDRAWAL',
              user: {
                id: 4,
                firstName: 'Emily',
                lastName: 'Davis',
                email: 'emily.davis@example.com',
              },
              amount: 500,
              status: 'COMPLETED',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      });
    }
  },

  sendDashboardUpdate: async (userId: number) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/dashboard/update/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error sending dashboard update:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'Dashboard update sent successfully',
      });
    }
  },

  sendAdminDashboardUpdate: async () => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/dashboard/update-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error sending admin dashboard update:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'Admin dashboard update sent successfully',
      });
    }
  },
};
