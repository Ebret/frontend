import {
  getAllDamayanFunds,
  getDamayanFundById,
  createDamayanFund,
  updateDamayanFund,
  makeContribution,
  getUserContributions,
  requestAssistance,
  getUserAssistanceRequests,
  getUserDamayanSummary,
  getUserDamayanSettings,
  updateUserDamayanSettings,
  generateDamayanReport,
  fetchDamayanFundStatistics,
  fetchMemberParticipation
} from '../damayanService';
import api from '../api';

// Mock the API module
jest.mock('../api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('Damayan Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllDamayanFunds', () => {
    test('fetches all Damayan funds successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            funds: [
              { id: 1, name: 'Fund 1' },
              { id: 2, name: 'Fund 2' },
            ],
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await getAllDamayanFunds();

      expect(api.get).toHaveBeenCalledWith('/damayan/funds');
      expect(result).toEqual(mockResponse.data.data.funds);
    });

    test('handles error when fetching funds', async () => {
      const mockError = new Error('API error');
      api.get.mockRejectedValue(mockError);

      await expect(getAllDamayanFunds()).rejects.toThrow(mockError);
      expect(api.get).toHaveBeenCalledWith('/damayan/funds');
    });
  });

  describe('getDamayanFundById', () => {
    test('fetches a Damayan fund by ID successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            fund: { id: 1, name: 'Fund 1' },
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await getDamayanFundById(1);

      expect(api.get).toHaveBeenCalledWith('/damayan/funds/1');
      expect(result).toEqual(mockResponse.data.data.fund);
    });
  });

  describe('createDamayanFund', () => {
    test('creates a Damayan fund successfully', async () => {
      const mockFundData = {
        name: 'New Fund',
        description: 'Fund description',
      };

      const mockResponse = {
        data: {
          status: 'success',
          data: {
            fund: { id: 3, ...mockFundData },
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await createDamayanFund(mockFundData);

      expect(api.post).toHaveBeenCalledWith('/damayan/funds', mockFundData);
      expect(result).toEqual(mockResponse.data.data.fund);
    });
  });

  describe('updateDamayanFund', () => {
    test('updates a Damayan fund successfully', async () => {
      const mockFundData = {
        name: 'Updated Fund',
        description: 'Updated description',
      };

      const mockResponse = {
        data: {
          status: 'success',
          data: {
            fund: { id: 1, ...mockFundData },
          },
        },
      };

      api.put.mockResolvedValue(mockResponse);

      const result = await updateDamayanFund(1, mockFundData);

      expect(api.put).toHaveBeenCalledWith('/damayan/funds/1', mockFundData);
      expect(result).toEqual(mockResponse.data.data.fund);
    });
  });

  describe('makeContribution', () => {
    test('makes a contribution successfully', async () => {
      const mockContributionData = {
        userId: 1,
        damayanFundId: 1,
        amount: 100,
        contributionType: 'MANUAL',
      };

      const mockResponse = {
        data: {
          status: 'success',
          data: {
            contribution: { id: 1, ...mockContributionData },
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await makeContribution(mockContributionData);

      expect(api.post).toHaveBeenCalledWith('/damayan/contributions', mockContributionData);
      expect(result).toEqual(mockResponse.data.data.contribution);
    });
  });

  describe('getUserContributions', () => {
    test('fetches user contributions successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            contributions: [
              { id: 1, amount: 100 },
              { id: 2, amount: 200 },
            ],
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await getUserContributions(1);

      expect(api.get).toHaveBeenCalledWith('/damayan/users/1/contributions');
      expect(result).toEqual(mockResponse.data.data.contributions);
    });
  });

  describe('requestAssistance', () => {
    test('requests assistance successfully', async () => {
      const mockAssistanceData = {
        userId: 1,
        damayanFundId: 1,
        amount: 500,
        reason: 'Medical emergency',
      };

      const mockResponse = {
        data: {
          status: 'success',
          data: {
            assistanceRequest: { id: 1, ...mockAssistanceData, status: 'PENDING' },
          },
        },
      };

      api.post.mockResolvedValue(mockResponse);

      const result = await requestAssistance(mockAssistanceData);

      expect(api.post).toHaveBeenCalledWith('/damayan/assistance', mockAssistanceData);
      expect(result).toEqual(mockResponse.data.data.assistanceRequest);
    });
  });

  describe('getUserDamayanSummary', () => {
    test('fetches user Damayan summary successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            summary: {
              totalContributions: 1000,
              totalAssistance: 500,
            },
            recentActivity: {
              contributions: [{ id: 1, amount: 100 }],
              assistance: [{ id: 1, amount: 500 }],
            },
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await getUserDamayanSummary(1);

      expect(api.get).toHaveBeenCalledWith('/damayan/users/1/summary');
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('generateDamayanReport', () => {
    test('generates a Damayan report successfully', async () => {
      const mockParams = {
        fundId: 1,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        reportType: 'summary',
      };

      const mockResponse = {
        data: {
          status: 'success',
          data: {
            summary: {
              totalContributions: 5000,
              totalDisbursements: 2000,
            },
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await generateDamayanReport(mockParams);

      expect(api.get).toHaveBeenCalledWith('/damayan/reports/generate', { params: mockParams });
      expect(result).toEqual(mockResponse.data.data);
    });
  });

  describe('fetchMemberParticipation', () => {
    test('fetches member participation data successfully', async () => {
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            members: [
              { id: 1, firstName: 'John', lastName: 'Doe', contributionAmount: 1000 },
              { id: 2, firstName: 'Jane', lastName: 'Smith', contributionAmount: 500 },
            ],
            stats: {
              totalMembers: 10,
              activeContributors: 5,
              participationRate: 50,
            },
          },
        },
      };

      api.get.mockResolvedValue(mockResponse);

      const result = await fetchMemberParticipation(1);

      expect(api.get).toHaveBeenCalledWith('/damayan/funds/1/members');
      expect(result).toEqual(mockResponse.data.data);
    });
  });
});
