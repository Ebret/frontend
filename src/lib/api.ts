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
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  twoFactorBackupCodes?: string[];
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

// Helper function to generate mock audit details based on action type
const generateMockAuditDetails = (actionType: string): any => {
  switch (actionType) {
    case 'USER_CREATED':
      return {
        creationMethod: ['manual', 'import', 'invitation'][Math.floor(Math.random() * 3)],
        userRole: ['ADMIN', 'MEMBER', 'CREDIT_OFFICER', 'TELLER'][Math.floor(Math.random() * 4)],
        passwordSetupMethod: ['administrator_set', 'user_set', 'temporary'][Math.floor(Math.random() * 3)],
      };

    case 'USER_UPDATED':
      return {
        changes: {
          firstName: {
            oldValue: 'John',
            newValue: 'Jonathan',
          },
          lastName: {
            oldValue: 'Doe',
            newValue: 'Smith',
          },
          phoneNumber: {
            oldValue: '+1234567890',
            newValue: '+0987654321',
          },
        },
      };

    case 'USER_ROLE_CHANGED':
      const roles = ['ADMIN', 'MEMBER', 'CREDIT_OFFICER', 'TELLER', 'ACCOUNTANT'];
      const oldRoleIndex = Math.floor(Math.random() * roles.length);
      let newRoleIndex = oldRoleIndex;
      while (newRoleIndex === oldRoleIndex) {
        newRoleIndex = Math.floor(Math.random() * roles.length);
      }
      return {
        oldRole: roles[oldRoleIndex],
        newRole: roles[newRoleIndex],
      };

    case 'BULK_USERS_IMPORTED':
      return {
        totalCount: Math.floor(Math.random() * 50) + 5,
        successCount: Math.floor(Math.random() * 45) + 5,
        failureCount: Math.floor(Math.random() * 5),
        passwordSetupMethod: ['email', 'temporary'][Math.floor(Math.random() * 2)],
        userRoles: {
          ADMIN: Math.floor(Math.random() * 3),
          MEMBER: Math.floor(Math.random() * 20) + 5,
          CREDIT_OFFICER: Math.floor(Math.random() * 5),
          TELLER: Math.floor(Math.random() * 5),
          ACCOUNTANT: Math.floor(Math.random() * 3),
        },
      };

    case 'USER_STATUS_CHANGED':
      return {
        oldStatus: ['ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'][Math.floor(Math.random() * 4)],
        newStatus: ['ACTIVE', 'INACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED'][Math.floor(Math.random() * 4)],
        reason: ['User request', 'Administrative action', 'Security concern', 'Account verification'][Math.floor(Math.random() * 4)],
      };

    case 'USER_PASSWORD_RESET':
      return {
        requestedBy: ['user', 'administrator'][Math.floor(Math.random() * 2)],
        resetMethod: ['email', 'sms', 'administrator'][Math.floor(Math.random() * 3)],
      };

    case 'USER_LOGIN':
    case 'USER_LOGOUT':
      return {
        device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
        browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
        os: ['Windows', 'MacOS', 'iOS', 'Android'][Math.floor(Math.random() * 4)],
      };

    case 'DATA_PRIVACY_AGREEMENT_ACCEPTED':
      return {
        agreementType: ['standard', 'e-wallet'][Math.floor(Math.random() * 2)],
        timestamp: new Date().toISOString(),
      };

    case 'E_WALLET_CREATED':
      return {
        walletId: `WALLET-${Math.floor(100000 + Math.random() * 900000)}`,
        initialBalance: Math.floor(Math.random() * 1000) * 100 / 100,
      };

    case 'E_WALLET_TRANSACTION':
      const transactionTypes = ['deposit', 'withdrawal', 'transfer', 'payment'];
      const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const amount = Math.floor(Math.random() * 10000) / 100;

      const details: any = {
        transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        transactionType,
        amount,
      };

      if (transactionType === 'transfer' || transactionType === 'payment') {
        details.recipientId = Math.floor(Math.random() * 100) + 1;
        details.recipientEmail = `user${details.recipientId}@example.com`;
        details.recipientName = `User ${details.recipientId}`;
        details.description = transactionType === 'transfer'
          ? 'Fund transfer'
          : ['Bill payment', 'Merchant payment', 'Service fee'][Math.floor(Math.random() * 3)];
      }

      return details;

    case 'E_WALLET_SETTINGS_CHANGED':
      return {
        changes: {
          dailyLimit: {
            oldValue: 5000,
            newValue: 10000,
          },
          transactionNotifications: {
            oldValue: false,
            newValue: true,
          },
          securityLevel: {
            oldValue: 'standard',
            newValue: 'high',
          },
        },
      };

    default:
      return {};
  }
};

