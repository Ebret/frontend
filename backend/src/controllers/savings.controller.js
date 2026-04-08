const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all savings accounts
exports.getAllSavings = async (req, res) => {
  try {
    const savings = await prisma.savings.findMany({
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
        savingsProduct: true,
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        savings,
      },
    });
  } catch (error) {
    console.error('Get all savings error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching savings accounts',
    });
  }
};

// Get savings account by ID
exports.getSavingsById = async (req, res) => {
  try {
    const { id } = req.params;
    const savingsId = parseInt(id, 10);

    const savings = await prisma.savings.findUnique({
      where: { id: savingsId },
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
        savingsProduct: true,
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!savings) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings account not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        savings,
      },
    });
  } catch (error) {
    console.error('Get savings by ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the savings account',
    });
  }
};

// Get savings accounts by user ID
exports.getSavingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdInt = parseInt(userId, 10);

    const savings = await prisma.savings.findMany({
      where: { userId: userIdInt },
      include: {
        savingsProduct: true,
        transactions: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        savings,
      },
    });
  } catch (error) {
    console.error('Get savings by user ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user savings accounts',
    });
  }
};

// Create a new savings account
exports.createSavings = async (req, res) => {
  try {
    const {
      userId,
      savingsProductId,
      initialDeposit,
      savingsType,
      cooperativeId,
    } = req.body;

    // Validate required fields
    if (!userId || !savingsProductId || !savingsType) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
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

    // Check if savings product exists
    const savingsProduct = await prisma.savingsProduct.findUnique({
      where: { id: parseInt(savingsProductId, 10) },
    });

    if (!savingsProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings product not found',
      });
    }

    // Validate initial deposit against minimum balance
    const initialDepositAmount = initialDeposit ? parseFloat(initialDeposit) : 0;
    if (initialDepositAmount < savingsProduct.minimumBalance) {
      return res.status(400).json({
        status: 'error',
        message: `Initial deposit must be at least ${savingsProduct.minimumBalance}`,
      });
    }

    // Validate savings type
    const validSavingsTypes = [
      'REGULAR',
      'FIXED',
      'RETIREMENT',
      'EDUCATION',
      'EMERGENCY',
    ];

    if (!validSavingsTypes.includes(savingsType)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid savings type',
      });
    }

    // Generate unique account number
    const accountNumber = `SA-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create savings account
    const savings = await prisma.savings.create({
      data: {
        accountNumber,
        userId: parseInt(userId, 10),
        savingsProductId: parseInt(savingsProductId, 10),
        balance: initialDepositAmount,
        savingsType,
        status: 'ACTIVE',
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
        savingsProduct: true,
      },
    });

    // If there's an initial deposit, create a transaction
    if (initialDepositAmount > 0) {
      // Generate reference number
      const referenceNumber = `DEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create transaction
      await prisma.transaction.create({
        data: {
          transactionType: 'DEPOSIT',
          amount: initialDepositAmount,
          description: `Initial deposit for account ${accountNumber}`,
          referenceNumber,
          userId: parseInt(userId, 10),
          savingsId: savings.id,
          status: 'COMPLETED',
          cooperativeId: cooperativeId ? parseInt(cooperativeId, 10) : null,
        },
      });

      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId: parseInt(userId, 10),
          title: 'Savings account opened',
          message: `Your new savings account (${accountNumber}) has been opened with an initial deposit of ${initialDepositAmount}.`,
          notificationType: 'ACCOUNT_UPDATE',
        },
      });
    } else {
      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId: parseInt(userId, 10),
          title: 'Savings account opened',
          message: `Your new savings account (${accountNumber}) has been opened.`,
          notificationType: 'ACCOUNT_UPDATE',
        },
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Savings account created successfully',
      data: {
        savings,
      },
    });
  } catch (error) {
    console.error('Create savings error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the savings account',
    });
  }
};

