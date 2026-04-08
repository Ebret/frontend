const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Create a new Damayan fund
 * @param {Object} fundData - Fund data
 * @returns {Promise<Object>} - Created fund
 */
exports.createDamayanFund = async (fundData) => {
  try {
    const fund = await prisma.damayanFund.create({
      data: fundData
    });
    return fund;
  } catch (error) {
    console.error('Create Damayan fund error:', error);
    throw new Error('Failed to create Damayan fund');
  }
};

/**
 * Get Damayan fund by ID
 * @param {number} id - Fund ID
 * @returns {Promise<Object>} - Fund details
 */
exports.getDamayanFundById = async (id) => {
  try {
    const fund = await prisma.damayanFund.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        cooperative: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    if (!fund) {
      throw new Error('Damayan fund not found');
    }

    return fund;
  } catch (error) {
    console.error('Get Damayan fund error:', error);
    throw error;
  }
};

/**
 * Get all Damayan funds
 * @param {Object} filter - Filter criteria
 * @returns {Promise<Array>} - List of funds
 */
exports.getAllDamayanFunds = async (filter = {}) => {
  try {
    const funds = await prisma.damayanFund.findMany({
      where: filter,
      include: {
        cooperative: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return funds;
  } catch (error) {
    console.error('Get all Damayan funds error:', error);
    throw new Error('Failed to fetch Damayan funds');
  }
};

/**
 * Update Damayan fund
 * @param {number} id - Fund ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated fund
 */
exports.updateDamayanFund = async (id, updateData) => {
  try {
    const fund = await prisma.damayanFund.update({
      where: { id: parseInt(id, 10) },
      data: updateData
    });

    return fund;
  } catch (error) {
    console.error('Update Damayan fund error:', error);
    throw new Error('Failed to update Damayan fund');
  }
};

/**
 * Make a contribution to Damayan fund
 * @param {Object} contributionData - Contribution data
 * @returns {Promise<Object>} - Created contribution
 */
exports.makeContribution = async (contributionData) => {
  const { userId, damayanFundId, amount, contributionType, transactionId } = contributionData;

  try {
    // Start a transaction
    return await prisma.$transaction(async (prisma) => {
      // Create the contribution
      const contribution = await prisma.damayanContribution.create({
        data: {
          amount: parseFloat(amount),
          contributionType,
          userId: parseInt(userId, 10),
          damayanFundId: parseInt(damayanFundId, 10),
          transactionId: transactionId ? parseInt(transactionId, 10) : undefined
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              memberId: true
            }
          },
          damayanFund: true
        }
      });

      // Update the fund balance
      await prisma.damayanFund.update({
        where: { id: parseInt(damayanFundId, 10) },
        data: {
          balance: {
            increment: parseFloat(amount)
          }
        }
      });

      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId: parseInt(userId, 10),
          title: 'Damayan Contribution',
          message: `Thank you for your contribution of ₱${amount.toFixed(2)} to the Damayan fund.`,
          notificationType: 'DAMAYAN_CONTRIBUTION'
        }
      });

      return contribution;
    });
  } catch (error) {
    console.error('Make Damayan contribution error:', error);
    throw new Error('Failed to make contribution to Damayan fund');
  }
};

/**
 * Get contributions by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - List of contributions
 */
exports.getContributionsByUserId = async (userId) => {
  try {
    const contributions = await prisma.damayanContribution.findMany({
      where: { userId: parseInt(userId, 10) },
      include: {
        damayanFund: true,
        transaction: true
      },
      orderBy: {
        contributionDate: 'desc'
      }
    });

    return contributions;
  } catch (error) {
    console.error('Get contributions by user ID error:', error);
    throw new Error('Failed to fetch user contributions');
  }
};

/**
 * Get contributions by fund ID
 * @param {number} fundId - Fund ID
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Contributions with pagination
 */
