const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all loans
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
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
        loanProduct: true,
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        loans,
      },
    });
  } catch (error) {
    console.error('Get all loans error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching loans',
    });
  }
};

// Get loan by ID
exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;
    const loanId = parseInt(id, 10);

    const loan = await prisma.loan.findUnique({
      where: { id: loanId },
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
        loanProduct: true,
        payments: true,
        documents: true,
      },
    });

    if (!loan) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        loan,
      },
    });
  } catch (error) {
    console.error('Get loan by ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching the loan',
    });
  }
};

// Get loans by user ID
exports.getLoansByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const userIdInt = parseInt(userId, 10);

    const loans = await prisma.loan.findMany({
      where: { userId: userIdInt },
      include: {
        loanProduct: true,
        payments: true,
      },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        loans,
      },
    });
  } catch (error) {
    console.error('Get loans by user ID error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user loans',
    });
  }
};

// Create a new loan application
exports.createLoan = async (req, res) => {
  try {
    const {
      userId,
      loanProductId,
      amount,
      term,
      purpose,
      cooperativeId,
    } = req.body;

    // Validate required fields
    if (!userId || !loanProductId || !amount || !term) {
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

    // Check if loan product exists
    const loanProduct = await prisma.loanProduct.findUnique({
      where: { id: parseInt(loanProductId, 10) },
    });

    if (!loanProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan product not found',
      });
    }

    // Validate loan amount against product limits
    if (amount < loanProduct.minAmount || amount > loanProduct.maxAmount) {
      return res.status(400).json({
        status: 'error',
        message: `Loan amount must be between ${loanProduct.minAmount} and ${loanProduct.maxAmount}`,
      });
    }

    // Validate loan term against product limits
    if (term < loanProduct.minTerm || term > loanProduct.maxTerm) {
      return res.status(400).json({
        status: 'error',
        message: `Loan term must be between ${loanProduct.minTerm} and ${loanProduct.maxTerm} months`,
      });
    }

    // Generate unique loan number
    const loanNumber = `LOAN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create loan
    const loan = await prisma.loan.create({
      data: {
        loanNumber,
        userId: parseInt(userId, 10),
        loanProductId: parseInt(loanProductId, 10),
        amount: parseFloat(amount),
        interestRate: loanProduct.interestRate,
        term: parseInt(term, 10),
        purpose,
        status: 'PENDING',
        applicationDate: new Date(),
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
        loanProduct: true,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Loan application submitted successfully',
      data: {
        loan,
      },
    });
  } catch (error) {
    console.error('Create loan error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the loan application',
    });
  }
};

// Update loan status
exports.updateLoanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approvalDate, disbursementDate, maturityDate, notes } = req.body;
    const loanId = parseInt(id, 10);

    // Check if loan exists
    const existingLoan = await prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!existingLoan) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan not found',
      });
    }

    // Validate status
    const validStatuses = [
      'PENDING',
      'APPROVED',
      'REJECTED',
      'DISBURSED',
      'ACTIVE',
      'PAID',
      'DEFAULTED',
      'RESTRUCTURED',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid loan status',
      });
    }

    // Update loan
    const updatedLoan = await prisma.loan.update({
      where: { id: loanId },
      data: {
        status,
        approvalDate: status === 'APPROVED' ? approvalDate || new Date() : existingLoan.approvalDate,
        disbursementDate: status === 'DISBURSED' ? disbursementDate || new Date() : existingLoan.disbursementDate,
        maturityDate: maturityDate || existingLoan.maturityDate,
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
        loanProduct: true,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: existingLoan.userId,
        title: `Loan ${status.toLowerCase()}`,
        message: `Your loan application (${existingLoan.loanNumber}) has been ${status.toLowerCase()}${notes ? `: ${notes}` : '.'}`,
        notificationType: 'LOAN_STATUS',
      },
    });

    // If loan is disbursed, create a transaction
    if (status === 'DISBURSED') {
      // Generate reference number
      const referenceNumber = `DISB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create transaction
      await prisma.transaction.create({
        data: {
          transactionType: 'LOAN_DISBURSEMENT',
          amount: existingLoan.amount,
          description: `Loan disbursement for ${existingLoan.loanNumber}`,
          referenceNumber,
          userId: existingLoan.userId,
          status: 'COMPLETED',
          cooperativeId: existingLoan.cooperativeId,
        },
      });
    }

    return res.status(200).json({
      status: 'success',
      message: `Loan status updated to ${status}`,
      data: {
        loan: updatedLoan,
      },
    });
  } catch (error) {
    console.error('Update loan status error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the loan status',
    });
  }
};

