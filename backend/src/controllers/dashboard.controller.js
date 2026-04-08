const dashboardService = require('../services/dashboard.service');

// Get dashboard summary for current user
exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const summary = await dashboardService.getDashboardSummary(userId);

    return res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    console.error('Get dashboard summary error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching dashboard summary',
    });
  }
};

// Get admin dashboard summary
exports.getAdminDashboardSummary = async (req, res) => {
  try {
    const summary = await dashboardService.getAdminDashboardSummary();

    return res.status(200).json({
      status: 'success',
      data: summary,
    });
  } catch (error) {
    console.error('Get admin dashboard summary error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching admin dashboard summary',
    });
  }
};

// Send dashboard update to a user
exports.sendDashboardUpdate = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await dashboardService.sendDashboardUpdate(parseInt(userId, 10));

    return res.status(200).json({
      status: 'success',
      message: 'Dashboard update sent successfully',
    });
  } catch (error) {
    console.error('Send dashboard update error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while sending dashboard update',
    });
  }
};

// Send admin dashboard update
exports.sendAdminDashboardUpdate = async (req, res) => {
  try {
    await dashboardService.sendAdminDashboardUpdate();

    return res.status(200).json({
      status: 'success',
      message: 'Admin dashboard update sent successfully',
    });
  } catch (error) {
    console.error('Send admin dashboard update error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while sending admin dashboard update',
    });
  }
};
