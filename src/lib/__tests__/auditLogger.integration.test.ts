import { setupServer } from 'msw/node';
import { rest } from 'msw';
import {
  AuditActionType,
  logAuditEvent,
  logUserCreation,
  logDataPrivacyAgreementAccepted,
  logEWalletCreation,
  logEWalletTransaction,
  retryFailedAuditLogs,
} from '../auditLogger';
import { UserRole } from '../roles';
import { api } from '../api';

// Mock the API URL
const API_URL = 'http://localhost:3001/api';

// Setup MSW server
const server = setupServer(
  // Mock create audit log endpoint
  rest.post(`${API_URL}/audit-logs`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        status: 'success',
        message: 'Audit log created successfully',
        data: {
          id: 1,
          ...req.body,
        },
      })
    );
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  jest.clearAllMocks();
});
afterAll(() => server.close());

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock the API client
jest.mock('../api', () => ({
  api: {
    createAuditLog: jest.fn().mockResolvedValue({
      status: 'success',
      message: 'Audit log created successfully',
      data: {
        id: 1,
      },
    }),
  },
}));

describe('Audit Logger Integration Tests', () => {
  describe('logAuditEvent', () => {
    it('successfully logs an audit event to the API', async () => {
      const user = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
      };
      
      const targetUser = {
        id: 2,
        email: 'user@example.com',
        name: 'Test User',
      };
      
      const details = {
        creationMethod: 'manual',
        userRole: UserRole.MEMBER,
      };
      
      await logAuditEvent(
        AuditActionType.USER_CREATED,
        user,
        details,
        targetUser
      );
      
      expect(api.createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        actionType: AuditActionType.USER_CREATED,
        performedBy: user,
        details,
        targetUser,
      }));
    });
    
    it('stores failed logs in localStorage when API call fails', async () => {
      // Mock API failure
      (api.createAuditLog as jest.Mock).mockRejectedValueOnce(new Error('API error'));
      
      const user = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
      };
      
      await logAuditEvent(
        AuditActionType.USER_LOGIN,
        user,
        { device: 'desktop' }
      );
      
      // Verify that the log was stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'failedAuditLogs',
        expect.any(String)
      );
      
      const storedLogs = JSON.parse(localStorage.getItem('failedAuditLogs') as string);
      expect(storedLogs).toHaveLength(1);
      expect(storedLogs[0].actionType).toBe(AuditActionType.USER_LOGIN);
      expect(storedLogs[0].performedBy).toEqual(user);
      expect(storedLogs[0].details).toEqual({ device: 'desktop' });
    });
  });
  
  describe('logUserCreation', () => {
    it('logs user creation with correct parameters', async () => {
      const admin = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
      };
      
      const newUser = {
        id: 2,
        email: 'user@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.MEMBER,
      };
      
      await logUserCreation(admin, newUser, 'manual');
      
      expect(api.createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        actionType: AuditActionType.USER_CREATED,
        performedBy: admin,
        details: expect.objectContaining({
          creationMethod: 'manual',
          userRole: UserRole.MEMBER,
          userName: 'Test User',
        }),
        targetUser: expect.objectContaining({
          id: 2,
          email: 'user@example.com',
          name: 'Test User',
        }),
      }));
    });
  });
  
  describe('logDataPrivacyAgreementAccepted', () => {
    it('logs data privacy agreement acceptance with correct parameters', async () => {
      const user = {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
      };
      
      await logDataPrivacyAgreementAccepted(user, 'e-wallet');
      
      expect(api.createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        actionType: AuditActionType.DATA_PRIVACY_AGREEMENT_ACCEPTED,
        performedBy: user,
        details: expect.objectContaining({
          agreementType: 'e-wallet',
          timestamp: expect.any(String),
        }),
      }));
    });
  });
  
  describe('logEWalletCreation', () => {
    it('logs e-wallet creation with correct parameters', async () => {
      const admin = {
        id: 1,
        email: 'admin@example.com',
        name: 'Admin User',
      };
      
      const user = {
        id: 2,
        email: 'user@example.com',
        name: 'Test User',
      };
      
      const walletDetails = {
        walletId: 'WALLET-123456',
        initialBalance: 0,
      };
      
      await logEWalletCreation(admin, user, walletDetails);
      
      expect(api.createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        actionType: AuditActionType.E_WALLET_CREATED,
        performedBy: admin,
        details: walletDetails,
        targetUser: user,
      }));
    });
  });
  
  describe('logEWalletTransaction', () => {
    it('logs e-wallet transaction with correct parameters', async () => {
      const user = {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
      };
      
      const transactionDetails = {
        transactionId: 'TXN-123456',
        transactionType: 'deposit' as const,
        amount: 100.50,
      };
      
      await logEWalletTransaction(user, transactionDetails);
      
      expect(api.createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        actionType: AuditActionType.E_WALLET_TRANSACTION,
        performedBy: user,
        details: transactionDetails,
      }));
    });
    
    it('logs e-wallet transfer transaction with recipient details', async () => {
      const user = {
        id: 1,
        email: 'user@example.com',
        name: 'Test User',
      };
      
      const transactionDetails = {
        transactionId: 'TXN-123456',
        transactionType: 'transfer' as const,
        amount: 50.25,
        recipientId: 2,
        recipientEmail: 'recipient@example.com',
        recipientName: 'Recipient User',
        description: 'Fund transfer',
      };
      
      await logEWalletTransaction(user, transactionDetails);
      
      expect(api.createAuditLog).toHaveBeenCalledWith(expect.objectContaining({
        actionType: AuditActionType.E_WALLET_TRANSACTION,
        performedBy: user,
        details: transactionDetails,
      }));
    });
  });
  
  describe('retryFailedAuditLogs', () => {
    it('retries failed logs from localStorage', async () => {
      // Setup failed logs in localStorage
      const failedLogs = [
        {
          actionType: AuditActionType.USER_LOGIN,
          performedBy: {
            id: 1,
            email: 'user@example.com',
            name: 'Test User',
          },
          timestamp: new Date().toISOString(),
          details: { device: 'desktop' },
        },
        {
          actionType: AuditActionType.USER_LOGOUT,
          performedBy: {
            id: 1,
            email: 'user@example.com',
            name: 'Test User',
          },
          timestamp: new Date().toISOString(),
          details: { device: 'desktop' },
        },
      ];
      
      localStorage.setItem('failedAuditLogs', JSON.stringify(failedLogs));
      
      // First log succeeds, second fails
      (api.createAuditLog as jest.Mock)
        .mockResolvedValueOnce({ status: 'success' })
        .mockRejectedValueOnce(new Error('API error'));
      
      await retryFailedAuditLogs();
      
      // Should have attempted to create both logs
      expect(api.createAuditLog).toHaveBeenCalledTimes(2);
      
      // Should have removed the successful log from localStorage
      const remainingLogs = JSON.parse(localStorage.getItem('failedAuditLogs') as string);
      expect(remainingLogs).toHaveLength(1);
      expect(remainingLogs[0].actionType).toBe(AuditActionType.USER_LOGOUT);
    });
    
    it('handles empty localStorage gracefully', async () => {
      localStorage.setItem('failedAuditLogs', JSON.stringify([]));
      
      await retryFailedAuditLogs();
      
      expect(api.createAuditLog).not.toHaveBeenCalled();
    });
  });
});
