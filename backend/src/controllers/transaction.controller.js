const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const damayanService = require('../services/damayan.service');

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, type, status } = req.query;
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const skip = (pageInt - 1) * limitInt;

    // Build filter
    const filter = {};

    if (startDate && endDate) {
      filter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        lte: new Date(endDate),
      };
    }

    if (type) {
      filter.transactionType = type;
    }

    if (status) {
      filter.status = status;
    }

    // Get transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            memberId: true,
          },
        },
        savings: {
          select: {
            id: true,
            accountNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limitInt,
    });

    // Get total count for pagination
    const totalCount = await prisma.transaction.count({
      where: filter,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        transactions,
        pagination: {
          total: totalCount,
          page: pageInt,
          limit: limitInt,
          pages: Math.ceil(totalCount / limitInt),
        },
      },
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching transactions',
    });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const transactionId = parseInt(id, 10);

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            memberId: true,
          },
        },
        savings: {
          select: {
            id: true,
            accountNumber: true,
            savingsType: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        transaction,
      },
    });
  } catch (error) {
    console.error('Get transaction by ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the transaction',
    });
  }
};

// Get transactions by user ID
exports.getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, startDate, endDate, type, status } = req.query;
    const userIdInt = parseInt(userId, 10);
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const skip = (pageInt - 1) * limitInt;

    // Build filter
    const filter = {
      userId: userIdInt,
    };

    if (startDate && endDate) {
      filter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        lte: new Date(endDate),
      };
    }

    if (type) {
      filter.transactionType = type;
    }

    if (status) {
      filter.status = status;
    }

    // Get transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where: filter,
      include: {
        savings: {
          select: {
            id: true,
            accountNumber: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limitInt,
    });

    // Get total count for pagination
    const totalCount = await prisma.transaction.count({
      where: filter,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        transactions,
        pagination: {
          total: totalCount,
          page: pageInt,
          limit: limitInt,
          pages: Math.ceil(totalCount / limitInt),
        },
      },
    });
  } catch (error) {
    console.error('Get transactions by user ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user transactions',
    });
  }
};

// Get transactions by savings account ID
exports.getTransactionsBySavingsId = async (req, res) => {
  try {
    const { savingsId } = req.params;
    const { page = 1, limit = 20, startDate, endDate, type, status } = req.query;
    const savingsIdInt = parseInt(savingsId, 10);
    const pageInt = parseInt(page, 10);
    const limitInt = parseInt(limit, 10);
    const skip = (pageInt - 1) * limitInt;

    // Build filter
    const filter = {
      savingsId: savingsIdInt,
    };

    if (startDate && endDate) {
      filter.createdAt = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      filter.createdAt = {
        gte: new Date(startDate),
      };
    } else if (endDate) {
      filter.createdAt = {
        lte: new Date(endDate),
      };
    }

    if (type) {
      filter.transactionType = type;
    }

    if (status) {
      filter.status = status;
    }

    // Get transactions with pagination
    const transactions = await prisma.transaction.findMany({
      where: filter,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            memberId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limitInt,
    });

    // Get total count for pagination
    const totalCount = await prisma.transaction.count({
      where: filter,
    });

    return res.status(200).json({
      status: 'success',
      data: {
        transactions,
        pagination: {
          total: totalCount,
          page: pageInt,
          limit: limitInt,
          pages: Math.ceil(totalCount / limitInt),
        },
      },
    });
  } catch (error) {
    console.error('Get transactions by savings ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching savings account transactions',
    });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    const {
      transactionType,
      amount,
      description,
      referenceNumber,
      userId,
      savingsId,
      status,
      cooperativeId,
    } = req.body;

    // Validate required fields
    if (!transactionType || !amount || !userId) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    // Validate transaction type
    const validTransactionTypes = [
      'DEPOSIT',
      'WITHDRAWAL',
      'TRANSFER',
      'LOAN_DISBURSEMENT',
      'LOAN_PAYMENT',
      'INTEREST_EARNED',
      'FEE',
      'DIVIDEND',
    ];

    if (!validTransactionTypes.includes(transactionType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid transaction type',
      });
    }

    // Validate status
    const validStatuses = [
      'PENDING',
      'COMPLETED',
      'FAILED',
      'REVERSED',
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid transaction status',
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // Check if savings account exists (if provided)
    if (savingsId) {
      const savings = await prisma.savings.findUnique({
        where: { id: parseInt(savingsId, 10) },
      });

      if (!savings) {
        return res.status(404).json({
          status: 'error',
          message: 'Savings account not found',
        });
      }
    }

    // Generate reference number if not provided
    const txnReferenceNumber = referenceNumber || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionType,
        amount: parseFloat(amount),
        description,
        referenceNumber: txnReferenceNumber,
        userId: parseInt(userId, 10),
        savingsId: savingsId ? parseInt(savingsId, 10) : null,
        status: status || 'COMPLETED',
        cooperativeId: cooperativeId ? parseInt(cooperativeId, 10) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            memberId: true,
          },
        },
        savings: savingsId ? {
          select: {
            id: true,
            accountNumber: true,
          },
        } : undefined,
      },
    });

    // If it's a deposit or withdrawal and the transaction is completed, update the savings balance
    if (savingsId && (transactionType === 'DEPOSIT' || transactionType === 'WITHDRAWAL' || transactionType === 'INTEREST_EARNED' || transactionType === 'FEE') && status === 'COMPLETED') {
      const savings = await prisma.savings.findUnique({
        where: { id: parseInt(savingsId, 10) },
      });

      if (savings) {
        let newBalance = savings.balance;

        if (transactionType === 'DEPOSIT' || transactionType === 'INTEREST_EARNED') {
          newBalance += parseFloat(amount);
        } else if (transactionType === 'WITHDRAWAL' || transactionType === 'FEE') {
          newBalance -= parseFloat(amount);
        }

        await prisma.savings.update({
          where: { id: parseInt(savingsId, 10) },
          data: {
            balance: newBalance,
          },
        });
      }
    }

    // Check if this is a transaction that could trigger a Damayan contribution prompt
    const eligibleForDamayanPrompt = ['DEPOSIT', 'LOAN_DISBURSEMENT', 'INTEREST_EARNED', 'DIVIDEND'].includes(transaction.transactionType);

    // Get active Damayan fund if available
    let damayanFund = null;
    if (eligibleForDamayanPrompt) {
      try {
        const funds = await damayanService.getAllDamayanFunds({
          status: 'ACTIVE',
          cooperativeId: transaction.cooperativeId
        });
        if (funds && funds.length > 0) {
          damayanFund = funds[0];
        }
      } catch (damayanError) {
        console.error('Error fetching Damayan fund:', damayanError);
        // Continue with transaction response even if Damayan fund fetch fails
      }
    }

    return res.status(201).json({
      status: 'success',
      message: 'Transaction created successfully',
      data: {
        transaction,
        damayanPrompt: eligibleForDamayanPrompt && damayanFund ? {
          showPrompt: true,
          fundId: damayanFund.id,
          fundName: damayanFund.name,
          suggestedAmount: 10, // Default suggested amount
          message: 'Would you like to contribute ₱10 to the Damayan fund to help fellow members in need?'
        } : null
      },
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the transaction',
    });
  }
};