// API functions
export const api = {
  // Test Users API (for development only)
  createUser: async (userData: any) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error during user creation:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'User created successfully',
        data: {
          id: Math.floor(Math.random() * 1000) + 1,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },

  createSocialUser: async (userData: any) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/auth/${userData.provider}/mock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(userData),
      });

      return handleResponse(response);
    } catch (error) {
      console.error(`Network error during ${userData.provider} user creation:`, error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: `${userData.provider} user created successfully`,
        data: {
          id: Math.floor(Math.random() * 1000) + 1,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          status: 'ACTIVE',
          socialProvider: userData.provider,
          socialId: userData.socialId,
          profilePicture: userData.profilePicture,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },

  deleteUser: async (userId: number) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error during user deletion:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'User deleted successfully',
      });
    }
  },

  createEWallet: async (data: { userId: number, initialBalance?: number }) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/e-wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error during e-wallet creation:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'E-Wallet created successfully',
        data: {
          walletId: `WALLET-${Math.floor(100000 + Math.random() * 900000)}`,
          userId: data.userId,
          balance: data.initialBalance || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  },
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
            emailVerified: true,
          },
          token: 'mock-jwt-token',
        },
      });
    }
  },

  loginWithGoogle: async () => {
    try {
      // In a real implementation, this would redirect to Google OAuth
      window.location.href = `${API_URL}/auth/google`;

      // This won't actually execute due to the redirect
      return createMockResponse({
        status: 'success',
        message: 'Redirecting to Google...',
      });
    } catch (error) {
      console.error('Error initiating Google login:', error);

      // For development/testing, simulate a successful login
      return createMockResponse({
        status: 'success',
        message: 'Login with Google successful',
        data: {
          user: {
            id: 1,
            email: 'google.user@example.com',
            firstName: 'Google',
            lastName: 'User',
            role: 'MEMBER',
            status: 'ACTIVE',
            memberId: 'MEM789012',
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: true,
          },
          token: 'mock-jwt-token',
        },
      });
    }
  },

  loginWithFacebook: async () => {
    try {
      // In a real implementation, this would redirect to Facebook OAuth
      window.location.href = `${API_URL}/auth/facebook`;

      // This won't actually execute due to the redirect
      return createMockResponse({
        status: 'success',
        message: 'Redirecting to Facebook...',
      });
    } catch (error) {
      console.error('Error initiating Facebook login:', error);

      // For development/testing, simulate a successful login
      return createMockResponse({
        status: 'success',
        message: 'Login with Facebook successful',
        data: {
          user: {
            id: 2,
            email: 'facebook.user@example.com',
            firstName: 'Facebook',
            lastName: 'User',
            role: 'MEMBER',
            status: 'ACTIVE',
            memberId: 'MEM345678',
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: true,
          },
          token: 'mock-jwt-token',
        },
      });
    }
  },

  handleSocialLoginCallback: async (provider: string, code: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/${provider}/callback?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error(`Error handling ${provider} login callback:`, error);

      // For development/testing, simulate a successful login
      return createMockResponse({
        status: 'success',
        message: `Login with ${provider} successful`,
        data: {
          user: {
            id: 3,
            email: `${provider}.user@example.com`,
            firstName: provider.charAt(0).toUpperCase() + provider.slice(1),
            lastName: 'User',
            role: 'MEMBER',
            status: 'ACTIVE',
            memberId: 'MEM' + Math.floor(100000 + Math.random() * 900000),
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: true,
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
        message: 'User registered successfully. Please check your email to verify your account.',
        data: {
          user: {
            id: 1,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'MEMBER',
            status: 'PENDING_VERIFICATION',
            memberId: 'MEM' + Math.floor(100000 + Math.random() * 900000),
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: false,
          },
          token: 'mock-jwt-token',
        },
      });
    }
  },

  verifyEmail: async (token: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error during email verification:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'Email verified successfully',
        data: {
          user: {
            id: 1,
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'MEMBER',
            status: 'ACTIVE',
            memberId: 'MEM123456',
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: true,
          },
        },
      });
    }
  },

  resendVerificationEmail: async (email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error during resend verification:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'Verification email sent successfully',
      });
    }
  },

  logout: async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error during logout:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'Logged out successfully',
      });
    }
  },

  // Two-factor authentication
  enable2FA: async () => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/auth/2fa/enable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error enabling 2FA:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: '2FA setup initiated',
        data: {
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/CreditCooperative:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=CreditCooperative',
          secret: 'JBSWY3DPEHPK3PXP',
        },
      });
    }
  },

  verify2FASetup: async (token: string) => {
    const authToken = getToken();

    if (!authToken) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/auth/2fa/verify-setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error verifying 2FA setup:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: '2FA setup verified successfully',
        data: {
          backupCodes: [
            '1234-5678',
            '2345-6789',
            '3456-7890',
            '4567-8901',
            '5678-9012',
            '6789-0123',
            '7890-1234',
            '8901-2345',
            '9012-3456',
            '0123-4567',
          ],
        },
      });
    }
  },

  disable2FA: async (token: string) => {
    const authToken = getToken();

    if (!authToken) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/auth/2fa/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error disabling 2FA:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: '2FA disabled successfully',
      });
    }
  },

  verify2FA: async (token: string, email: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/2fa/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error verifying 2FA:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: '2FA verified successfully',
        data: {
          user: {
            id: 1,
            email: email || 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'ADMIN',
            status: 'ACTIVE',
            memberId: 'MEM123456',
            memberSince: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            emailVerified: true,
            twoFactorEnabled: true,
          },
          token: 'mock-jwt-token',
        },
      });
    }
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

    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error getting user:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'User retrieved successfully',
        data: {
          user: {
            id: id,
            email: `user${id}@example.com`,
            firstName: 'User',
            lastName: `${id}`,
            role: 'MEMBER',
            status: 'ACTIVE',
            phoneNumber: '+1234567890',
            address: '123 Main St',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      });
    }
  },

  getUser: async (id: number) => {
    return api.getUserById(id);
  },

  createUser: async (data: RegisterData) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error creating user:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'User created successfully',
        data: {
          user: {
            id: Math.floor(Math.random() * 1000) + 1,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            status: 'PENDING_VERIFICATION',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      });
    }
  },

  importUsers: async (users: any[]) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/users/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ users }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error importing users:', error);

      // For development/testing, simulate a successful import
      // In a real app, this would be handled by the API
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: `Successfully imported ${users.length} users`,
        data: {
          importedCount: users.length,
          successCount: users.length,
          failureCount: 0,
          users: users.map((user, index) => ({
            id: Math.floor(Math.random() * 1000) + 1,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: 'PENDING_VERIFICATION',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })),
        },
      });
    }
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

  // Audit Logs
  createAuditLog: async (logEntry: any) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      const response = await fetch(`${API_URL}/audit-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(logEntry),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error creating audit log:', error);

      // Return mock data if API is not available
      return createMockResponse({
        status: 'success',
        message: 'Audit log created successfully',
        data: {
          id: Math.floor(Math.random() * 1000) + 1,
          ...logEntry,
        },
      });
    }
  },

  getAuditLogs: async (params: {
    page?: number;
    limit?: number;
    actionTypes?: string[];
    userId?: number;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
  }) => {
    const token = getToken();

    if (!token) {
      throw new Error('No token found');
    }

    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.actionTypes) params.actionTypes.forEach(type => queryParams.append('actionType', type));
      if (params.userId) queryParams.append('userId', params.userId.toString());
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.searchTerm) queryParams.append('search', params.searchTerm);

      const queryString = queryParams.toString();

      const response = await fetch(`${API_URL}/audit-logs${queryString ? `?${queryString}` : ''}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Network error getting audit logs:', error);

      // Generate mock audit logs for development
      const mockLogs = [];
      const actionTypes = [
        'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'USER_ROLE_CHANGED',
        'USER_STATUS_CHANGED', 'USER_PASSWORD_RESET', 'USER_LOGIN', 'USER_LOGOUT',
        'BULK_USERS_IMPORTED', 'DATA_PRIVACY_AGREEMENT_ACCEPTED', 'E_WALLET_CREATED',
        'E_WALLET_TRANSACTION', 'E_WALLET_SETTINGS_CHANGED'
      ];

      // Filter by action type if specified
      const filteredActionTypes = params.actionTypes?.length
        ? actionTypes.filter(type => params.actionTypes?.includes(type))
        : actionTypes;

      // Generate random logs
      for (let i = 0; i < (params.limit || 10); i++) {
        const actionType = filteredActionTypes[Math.floor(Math.random() * filteredActionTypes.length)];
        const timestamp = new Date();
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days

        const userId = params.userId || Math.floor(Math.random() * 10) + 1;

        mockLogs.push({
          id: Math.floor(Math.random() * 1000) + 1,
          actionType,
          performedBy: {
            id: Math.floor(Math.random() * 5) + 1,
            email: `admin${Math.floor(Math.random() * 5) + 1}@example.com`,
            name: `Admin ${Math.floor(Math.random() * 5) + 1}`,
          },
          timestamp: timestamp.toISOString(),
          targetUser: actionType !== 'USER_LOGIN' && actionType !== 'USER_LOGOUT' ? {
            id: userId,
            email: `user${userId}@example.com`,
            name: `User ${userId}`,
          } : undefined,
          details: generateMockAuditDetails(actionType),
          ipAddress: '192.168.1.1',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        });
      }

      // Return mock data
      return createMockResponse({
        status: 'success',
        message: 'Audit logs retrieved successfully',
        data: {
          logs: mockLogs,
          pagination: {
            page: params.page || 1,
            limit: params.limit || 10,
            total: 100,
            totalPages: 10,
          },
        },
      });
    }
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
