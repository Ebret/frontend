/**
 * Role and Permission Definitions for the Cooperative System
 * 
 * This file defines all user roles and their associated permissions.
 * It also provides utility functions for role-based access control.
 */

// User Roles
export const UserRole = {
  // Common roles for both cooperative types
  ADMIN: 'ADMIN',
  BOARD_MEMBER: 'BOARD_MEMBER',
  GENERAL_MANAGER: 'GENERAL_MANAGER',
  CREDIT_OFFICER: 'CREDIT_OFFICER',
  ACCOUNTANT: 'ACCOUNTANT',
  TELLER: 'TELLER',
  COMPLIANCE_OFFICER: 'COMPLIANCE_OFFICER',
  MEMBER: 'MEMBER',
  MEMBERSHIP_OFFICER: 'MEMBERSHIP_OFFICER',
  SECURITY_MANAGER: 'SECURITY_MANAGER',
  MARKETING_OFFICER: 'MARKETING_OFFICER',
  PARTNER: 'PARTNER',
  
  // Multi-Purpose Cooperative specific roles
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  STORE_MANAGER: 'STORE_MANAGER',
  CASHIER: 'CASHIER',
  PURCHASING_OFFICER: 'PURCHASING_OFFICER',
  SALES_ASSOCIATE: 'SALES_ASSOCIATE',
};

// Permissions
export const Permission = {
  // Common permissions
  VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  MANAGE_USERS: 'MANAGE_USERS',
  VIEW_MEMBER_LIST: 'VIEW_MEMBER_LIST',
  VIEW_MEMBER_DETAILS: 'VIEW_MEMBER_DETAILS',
  EDIT_MEMBER_DETAILS: 'EDIT_MEMBER_DETAILS',
  APPROVE_MEMBERSHIP: 'APPROVE_MEMBERSHIP',
  
  // Loan permissions
  VIEW_LOAN_APPLICATIONS: 'VIEW_LOAN_APPLICATIONS',
  CREATE_LOAN_APPLICATION: 'CREATE_LOAN_APPLICATION',
  APPROVE_LOAN: 'APPROVE_LOAN',
  DISBURSE_LOAN: 'DISBURSE_LOAN',
  MANAGE_LOAN_PRODUCTS: 'MANAGE_LOAN_PRODUCTS',
  
  // Savings permissions
  VIEW_SAVINGS_ACCOUNTS: 'VIEW_SAVINGS_ACCOUNTS',
  CREATE_SAVINGS_ACCOUNT: 'CREATE_SAVINGS_ACCOUNT',
  DEPOSIT_FUNDS: 'DEPOSIT_FUNDS',
  WITHDRAW_FUNDS: 'WITHDRAW_FUNDS',
  MANAGE_SAVINGS_PRODUCTS: 'MANAGE_SAVINGS_PRODUCTS',
  
  // Transaction permissions
  VIEW_TRANSACTIONS: 'VIEW_TRANSACTIONS',
  CREATE_TRANSACTION: 'CREATE_TRANSACTION',
  APPROVE_TRANSACTION: 'APPROVE_TRANSACTION',
  VOID_TRANSACTION: 'VOID_TRANSACTION',
  
  // Collateral permissions
  VIEW_COLLATERAL: 'VIEW_COLLATERAL',
  MANAGE_COLLATERAL: 'MANAGE_COLLATERAL',
  APPROVE_COLLATERAL: 'APPROVE_COLLATERAL',
  
  // Report permissions
  VIEW_FINANCIAL_REPORTS: 'VIEW_FINANCIAL_REPORTS',
  VIEW_MEMBER_REPORTS: 'VIEW_MEMBER_REPORTS',
  VIEW_LOAN_REPORTS: 'VIEW_LOAN_REPORTS',
  VIEW_SAVINGS_REPORTS: 'VIEW_SAVINGS_REPORTS',
  EXPORT_REPORTS: 'EXPORT_REPORTS',
  
  // System permissions
  MANAGE_SETTINGS: 'MANAGE_SETTINGS',
  MANAGE_POLICIES: 'MANAGE_POLICIES',
  VIEW_AUDIT_LOGS: 'VIEW_AUDIT_LOGS',
  MANAGE_SYSTEM_CONFIGURATION: 'MANAGE_SYSTEM_CONFIGURATION',
  
  // Damayan permissions
  MANAGE_DAMAYAN_FUNDS: 'MANAGE_DAMAYAN_FUNDS',
  APPROVE_ASSISTANCE_REQUESTS: 'APPROVE_ASSISTANCE_REQUESTS',
  VIEW_DAMAYAN_REPORTS: 'VIEW_DAMAYAN_REPORTS',
  
  // Partner permissions
  ACCESS_API: 'ACCESS_API',
  EXCHANGE_DOCUMENTS: 'EXCHANGE_DOCUMENTS',
  
  // Multi-Purpose Cooperative specific permissions
  // Inventory permissions
  VIEW_INVENTORY: 'VIEW_INVENTORY',
  MANAGE_INVENTORY: 'MANAGE_INVENTORY',
  ADJUST_INVENTORY: 'ADJUST_INVENTORY',
  APPROVE_INVENTORY_ADJUSTMENTS: 'APPROVE_INVENTORY_ADJUSTMENTS',
  
  // Product permissions
  VIEW_PRODUCTS: 'VIEW_PRODUCTS',
  MANAGE_PRODUCTS: 'MANAGE_PRODUCTS',
  SET_PRODUCT_PRICES: 'SET_PRODUCT_PRICES',
  
  // Supplier permissions
  VIEW_SUPPLIERS: 'VIEW_SUPPLIERS',
  MANAGE_SUPPLIERS: 'MANAGE_SUPPLIERS',
  APPROVE_SUPPLIERS: 'APPROVE_SUPPLIERS',
  
  // Purchase permissions
  CREATE_PURCHASE_ORDER: 'CREATE_PURCHASE_ORDER',
  APPROVE_PURCHASE_ORDER: 'APPROVE_PURCHASE_ORDER',
  RECEIVE_INVENTORY: 'RECEIVE_INVENTORY',
  
  // Sales permissions
  ACCESS_POS: 'ACCESS_POS',
  PROCESS_SALES: 'PROCESS_SALES',
  APPLY_DISCOUNTS: 'APPLY_DISCOUNTS',
  VOID_SALES: 'VOID_SALES',
  MANAGE_CASH_DRAWER: 'MANAGE_CASH_DRAWER',
  
  // Sales reporting permissions
  VIEW_SALES_REPORTS: 'VIEW_SALES_REPORTS',
  VIEW_INVENTORY_REPORTS: 'VIEW_INVENTORY_REPORTS',
};

