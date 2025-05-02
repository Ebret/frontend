// User roles and permissions for the Credit Cooperative System

export enum UserRole {
  ADMIN = 'ADMIN',
  BOARD_MEMBER = 'BOARD_MEMBER',
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  CREDIT_OFFICER = 'CREDIT_OFFICER',
  ACCOUNTANT = 'ACCOUNTANT',
  TELLER = 'TELLER',
  COMPLIANCE_OFFICER = 'COMPLIANCE_OFFICER',
  MEMBER = 'MEMBER',
  MEMBERSHIP_OFFICER = 'MEMBERSHIP_OFFICER',
  SECURITY_MANAGER = 'SECURITY_MANAGER',
  MARKETING_OFFICER = 'MARKETING_OFFICER',
  PARTNER = 'PARTNER',
}

export enum Permission {
  // System permissions
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION',
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',
  
  // Member permissions
  VIEW_MEMBER_LIST = 'VIEW_MEMBER_LIST',
  VIEW_MEMBER_DETAILS = 'VIEW_MEMBER_DETAILS',
  CREATE_MEMBER = 'CREATE_MEMBER',
  EDIT_MEMBER = 'EDIT_MEMBER',
  DELETE_MEMBER = 'DELETE_MEMBER',
  
  // Financial permissions
  VIEW_FINANCIAL_REPORTS = 'VIEW_FINANCIAL_REPORTS',
  CREATE_JOURNAL_ENTRY = 'CREATE_JOURNAL_ENTRY',
  APPROVE_JOURNAL_ENTRY = 'APPROVE_JOURNAL_ENTRY',
  MANAGE_GENERAL_LEDGER = 'MANAGE_GENERAL_LEDGER',
  
  // Loan permissions
  VIEW_LOAN_APPLICATIONS = 'VIEW_LOAN_APPLICATIONS',
  CREATE_LOAN_APPLICATION = 'CREATE_LOAN_APPLICATION',
  PROCESS_LOAN_APPLICATION = 'PROCESS_LOAN_APPLICATION',
  APPROVE_LOAN = 'APPROVE_LOAN',
  DISBURSE_LOAN = 'DISBURSE_LOAN',
  
  // Transaction permissions
  PROCESS_DEPOSITS = 'PROCESS_DEPOSITS',
  PROCESS_WITHDRAWALS = 'PROCESS_WITHDRAWALS',
  PROCESS_LOAN_PAYMENTS = 'PROCESS_LOAN_PAYMENTS',
  PROCESS_TRANSFERS = 'PROCESS_TRANSFERS',
  MANAGE_CASH_DRAWER = 'MANAGE_CASH_DRAWER',
  
  // Compliance permissions
  MANAGE_POLICIES = 'MANAGE_POLICIES',
  CONDUCT_AUDITS = 'CONDUCT_AUDITS',
  MANAGE_RISK = 'MANAGE_RISK',
  
  // Marketing permissions
  MANAGE_CAMPAIGNS = 'MANAGE_CAMPAIGNS',
  SEND_COMMUNICATIONS = 'SEND_COMMUNICATIONS',
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  
  // Partner permissions
  ACCESS_API = 'ACCESS_API',
  EXCHANGE_DOCUMENTS = 'EXCHANGE_DOCUMENTS',
}

