const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { initializeSocketIO } = require('./services/socket.service');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 5000;

// Initialize Socket.IO
const io = initializeSocketIO(server);
global.io = io;

// Import middleware
const { standardLimiter } = require('./middleware/rate-limit.middleware');
const { validateCsrfToken } = require('./middleware/csrf.middleware');

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(standardLimiter); // Apply rate limiting to all routes
// Apply CSRF protection to non-GET routes
app.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    validateCsrfToken(req, res, next);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Credit Cooperative System API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mock authentication endpoints
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  // Simple validation
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide all required fields',
    });
  }

  // Mock user creation
  const user = {
    id: 1,
    email,
    firstName,
    lastName,
    role: role || 'MEMBER',
    status: 'ACTIVE',
    memberId: `MEM${Math.floor(100000 + Math.random() * 900000)}`,
    memberSince: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mock token
  const token = 'mock-jwt-token';

  return res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user,
      token,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide email and password',
    });
  }

  // Mock user
  const user = {
    id: 1,
    email,
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN',
    status: 'ACTIVE',
    memberId: 'MEM123456',
    memberSince: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Mock token
  const token = 'mock-jwt-token';

  return res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user,
      token,
    },
  });
});

app.get('/api/auth/me', (req, res) => {
  // Mock authenticated user
  const user = {
    id: 1,
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'ADMIN',
    status: 'ACTIVE',
    memberId: 'MEM123456',
    memberSince: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Mock user endpoints
app.get('/api/users', (req, res) => {
  // Mock users
  const users = [
    {
      id: 1,
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'ADMIN',
      status: 'ACTIVE',
      memberId: 'MEM123456',
      memberSince: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'MEMBER',
      status: 'ACTIVE',
      memberId: 'MEM654321',
      memberSince: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

// Mock cooperative endpoints
app.get('/api/cooperatives/white-label', (req, res) => {
  // Mock white-label config
  const config = {
    name: 'Credit Cooperative System',
    logo: 'https://example.com/logo.png',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
  };

  return res.status(200).json({
    status: 'success',
    data: {
      config,
    },
  });
});

// Import routes
const loanRoutes = require('./routes/loan.routes');
const savingsRoutes = require('./routes/savings.routes');
const transactionRoutes = require('./routes/transaction.routes');
const notificationRoutes = require('./routes/notification.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const damayanRoutes = require('./routes/damayan.routes');

// Routes
app.use('/api/loans', loanRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/damayan', damayanRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Socket.IO initialized`);
});

module.exports = app;
