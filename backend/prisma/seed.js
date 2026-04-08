const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create default cooperative
  const cooperative = await prisma.cooperative.upsert({
    where: { code: 'DEFAULT' },
    update: {},
    create: {
      name: 'Credit Cooperative System',
      code: 'DEFAULT',
      profileType: 'PRIMARY',
      registrationNo: 'CDA-REG-0001',
      registrationDate: new Date('2020-01-01'),
      hasCTE: true,
      logo: 'https://example.com/logo.png',
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
      address: '123 Main St, City, Country',
      phoneNumber: '+1234567890',
      email: 'info@creditcoop.com',
      website: 'https://creditcoop.com',
    },
  });

  console.log('Created default cooperative:', cooperative.name);

  await prisma.cooperative.upsert({
    where: { code: 'ELECTRIC-COOP' },
    update: {},
    create: {
      name: 'Electric Cooperative',
      code: 'ELECTRIC-COOP',
      profileType: 'ELECTRIC_COOPERATIVE',
      registrationNo: 'CDA-REG-0002',
      registrationDate: new Date('2018-06-01'),
      hasCTE: false,
      address: '456 Power Ave, City, Country',
      email: 'ecoop@example.com',
    },
  });

  await prisma.cooperative.upsert({
    where: { code: 'NEWLY-REG' },
    update: {},
    create: {
      name: 'Newly Registered Cooperative',
      code: 'NEWLY-REG',
      profileType: 'NEWLY_REGISTERED',
      registrationNo: 'CDA-REG-0003',
      registrationDate: new Date('2024-07-01'),
      hasCTE: false,
      address: '789 New St, City, Country',
      email: 'newcoop@example.com',
    },
  });

  const profiles = [
    {
      name: 'base_annual',
      description: 'Base annual CAPR attachments',
      expression: { op: 'exists', field: 'profileType' },
      modules: [
        'OFFICERS_TRAINING',
        'SOCIAL_AUDIT',
        'PERFORMANCE_AUDIT',
        'SEMI_ANNUAL_MEDIATION',
        'SWORN_STATEMENT',
      ],
    },
    {
      name: 'afs_standard',
      description: 'AFS required if not newly registered',
      expression: { op: 'not', arg: { op: 'eq', field: 'profileType', value: 'NEWLY_REGISTERED' } },
      modules: ['AFS'],
    },
    {
      name: 'newly_registered',
      description: 'Financial status report for newly registered',
      expression: { op: 'eq', field: 'profileType', value: 'NEWLY_REGISTERED' },
      modules: ['FINANCIAL_STATUS_REPORT'],
    },
    {
      name: 'cte_addons',
      description: 'ATIR and ABR required if cooperative has CTE',
      expression: { op: 'eq', field: 'hasCTE', value: true },
      modules: ['ATIR', 'ABR'],
    },
    {
      name: 'electric_addon',
      description: 'MCO list required for electric cooperatives',
      expression: { op: 'eq', field: 'profileType', value: 'ELECTRIC_COOPERATIVE' },
      modules: ['MCO_LIST'],
    },
  ];

  for (const profile of profiles) {
    const existing = await prisma.complianceRequirementProfile.findFirst({
      where: { name: profile.name },
    });
    if (existing) continue;

    const created = await prisma.complianceRequirementProfile.create({
      data: {
        name: profile.name,
        description: profile.description,
        expression: profile.expression,
        modules: {
          create: profile.modules.map((m) => ({ moduleType: m })),
        },
      },
    });
    console.log('Created compliance profile:', created.name);
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      phoneNumber: '+1234567890',
      address: '123 Admin St, City, Country',
      memberId: 'MEM100001',
      memberSince: new Date(),
      cooperativeId: cooperative.id,
    },
  });

  console.log('Created admin user:', admin.email);

  // Create other user roles
  const roles = [
    {
      email: 'manager@example.com',
      firstName: 'Manager',
      lastName: 'User',
      role: 'MANAGER',
      memberId: 'MEM100002',
    },
    {
      email: 'board@example.com',
      firstName: 'Board',
      lastName: 'Member',
      role: 'BOARD_MEMBER',
      memberId: 'MEM100003',
    },
    {
      email: 'credit@example.com',
      firstName: 'Credit',
      lastName: 'Officer',
      role: 'CREDIT_OFFICER',
      memberId: 'MEM100004',
    },
    {
      email: 'accountant@example.com',
      firstName: 'Accountant',
      lastName: 'User',
      role: 'ACCOUNTANT',
      memberId: 'MEM100005',
    },
    {
      email: 'teller@example.com',
      firstName: 'Teller',
      lastName: 'User',
      role: 'TELLER',
      memberId: 'MEM100006',
    },
    {
      email: 'compliance@example.com',
      firstName: 'Compliance',
      lastName: 'Officer',
      role: 'COMPLIANCE_OFFICER',
      memberId: 'MEM100007',
    },
    {
      email: 'member@example.com',
      firstName: 'Regular',
      lastName: 'Member',
      role: 'MEMBER',
      memberId: 'MEM100008',
    },
  ];

  for (const roleData of roles) {
    const user = await prisma.user.upsert({
      where: { email: roleData.email },
      update: {},
      create: {
        email: roleData.email,
        password: hashedPassword,
        firstName: roleData.firstName,
        lastName: roleData.lastName,
        role: roleData.role,
        status: 'ACTIVE',
        phoneNumber: '+1234567890',
        address: `123 ${roleData.role} St, City, Country`,
        memberId: roleData.memberId,
        memberSince: new Date(),
        cooperativeId: cooperative.id,
      },
    });

    console.log(`Created ${roleData.role} user:`, user.email);
  }

  // Create loan products
  const loanProducts = [
    {
      name: 'Personal Loan',
      description: 'Short-term personal loan for various needs',
      minAmount: 1000,
      maxAmount: 50000,
      interestRate: 0.12, // 12%
      minTerm: 6, // 6 months
      maxTerm: 36, // 3 years
      processingFee: 500,
      requirements: 'Valid ID, Proof of Income, Proof of Address',
    },
    {
      name: 'Business Loan',
      description: 'Loan for small business owners',
      minAmount: 10000,
      maxAmount: 500000,
      interestRate: 0.15, // 15%
      minTerm: 12, // 1 year
      maxTerm: 60, // 5 years
      processingFee: 1000,
      requirements: 'Business Registration, Financial Statements, Business Plan',
    },
    {
      name: 'Emergency Loan',
      description: 'Quick loan for emergencies',
      minAmount: 500,
      maxAmount: 10000,
      interestRate: 0.10, // 10%
      minTerm: 3, // 3 months
      maxTerm: 12, // 1 year
      processingFee: 200,
      requirements: 'Valid ID, Membership for at least 3 months',
    },
  ];

  for (const productData of loanProducts) {
    const loanProduct = await prisma.loanProduct.upsert({
      where: { 
        name_cooperativeId: {
          name: productData.name,
          cooperativeId: cooperative.id,
        }
      },
      update: {},
      create: {
        ...productData,
        isActive: true,
        cooperativeId: cooperative.id,
      },
    });

    console.log('Created loan product:', loanProduct.name);
  }

  // Create savings products
  const savingsProducts = [
    {
      name: 'Regular Savings',
      description: 'Basic savings account with minimal restrictions',
      interestRate: 0.03, // 3%
      minimumBalance: 500,
      withdrawalLimit: null,
      withdrawalFee: null,
    },
    {
      name: 'Fixed Deposit',
      description: 'Higher interest rate with fixed term',
      interestRate: 0.06, // 6%
      minimumBalance: 10000,
      withdrawalLimit: null,
      withdrawalFee: 500,
    },
    {
      name: 'Education Savings',
      description: 'Savings account for educational purposes',
      interestRate: 0.04, // 4%
      minimumBalance: 1000,
      withdrawalLimit: 50000,
      withdrawalFee: null,
    },
  ];

  for (const productData of savingsProducts) {
    const savingsProduct = await prisma.savingsProduct.upsert({
      where: { 
        name_cooperativeId: {
          name: productData.name,
          cooperativeId: cooperative.id,
        }
      },
      update: {},
      create: {
        ...productData,
        isActive: true,
        cooperativeId: cooperative.id,
      },
    });

    console.log('Created savings product:', savingsProduct.name);
  }

  // Create sample savings account for member
  const member = await prisma.user.findUnique({
    where: { email: 'member@example.com' },
  });

  const regularSavings = await prisma.savingsProduct.findFirst({
    where: { 
      name: 'Regular Savings',
      cooperativeId: cooperative.id,
    },
  });

  if (member && regularSavings) {
    const savings = await prisma.savings.upsert({
      where: { accountNumber: 'SA-SAMPLE-1001' },
      update: {},
      create: {
        accountNumber: 'SA-SAMPLE-1001',
        userId: member.id,
        savingsProductId: regularSavings.id,
        balance: 5000,
        savingsType: 'REGULAR',
        status: 'ACTIVE',
        cooperativeId: cooperative.id,
      },
    });

    console.log('Created sample savings account:', savings.accountNumber);

    // Create sample transactions
    const transactions = [
      {
        transactionType: 'DEPOSIT',
        amount: 2000,
        description: 'Initial deposit',
        referenceNumber: 'DEP-SAMPLE-1001',
        userId: member.id,
        savingsId: savings.id,
        status: 'COMPLETED',
        cooperativeId: cooperative.id,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
      {
        transactionType: 'DEPOSIT',
        amount: 3000,
        description: 'Monthly savings',
        referenceNumber: 'DEP-SAMPLE-1002',
        userId: member.id,
        savingsId: savings.id,
        status: 'COMPLETED',
        cooperativeId: cooperative.id,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      },
      {
        transactionType: 'WITHDRAWAL',
        amount: 500,
        description: 'ATM withdrawal',
        referenceNumber: 'WTH-SAMPLE-1001',
        userId: member.id,
        savingsId: savings.id,
        status: 'COMPLETED',
        cooperativeId: cooperative.id,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
      {
        transactionType: 'INTEREST_EARNED',
        amount: 37.5,
        description: 'Monthly interest',
        referenceNumber: 'INT-SAMPLE-1001',
        userId: member.id,
        savingsId: savings.id,
        status: 'COMPLETED',
        cooperativeId: cooperative.id,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    for (const txnData of transactions) {
      const transaction = await prisma.transaction.create({
        data: txnData,
      });

      console.log('Created sample transaction:', transaction.referenceNumber);
    }
  }

  // Create sample loan for member
  const personalLoan = await prisma.loanProduct.findFirst({
    where: { 
      name: 'Personal Loan',
      cooperativeId: cooperative.id,
    },
  });

  if (member && personalLoan) {
    const loan = await prisma.loan.upsert({
      where: { loanNumber: 'LOAN-SAMPLE-1001' },
      update: {},
      create: {
        loanNumber: 'LOAN-SAMPLE-1001',
        userId: member.id,
        loanProductId: personalLoan.id,
        amount: 20000,
        interestRate: personalLoan.interestRate,
        term: 24, // 2 years
        status: 'ACTIVE',
        purpose: 'Home renovation',
        applicationDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
        approvalDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000), // 55 days ago
        disbursementDate: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), // 50 days ago
        maturityDate: new Date(Date.now() + 670 * 24 * 60 * 60 * 1000), // ~22 months from now
        cooperativeId: cooperative.id,
      },
    });

    console.log('Created sample loan:', loan.loanNumber);

    // Create sample loan payments
    const payments = [
      {
        loanId: loan.id,
        amount: 1000,
        paymentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        paymentMethod: 'BANK_TRANSFER',
        referenceNumber: 'PMT-SAMPLE-1001',
        status: 'COMPLETED',
      },
      {
        loanId: loan.id,
        amount: 1000,
        paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        paymentMethod: 'CASH',
        referenceNumber: 'PMT-SAMPLE-1002',
        status: 'COMPLETED',
      },
    ];

    for (const pmtData of payments) {
      const payment = await prisma.payment.create({
        data: pmtData,
      });

      console.log('Created sample payment:', payment.referenceNumber);

      // Create transaction for the payment
      await prisma.transaction.create({
        data: {
          transactionType: 'LOAN_PAYMENT',
          amount: pmtData.amount,
          description: `Loan payment for ${loan.loanNumber}`,
          referenceNumber: `LOAN-PMT-${pmtData.referenceNumber}`,
          userId: member.id,
          status: 'COMPLETED',
          cooperativeId: cooperative.id,
          createdAt: pmtData.paymentDate,
        },
      });
    }
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