exports.getContributionsByFundId = async (fundId, options = {}) => {
  const { page = 1, limit = 20 } = options;
  const skip = (page - 1) * limit;

  try {
    const [contributions, total] = await Promise.all([
      prisma.damayanContribution.findMany({
        where: { damayanFundId: parseInt(fundId, 10) },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              memberId: true
            }
          },
          transaction: true
        },
        orderBy: {
          contributionDate: 'desc'
        },
        skip,
        take: parseInt(limit, 10)
      }),
      prisma.damayanContribution.count({
        where: { damayanFundId: parseInt(fundId, 10) }
      })
    ]);

    return {
      contributions,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    };
  } catch (error) {
    console.error('Get contributions by fund ID error:', error);
    throw new Error('Failed to fetch fund contributions');
  }
};

/**
 * Request assistance from Damayan fund
 * @param {Object} requestData - Assistance request data
 * @returns {Promise<Object>} - Created assistance request
 */
exports.requestAssistance = async (requestData) => {
  const { userId, damayanFundId, reason, documents } = requestData;

  try {
    // Create the assistance request
    const assistanceRequest = await prisma.damayanAssistance.create({
      data: {
        reason,
        userId: parseInt(userId, 10),
        damayanFundId: parseInt(damayanFundId, 10),
        documents: {
          create: documents || []
        }
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            memberId: true
          }
        },
        damayanFund: true,
        documents: true
      }
    });

    // Notify administrators
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'MANAGER' },
          { role: 'BOARD_MEMBER' }
        ]
      }
    });

    // Create notifications for admins
    await Promise.all(
      admins.map(admin =>
        prisma.notification.create({
          data: {
            userId: admin.id,
            title: 'New Damayan Assistance Request',
            message: `A new assistance request has been submitted by ${assistanceRequest.user.firstName} ${assistanceRequest.user.lastName}.`,
            notificationType: 'DAMAYAN_REQUEST'
          }
        })
      )
    );

    return assistanceRequest;
  } catch (error) {
    console.error('Request Damayan assistance error:', error);
    throw new Error('Failed to submit assistance request');
  }
};

/**
 * Get assistance requests by user ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - List of assistance requests
 */
exports.getAssistanceRequestsByUserId = async (userId) => {
  try {
    const requests = await prisma.damayanAssistance.findMany({
      where: { userId: parseInt(userId, 10) },
      include: {
        damayanFund: true,
        documents: true,
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        }
      },
      orderBy: {
        requestDate: 'desc'
      }
    });

    return requests;
  } catch (error) {
    console.error('Get assistance requests by user ID error:', error);
    throw new Error('Failed to fetch user assistance requests');
  }
};

/**
 * Get pending assistance requests
 * @param {Object} options - Pagination options
 * @returns {Promise<Object>} - Requests with pagination
 */
exports.getPendingAssistanceRequests = async (options = {}) => {
  const { page = 1, limit = 20, cooperativeId } = options;
  const skip = (page - 1) * limit;

  const filter = { status: 'PENDING' };
  if (cooperativeId) {
    filter.damayanFund = {
      cooperativeId: parseInt(cooperativeId, 10)
    };
  }

  try {
    const [requests, total] = await Promise.all([
      prisma.damayanAssistance.findMany({
        where: filter,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              memberId: true
            }
          },
          damayanFund: true,
          documents: true
        },
        orderBy: {
          requestDate: 'desc'
        },
        skip,
        take: parseInt(limit, 10)
      }),
      prisma.damayanAssistance.count({
        where: filter
      })
    ]);

    return {
      requests,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pages: Math.ceil(total / parseInt(limit, 10))
      }
    };
  } catch (error) {
    console.error('Get pending assistance requests error:', error);
    throw new Error('Failed to fetch pending assistance requests');
  }
};

/**
 * Review assistance request
 * @param {number} requestId - Request ID
 * @param {Object} reviewData - Review data
 * @returns {Promise<Object>} - Updated assistance request
 */
