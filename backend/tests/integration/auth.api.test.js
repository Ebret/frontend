const request = require('supertest');
const app = require('../../src/server');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

describe('Auth API Endpoints', () => {
  // Test user data
  const testUser = {
    email: 'integration-test@example.com',
    password: 'TestPassword123!',
    firstName: 'Integration',
    lastName: 'Test',
    role: 'MEMBER',
  };

  let authToken;

  // Setup: Create test user before tests
  beforeAll(async () => {
    // Clean up any existing test user
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });

    // Create test user for login tests
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await prisma.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        role: testUser.role,
        status: 'ACTIVE',
        memberId: `MEM-TEST-${Date.now()}`,
        memberSince: new Date(),
      },
    });
  });

  // Cleanup: Remove test user after tests
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: testUser.email,
      },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        email: `register-test-${Date.now()}@example.com`,
        password: 'RegisterTest123!',
        firstName: 'Register',
        lastName: 'Test',
        role: 'MEMBER',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.token).toBeDefined();

      // Clean up the created user
      await prisma.user.deleteMany({
        where: {
          email: newUser.email,
        },
      });
    });

    it('should return error for missing required fields', async () => {
      const incompleteUser = {
        email: 'incomplete@example.com',
        // Missing password and other required fields
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Please provide all required fields');
    });

    it('should return error for weak password', async () => {
      const userWithWeakPassword = {
        email: 'weak-password@example.com',
        password: 'weak', // Too short, no uppercase, no number, no special char
        firstName: 'Weak',
        lastName: 'Password',
        role: 'MEMBER',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userWithWeakPassword)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Password must be');
    });

    it('should return error for existing email', async () => {
      // Try to register with the same email as testUser
      const duplicateUser = {
        email: testUser.email, // Already exists
        password: 'DuplicateTest123!',
        firstName: 'Duplicate',
        lastName: 'Test',
        role: 'MEMBER',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateUser)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('User with this email already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.token).toBeDefined();

      // Save token for protected route tests
      authToken = response.body.data.token;
    });

    it('should return error with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Invalid credentials');
    });

    it('should return error with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Password123!',
        })
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user data with valid token', async () => {
      // Skip if no auth token (login test failed)
      if (!authToken) {
        console.warn('Skipping test: No auth token available');
        return;
      }

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.firstName).toBe(testUser.firstName);
      expect(response.body.data.user.lastName).toBe(testUser.lastName);
      expect(response.body.data.user.role).toBe(testUser.role);
      // Password should not be included in response
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Authentication required');
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect('Content-Type', /json/)
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.message).toContain('Invalid token');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      // Skip if no auth token (login test failed)
      if (!authToken) {
        console.warn('Skipping test: No auth token available');
        return;
      }

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Logged out successfully');
    });
  });
});
