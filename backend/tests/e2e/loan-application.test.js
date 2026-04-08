const request = require('supertest');
const app = require('../../src/server');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

describe('Loan Application E2E Flow', () => {
  // Test users
  const memberUser = {
    email: 'e2e-member@example.com',
    password: 'MemberTest123!',
    firstName: 'E2E',
    lastName: 'Member',
    role: 'MEMBER',
  };

  const creditOfficerUser = {
    email: 'e2e-officer@example.com',
    password: 'OfficerTest123!',
    firstName: 'E2E',
    lastName: 'Officer',
    role: 'CREDIT_OFFICER',
  };

  // Auth tokens
  let memberToken;
  let officerToken;
  let memberId;
  let loanProductId;
  let loanId;

  // Setup: Create test users and loan product before tests
  beforeAll(async () => {
    // Clean up any existing test data
    await prisma.payment.deleteMany({
      where: {
        loan: {
          user: {
            email: {
              in: [memberUser.email, creditOfficerUser.email],
            },
          },
        },
      },
    });
    
    await prisma.loan.deleteMany({
      where: {
        user: {
          email: {
            in: [memberUser.email, creditOfficerUser.email],
          },
        },
      },
    });
    
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [memberUser.email, creditOfficerUser.email],
        },
      },
    });

    // Create member user
    const hashedMemberPassword = await bcrypt.hash(memberUser.password, 10);
    const createdMember = await prisma.user.create({
      data: {
        email: memberUser.email,
        password: hashedMemberPassword,
        firstName: memberUser.firstName,
        lastName: memberUser.lastName,
        role: memberUser.role,
        status: 'ACTIVE',
        memberId: `MEM-E2E-${Date.now()}`,
        memberSince: new Date(),
      },
    });
    memberId = createdMember.id;

    // Create credit officer user
    const hashedOfficerPassword = await bcrypt.hash(creditOfficerUser.password, 10);
    await prisma.user.create({
      data: {
        email: creditOfficerUser.email,
        password: hashedOfficerPassword,
        firstName: creditOfficerUser.firstName,
        lastName: creditOfficerUser.lastName,
        role: creditOfficerUser.role,
        status: 'ACTIVE',
        memberId: `OFF-E2E-${Date.now()}`,
        memberSince: new Date(),
      },
    });

    // Create test loan product
    const loanProduct = await prisma.loanProduct.create({
      data: {
        name: 'E2E Test Loan',
        description: 'Loan product for E2E testing',
        minAmount: 1000,
        maxAmount: 10000,
        interestRate: 0.1, // 10%
        minTerm: 6, // 6 months
        maxTerm: 24, // 2 years
        processingFee: 100,
        requirements: 'For E2E testing only',
        isActive: true,
      },
    });
    loanProductId = loanProduct.id;

    // Login as member
    const memberLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: memberUser.email,
        password: memberUser.password,
      });
    memberToken = memberLoginResponse.body.data.token;

    // Login as credit officer
    const officerLoginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: creditOfficerUser.email,
        password: creditOfficerUser.password,
      });
    officerToken = officerLoginResponse.body.data.token;
  });

  // Cleanup: Remove test data after tests
  afterAll(async () => {
    await prisma.payment.deleteMany({
      where: {
        loan: {
          user: {
            email: {
              in: [memberUser.email, creditOfficerUser.email],
            },
          },
        },
      },
    });
    
    await prisma.loan.deleteMany({
      where: {
        user: {
          email: {
            in: [memberUser.email, creditOfficerUser.email],
          },
        },
      },
    });
    
    await prisma.loanProduct.deleteMany({
      where: {
        name: 'E2E Test Loan',
      },
    });
    
    await prisma.user.deleteMany({
      where: {
        email: {
          in: [memberUser.email, creditOfficerUser.email],
        },
      },
    });
    
    await prisma.$disconnect();
  });

  // Test the complete loan application flow
  it('should complete the full loan application process', async () => {
    // Step 1: Member views available loan products
    const getProductsResponse = await request(app)
      .get('/api/loans/products')
      .set('Authorization', `Bearer ${memberToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getProductsResponse.body.status).toBe('success');
    expect(getProductsResponse.body.data.loanProducts).toBeDefined();
    expect(getProductsResponse.body.data.loanProducts.length).toBeGreaterThan(0);
    expect(getProductsResponse.body.data.loanProducts.some(p => p.id === loanProductId)).toBe(true);

    // Step 2: Member submits loan application
    const loanApplication = {
      userId: memberId,
      loanProductId: loanProductId,
      amount: 5000,
      term: 12, // 1 year
      purpose: 'E2E Test Loan Application',
    };

    const applyLoanResponse = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${memberToken}`)
      .send(loanApplication)
      .expect('Content-Type', /json/)
      .expect(201);

    expect(applyLoanResponse.body.status).toBe('success');
    expect(applyLoanResponse.body.message).toContain('Loan application submitted successfully');
    expect(applyLoanResponse.body.data.loan).toBeDefined();
    expect(applyLoanResponse.body.data.loan.status).toBe('PENDING');
    
    loanId = applyLoanResponse.body.data.loan.id;

    // Step 3: Credit officer views pending loan applications
    const getLoansResponse = await request(app)
      .get('/api/loans')
      .set('Authorization', `Bearer ${officerToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getLoansResponse.body.status).toBe('success');
    expect(getLoansResponse.body.data.loans).toBeDefined();
    expect(getLoansResponse.body.data.loans.some(loan => loan.id === loanId)).toBe(true);

    // Step 4: Credit officer views the specific loan application
    const getLoanResponse = await request(app)
      .get(`/api/loans/${loanId}`)
      .set('Authorization', `Bearer ${officerToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getLoanResponse.body.status).toBe('success');
    expect(getLoanResponse.body.data.loan).toBeDefined();
    expect(getLoanResponse.body.data.loan.id).toBe(loanId);
    expect(getLoanResponse.body.data.loan.status).toBe('PENDING');

    // Step 5: Credit officer approves the loan
    const approveLoanResponse = await request(app)
      .put(`/api/loans/${loanId}/status`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({
        status: 'APPROVED',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(approveLoanResponse.body.status).toBe('success');
    expect(approveLoanResponse.body.message).toContain('Loan status updated to APPROVED');
    expect(approveLoanResponse.body.data.loan.status).toBe('APPROVED');

    // Step 6: Credit officer disburses the loan
    const disburseLoanResponse = await request(app)
      .put(`/api/loans/${loanId}/status`)
      .set('Authorization', `Bearer ${officerToken}`)
      .send({
        status: 'DISBURSED',
      })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(disburseLoanResponse.body.status).toBe('success');
    expect(disburseLoanResponse.body.message).toContain('Loan status updated to DISBURSED');
    expect(disburseLoanResponse.body.data.loan.status).toBe('DISBURSED');

    // Step 7: Member views their active loans
    const getMemberLoansResponse = await request(app)
      .get(`/api/loans/user/${memberId}`)
      .set('Authorization', `Bearer ${memberToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getMemberLoansResponse.body.status).toBe('success');
    expect(getMemberLoansResponse.body.data.loans).toBeDefined();
    expect(getMemberLoansResponse.body.data.loans.some(loan => loan.id === loanId)).toBe(true);
    expect(getMemberLoansResponse.body.data.loans.find(loan => loan.id === loanId).status).toBe('DISBURSED');

    // Step 8: Member makes a loan payment
    const makePaymentResponse = await request(app)
      .post(`/api/loans/${loanId}/payments`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({
        amount: 500,
        paymentMethod: 'BANK_TRANSFER',
        referenceNumber: `E2E-PMT-${Date.now()}`,
      })
      .expect('Content-Type', /json/)
      .expect(201);

    expect(makePaymentResponse.body.status).toBe('success');
    expect(makePaymentResponse.body.message).toContain('Payment recorded successfully');
    expect(makePaymentResponse.body.data.payment).toBeDefined();
    expect(makePaymentResponse.body.data.payment.amount).toBe(500);

    // Step 9: Credit officer views the loan with payments
    const getLoanWithPaymentsResponse = await request(app)
      .get(`/api/loans/${loanId}`)
      .set('Authorization', `Bearer ${officerToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(getLoanWithPaymentsResponse.body.status).toBe('success');
    expect(getLoanWithPaymentsResponse.body.data.loan).toBeDefined();
    expect(getLoanWithPaymentsResponse.body.data.loan.payments).toBeDefined();
    expect(getLoanWithPaymentsResponse.body.data.loan.payments.length).toBeGreaterThan(0);
    expect(getLoanWithPaymentsResponse.body.data.loan.payments[0].amount).toBe(500);
  });
});
