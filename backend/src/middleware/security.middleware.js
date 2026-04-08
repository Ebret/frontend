/**
 * Enhanced Security Middleware for Credit Cooperative System
 *
 * This middleware provides comprehensive security features including:
 * - Content Security Policy (CSP)
 * - XSS Protection
 * - SQL Injection Protection
 * - CSRF Protection
 * - Rate Limiting
 * - Input Validation
 * - Secure Headers
 */

const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const { rateLimit } = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const logger = require('../utils/logger');
const security = require('../utils/security');

/**
 * Apply all security middleware to an Express app
 * @param {Object} app - Express app
 */
exports.applySecurityMiddleware = (app) => {
  // Apply Helmet (sets various HTTP headers)
  app.use(helmet());

  // Content Security Policy
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net'],
        connectSrc: ["'self'", 'https://api.cooperativesystem.com'],
      },
    })
  );

  // XSS Protection
  app.use(xss());

  // Prevent Parameter Pollution
  app.use(hpp());

  // MongoDB Query Sanitization (if using MongoDB)
  app.use(mongoSanitize());

  // Apply CSRF protection to non-GET routes
  app.use((req, res, next) => {
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      validateCsrfToken(req, res, next);
    } else {
      next();
    }
  });

  // Apply rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per window
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
      message: {
        status: 'error',
        message: 'Too many requests, please try again later',
      },
    })
  );

  // Stricter rate limiting for auth routes
  const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 requests per hour
    message: {
      status: 'error',
      message: 'Too many login attempts, please try again later',
    },
  });

  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
  app.use('/api/auth/forgot-password', authLimiter);

  logger.info('Security middleware applied');
};

/**
 * Generate CSRF token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
exports.generateCsrfToken = (req, res, next) => {
  // Get the user's session ID
  const sessionId = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

  if (sessionId) {
    // Generate a token using the security utility
    const csrfToken = security.generateCsrfToken(sessionId);

    // Set CSRF token in response header
    res.setHeader('X-CSRF-Token', csrfToken);
  }

  next();
};

/**
 * Validate CSRF token
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
const validateCsrfToken = (req, res, next) => {
  // Skip validation for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const sessionId = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  const csrfToken = req.headers['x-csrf-token'];

  // If no session or token, reject the request
  if (!sessionId || !csrfToken) {
    return res.status(403).json({
      status: 'error',
      message: 'CSRF token missing',
    });
  }

  // Validate the token using the security utility
  const isValid = security.validateCsrfToken(sessionId, csrfToken);

  if (!isValid) {
    logger.warn(`CSRF token validation failed for session ${sessionId}`);
    return res.status(403).json({
      status: 'error',
      message: 'Invalid CSRF token',
    });
  }

  // Token is valid, proceed
  next();
};

/**
 * Password strength validation middleware
 */
exports.validatePasswordStrength = [
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Password does not meet security requirements',
        errors: errors.array(),
      });
    }
    next();
  },
];

/**
 * Data encryption utility
 */
exports.encryption = {
  /**
   * Encrypt sensitive data
   * @param {string} text - Text to encrypt
   * @returns {string} - Encrypted text
   */
  encrypt: (text) => {
    return security.encrypt(text);
  },

  /**
   * Decrypt sensitive data
   * @param {string} text - Encrypted text
   * @returns {string} - Decrypted text
   */
  decrypt: (text) => {
    return security.decrypt(text);
  },
};

/**
 * Security audit logging
 * @param {string} action - Security action
 * @param {Object} user - User performing the action
 * @param {Object} details - Action details
 */
exports.logSecurityEvent = (action, user, details) => {
  security.logSecurityEvent(action, user, details);
};
