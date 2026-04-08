const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

// Mock dependencies
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    $disconnect: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => 'salt'),
  hash: jest.fn(() => 'hashedPassword'),
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token'),
}));

// Import controller after mocking dependencies
const authController = require('../../src/controllers/auth.controller');

describe('Auth Controller', () => {
  let req;
  let res;
  let prisma;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request and response objects
    req = {
      body: {},
      user: {},
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };

    // Get prisma instance
    prisma = new PrismaClient();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Setup
      req.body = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'MEMBER',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        role: 'MEMBER',
        status: 'ACTIVE',
        memberId: 'MEM123456',
        memberSince: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Execute
      await authController.register(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('Password123!', 'salt');
      expect(prisma.user.create).toHaveBeenCalled();
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'User registered successfully',
          data: expect.objectContaining({
            user: expect.any(Object),
            token: 'token',
          }),
        })
      );
    });

    it('should return error if user already exists', async () => {
      // Setup
      req.body = {
        email: 'existing@example.com',
        password: 'Password123!',
        firstName: 'Existing',
        lastName: 'User',
        role: 'MEMBER',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'existing@example.com',
      });

      // Execute
      await authController.register(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'existing@example.com' },
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'User with this email already exists',
        })
      );
    });
  });

  describe('login', () => {
    it('should login user successfully with correct credentials', async () => {
      // Setup
      req.body = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        role: 'MEMBER',
      });

      bcrypt.compare.mockResolvedValue(true);

      // Execute
      await authController.login(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('Password123!', 'hashedPassword');
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Login successful',
          data: expect.objectContaining({
            user: expect.any(Object),
            token: 'token',
          }),
        })
      );
    });

    it('should return error with incorrect password', async () => {
      // Setup
      req.body = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      bcrypt.compare.mockResolvedValue(false);

      // Execute
      await authController.login(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('WrongPassword', 'hashedPassword');
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Invalid credentials',
        })
      );
    });

    it('should return error if user does not exist', async () => {
      // Setup
      req.body = {
        email: 'nonexistent@example.com',
        password: 'Password123!',
      };

      prisma.user.findUnique.mockResolvedValue(null);

      // Execute
      await authController.login(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Invalid credentials',
        })
      );
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user data', async () => {
      // Setup
      req.user = {
        id: 1,
      };

      prisma.user.findUnique.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        role: 'MEMBER',
      });

      // Execute
      await authController.getCurrentUser(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: expect.objectContaining({
            user: expect.objectContaining({
              id: 1,
              email: 'test@example.com',
              firstName: 'Test',
              lastName: 'User',
              role: 'MEMBER',
            }),
          }),
        })
      );
    });

    it('should return error if user is not authenticated', async () => {
      // Setup
      req.user = null;

      // Execute
      await authController.getCurrentUser(req, res);

      // Assert
      expect(prisma.user.findUnique).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'Not authenticated',
        })
      );
    });

    it('should return error if user not found', async () => {
      // Setup
      req.user = {
        id: 999,
      };

      prisma.user.findUnique.mockResolvedValue(null);

      // Execute
      await authController.getCurrentUser(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: 'User not found',
        })
      );
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      // Execute
      await authController.logout(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          message: 'Logged out successfully',
        })
      );
    });
  });
});
