const damayanService = require('../../src/services/damayan.service');
const damayanController = require('../../src/controllers/damayan.controller');
const { handleError } = require('../../src/utils/errorHandler');

// Mock dependencies
jest.mock('../../src/services/damayan.service');
jest.mock('../../src/utils/errorHandler');

describe('Damayan Controller', () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request and response objects
    req = {
      params: {},
      query: {},
      body: {},
      user: { id: 1 }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createDamayanFund', () => {
    it('should create a Damayan fund successfully', async () => {
      // Setup
      const fundData = {
        name: 'Test Fund',
        description: 'Test fund description',
        status: 'ACTIVE'
      };
      
      req.body = fundData;
      
      const createdFund = {
        id: 1,
        ...fundData,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      damayanService.createDamayanFund.mockResolvedValue(createdFund);
      
      // Execute
      await damayanController.createDamayanFund(req, res);
      
      // Assert
      expect(damayanService.createDamayanFund).toHaveBeenCalledWith(fundData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Damayan fund created successfully',
        data: { fund: createdFund }
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      const error = new Error('Database error');
      damayanService.createDamayanFund.mockRejectedValue(error);
      
      // Execute
      await damayanController.createDamayanFund(req, res);
      
      // Assert
      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('getDamayanFundById', () => {
    it('should get a Damayan fund by ID successfully', async () => {
      // Setup
      const fundId = '1';
      req.params.id = fundId;
      
      const fund = {
        id: 1,
        name: 'Test Fund',
        description: 'Test fund description',
        balance: 1000,
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      damayanService.getDamayanFundById.mockResolvedValue(fund);
      
      // Execute
      await damayanController.getDamayanFundById(req, res);
      
      // Assert
      expect(damayanService.getDamayanFundById).toHaveBeenCalledWith(fundId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { fund }
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      req.params.id = '999';
      const error = new Error('Fund not found');
      damayanService.getDamayanFundById.mockRejectedValue(error);
      
      // Execute
      await damayanController.getDamayanFundById(req, res);
      
      // Assert
      expect(handleError).toHaveBeenCalledWith(res, error);
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
          status: 'ACTIVE'
        },
        {
          id: 2,
          name: 'Fund 2',
          balance: 2000,
          status: 'ACTIVE'
        }
      ];
      
      damayanService.getAllDamayanFunds.mockResolvedValue(funds);
      
      // Execute
      await damayanController.getAllDamayanFunds(req, res);
      
      // Assert
      expect(damayanService.getAllDamayanFunds).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { funds }
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      const error = new Error('Database error');
      damayanService.getAllDamayanFunds.mockRejectedValue(error);
      
      // Execute
      await damayanController.getAllDamayanFunds(req, res);
      
      // Assert
      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('updateDamayanFund', () => {
    it('should update a Damayan fund successfully', async () => {
      // Setup
      const fundId = '1';
      req.params.id = fundId;
      
      const updateData = {
        name: 'Updated Fund',
        description: 'Updated description',
        status: 'ACTIVE'
      };
      
      req.body = updateData;
      
      const updatedFund = {
        id: 1,
        ...updateData,
        balance: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      damayanService.updateDamayanFund.mockResolvedValue(updatedFund);
      
      // Execute
      await damayanController.updateDamayanFund(req, res);
      
      // Assert
      expect(damayanService.updateDamayanFund).toHaveBeenCalledWith(fundId, updateData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Damayan fund updated successfully',
        data: { fund: updatedFund }
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      req.params.id = '999';
      const error = new Error('Fund not found');
      damayanService.updateDamayanFund.mockRejectedValue(error);
      
      // Execute
      await damayanController.updateDamayanFund(req, res);
      
      // Assert
      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('makeContribution', () => {
    it('should make a contribution successfully', async () => {
      // Setup
      const contributionData = {
        userId: 1,
        damayanFundId: 1,
        amount: 100,
        contributionType: 'MANUAL'
      };
      
      req.body = contributionData;
      
      const contribution = {
        id: 1,
        ...contributionData,
        contributionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      damayanService.makeContribution.mockResolvedValue(contribution);
      
      // Execute
      await damayanController.makeContribution(req, res);
      
      // Assert
      expect(damayanService.makeContribution).toHaveBeenCalledWith(contributionData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Contribution made successfully',
        data: { contribution }
      });
    });
    
    it('should validate required fields', async () => {
      // Setup - missing required fields
      req.body = {
        userId: 1,
        // Missing damayanFundId and amount
      };
      
      // Execute
      await damayanController.makeContribution(req, res);
      
      // Assert
      expect(damayanService.makeContribution).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User ID, fund ID, and amount are required'
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      req.body = {
        userId: 1,
        damayanFundId: 1,
        amount: 100,
        contributionType: 'MANUAL'
      };
      
      const error = new Error('Database error');
      damayanService.makeContribution.mockRejectedValue(error);
      
      // Execute
      await damayanController.makeContribution(req, res);
      
      // Assert
      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('requestAssistance', () => {
    it('should request assistance successfully', async () => {
      // Setup
      const requestData = {
        userId: 1,
        damayanFundId: 1,
        reason: 'Medical emergency',
        documents: []
      };
      
      req.body = requestData;
      
      const assistanceRequest = {
        id: 1,
        ...requestData,
        status: 'PENDING',
        requestDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      damayanService.requestAssistance.mockResolvedValue(assistanceRequest);
      
      // Execute
      await damayanController.requestAssistance(req, res);
      
      // Assert
      expect(damayanService.requestAssistance).toHaveBeenCalledWith(requestData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Assistance request submitted successfully',
        data: { assistanceRequest }
      });
    });
    
    it('should validate required fields', async () => {
      // Setup - missing required fields
      req.body = {
        userId: 1,
        // Missing damayanFundId and reason
      };
      
      // Execute
      await damayanController.requestAssistance(req, res);
      
      // Assert
      expect(damayanService.requestAssistance).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'User ID, fund ID, and reason are required'
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      req.body = {
        userId: 1,
        damayanFundId: 1,
        reason: 'Medical emergency',
        documents: []
      };
      
      const error = new Error('Database error');
      damayanService.requestAssistance.mockRejectedValue(error);
      
      // Execute
      await damayanController.requestAssistance(req, res);
      
      // Assert
      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });

  describe('generateDamayanReport', () => {
    it('should generate a report successfully', async () => {
      // Setup
      req.query = {
        fundId: '1',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        reportType: 'summary'
      };
      
      const reportData = {
        summary: {
          totalContributions: 5000,
          totalDisbursements: 2000,
          netChange: 3000
        },
        reportParams: {
          fundId: '1',
          startDate: '2023-01-01',
          endDate: '2023-12-31',
          reportType: 'summary'
        }
      };
      
      damayanService.generateDamayanReport.mockResolvedValue(reportData);
      
      // Execute
      await damayanController.generateDamayanReport(req, res);
      
      // Assert
      expect(damayanService.generateDamayanReport).toHaveBeenCalledWith(req.query);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: reportData
      });
    });
    
    it('should validate required parameters', async () => {
      // Setup - missing required parameters
      req.query = {
        // Missing fundId
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        reportType: 'summary'
      };
      
      // Execute
      await damayanController.generateDamayanReport(req, res);
      
      // Assert
      expect(damayanService.generateDamayanReport).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Fund ID is required'
      });
    });
    
    it('should handle errors', async () => {
      // Setup
      req.query = {
        fundId: '1',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        reportType: 'summary'
      };
      
      const error = new Error('Database error');
      damayanService.generateDamayanReport.mockRejectedValue(error);
      
      // Execute
      await damayanController.generateDamayanReport(req, res);
      
      // Assert
      expect(handleError).toHaveBeenCalledWith(res, error);
    });
  });
});
