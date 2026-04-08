/**
 * Prisma mock for testing
 * This file provides a consistent mock for the Prisma client across all tests
 */

// Create mock functions for all Prisma operations
const mockFindMany = jest.fn();
const mockFindUnique = jest.fn();
const mockFindFirst = jest.fn();
const mockCreate = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();
const mockDeleteMany = jest.fn();
const mockUpsert = jest.fn();
const mockCount = jest.fn();
const mockAggregate = jest.fn();
const mockGroupBy = jest.fn();
const mockExecute = jest.fn();
const mockQueryRaw = jest.fn();
const mockTransaction = jest.fn();

// Create a mock for the $transaction method
const mockPrismaTransaction = jest.fn().mockImplementation((callback) => {
  return callback(mockPrismaClient);
});

// Create a mock for the $connect method
const mockConnect = jest.fn();

// Create a mock for the $disconnect method
const mockDisconnect = jest.fn();

// Create a mock Prisma client with all models
const mockPrismaClient = {
  user: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
  },
  cooperative: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
  },
  loan: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
  },
  loanProduct: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
  },
  savingsAccount: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
  },
  transaction: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
  },
  auditLog: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
  },
  notification: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
  },
  $transaction: mockPrismaTransaction,
  $connect: mockConnect,
  $disconnect: mockDisconnect,
  $queryRaw: mockQueryRaw,
  $executeRaw: mockExecute,
};

// Create a mock for the PrismaClient constructor
const mockPrismaClientConstructor = jest.fn(() => mockPrismaClient);

// Export the mock
module.exports = {
  PrismaClient: mockPrismaClientConstructor,
  mockPrismaClient,
  // Export individual mocks for direct manipulation in tests
  mocks: {
    findMany: mockFindMany,
    findUnique: mockFindUnique,
    findFirst: mockFindFirst,
    create: mockCreate,
    update: mockUpdate,
    delete: mockDelete,
    deleteMany: mockDeleteMany,
    upsert: mockUpsert,
    count: mockCount,
    aggregate: mockAggregate,
    groupBy: mockGroupBy,
    transaction: mockPrismaTransaction,
    connect: mockConnect,
    disconnect: mockDisconnect,
    queryRaw: mockQueryRaw,
    execute: mockExecute,
  },
  // Helper to reset all mocks
  resetMocks: () => {
    jest.clearAllMocks();
  },
};