exports.reviewAssistanceRequest = async (requestId, reviewData) => {
  const { status, amount, approvedById, rejectionReason } = reviewData;

  try {
    // Get the request
    const request = await prisma.damayanAssistance.findUnique({
      where: { id: parseInt(requestId, 10) },
      include: {
        damayanFund: true,
        user: true
      }
    });

    if (!request) {
      throw new Error('Assistance request not found');
    }

    if (request.status !== 'PENDING') {
      throw new Error('This request has already been reviewed');
    }

    // Update the request
    const updatedRequest = await prisma.damayanAssistance.update({
      where: { id: parseInt(requestId, 10) },
      data: {
        status,
        amount: status === 'APPROVED' ? parseFloat(amount) : null,
        approvalDate: status === 'APPROVED' ? new Date() : null,
        approvedById: status === 'APPROVED' ? parseInt(approvedById, 10) : null,
        rejectionReason: status === 'REJECTED' ? rejectionReason : null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            memberId: true
          }
        },
        damayanFund: true,
        approvedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true
          }
        },
        documents: true
      }
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: request.userId,
        title: `Damayan Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`,
        message: status === 'APPROVED'
          ? `Your assistance request has been approved for ₱${amount}.`
          : `Your assistance request has been rejected. Reason: ${rejectionReason}`,
        notificationType: 'DAMAYAN_APPROVAL'
      }
    });

    return updatedRequest;
  } catch (error) {
    console.error('Review assistance request error:', error);
    throw error;
  }
};

/**
 * Disburse approved assistance
 * @param {number} requestId - Request ID
 * @param {Object} disbursementData - Disbursement data
 * @returns {Promise<Object>} - Updated assistance request
 */
exports.disburseAssistance = async (requestId, disbursementData) => {
  const { transactionId } = disbursementData;

  try {
    // Get the request
    const request = await prisma.damayanAssistance.findUnique({
      where: { id: parseInt(requestId, 10) },
      include: {
        damayanFund: true,
        user: true
      }
    });

    if (!request) {
      throw new Error('Assistance request not found');
    }

    if (request.status !== 'APPROVED') {
      throw new Error('Only approved requests can be disbursed');
    }

    // Start a transaction
    return await prisma.$transaction(async (prisma) => {
      // Update the request
      const updatedRequest = await prisma.damayanAssistance.update({
        where: { id: parseInt(requestId, 10) },
        data: {
          status: 'DISBURSED',
          disbursementDate: new Date(),
          transactionId: transactionId ? parseInt(transactionId, 10) : undefined
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              memberId: true
            }
          },
          damayanFund: true,
          approvedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true
            }
          },
          documents: true,
          transaction: true
        }
      });

      // Update the fund balance
      await prisma.damayanFund.update({
        where: { id: request.damayanFundId },
        data: {
          balance: {
            decrement: request.amount
          }
        }
      });

      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId: request.userId,
          title: 'Damayan Assistance Disbursed',
          message: `Your assistance of ₱${request.amount.toFixed(2)} has been disbursed to your account.`,
          notificationType: 'DAMAYAN_DISBURSEMENT'
        }
      });

      // Create notifications for all contributors
      const contributors = await prisma.damayanContribution.findMany({
        where: {
          damayanFundId: request.damayanFundId,
          NOT: {
            userId: request.userId
          }
        },
        select: {
          userId: true
        },
        distinct: ['userId']
      });

      // Create notifications for contributors
      await Promise.all(
        contributors.map(contributor =>
          prisma.notification.create({
            data: {
              userId: contributor.userId,
              title: 'Damayan Fund Update',
              message: `Your contribution has helped a fellow member in need. ₱${request.amount.toFixed(2)} has been disbursed from the Damayan fund.`,
              notificationType: 'DAMAYAN_DISBURSEMENT'
            }
          })
        )
      );

      return updatedRequest;
    });
  } catch (error) {
    console.error('Disburse assistance error:', error);
    throw error;
  }
};

/**
 * Get Damayan fund statistics
 * @param {number} fundId - Fund ID
 * @returns {Promise<Object>} - Fund statistics
 */
