const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding test database...');

  // Create test cooperative
  const cooperative = await prisma.cooperative.upsert({
    where: { code: 'TEST_COOP' },
    update: {},
    create: {
      name: 'Test Cooperative',
      code: 'TEST_COOP',
      description: 'Test cooperative for testing purposes',
      status: 'ACTIVE',
      address: '123 Test Street',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      country: 'Test Country',
      phone: '123-456-7890',
      email: 'test@testcoop.com',
      website: 'https://testcoop.com',
      logo: 'test-logo.png',
      primaryColor: '#007bff',
      secondaryColor: '#6c757d',
    },
  });

  console.log('Created test cooperative:', cooperative.name);

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
      cooperativeId: cooperative.id,
      memberId: 'ADMIN001',
    },
  });

  console.log('Created admin user:', adminUser.email);

  // Regular member
  const memberUser = await prisma.user.upsert({
    where: { email: 'member@test.com' },
    update: {},
    create: {
      email: 'member@test.com',
      password: hashedPassword,
      firstName: 'Member',
      lastName: 'User',
      role: 'MEMBER',
      status: 'ACTIVE',
      cooperativeId: cooperative.id,
      memberId: 'MEM001',
    },
  });

  console.log('Created member user:', memberUser.email);

  // Create test Damayan fund
  const damayanFund = await prisma.damayanFund.upsert({
    where: { name_cooperativeId: { name: 'Test Damayan Fund', cooperativeId: cooperative.id } },
    update: {},
    create: {
      name: 'Test Damayan Fund',
      description: 'Test Damayan fund for testing purposes',
      status: 'ACTIVE',
      cooperativeId: cooperative.id,
      createdById: adminUser.id,
    },
  });

  console.log('Created test Damayan fund:', damayanFund.name);

  // Create test contributions
  const contributions = [];
  for (let i = 1; i <= 5; i++) {
    const contribution = await prisma.damayanContribution.create({
      data: {
        userId: memberUser.id,
        damayanFundId: damayanFund.id,
        amount: i * 100,
        contributionType: i % 2 === 0 ? 'MANUAL' : 'AUTOMATIC',
        contributionDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // i days ago
      },
    });
    contributions.push(contribution);
  }

  console.log(`Created ${contributions.length} test contributions`);

  // Create test assistance request
  const assistanceRequest = await prisma.damayanAssistance.create({
    data: {
      userId: memberUser.id,
      damayanFundId: damayanFund.id,
      amount: 500,
      reason: 'Test assistance request',
      status: 'PENDING',
      requestDate: new Date(),
    },
  });

  console.log('Created test assistance request:', assistanceRequest.id);

  // Create test user settings
  const userSettings = await prisma.userDamayanSettings.upsert({
    where: { userId: memberUser.id },
    update: {},
    create: {
      userId: memberUser.id,
      autoContribute: true,
      contributionType: 'FIXED',
      contributionAmount: 50,
      contributionPercentage: null,
      monthlyContribution: true,
      monthlyAmount: 200,
      monthlyDay: 15,
      notificationsEnabled: true,
    },
  });

  console.log('Created test user settings for user:', memberUser.email);

  // Create test notifications
  const notifications = [];
  for (let i = 1; i <= 3; i++) {
    const notification = await prisma.notification.create({
      data: {
        userId: memberUser.id,
        title: `Test Notification ${i}`,
        message: `This is test notification ${i}`,
        notificationType: 'DAMAYAN_REQUEST',
        isRead: false,
        metadata: {
          fundId: damayanFund.id,
          fundName: damayanFund.name,
        },
      },
    });
    notifications.push(notification);
  }

  console.log(`Created ${notifications.length} test notifications`);

  console.log('Test database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding test database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