// Update savings account status
exports.updateSavingsStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const savingsId = parseInt(id, 10);

    // Check if savings account exists
    const existingSavings = await prisma.savings.findUnique({
      where: { id: savingsId },
    });

    if (!existingSavings) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings account not found',
      });
    }

    // Validate status
    const validStatuses = [
      'ACTIVE',
      'INACTIVE',
      'CLOSED',
      'DORMANT',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid savings account status',
      });
    }

    // Update savings account
    const updatedSavings = await prisma.savings.update({
      where: { id: savingsId },
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
        savingsProduct: true,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: existingSavings.userId,
        title: `Savings account ${status.toLowerCase()}`,
        message: `Your savings account (${existingSavings.accountNumber}) has been ${status.toLowerCase()}.`,
        notificationType: 'ACCOUNT_UPDATE',
      },
    });

    return res.status(200).json({
      status: 'success',
      message: `Savings account status updated to ${status}`,
      data: {
        savings: updatedSavings,
      },
    });
  } catch (error) {
    console.error('Update savings status error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the savings account status',
    });
  }
};

// Make a deposit
exports.makeDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;
    const savingsId = parseInt(id, 10);

    // Check if savings account exists
    const savings = await prisma.savings.findUnique({
      where: { id: savingsId },
    });

    if (!savings) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings account not found',
      });
    }

    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid deposit amount',
      });
    }

    const depositAmount = parseFloat(amount);

    // Update savings balance
    const updatedSavings = await prisma.savings.update({
      where: { id: savingsId },
      data: {
        balance: {
          increment: depositAmount,
        },
      },
    });

    // Generate reference number
    const referenceNumber = `DEP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionType: 'DEPOSIT',
        amount: depositAmount,
        description: description || `Deposit to account ${savings.accountNumber}`,
        referenceNumber,
        userId: savings.userId,
        savingsId,
        status: 'COMPLETED',
        cooperativeId: savings.cooperativeId,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: savings.userId,
        title: 'Deposit successful',
        message: `Your deposit of ${depositAmount} to account ${savings.accountNumber} was successful. New balance: ${updatedSavings.balance}.`,
        notificationType: 'ACCOUNT_UPDATE',
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Deposit successful',
      data: {
        transaction,
        newBalance: updatedSavings.balance,
      },
    });
  } catch (error) {
    console.error('Make deposit error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing the deposit',
    });
  }
};

// Make a withdrawal
exports.makeWithdrawal = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;
    const savingsId = parseInt(id, 10);

    // Check if savings account exists
    const savings = await prisma.savings.findUnique({
      where: { id: savingsId },
      include: {
        savingsProduct: true,
      },
    });

    if (!savings) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings account not found',
      });
    }

    // Validate amount
    if (!amount || parseFloat(amount) <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid withdrawal amount',
      });
    }

    const withdrawalAmount = parseFloat(amount);

    // Check if account has sufficient balance
    if (savings.balance < withdrawalAmount) {
      return res.status(400).json({
        status: 'error',
        message: 'Insufficient balance',
      });
    }

    // Check if withdrawal would leave minimum balance
    if (savings.balance - withdrawalAmount < savings.savingsProduct.minimumBalance) {
      return res.status(400).json({
        status: 'error',
        message: `Withdrawal would leave less than the minimum balance of ${savings.savingsProduct.minimumBalance}`,
      });
    }

    // Check if withdrawal exceeds limit (if any)
    if (savings.savingsProduct.withdrawalLimit && withdrawalAmount > savings.savingsProduct.withdrawalLimit) {
      return res.status(400).json({
        status: 'error',
        message: `Withdrawal exceeds the limit of ${savings.savingsProduct.withdrawalLimit}`,
      });
    }

    // Calculate withdrawal fee (if any)
    let withdrawalFee = 0;
    if (savings.savingsProduct.withdrawalFee) {
      withdrawalFee = savings.savingsProduct.withdrawalFee;
    }

    // Update savings balance
    const updatedSavings = await prisma.savings.update({
      where: { id: savingsId },
      data: {
        balance: {
          decrement: withdrawalAmount + withdrawalFee,
        },
      },
    });

    // Generate reference number
    const referenceNumber = `WTH-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create withdrawal transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionType: 'WITHDRAWAL',
        amount: withdrawalAmount,
        description: description || `Withdrawal from account ${savings.accountNumber}`,
        referenceNumber,
        userId: savings.userId,
        savingsId,
        status: 'COMPLETED',
        cooperativeId: savings.cooperativeId,
      },
    });

    // If there's a withdrawal fee, create a fee transaction
    if (withdrawalFee > 0) {
      const feeReferenceNumber = `FEE-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      await prisma.transaction.create({
        data: {
          transactionType: 'FEE',
          amount: withdrawalFee,
          description: `Withdrawal fee for account ${savings.accountNumber}`,
          referenceNumber: feeReferenceNumber,
          userId: savings.userId,
          savingsId,
          status: 'COMPLETED',
          cooperativeId: savings.cooperativeId,
        },
      });
    }

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: savings.userId,
        title: 'Withdrawal successful',
        message: `Your withdrawal of ${withdrawalAmount} from account ${savings.accountNumber} was successful. ${withdrawalFee > 0 ? `A fee of ${withdrawalFee} was charged. ` : ''}New balance: ${updatedSavings.balance}.`,
        notificationType: 'ACCOUNT_UPDATE',
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Withdrawal successful',
      data: {
        transaction,
        fee: withdrawalFee,
        newBalance: updatedSavings.balance,
      },
    });
  } catch (error) {
    console.error('Make withdrawal error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while processing the withdrawal',
    });
  }
};

// Get savings products
exports.getSavingsProducts = async (req, res) => {
  try {
    const savingsProducts = await prisma.savingsProduct.findMany({
      where: { isActive: true },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        savingsProducts,
      },
    });
  } catch (error) {
    console.error('Get savings products error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching savings products',
    });
  }
};

// Create savings product
exports.createSavingsProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      interestRate,
      minimumBalance,
      withdrawalLimit,
      withdrawalFee,
      cooperativeId,
    } = req.body;

    // Validate required fields
    if (!name || !interestRate || !minimumBalance) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    // Create savings product
    const savingsProduct = await prisma.savingsProduct.create({
      data: {
        name,
        description,
        interestRate: parseFloat(interestRate),
        minimumBalance: parseFloat(minimumBalance),
        withdrawalLimit: withdrawalLimit ? parseFloat(withdrawalLimit) : null,
        withdrawalFee: withdrawalFee ? parseFloat(withdrawalFee) : null,
        isActive: true,
        cooperativeId: cooperativeId ? parseInt(cooperativeId, 10) : null,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Savings product created successfully',
      data: {
        savingsProduct,
      },
    });
  } catch (error) {
    console.error('Create savings product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the savings product',
    });
  }
};

// Update savings product
exports.updateSavingsProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      interestRate,
      minimumBalance,
      withdrawalLimit,
      withdrawalFee,
      isActive,
    } = req.body;
    const savingsProductId = parseInt(id, 10);

    // Check if savings product exists
    const existingSavingsProduct = await prisma.savingsProduct.findUnique({
      where: { id: savingsProductId },
    });

    if (!existingSavingsProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings product not found',
      });
    }

    // Update savings product
    const updatedSavingsProduct = await prisma.savingsProduct.update({
      where: { id: savingsProductId },
      data: {
        name,
        description,
        interestRate: interestRate ? parseFloat(interestRate) : undefined,
        minimumBalance: minimumBalance ? parseFloat(minimumBalance) : undefined,
        withdrawalLimit: withdrawalLimit ? parseFloat(withdrawalLimit) : undefined,
        withdrawalFee: withdrawalFee ? parseFloat(withdrawalFee) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Savings product updated successfully',
      data: {
        savingsProduct: updatedSavingsProduct,
      },
    });
  } catch (error) {
    console.error('Update savings product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the savings product',
    });
  }
};

// Delete savings product
exports.deleteSavingsProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const savingsProductId = parseInt(id, 10);

    // Check if savings product exists
    const existingSavingsProduct = await prisma.savingsProduct.findUnique({
      where: { id: savingsProductId },
    });

    if (!existingSavingsProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Savings product not found',
      });
    }

    // Check if there are any savings accounts using this product
    const savingsUsingProduct = await prisma.savings.count({
      where: { savingsProductId },
    });

    if (savingsUsingProduct > 0) {
      // Instead of deleting, just mark as inactive
      await prisma.savingsProduct.update({
        where: { id: savingsProductId },
        data: { isActive: false },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Savings product marked as inactive because it is in use',
      });
    }

    // Delete savings product
    await prisma.savingsProduct.delete({
      where: { id: savingsProductId },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Savings product deleted successfully',
    });
  } catch (error) {
    console.error('Delete savings product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting the savings product',
    });
  }
};