exports.getDamayanFundStatistics = async (fundId) => {
  try {
    const fund = await prisma.damayanFund.findUnique({
      where: { id: parseInt(fundId, 10) }
    });

    if (!fund) {
      throw new Error('Damayan fund not found');
    }

    // Get total contributions
    const totalContributions = await prisma.damayanContribution.aggregate({
      where: { damayanFundId: parseInt(fundId, 10) },
      _sum: {
        amount: true
      },
      _count: true
    });

    // Get total disbursements
    const totalDisbursements = await prisma.damayanAssistance.aggregate({
      where: {
        damayanFundId: parseInt(fundId, 10),
        status: 'DISBURSED'
      },
      _sum: {
        amount: true
      },
      _count: true
    });

    // Get recent contributions
    const recentContributions = await prisma.damayanContribution.findMany({
      where: { damayanFundId: parseInt(fundId, 10) },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            memberId: true
          }
        }
      },
      orderBy: {
        contributionDate: 'desc'
      },
      take: 5
    });

    // Get recent disbursements
    const recentDisbursements = await prisma.damayanAssistance.findMany({
      where: {
        damayanFundId: parseInt(fundId, 10),
        status: 'DISBURSED'
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            memberId: true
          }
        }
      },
      orderBy: {
        disbursementDate: 'desc'
      },
      take: 5
    });

    // Get pending requests count
    const pendingRequestsCount = await prisma.damayanAssistance.count({
      where: {
        damayanFundId: parseInt(fundId, 10),
        status: 'PENDING'
      }
    });

    // Get unique contributors count
    const uniqueContributorsCount = await prisma.damayanContribution.groupBy({
      by: ['userId'],
      where: { damayanFundId: parseInt(fundId, 10) },
      _count: true
    });

    return {
      fund,
      statistics: {
        totalContributions: totalContributions._sum.amount || 0,
        contributionsCount: totalContributions._count,
        totalDisbursements: totalDisbursements._sum.amount || 0,
        disbursementsCount: totalDisbursements._count,
        currentBalance: fund.balance,
        pendingRequestsCount,
        uniqueContributorsCount: uniqueContributorsCount.length
      },
      recentActivity: {
        contributions: recentContributions,
        disbursements: recentDisbursements
      }
    };
  } catch (error) {
    console.error('Get Damayan fund statistics error:', error);
    throw error;
  }
};

/**
 * Get user's Damayan summary
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - User's Damayan summary
 */
exports.getUserDamayanSummary = async (userId) => {
  try {
    // Get user's total contributions
    const totalContributions = await prisma.damayanContribution.aggregate({
      where: { userId: parseInt(userId, 10) },
      _sum: {
        amount: true
      },
      _count: true
    });

    // Get user's received assistance
    const receivedAssistance = await prisma.damayanAssistance.aggregate({
      where: {
        userId: parseInt(userId, 10),
        status: 'DISBURSED'
      },
      _sum: {
        amount: true
      },
      _count: true
    });

    // Get user's recent contributions
    const recentContributions = await prisma.damayanContribution.findMany({
      where: { userId: parseInt(userId, 10) },
      include: {
        damayanFund: true
      },
      orderBy: {
        contributionDate: 'desc'
      },
      take: 5
    });

    // Get user's recent assistance
    const recentAssistance = await prisma.damayanAssistance.findMany({
      where: {
        userId: parseInt(userId, 10)
      },
      include: {
        damayanFund: true
      },
      orderBy: {
        requestDate: 'desc'
      },
      take: 5
    });

    // Get pending requests
    const pendingRequests = await prisma.damayanAssistance.count({
      where: {
        userId: parseInt(userId, 10),
        status: 'PENDING'
      }
    });

    return {
      summary: {
        totalContributions: totalContributions._sum.amount || 0,
        contributionsCount: totalContributions._count,
        totalAssistanceReceived: receivedAssistance._sum.amount || 0,
        assistanceReceivedCount: receivedAssistance._count,
        pendingRequestsCount: pendingRequests
      },
      recentActivity: {
        contributions: recentContributions,
        assistance: recentAssistance
      }
    };
  } catch (error) {
    console.error('Get user Damayan summary error:', error);
    throw error;
  }
};