// Define role-based permissions
export const rolePermissions = {
  // Common roles
  [UserRole.ADMIN]: [
    // Admin has all permissions
    ...Object.values(Permission),
  ],
  
  [UserRole.BOARD_MEMBER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_POLICIES,
    Permission.VIEW_SALES_REPORTS,
    Permission.VIEW_INVENTORY_REPORTS,
  ],
  
  [UserRole.GENERAL_MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_DETAILS,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.APPROVE_LOAN,
    Permission.VIEW_LOAN_APPLICATIONS,
    Permission.MANAGE_POLICIES,
    Permission.VIEW_AUDIT_LOGS,
    Permission.APPROVE_PURCHASE_ORDER,
    Permission.APPROVE_SUPPLIERS,
    Permission.APPROVE_INVENTORY_ADJUSTMENTS,
    Permission.SET_PRODUCT_PRICES,
    Permission.VIEW_SALES_REPORTS,
    Permission.VIEW_INVENTORY_REPORTS,
  ],
  
  [UserRole.CREDIT_OFFICER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_DETAILS,
    Permission.VIEW_LOAN_APPLICATIONS,
    Permission.CREATE_LOAN_APPLICATION,
    Permission.VIEW_COLLATERAL,
    Permission.MANAGE_COLLATERAL,
    Permission.VIEW_LOAN_REPORTS,
  ],
  
  [UserRole.ACCOUNTANT]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_TRANSACTIONS,
    Permission.APPROVE_TRANSACTION,
    Permission.VIEW_FINANCIAL_REPORTS,
    Permission.EXPORT_REPORTS,
    Permission.VIEW_SALES_REPORTS,
    Permission.VIEW_INVENTORY_REPORTS,
  ],
  
  [UserRole.TELLER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_MEMBER_DETAILS,
    Permission.DEPOSIT_FUNDS,
    Permission.WITHDRAW_FUNDS,
    Permission.CREATE_TRANSACTION,
    Permission.VIEW_TRANSACTIONS,
    Permission.PROCESS_SALES,
    Permission.MANAGE_CASH_DRAWER,
  ],
  
  [UserRole.COMPLIANCE_OFFICER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_DETAILS,
    Permission.VIEW_AUDIT_LOGS,
    Permission.VIEW_TRANSACTIONS,
  ],
  
  [UserRole.MEMBER]: [
    Permission.VIEW_DASHBOARD,
    Permission.CREATE_LOAN_APPLICATION,
    Permission.VIEW_SAVINGS_ACCOUNTS,
  ],
  
  [UserRole.MEMBERSHIP_OFFICER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_DETAILS,
    Permission.EDIT_MEMBER_DETAILS,
    Permission.APPROVE_MEMBERSHIP,
  ],
  
  [UserRole.SECURITY_MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_AUDIT_LOGS,
    Permission.MANAGE_SYSTEM_CONFIGURATION,
  ],
  
  [UserRole.MARKETING_OFFICER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_MEMBER_LIST,
    Permission.VIEW_MEMBER_REPORTS,
  ],
  
  [UserRole.PARTNER]: [
    Permission.ACCESS_API,
    Permission.EXCHANGE_DOCUMENTS,
  ],
  
  // Multi-Purpose Cooperative specific roles
  [UserRole.INVENTORY_MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INVENTORY,
    Permission.MANAGE_INVENTORY,
    Permission.ADJUST_INVENTORY,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.VIEW_SUPPLIERS,
    Permission.RECEIVE_INVENTORY,
    Permission.VIEW_INVENTORY_REPORTS,
  ],
  
  [UserRole.STORE_MANAGER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_PRODUCTS,
    Permission.MANAGE_PRODUCTS,
    Permission.SET_PRODUCT_PRICES,
    Permission.VIEW_SUPPLIERS,
    Permission.MANAGE_SUPPLIERS,
    Permission.CREATE_PURCHASE_ORDER,
    Permission.ACCESS_POS,
    Permission.PROCESS_SALES,
    Permission.APPLY_DISCOUNTS,
    Permission.VOID_SALES,
    Permission.MANAGE_CASH_DRAWER,
    Permission.VIEW_SALES_REPORTS,
    Permission.VIEW_INVENTORY_REPORTS,
  ],
  
  [UserRole.CASHIER]: [
    Permission.VIEW_DASHBOARD,
    Permission.ACCESS_POS,
    Permission.PROCESS_SALES,
    Permission.MANAGE_CASH_DRAWER,
    Permission.VIEW_PRODUCTS,
  ],
  
  [UserRole.PURCHASING_OFFICER]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_INVENTORY,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_SUPPLIERS,
    Permission.MANAGE_SUPPLIERS,
    Permission.CREATE_PURCHASE_ORDER,
    Permission.RECEIVE_INVENTORY,
  ],
  
  [UserRole.SALES_ASSOCIATE]: [
    Permission.VIEW_DASHBOARD,
    Permission.ACCESS_POS,
    Permission.PROCESS_SALES,
    Permission.VIEW_PRODUCTS,
  ],
};

