import { api } from '../api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { UserRole } from '../roles';

// Mock API URL
const API_URL = 'http://localhost:3001/api';

// Setup MSW server
const server = setupServer(
  // Mock login endpoint
  rest.post(`${API_URL}/auth/login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: 'Login successful',
        data: {
          token: 'mock-token',
          user: {
            id: 1,
            email: 'user@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: UserRole.ADMIN,
          },
        },
      })
    );
  }),

  // Mock register endpoint
  rest.post(`${API_URL}/auth/register`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: 'Registration successful',
        data: {
          user: {
            id: 2,
            email: 'new@example.com',
            firstName: 'New',
            lastName: 'User',
            role: UserRole.MEMBER,
          },
        },
      })
    );
  }),

  // Mock get users endpoint
  rest.get(`${API_URL}/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: 'Users retrieved successfully',
        data: {
          users: [
            {
              id: 1,
              email: 'user@example.com',
              firstName: 'Test',
              lastName: 'User',
              role: UserRole.ADMIN,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
            },
            {
              id: 2,
              email: 'member@example.com',
              firstName: 'Member',
              lastName: 'User',
              role: UserRole.MEMBER,
              status: 'ACTIVE',
              createdAt: new Date().toISOString(),
            },
          ],
        },
      })
    );
  }),

  // Mock get user by ID endpoint
  rest.get(`${API_URL}/users/:id`, (req, res, ctx) => {
    const { id } = req.params;
    
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: 'User retrieved successfully',
        data: {
          user: {
            id: Number(id),
            email: 'user@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: UserRole.ADMIN,
            status: 'ACTIVE',
            createdAt: new Date().toISOString(),
          },
        },
      })
    );
  }),

  // Mock create user endpoint
  rest.post(`${API_URL}/users`, (req, res, ctx) => {
    const { email, firstName, lastName, role } = req.body as any;
    
    return res(
      ctx.status(201),
      ctx.json({
        status: 'success',
        message: 'User created successfully',
        data: {
          user: {
            id: 3,
            email,
            firstName,
            lastName,
            role,
            status: 'PENDING_VERIFICATION',
            createdAt: new Date().toISOString(),
          },
        },
      })
    );
  }),

  // Mock import users endpoint
  rest.post(`${API_URL}/users/import`, (req, res, ctx) => {
    const { users } = req.body as any;
    
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: `Successfully imported ${users.length} users`,
        data: {
          importedCount: users.length,
          successCount: users.length,
          failureCount: 0,
          users: users.map((user: any, index: number) => ({
            id: 100 + index,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: 'PENDING_VERIFICATION',
            createdAt: new Date().toISOString(),
          })),
        },
      })
    );
  }),

  // Mock create audit log endpoint
  rest.post(`${API_URL}/audit-logs`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        status: 'success',
        message: 'Audit log created successfully',
        data: {
          id: 1,
          ...req.body,
        },
      })
    );
  }),

  // Mock get audit logs endpoint
  rest.get(`${API_URL}/audit-logs`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
        message: 'Audit logs retrieved successfully',
        data: {
          logs: [
            {
              id: 1,
              actionType: 'USER_CREATED',
              performedBy: {
                id: 1,
                email: 'admin@example.com',
                name: 'Admin User',
              },
              timestamp: new Date().toISOString(),
              targetUser: {
                id: 2,
                email: 'user@example.com',
                name: 'Test User',
              },
              details: {
                creationMethod: 'manual',
                userRole: UserRole.MEMBER,
              },
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 1,
            totalPages: 1,
          },
        },
      })
    );
  })
);

// Setup and teardown
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock localStorage for token
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock token
beforeEach(() => {
  localStorageMock.setItem('token', 'mock-token');
});

describe('API Integration Tests', () => {
  describe('Authentication', () => {
    it('logs in a user successfully', async () => {
      const response = await api.login({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(response.status).toBe('success');
      expect(response.data.token).toBe('mock-token');
      expect(response.data.user.email).toBe('user@example.com');
    });

    it('registers a new user successfully', async () => {
      const response = await api.register({
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
      });

      expect(response.status).toBe('success');
      expect(response.data.user.email).toBe('new@example.com');
    });
  });

  describe('User Management', () => {
    it('gets all users successfully', async () => {
      const response = await api.getUsers();

      expect(response.status).toBe('success');
      expect(response.data.users).toHaveLength(2);
      expect(response.data.users[0].email).toBe('user@example.com');
    });

    it('gets a user by ID successfully', async () => {
      const response = await api.getUserById(1);

      expect(response.status).toBe('success');
      expect(response.data.user.id).toBe(1);
      expect(response.data.user.email).toBe('user@example.com');
    });

    it('creates a user successfully', async () => {
      const userData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: UserRole.MEMBER,
      };

      const response = await api.createUser(userData);

      expect(response.status).toBe('success');
      expect(response.data.user.email).toBe('new@example.com');
      expect(response.data.user.role).toBe(UserRole.MEMBER);
    });

    it('imports users successfully', async () => {
      const users = [
        {
          email: 'user1@example.com',
          firstName: 'User',
          lastName: 'One',
          role: UserRole.MEMBER,
        },
        {
          email: 'user2@example.com',
          firstName: 'User',
          lastName: 'Two',
          role: UserRole.MEMBER,
        },
      ];

      const response = await api.importUsers(users);

      expect(response.status).toBe('success');
      expect(response.data.importedCount).toBe(2);
      expect(response.data.users).toHaveLength(2);
      expect(response.data.users[0].email).toBe('user1@example.com');
    });
  });

  describe('Audit Logging', () => {
    it('creates an audit log successfully', async () => {
      const logEntry = {
        actionType: 'USER_CREATED',
        performedBy: {
          id: 1,
          email: 'admin@example.com',
          name: 'Admin User',
        },
        timestamp: new Date().toISOString(),
        targetUser: {
          id: 2,
          email: 'user@example.com',
          name: 'Test User',
        },
        details: {
          creationMethod: 'manual',
          userRole: UserRole.MEMBER,
        },
      };

      const response = await api.createAuditLog(logEntry);

      expect(response.status).toBe('success');
      expect(response.data.id).toBe(1);
    });

    it('gets audit logs successfully', async () => {
      const response = await api.getAuditLogs({
        page: 1,
        limit: 10,
      });

      expect(response.status).toBe('success');
      expect(response.data.logs).toHaveLength(1);
      expect(response.data.logs[0].actionType).toBe('USER_CREATED');
    });
  });

  describe('Error Handling', () => {
    it('handles API errors gracefully', async () => {
      // Override the get users endpoint to return an error
      server.use(
        rest.get(`${API_URL}/users`, (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({
              status: 'error',
              message: 'Internal server error',
            })
          );
        })
      );

      try {
        await api.getUsers();
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toBe('Internal server error');
      }
    });

    it('handles network errors gracefully', async () => {
      // Override the get users endpoint to return a network error
      server.use(
        rest.get(`${API_URL}/users`, (req, res) => {
          return res.networkError('Network error');
        })
      );

      try {
        await api.getUsers();
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toContain('Network error');
      }
    });

    it('handles missing token gracefully', async () => {
      // Remove the token
      localStorageMock.removeItem('token');

      try {
        await api.getUsers();
        // Should not reach here
        expect(true).toBe(false);
      } catch (error: any) {
        expect(error.message).toBe('No token found');
      }
    });
  });
});