/**
 * Get user's Damayan settings
 * @param {number} userId - User ID
 * @returns {Promise<Object>} - User's Damayan settings
 */
exports.getUserDamayanSettings = async (userId) => {
  try {
    // Check if settings exist
    let settings = await prisma.damayanUserSettings.findUnique({
      where: { userId: parseInt(userId, 10) }
    });

    // If not, create default settings
    if (!settings) {
      settings = await prisma.damayanUserSettings.create({
        data: {
          userId: parseInt(userId, 10),
          autoContribute: false,
          contributionType: 'FIXED',
          fixedAmount: 10,
          percentageAmount: 1,
          monthlyContribution: false,
          monthlyAmount: 50,
          receiveNotifications: true
        }
      });
    }

    return settings;
  } catch (error) {
    console.error('Get user Damayan settings error:', error);
    throw error;
  }
};

/**
 * Update user's Damayan settings
 * @param {number} userId - User ID
 * @param {Object} settingsData - Settings data
 * @returns {Promise<Object>} - Updated settings
 */
exports.updateUserDamayanSettings = async (userId, settingsData) => {
  try {
    // Get current settings or create if not exists
    const currentSettings = await exports.getUserDamayanSettings(userId);

    // Update settings
    const updatedSettings = await prisma.damayanUserSettings.update({
      where: { id: currentSettings.id },
      data: {
        autoContribute: settingsData.autoContribute === true,
        contributionType: settingsData.contributionType || 'FIXED',
        fixedAmount: parseFloat(settingsData.fixedAmount) || 10,
        percentageAmount: parseFloat(settingsData.percentageAmount) || 1,
        monthlyContribution: settingsData.monthlyContribution === true,
        monthlyAmount: parseFloat(settingsData.monthlyAmount) || 50,
        receiveNotifications: settingsData.receiveNotifications !== false
      }
    });

    return updatedSettings;
  } catch (error) {
    console.error('Update user Damayan settings error:', error);
    throw error;
  }
};

/**
 * Process automatic contribution after transaction
 * @param {Object} transactionData - Transaction data
 * @returns {Promise<Object|null>} - Created contribution or null if not applicable
 */
exports.processAutomaticContribution = async (transactionData) => {
  const { userId, amount, transactionId, cooperativeId } = transactionData;

  try {
    // Check if user has opted in for automatic contributions
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        cooperative: true,
        damayanSettings: true
      }
    });

    if (!user || !user.damayanSettings || !user.damayanSettings.autoContribute) {
      return null;
    }

    // Get the active Damayan fund for the cooperative
    const damayanFund = await prisma.damayanFund.findFirst({
      where: {
        status: 'ACTIVE',
        cooperativeId: cooperativeId ? parseInt(cooperativeId, 10) : user.cooperativeId
      }
    });

    if (!damayanFund) {
      return null;
    }

    // Calculate contribution amount based on user settings
    let contributionAmount = 10; // Default

    if (user.damayanSettings.contributionType === 'PERCENTAGE') {
      // Calculate percentage of transaction amount
      contributionAmount = (amount * user.damayanSettings.percentageAmount) / 100;

      // Set minimum contribution amount
      if (contributionAmount < 1) {
        contributionAmount = 1;
      }
    } else {
      // Use fixed amount
      contributionAmount = user.damayanSettings.fixedAmount;
    }

    // Create the contribution
    const contribution = await exports.makeContribution({
      userId: user.id,
      damayanFundId: damayanFund.id,
      amount: contributionAmount,
      contributionType: 'TRANSACTION_BASED',
      transactionId
    });

    return contribution;
  } catch (error) {
    console.error('Process automatic contribution error:', error);
    // Don't throw error to prevent affecting the main transaction
    return null;
  }
};