// Role display names for UI
export const roleDisplayNames = {
  // Common roles
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
  
  // Multi-Purpose Cooperative specific roles
  [UserRole.INVENTORY_MANAGER]: 'Inventory Manager',
  [UserRole.STORE_MANAGER]: 'Store Manager',
  [UserRole.CASHIER]: 'Cashier',
  [UserRole.PURCHASING_OFFICER]: 'Purchasing Officer',
  [UserRole.SALES_ASSOCIATE]: 'Sales Associate',
};

// Role descriptions
export const roleDescriptions = {
  // Common roles
  [UserRole.ADMIN]: 'Full system access with ability to manage users, roles, and system configuration.',
  [UserRole.BOARD_MEMBER]: 'Access to financial reports and governance documents for oversight purposes.',
  [UserRole.GENERAL_MANAGER]: 'Manages operations, staff, and has approval authority for high-value transactions.',
  [UserRole.CREDIT_OFFICER]: 'Processes loan applications, manages member credit, and handles collections.',
  [UserRole.ACCOUNTANT]: 'Manages financial records, generates reports, and handles tax documentation.',
  [UserRole.TELLER]: 'Processes cash transactions and provides basic member services.',
  [UserRole.COMPLIANCE_OFFICER]: 'Ensures adherence to regulations, policies, and procedures.',
  [UserRole.MEMBER]: 'Regular cooperative member with access to personal accounts and services.',
  [UserRole.MEMBERSHIP_OFFICER]: 'Manages member onboarding, verification, and relationship management.',
  [UserRole.SECURITY_MANAGER]: 'Oversees system security, access controls, and data protection.',
  [UserRole.MARKETING_OFFICER]: 'Manages promotional activities, member communications, and outreach.',
  [UserRole.PARTNER]: 'External organization with limited API access for integration purposes.',
  
  // Multi-Purpose Cooperative specific roles
  [UserRole.INVENTORY_MANAGER]: 'Manages inventory levels, product catalog, and stock adjustments.',
  [UserRole.STORE_MANAGER]: 'Oversees retail operations, pricing, and store performance.',
  [UserRole.CASHIER]: 'Operates point of sale system and handles cash transactions.',
  [UserRole.PURCHASING_OFFICER]: 'Manages supplier relationships and procurement processes.',
  [UserRole.SALES_ASSOCIATE]: 'Assists members with purchases and provides product information.',
};

