const { PrismaClient } = require('@prisma/client');
const socketService = require('./socket.service');

const prisma = new PrismaClient();

/**
 * Get dashboard summary for a user
 * @param {number} userId - User ID
 * @returns {Promise<Object>} Dashboard summary
 */
const getDashboardSummary = async (userId) => {
  try {
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get user's loans
    const loans = await prisma.loan.findMany({
      where: { userId },
      include: {
        loanProduct: true,
        payments: true,
      },
    });

    // Get user's savings accounts
    const savings = await prisma.savings.findMany({
      where: { userId },
      include: {
        savingsProduct: true,
      },
    });

    // Get user's recent transactions
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });

    // Calculate total loan amount
    const totalLoanAmount = loans.reduce((total, loan) => {
      if (loan.status === 'ACTIVE' || loan.status === 'DISBURSED') {
        return total + loan.amount;
      }
      return total;
    }, 0);

    // Calculate total savings balance
    const totalSavingsBalance = savings.reduce((total, account) => {
      return total + account.balance;
    }, 0);

    // Calculate total payments made
    const totalPayments = loans.reduce((total, loan) => {
      return total + loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);

    // Count active loans
    const activeLoans = loans.filter(
      loan => loan.status === 'ACTIVE' || loan.status === 'DISBURSED'
    ).length;

    // Count pending applications
    const pendingApplications = loans.filter(
      loan => loan.status === 'PENDING'
    ).length;

    return {
      totalLoanAmount,
      totalSavingsBalance,
      totalPayments,
      activeLoans,
      pendingApplications,
      savingsAccounts: savings.length,
      recentTransactions: transactions,
    };
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    throw error;
  }
};

/**
 * Get admin dashboard summary
 * @returns {Promise<Object>} Admin dashboard summary
 */
const getAdminDashboardSummary = async () => {
  try {
    // Get total members
    const totalMembers = await prisma.user.count({
      where: { role: 'MEMBER' },
    });

    // Get active members (with at least one active loan or savings account)
    const activeMembers = await prisma.user.count({
      where: {
        role: 'MEMBER',
        OR: [
          {
            loans: {
              some: {
                status: {
                  in: ['ACTIVE', 'DISBURSED'],
                },
              },
            },
          },
          {
            savings: {
              some: {
                status: 'ACTIVE',
              },
            },
          },
        ],
      },
    });

    // Get total loans
    const totalLoans = await prisma.loan.count();

    // Get active loans
    const activeLoans = await prisma.loan.count({
      where: {
        status: {
          in: ['ACTIVE', 'DISBURSED'],
        },
      },
    });

    // Get total loan amount
    const loanAmountResult = await prisma.loan.aggregate({
      _sum: {
        amount: true,
      },
    });
    const totalLoanAmount = loanAmountResult._sum.amount || 0;

    // Get total savings
    const savingsResult = await prisma.savings.aggregate({
      _sum: {
        balance: true,
      },
    });
    const totalSavings = savingsResult._sum.balance || 0;

    // Get total accounts
    const totalAccounts = await prisma.savings.count();

    // Get pending applications
    const pendingApplications = await prisma.loan.count({
      where: {
        status: 'PENDING',
      },
    });

    // Get recent activity
    const recentActivity = await prisma.transaction.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return {
      totalMembers,
      activeMembers,
      totalLoans,
      activeLoans,
      totalLoanAmount,
      totalSavings,
      totalAccounts,
      pendingApplications,
      recentActivity,
    };
  } catch (error) {
    console.error('Error getting admin dashboard summary:', error);
    throw error;
  }
};

/**
 * Send dashboard update to a user
 * @param {number} userId - User ID
 * @returns {Promise<void>}
 */
const sendDashboardUpdate = async (userId) => {
  try {
    const summary = await getDashboardSummary(userId);
    socketService.sendDashboardUpdateToUser(userId, summary);
  } catch (error) {
    console.error('Error sending dashboard update:', error);
    throw error;
  }
};

/**
 * Send admin dashboard update to all admin users
 * @returns {Promise<void>}
 */
const sendAdminDashboardUpdate = async () => {
  try {
    const summary = await getAdminDashboardSummary();
    socketService.sendDashboardUpdateToRole('ADMIN', summary);
  } catch (error) {
    console.error('Error sending admin dashboard update:', error);
    throw error;
  }
};

module.exports = {
  getDashboardSummary,
  getAdminDashboardSummary,
  sendDashboardUpdate,
  sendAdminDashboardUpdate,
};