/**
 * Generate Damayan report
 * @param {Object} params - Report parameters
 * @returns {Promise<Object>} - Report data
 */
exports.generateDamayanReport = async (params) => {
  const { fundId, startDate, endDate, reportType } = params;

  try {
    // Validate fund
    const fund = await prisma.damayanFund.findUnique({
      where: { id: parseInt(fundId, 10) }
    });

    if (!fund) {
      throw new Error('Damayan fund not found');
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // Set to end of day

    // Generate report based on type
    if (reportType === 'contributions') {
      // Get contributions in date range
      const contributions = await prisma.damayanContribution.findMany({
        where: {
          damayanFundId: parseInt(fundId, 10),
          contributionDate: {
            gte: start,
            lte: end
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              memberId: true
            }
          }
        },
        orderBy: {
          contributionDate: 'desc'
        }
      });

      // Calculate totals
      const totalAmount = contributions.reduce((sum, item) => sum + item.amount, 0);

      return {
        contributions,
        totals: {
          totalAmount,
          count: contributions.length
        },
        reportParams: {
          fundId,
          fundName: fund.name,
          startDate,
          endDate,
          reportType
        }
      };
    } else if (reportType === 'disbursements') {
      // Get disbursements in date range
      const disbursements = await prisma.damayanAssistance.findMany({
        where: {
          damayanFundId: parseInt(fundId, 10),
          status: 'DISBURSED',
          disbursementDate: {
            gte: start,
            lte: end
          }
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              memberId: true
            }
          }
        },
        orderBy: {
          disbursementDate: 'desc'
        }
      });

      // Calculate totals
      const totalAmount = disbursements.reduce((sum, item) => sum + item.amount, 0);

      return {
        disbursements,
        totals: {
          totalAmount,
          count: disbursements.length
        },
        reportParams: {
          fundId,
          fundName: fund.name,
          startDate,
          endDate,
          reportType
        }
      };
    } else if (reportType === 'summary') {
      // Get contributions in date range
      const contributions = await prisma.damayanContribution.findMany({
        where: {
          damayanFundId: parseInt(fundId, 10),
          contributionDate: {
            gte: start,
            lte: end
          }
        },
        include: {
          user: {
            select: {
              id: true
            }
          }
        }
      });

      // Get disbursements in date range
      const disbursements = await prisma.damayanAssistance.findMany({
        where: {
          damayanFundId: parseInt(fundId, 10),
          status: 'DISBURSED',
          disbursementDate: {
            gte: start,
            lte: end
          }
        },
        include: {
          user: {
            select: {
              id: true
            }
          }
        }
      });

      // Calculate totals
      const totalContributions = contributions.reduce((sum, item) => sum + item.amount, 0);
      const totalDisbursements = disbursements.reduce((sum, item) => sum + item.amount, 0);

      // Get unique contributors
      const uniqueContributors = [...new Set(contributions.map(item => item.userId))];

      // Get unique assistance recipients
      const uniqueRecipients = [...new Set(disbursements.map(item => item.userId))];

      // Calculate averages
      const averageContribution = contributions.length > 0 ? totalContributions / contributions.length : 0;
      const averageDisbursement = disbursements.length > 0 ? totalDisbursements / disbursements.length : 0;

      return {
        summary: {
          totalContributions,
          contributionsCount: contributions.length,
          totalDisbursements,
          disbursementsCount: disbursements.length,
          netChange: totalContributions - totalDisbursements,
          uniqueContributorsCount: uniqueContributors.length,
          assistanceRecipientsCount: uniqueRecipients.length,
          averageContribution,
          averageDisbursement
        },
        reportParams: {
          fundId,
          fundName: fund.name,
          startDate,
          endDate,
          reportType
        }
      };
    } else {
      throw new Error('Invalid report type');
    }
  } catch (error) {
    console.error('Generate Damayan report error:', error);
    throw error;
  }
};