/**
 * Check if a user has a specific permission
 * @param {string} userRole - The user's role
 * @param {string} permission - The permission to check
 * @returns {boolean} - Whether the user has the permission
 */
export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  const permissions = rolePermissions[userRole];
  return permissions ? permissions.includes(permission) : false;
};

/**
 * Get all permissions for a user role
 * @param {string} userRole - The user's role
 * @returns {string[]} - Array of permissions
 */
export const getPermissionsForRole = (userRole) => {
  return rolePermissions[userRole] || [];
};

/**
 * Check if a role is specific to Multi-Purpose Cooperatives
 * @param {string} role - The role to check
 * @returns {boolean} - Whether the role is Multi-Purpose specific
 */
export const isMultiPurposeRole = (role) => {
  return [
    UserRole.INVENTORY_MANAGER,
    UserRole.STORE_MANAGER,
    UserRole.CASHIER,
    UserRole.PURCHASING_OFFICER,
    UserRole.SALES_ASSOCIATE,
  ].includes(role);
};

/**
 * Get roles available for a specific cooperative type
 * @param {string} cooperativeType - The cooperative type (CREDIT or MULTI_PURPOSE)
 * @returns {string[]} - Array of available roles
 */
export const getRolesForCooperativeType = (cooperativeType) => {
  const commonRoles = [
    UserRole.ADMIN,
    UserRole.BOARD_MEMBER,
    UserRole.GENERAL_MANAGER,
    UserRole.CREDIT_OFFICER,
    UserRole.ACCOUNTANT,
    UserRole.TELLER,
    UserRole.COMPLIANCE_OFFICER,
    UserRole.MEMBER,
    UserRole.MEMBERSHIP_OFFICER,
    UserRole.SECURITY_MANAGER,
    UserRole.MARKETING_OFFICER,
    UserRole.PARTNER,
  ];
  
  if (cooperativeType === 'MULTI_PURPOSE') {
    return [
      ...commonRoles,
      UserRole.INVENTORY_MANAGER,
      UserRole.STORE_MANAGER,
      UserRole.CASHIER,
      UserRole.PURCHASING_OFFICER,
      UserRole.SALES_ASSOCIATE,
    ];
  }
  
  return commonRoles;
};
