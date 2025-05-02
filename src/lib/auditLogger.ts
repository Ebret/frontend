// Audit logging service for tracking user management activities

import { api } from './api';
import { UserRole } from './roles';

export enum AuditActionType {
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_STATUS_CHANGED = 'USER_STATUS_CHANGED',
  USER_PASSWORD_RESET = 'USER_PASSWORD_RESET',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOCKED = 'USER_LOCKED',
  USER_UNLOCKED = 'USER_UNLOCKED',
  BULK_USERS_IMPORTED = 'BULK_USERS_IMPORTED',
  PERMISSION_CHANGED = 'PERMISSION_CHANGED',
  SECURITY_SETTING_CHANGED = 'SECURITY_SETTING_CHANGED',
  DATA_PRIVACY_AGREEMENT_ACCEPTED = 'DATA_PRIVACY_AGREEMENT_ACCEPTED',
  E_WALLET_CREATED = 'E_WALLET_CREATED',
  E_WALLET_TRANSACTION = 'E_WALLET_TRANSACTION',
  E_WALLET_SETTINGS_CHANGED = 'E_WALLET_SETTINGS_CHANGED'
}

export interface AuditLogEntry {
  actionType: AuditActionType;
  performedBy: {
    id: number;
    email: string;
    name: string;
  };
  timestamp: string;
  targetUser?: {
    id: number;
    email: string;
    name?: string;
  };
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

// Function to log audit events
export const logAuditEvent = async (
  actionType: AuditActionType,
  performedBy: { id: number; email: string; name: string },
  details: Record<string, any>,
  targetUser?: { id: number; email: string; name?: string }
): Promise<void> => {
  try {
    // Create the audit log entry
    const auditLogEntry: AuditLogEntry = {
      actionType,
      performedBy,
      timestamp: new Date().toISOString(),
      details,
      targetUser,
      // In a real implementation, these would be captured server-side
      ipAddress: '127.0.0.1', // Placeholder
      userAgent: navigator.userAgent,
    };

    // Send to API
    await api.createAuditLog(auditLogEntry);

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Audit Log:', auditLogEntry);
    }
  } catch (error) {
    console.error('Failed to log audit event:', error);

    // Store failed logs in localStorage for retry
    const failedLogs = JSON.parse(localStorage.getItem('failedAuditLogs') || '[]');
    failedLogs.push({
      actionType,
      performedBy,
      timestamp: new Date().toISOString(),
      details,
      targetUser,
    });
    localStorage.setItem('failedAuditLogs', JSON.stringify(failedLogs));
  }
};

// Function to log user creation
export const logUserCreation = async (
  createdBy: { id: number; email: string; name: string },
  newUser: { id: number; email: string; firstName: string; lastName: string; role: UserRole },
  creationMethod: 'manual' | 'import' | 'invitation'
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.USER_CREATED,
    createdBy,
    {
      creationMethod,
      userRole: newUser.role,
      passwordSetupMethod: creationMethod === 'manual' ? 'administrator_set' :
                          creationMethod === 'invitation' ? 'user_set' : 'temporary',
    },
    {
      id: newUser.id,
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
    }
  );
};

// Function to log bulk user import
export const logBulkUserImport = async (
  importedBy: { id: number; email: string; name: string },
  importDetails: {
    totalCount: number;
    successCount: number;
    failureCount: number;
    passwordSetupMethod: 'email' | 'temporary';
    userRoles: Record<UserRole, number>; // Count of users by role
  }
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.BULK_USERS_IMPORTED,
    importedBy,
    importDetails,
    undefined
  );
};

// Function to log user update
export const logUserUpdate = async (
  updatedBy: { id: number; email: string; name: string },
  updatedUser: { id: number; email: string; name?: string },
  changes: Record<string, { oldValue: any; newValue: any }>
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.USER_UPDATED,
    updatedBy,
    { changes },
    updatedUser
  );
};

// Function to log role change
export const logRoleChange = async (
  changedBy: { id: number; email: string; name: string },
  targetUser: { id: number; email: string; name?: string },
  oldRole: UserRole,
  newRole: UserRole
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.USER_ROLE_CHANGED,
    changedBy,
    {
      oldRole,
      newRole,
    },
    targetUser
  );
};

// Function to log user deletion
export const logUserDeletion = async (
  deletedBy: { id: number; email: string; name: string },
  deletedUser: { id: number; email: string; name?: string; role: UserRole }
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.USER_DELETED,
    deletedBy,
    {
      userRole: deletedUser.role,
    },
    deletedUser
  );
};

// Function to retry failed audit logs
export const retryFailedAuditLogs = async (): Promise<void> => {
  const failedLogs = JSON.parse(localStorage.getItem('failedAuditLogs') || '[]');
  if (failedLogs.length === 0) return;

  const successfulRetries: number[] = [];

  for (let i = 0; i < failedLogs.length; i++) {
    const log = failedLogs[i];
    try {
      await api.createAuditLog({
        ...log,
        retried: true,
      });
      successfulRetries.push(i);
    } catch (error) {
      console.error('Failed to retry audit log:', error);
    }
  }

  // Remove successful retries
  const updatedFailedLogs = failedLogs.filter((_, index) => !successfulRetries.includes(index));
  localStorage.setItem('failedAuditLogs', JSON.stringify(updatedFailedLogs));
};

// Function to log data privacy agreement acceptance
export const logDataPrivacyAgreementAccepted = async (
  user: { id: number; email: string; name: string },
  agreementType: 'standard' | 'e-wallet'
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.DATA_PRIVACY_AGREEMENT_ACCEPTED,
    user,
    {
      agreementType,
      timestamp: new Date().toISOString(),
    }
  );
};

// Function to log e-wallet creation
export const logEWalletCreation = async (
  createdBy: { id: number; email: string; name: string },
  targetUser: { id: number; email: string; name?: string },
  walletDetails: {
    walletId: string;
    initialBalance: number;
  }
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.E_WALLET_CREATED,
    createdBy,
    walletDetails,
    targetUser
  );
};

// Function to log e-wallet transaction
export const logEWalletTransaction = async (
  performedBy: { id: number; email: string; name: string },
  transactionDetails: {
    transactionId: string;
    transactionType: 'deposit' | 'withdrawal' | 'transfer' | 'payment';
    amount: number;
    recipientId?: number;
    recipientEmail?: string;
    recipientName?: string;
    description?: string;
  }
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.E_WALLET_TRANSACTION,
    performedBy,
    transactionDetails
  );
};

// Function to log e-wallet settings change
export const logEWalletSettingsChanged = async (
  changedBy: { id: number; email: string; name: string },
  targetUser: { id: number; email: string; name?: string },
  changes: Record<string, { oldValue: any; newValue: any }>
): Promise<void> => {
  await logAuditEvent(
    AuditActionType.E_WALLET_SETTINGS_CHANGED,
    changedBy,
    { changes },
    targetUser
  );
};

// Initialize retry mechanism
export const initAuditLogRetry = (): void => {
  // Try to retry failed logs on app initialization
  retryFailedAuditLogs();

  // Set up periodic retry
  setInterval(retryFailedAuditLogs, 5 * 60 * 1000); // Every 5 minutes
};
