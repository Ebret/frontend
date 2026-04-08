const { PrismaClient } = require('@prisma/client');
const damayanService = require('../../src/services/damayan.service');

// Mock PrismaClient
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    damayanFund: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    damayanContribution: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    damayanAssistance: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    damayanUserSettings: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    notification: {
      create: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaClient)),
  };
  
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

describe('Damayan Service', () => {
  let prisma;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Get prisma instance
    prisma = new PrismaClient();
  });
  
  describe('createDamayanFund', () => {
    it('should create a Damayan fund successfully', async () => {
      // Setup
      const fundData = {
        name: 'Test Fund',
        description: 'Test fund description',
        status: 'ACTIVE',
      };
      
      const createdFund = {
        id: 1,
        ...fundData,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prisma.damayanFund.create.mockResolvedValue(createdFund);
      
      // Execute
      const result = await damayanService.createDamayanFund(fundData);
      
      // Assert
      expect(prisma.damayanFund.create).toHaveBeenCalledWith({
        data: fundData,
      });
      expect(result).toEqual(createdFund);
    });
    
    it('should handle errors', async () => {
      // Setup
      const fundData = {
        name: 'Test Fund',
        description: 'Test fund description',
        status: 'ACTIVE',
      };
      
      const error = new Error('Database error');
      prisma.damayanFund.create.mockRejectedValue(error);
      
      // Execute & Assert
      await expect(damayanService.createDamayanFund(fundData)).rejects.toThrow('Failed to create Damayan fund');
    });
  });
  
  describe('getDamayanFundById', () => {
    it('should get a Damayan fund by ID successfully', async () => {
      // Setup
      const fundId = '1';
      
      const fund = {
        id: 1,
        name: 'Test Fund',
        description: 'Test fund description',
        balance: 1000,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      prisma.damayanFund.findUnique.mockResolvedValue(fund);
      
      // Execute
      const result = await damayanService.getDamayanFundById(fundId);
      
      // Assert
      expect(prisma.damayanFund.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(fund);
    });
    
    it('should throw error if fund not found', async () => {
      // Setup
      const fundId = '999';
      
      prisma.damayanFund.findUnique.mockResolvedValue(null);
      
      // Execute & Assert
      await expect(damayanService.getDamayanFundById(fundId)).rejects.toThrow('Damayan fund not found');
    });
  });
  
  describe('getAllDamayanFunds', () => {
    it('should get all Damayan funds successfully', async () => {
      // Setup
      const funds = [
        {
          id: 1,
          name: 'Fund 1',
          balance: 1000,
          status: 'ACTIVE',
        },
        {
          id: 2,
          name: 'Fund 2',
          balance: 2000,
          status: 'ACTIVE',
        },
      ];
      
      prisma.damayanFund.findMany.mockResolvedValue(funds);
      
      // Execute
      const result = await damayanService.getAllDamayanFunds({});
      
      // Assert
      expect(prisma.damayanFund.findMany).toHaveBeenCalled();
      expect(result).toEqual(funds);
    });
    
    it('should filter funds by status', async () => {
      // Setup
      const params = { status: 'ACTIVE' };
      
      const funds = [
        {
          id: 1,
          name: 'Fund 1',
          balance: 1000,
          status: 'ACTIVE',
        },
      ];
      
      prisma.damayanFund.findMany.mockResolvedValue(funds);
      
      // Execute
      const result = await damayanService.getAllDamayanFunds(params);
      
      // Assert
      expect(prisma.damayanFund.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'ACTIVE',
          }),
        })
      );
      expect(result).toEqual(funds);
    });
  });
  
  describe('makeContribution', () => {
    it('should make a contribution successfully', async () => {
      // Setup
      const contributionData = {
        userId: 1,
        damayanFundId: 1,
        amount: 100,
        contributionType: 'MANUAL',
      };
      
      const fund = {
        id: 1,
        name: 'Test Fund',
        balance: 1000,
      };
      
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
      };
      
      const contribution = {
        id: 1,
        ...contributionData,
        contributionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        damayanFund: fund,
        user,
      };
      
      prisma.damayanFund.findUnique.mockResolvedValue(fund);
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.damayanFund.update.mockResolvedValue({ ...fund, balance: 1100 });
      prisma.damayanContribution.create.mockResolvedValue(contribution);
      
      // Execute
      const result = await damayanService.makeContribution(contributionData);
      
      // Assert
      expect(prisma.damayanFund.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.damayanFund.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { balance: { increment: 100 } },
      });
      expect(prisma.damayanContribution.create).toHaveBeenCalled();
      expect(prisma.notification.create).toHaveBeenCalled();
      expect(result).toEqual(contribution);
    });
    
    it('should throw error if fund not found', async () => {
      // Setup
      const contributionData = {
        userId: 1,
        damayanFundId: 999,
        amount: 100,
        contributionType: 'MANUAL',
      };
      
      prisma.damayanFund.findUnique.mockResolvedValue(null);
      
      // Execute & Assert
      await expect(damayanService.makeContribution(contributionData)).rejects.toThrow('Damayan fund not found');
    });
    
    it('should throw error if user not found', async () => {
      // Setup
      const contributionData = {
        userId: 999,
        damayanFundId: 1,
        amount: 100,
        contributionType: 'MANUAL',
      };
      
      const fund = {
        id: 1,
        name: 'Test Fund',
        balance: 1000,
      };
      
      prisma.damayanFund.findUnique.mockResolvedValue(fund);
      prisma.user.findUnique.mockResolvedValue(null);
      
      // Execute & Assert
      await expect(damayanService.makeContribution(contributionData)).rejects.toThrow('User not found');
    });
  });
  
  describe('requestAssistance', () => {
    it('should request assistance successfully', async () => {
      // Setup
      const requestData = {
        userId: 1,
        damayanFundId: 1,
        reason: 'Medical emergency',
        documents: [],
      };
      
      const fund = {
        id: 1,
        name: 'Test Fund',
      };
      
      const user = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        memberId: 'MEM123',
      };
      
      const assistanceRequest = {
        id: 1,
        ...requestData,
        status: 'PENDING',
        requestDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        damayanFund: fund,
        user,
        documents: [],
      };
      
      const admins = [
        { id: 2, email: 'admin@example.com' },
      ];
      
      prisma.damayanFund.findUnique.mockResolvedValue(fund);
      prisma.user.findUnique.mockResolvedValue(user);
      prisma.damayanAssistance.create.mockResolvedValue(assistanceRequest);
      prisma.user.findMany.mockResolvedValue(admins);
      
      // Execute
      const result = await damayanService.requestAssistance(requestData);
      
      // Assert
      expect(prisma.damayanFund.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(prisma.damayanAssistance.create).toHaveBeenCalled();
      expect(prisma.user.findMany).toHaveBeenCalled();
      expect(prisma.notification.create).toHaveBeenCalled();
      expect(result).toEqual(assistanceRequest);
    });
    
    it('should throw error if fund not found', async () => {
      // Setup
      const requestData = {
        userId: 1,
        damayanFundId: 999,
        reason: 'Medical emergency',
      };
      
      prisma.damayanFund.findUnique.mockResolvedValue(null);
      
      // Execute & Assert
      await expect(damayanService.requestAssistance(requestData)).rejects.toThrow('Damayan fund not found');
    });
    
    it('should throw error if user not found', async () => {
      // Setup
      const requestData = {
        userId: 999,
        damayanFundId: 1,
        reason: 'Medical emergency',
      };
      
      const fund = {
        id: 1,
        name: 'Test Fund',
      };
      
      prisma.damayanFund.findUnique.mockResolvedValue(fund);
      prisma.user.findUnique.mockResolvedValue(null);
      
      // Execute & Assert
      await expect(damayanService.requestAssistance(requestData)).rejects.toThrow('User not found');
    });
  });
  
  describe('getUserDamayanSummary', () => {
    it('should get user Damayan summary successfully', async () => {
      // Setup
      const userId = '1';
      
      const totalContributions = {
        _sum: { amount: 1000 },
        _count: 5,
      };
      
      const receivedAssistance = {
        _sum: { amount: 500 },
        _count: 1,
      };
      
      const recentContributions = [
        { id: 1, amount: 100, contributionDate: new Date() },
      ];
      
      const recentAssistance = [
        { id: 1, amount: 500, requestDate: new Date() },
      ];
      
      const pendingRequests = 1;
      
      prisma.damayanContribution.groupBy.mockResolvedValue([totalContributions]);
      prisma.damayanAssistance.groupBy.mockResolvedValue([receivedAssistance]);
      prisma.damayanContribution.findMany.mockResolvedValue(recentContributions);
      prisma.damayanAssistance.findMany.mockResolvedValue(recentAssistance);
      prisma.damayanAssistance.count.mockResolvedValue(pendingRequests);
      
      // Execute
      const result = await damayanService.getUserDamayanSummary(userId);
      
      // Assert
      expect(prisma.damayanContribution.groupBy).toHaveBeenCalled();
      expect(prisma.damayanAssistance.groupBy).toHaveBeenCalled();
      expect(prisma.damayanContribution.findMany).toHaveBeenCalled();
      expect(prisma.damayanAssistance.findMany).toHaveBeenCalled();
      expect(prisma.damayanAssistance.count).toHaveBeenCalled();
      expect(result).toEqual({
        summary: {
          totalContributions: 1000,
          contributionsCount: 5,
          totalAssistanceReceived: 500,
          assistanceReceivedCount: 1,
          pendingRequestsCount: 1,
        },
        recentActivity: {
          contributions: recentContributions,
          assistance: recentAssistance,
        },
      });
    });
  });
});