// Define role-based permissions
export const rolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    // Admin has all permissions
    ...Object.values(Permission),
  ],
  
  [UserRole.BOARD_MEMBER]: [
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_POLICIES,
  ],
  
  [UserRole.GENERAL_MANAGER]: [
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_DETAILS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.APPROVE_LOAN,
    Permission.VIEW_LOAN_APPLICATIONS,
    Permission.MANAGE_POLICIES,
    Permission.VIEW_AUDIT_LOGS,
  ],
  
  [UserRole.CREDIT_OFFICER]: [
    Permission.VIEW_MEMBER_DETAILS,
    Permission.VIEW_LOAN_APPLICATIONS,
    Permission.CREATE_LOAN_APPLICATION,
    Permission.PROCESS_LOAN_APPLICATION,
    Permission.APPROVE_LOAN,
    Permission.PROCESS_LOAN_PAYMENTS,
  ],
  
  [UserRole.ACCOUNTANT]: [
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.CREATE_JOURNAL_ENTRY,
    Permission.MANAGE_GENERAL_LEDGER,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_DETAILS,
  ],
  
  [UserRole.TELLER]: [
    Permission.PROCESS_DEPOSITS,
    Permission.PROCESS_WITHDRAWALS,
    Permission.PROCESS_LOAN_PAYMENTS,
    Permission.PROCESS_TRANSFERS,
    Permission.MANAGE_CASH_DRAWER,
    Permission.VIEW_MEMBER_DETAILS,
  ],
  
  [UserRole.COMPLIANCE_OFFICER]: [
    Permission.VIEW_AUDIT_LOGS,
    Permission.CONDUCT_AUDITS,
    Permission.MANAGE_RISK,
    Permission.MANAGE_POLICIES,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_DETAILS,
    Permission.VIEW_FINANCIAL_REPORTS,
  ],
  
  [UserRole.MEMBER]: [
    Permission.CREATE_LOAN_APPLICATION,
  ],
  
  [UserRole.MEMBERSHIP_OFFICER]: [
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_DETAILS,
    Permission.CREATE_MEMBER,
    Permission.EDIT_MEMBER,
  ],
  
  [UserRole.SECURITY_MANAGER]: [
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_ROLES,
    Permission.SYSTEM_CONFIGURATION,
  ],
  
  [UserRole.MARKETING_OFFICER]: [
    Permission.MANAGE_CAMPAIGNS,
    Permission.SEND_COMMUNICATIONS,
    Permission.MANAGE_CONTENT,
    Permission.VIEW_MEMBER_LIST,
  ],
  
  [UserRole.PARTNER]: [
    Permission.ACCESS_API,
    Permission.EXCHANGE_DOCUMENTS,
  ],
};

// Role display names for UI
export const roleDisplayNames: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'System Administrator',
  [UserRole.BOARD_MEMBER]: 'Board of Directors',
  [UserRole.GENERAL_MANAGER]: 'General Manager',
  [UserRole.CREDIT_OFFICER]: 'Credit Officer',
  [UserRole.ACCOUNTANT]: 'Accountant',
  [UserRole.TELLER]: 'Teller/Cashier',
  [UserRole.COMPLIANCE_OFFICER]: 'Compliance Officer',
  [UserRole.MEMBER]: 'Member',
  [UserRole.MEMBERSHIP_OFFICER]: 'Membership Officer',
  [UserRole.SECURITY_MANAGER]: 'Security Manager',
  [UserRole.MARKETING_OFFICER]: 'Marketing Officer',
  [UserRole.PARTNER]: 'Partner/Third-Party',
};

// Role descriptions
export const roleDescriptions: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Full system access with ability to manage users, roles, and system configuration.',
  [UserRole.BOARD_MEMBER]: 'Access to financial reports and governance documents for oversight purposes.',
  [UserRole.GENERAL_MANAGER]: 'Manages operations, staff, and has approval authority for high-value transactions.',
  [UserRole.CREDIT_OFFICER]: 'Processes loan applications, manages member credit, and handles collections.',
  [UserRole.ACCOUNTANT]: 'Manages financial records, generates reports, and handles tax documentation.',
  [UserRole.TELLER]: 'Processes cash transactions and provides basic member services.',
  [UserRole.COMPLIANCE_OFFICER]: 'Ensures regulatory compliance, conducts audits, and manages risk.',
  [UserRole.MEMBER]: 'Access to personal accounts, transaction history, and loan applications.',
  [UserRole.MEMBERSHIP_OFFICER]: 'Handles member registration, profile management, and service requests.',
  [UserRole.SECURITY_MANAGER]: 'Monitors security logs, tracks user activity, and manages access control.',
  [UserRole.MARKETING_OFFICER]: 'Manages campaigns, member communications, and community outreach.',
  [UserRole.PARTNER]: 'Limited access based on partnership agreement for integration purposes.',
};

// Check if a user has a specific permission
export const hasPermission = (userRole: UserRole, permission: Permission): boolean => {
  return rolePermissions[userRole]?.includes(permission) || false;
};

// Get all permissions for a role
export const getPermissionsForRole = (role: UserRole): Permission[] => {
  return rolePermissions[role] || [];
};
