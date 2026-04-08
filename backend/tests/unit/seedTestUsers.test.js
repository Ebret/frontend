const testUsers = require('../../src/data/testUsers');
const { mockPrismaClient, resetMocks } = require('../mocks/prisma.mock');

// Mock PrismaClient
jest.mock('@prisma/client', () => require('../mocks/prisma.mock'));

// Mock console.log and console.error
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('Test Users Seed Script', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    resetMocks();
  });

  it('should contain all required user roles', () => {
    // Check if all required roles are present in the test users
    const roles = testUsers.map(user => user.role);

    expect(roles).toContain('ADMIN');
    expect(roles).toContain('BOARD_DIRECTOR');
    expect(roles).toContain('GENERAL_MANAGER');
    expect(roles).toContain('CREDIT_OFFICER');
    expect(roles).toContain('ACCOUNTANT');
    expect(roles).toContain('TELLER');
    expect(roles).toContain('COMPLIANCE_OFFICER');
    expect(roles).toContain('MEMBER');
    expect(roles).toContain('MEMBERSHIP_OFFICER');
    expect(roles).toContain('SECURITY_MANAGER');
    expect(roles).toContain('MARKETING_OFFICER');
    expect(roles).toContain('PARTNER');
  });

  it('should have valid email addresses for all users', () => {
    // Check if all users have valid email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    testUsers.forEach(user => {
      expect(user.email).toMatch(emailRegex);
      expect(user.email).toContain('kacooperatiba.com');
    });
  });

  it('should have all required fields for each user', () => {
    // Check if all users have the required fields
    testUsers.forEach(user => {
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('password');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('status');
      expect(user).toHaveProperty('phoneNumber');
      expect(user).toHaveProperty('address');
      expect(user).toHaveProperty('memberSince');
      expect(user).toHaveProperty('memberId');
      expect(user).toHaveProperty('emailVerified');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });
  });

  it('should have unique email addresses and member IDs', () => {
    // Check if all users have unique email addresses and member IDs
    const emails = testUsers.map(user => user.email);
    const memberIds = testUsers.map(user => user.memberId);

    // Check for duplicates by comparing the length of the array with the length of a Set
    expect(emails.length).toBe(new Set(emails).size);
    expect(memberIds.length).toBe(new Set(memberIds).size);
  });
});
