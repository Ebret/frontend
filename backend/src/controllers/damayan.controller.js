const damayanService = require('../services/damayan.service');
const { handleError } = require('../utils/errorHandler');

// Create a new Damayan fund
exports.createDamayanFund = async (req, res) => {
  try {
    const fundData = req.body;
    const fund = await damayanService.createDamayanFund(fundData);

    return res.status(201).json({
      status: 'success',
      message: 'Damayan fund created successfully',
      data: { fund }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Damayan fund by ID
exports.getDamayanFundById = async (req, res) => {
  try {
    const { id } = req.params;
    const fund = await damayanService.getDamayanFundById(id);

    return res.status(200).json({
      status: 'success',
      data: { fund }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get all Damayan funds
exports.getAllDamayanFunds = async (req, res) => {
  try {
    const { status, cooperativeId } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (cooperativeId) filter.cooperativeId = parseInt(cooperativeId, 10);

    const funds = await damayanService.getAllDamayanFunds(filter);

    return res.status(200).json({
      status: 'success',
      data: { funds }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Update Damayan fund
exports.updateDamayanFund = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const fund = await damayanService.updateDamayanFund(id, updateData);

    return res.status(200).json({
      status: 'success',
      message: 'Damayan fund updated successfully',
      data: { fund }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Make a contribution to Damayan fund
exports.makeContribution = async (req, res) => {
  try {
    const contributionData = req.body;

    // Validate required fields
    if (!contributionData.userId || !contributionData.damayanFundId || !contributionData.amount) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID, fund ID, and amount are required'
      });
    }

    const contribution = await damayanService.makeContribution(contributionData);

    return res.status(201).json({
      status: 'success',
      message: 'Contribution made successfully',
      data: { contribution }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get contributions by user ID
exports.getContributionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const contributions = await damayanService.getContributionsByUserId(userId);

    return res.status(200).json({
      status: 'success',
      data: { contributions }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get contributions by fund ID
exports.getContributionsByFundId = async (req, res) => {
  try {
    const { fundId } = req.params;
    const { page, limit } = req.query;

    const result = await damayanService.getContributionsByFundId(fundId, { page, limit });

    return res.status(200).json({
      status: 'success',
      data: {
        contributions: result.contributions,
        pagination: result.pagination
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Request assistance from Damayan fund
exports.requestAssistance = async (req, res) => {
  try {
    const requestData = req.body;

    // Validate required fields
    if (!requestData.userId || !requestData.damayanFundId || !requestData.reason) {
      return res.status(400).json({
        status: 'error',
        message: 'User ID, fund ID, and reason are required'
      });
    }

    const assistanceRequest = await damayanService.requestAssistance(requestData);

    return res.status(201).json({
      status: 'success',
      message: 'Assistance request submitted successfully',
      data: { assistanceRequest }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get assistance requests by user ID
exports.getAssistanceRequestsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const requests = await damayanService.getAssistanceRequestsByUserId(userId);

    return res.status(200).json({
      status: 'success',
      data: { requests }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get pending assistance requests
exports.getPendingAssistanceRequests = async (req, res) => {
  try {
    const { page, limit, cooperativeId } = req.query;

    const result = await damayanService.getPendingAssistanceRequests({
      page,
      limit,
      cooperativeId
    });

    return res.status(200).json({
      status: 'success',
      data: {
        requests: result.requests,
        pagination: result.pagination
      }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Review assistance request
exports.reviewAssistanceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const reviewData = req.body;

    // Validate required fields
    if (!reviewData.status || !reviewData.approvedById) {
      return res.status(400).json({
        status: 'error',
        message: 'Status and approver ID are required'
      });
    }

    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(reviewData.status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status must be either APPROVED or REJECTED'
      });
    }

    // Validate amount for approved requests
    if (reviewData.status === 'APPROVED' && !reviewData.amount) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount is required for approved requests'
      });
    }

    // Validate rejection reason for rejected requests
    if (reviewData.status === 'REJECTED' && !reviewData.rejectionReason) {
      return res.status(400).json({
        status: 'error',
        message: 'Rejection reason is required for rejected requests'
      });
    }

    const updatedRequest = await damayanService.reviewAssistanceRequest(requestId, reviewData);

    return res.status(200).json({
      status: 'success',
      message: `Assistance request ${reviewData.status.toLowerCase()} successfully`,
      data: { assistanceRequest: updatedRequest }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Disburse approved assistance
exports.disburseAssistance = async (req, res) => {
  try {
    const { requestId } = req.params;
    const disbursementData = req.body;

    const updatedRequest = await damayanService.disburseAssistance(requestId, disbursementData);

    return res.status(200).json({
      status: 'success',
      message: 'Assistance disbursed successfully',
      data: { assistanceRequest: updatedRequest }
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get Damayan fund statistics
exports.getDamayanFundStatistics = async (req, res) => {
  try {
    const { fundId } = req.params;
    const statistics = await damayanService.getDamayanFundStatistics(fundId);

    return res.status(200).json({
      status: 'success',
      data: statistics
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get user's Damayan summary
exports.getUserDamayanSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const summary = await damayanService.getUserDamayanSummary(userId);

    return res.status(200).json({
      status: 'success',
      data: summary
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Get user's Damayan settings
exports.getUserDamayanSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const settings = await damayanService.getUserDamayanSettings(userId);

    return res.status(200).json({
      status: 'success',
      data: settings
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Update user's Damayan settings
exports.updateUserDamayanSettings = async (req, res) => {
  try {
    const { userId } = req.params;
    const settingsData = req.body;

    const settings = await damayanService.updateUserDamayanSettings(userId, settingsData);

    return res.status(200).json({
      status: 'success',
      message: 'Damayan settings updated successfully',
      data: settings
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// Generate Damayan report
exports.generateDamayanReport = async (req, res) => {
  try {
    const params = req.query;

    // Validate required parameters
    if (!params.fundId) {
      return res.status(400).json({
        status: 'error',
        message: 'Fund ID is required'
      });
    }

    if (!params.reportType) {
      return res.status(400).json({
        status: 'error',
        message: 'Report type is required'
      });
    }

    if (!params.startDate || !params.endDate) {
      return res.status(400).json({
        status: 'error',
        message: 'Start date and end date are required'
      });
    }

    const reportData = await damayanService.generateDamayanReport(params);

    return res.status(200).json({
      status: 'success',
      data: reportData
    });
  } catch (error) {
    return handleError(res, error);
  }
};