// Update transaction status
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const transactionId = parseInt(id, 10);

    // Check if transaction exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        savings: true,
      },
    });

    if (!existingTransaction) {
      return res.status(404).json({
        status: 'error',
        message: 'Transaction not found',
      });
    }

    // Validate status
    const validStatuses = [
      'PENDING',
      'COMPLETED',
      'FAILED',
      'REVERSED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid transaction status',
      });
    }

    // If transaction is being completed and it affects a savings account, update the balance
    if (status === 'COMPLETED' && existingTransaction.status !== 'COMPLETED' && existingTransaction.savingsId) {
      const savings = existingTransaction.savings;

      if (savings) {
        let newBalance = savings.balance;

        if (existingTransaction.transactionType === 'DEPOSIT' || existingTransaction.transactionType === 'INTEREST_EARNED') {
          newBalance += existingTransaction.amount;
        } else if (existingTransaction.transactionType === 'WITHDRAWAL' || existingTransaction.transactionType === 'FEE') {
          newBalance -= existingTransaction.amount;
        }

        await prisma.savings.update({
          where: { id: existingTransaction.savingsId },
          data: {
            balance: newBalance,
          },
        });
      }
    }

    // If transaction is being reversed and it affects a savings account, reverse the balance change
    if (status === 'REVERSED' && existingTransaction.status === 'COMPLETED' && existingTransaction.savingsId) {
      const savings = existingTransaction.savings;

      if (savings) {
        let newBalance = savings.balance;

        if (existingTransaction.transactionType === 'DEPOSIT' || existingTransaction.transactionType === 'INTEREST_EARNED') {
          newBalance -= existingTransaction.amount;
        } else if (existingTransaction.transactionType === 'WITHDRAWAL' || existingTransaction.transactionType === 'FEE') {
          newBalance += existingTransaction.amount;
        }

        await prisma.savings.update({
          where: { id: existingTransaction.savingsId },
          data: {
            balance: newBalance,
          },
        });
      }
    }

    // Update transaction
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            memberId: true,
          },
        },
        savings: {
          select: {
            id: true,
            accountNumber: true,
          },
        },
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: existingTransaction.userId,
        title: `Transaction ${status.toLowerCase()}`,
        message: `Your transaction (${existingTransaction.referenceNumber}) has been ${status.toLowerCase()}.`,
        notificationType: 'ACCOUNT_UPDATE',
      },
    });

    return res.status(200).json({
      status: 'success',
      message: `Transaction status updated to ${status}`,
      data: {
        transaction: updatedTransaction,
      },
    });
  } catch (error) {
    console.error('Update transaction status error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the transaction status',
    });
  }
};