// Add loan payment
exports.addLoanPayment = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { amount, paymentMethod, referenceNumber } = req.body;
    const loanIdInt = parseInt(loanId, 10);

    // Check if loan exists
    const loan = await prisma.loan.findUnique({
      where: { id: loanIdInt },
    });

    if (!loan) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan not found',
      });
    }

    // Validate payment method
    const validPaymentMethods = [
      'CASH',
      'BANK_TRANSFER',
      'MOBILE_MONEY',
      'DEDUCTION',
      'CHECK',
      'ONLINE_PAYMENT',
    ];

    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid payment method',
      });
    }

    // Create payment
    const payment = await prisma.payment.create({
      data: {
        loanId: loanIdInt,
        amount: parseFloat(amount),
        paymentDate: new Date(),
        paymentMethod,
        referenceNumber,
        status: 'COMPLETED',
      },
    });

    // Create transaction
    const transactionRefNumber = `LOAN-PMT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    await prisma.transaction.create({
      data: {
        transactionType: 'LOAN_PAYMENT',
        amount: parseFloat(amount),
        description: `Loan payment for ${loan.loanNumber}`,
        referenceNumber: transactionRefNumber,
        userId: loan.userId,
        status: 'COMPLETED',
        cooperativeId: loan.cooperativeId,
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: loan.userId,
        title: 'Payment received',
        message: `Your payment of ${amount} for loan ${loan.loanNumber} has been received.`,
        notificationType: 'PAYMENT_RECEIVED',
      },
    });

    // Check if loan is fully paid
    const totalPayments = await prisma.payment.aggregate({
      where: { loanId: loanIdInt },
      _sum: {
        amount: true,
      },
    });

    const totalPaid = totalPayments._sum.amount || 0;
    const totalDue = loan.amount + (loan.amount * loan.interestRate * loan.term / 12);

    // If loan is fully paid, update status
    if (totalPaid >= totalDue) {
      await prisma.loan.update({
        where: { id: loanIdInt },
        data: {
          status: 'PAID',
        },
      });

      // Create notification for the user
      await prisma.notification.create({
        data: {
          userId: loan.userId,
          title: 'Loan fully paid',
          message: `Congratulations! Your loan ${loan.loanNumber} has been fully paid.`,
          notificationType: 'LOAN_STATUS',
        },
      });
    }

    return res.status(201).json({
      status: 'success',
      message: 'Payment recorded successfully',
      data: {
        payment,
      },
    });
  } catch (error) {
    console.error('Add loan payment error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while recording the payment',
    });
  }
};

// Get loan products
exports.getLoanProducts = async (req, res) => {
  try {
    const loanProducts = await prisma.loanProduct.findMany({
      where: { isActive: true },
    });

    return res.status(200).json({
      status: 'success',
      data: {
        loanProducts,
      },
    });
  } catch (error) {
    console.error('Get loan products error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching loan products',
    });
  }
};

// Create loan product
exports.createLoanProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      minAmount,
      maxAmount,
      interestRate,
      minTerm,
      maxTerm,
      processingFee,
      requirements,
      cooperativeId,
    } = req.body;

    // Validate required fields
    if (!name || !minAmount || !maxAmount || !interestRate || !minTerm || !maxTerm) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide all required fields',
      });
    }

    // Create loan product
    const loanProduct = await prisma.loanProduct.create({
      data: {
        name,
        description,
        minAmount: parseFloat(minAmount),
        maxAmount: parseFloat(maxAmount),
        interestRate: parseFloat(interestRate),
        minTerm: parseInt(minTerm, 10),
        maxTerm: parseInt(maxTerm, 10),
        processingFee: processingFee ? parseFloat(processingFee) : null,
        requirements,
        isActive: true,
        cooperativeId: cooperativeId ? parseInt(cooperativeId, 10) : null,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Loan product created successfully',
      data: {
        loanProduct,
      },
    });
  } catch (error) {
    console.error('Create loan product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while creating the loan product',
    });
  }
};

// Update loan product
exports.updateLoanProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      minAmount,
      maxAmount,
      interestRate,
      minTerm,
      maxTerm,
      processingFee,
      requirements,
      isActive,
    } = req.body;
    const loanProductId = parseInt(id, 10);

    // Check if loan product exists
    const existingLoanProduct = await prisma.loanProduct.findUnique({
      where: { id: loanProductId },
    });

    if (!existingLoanProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan product not found',
      });
    }

    // Update loan product
    const updatedLoanProduct = await prisma.loanProduct.update({
      where: { id: loanProductId },
      data: {
        name,
        description,
        minAmount: minAmount ? parseFloat(minAmount) : undefined,
        maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
        interestRate: interestRate ? parseFloat(interestRate) : undefined,
        minTerm: minTerm ? parseInt(minTerm, 10) : undefined,
        maxTerm: maxTerm ? parseInt(maxTerm, 10) : undefined,
        processingFee: processingFee ? parseFloat(processingFee) : undefined,
        requirements,
        isActive: isActive !== undefined ? isActive : undefined,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Loan product updated successfully',
      data: {
        loanProduct: updatedLoanProduct,
      },
    });
  } catch (error) {
    console.error('Update loan product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating the loan product',
    });
  }
};

// Delete loan product
exports.deleteLoanProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const loanProductId = parseInt(id, 10);

    // Check if loan product exists
    const existingLoanProduct = await prisma.loanProduct.findUnique({
      where: { id: loanProductId },
    });

    if (!existingLoanProduct) {
      return res.status(404).json({
        status: 'error',
        message: 'Loan product not found',
      });
    }

    // Check if there are any loans using this product
    const loansUsingProduct = await prisma.loan.count({
      where: { loanProductId },
    });

    if (loansUsingProduct > 0) {
      // Instead of deleting, just mark as inactive
      await prisma.loanProduct.update({
        where: { id: loanProductId },
        data: { isActive: false },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Loan product marked as inactive because it is in use',
      });
    }

    // Delete loan product
    await prisma.loanProduct.delete({
      where: { id: loanProductId },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Loan product deleted successfully',
    });
  } catch (error) {
    console.error('Delete loan product error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting the loan product',
    });
  }
};
