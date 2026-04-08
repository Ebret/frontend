/**
 * Unified Security Utilities for Credit Cooperative System
 * 
 * This module provides comprehensive security utilities including:
 * - CSRF token generation and validation
 * - Data encryption and decryption
 * - Password hashing and validation
 * - Input sanitization
 * - Security event logging
 */

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const xss = require('xss');
const logger = require('./logger');

// CSRF token storage (in a real application, this would be in Redis or another store)
const csrfTokens = new Map();

/**
 * Generate a CSRF token
 * @param {string} sessionId - Session ID to associate with the token
 * @returns {string} - Generated CSRF token
 */
const generateCsrfToken = (sessionId) => {
  if (!sessionId) {
    throw new Error('Session ID is required to generate CSRF token');
  }
  
  // Generate a random token
  const csrfToken = crypto.randomBytes(32).toString('hex');
  
  // Store the token with the session ID
  csrfTokens.set(sessionId, {
    token: csrfToken,
    createdAt: Date.now()
  });
  
  // Log token generation
  logger.debug(`CSRF token generated for session ${sessionId}`);
  
  return csrfToken;
};

/**
 * Validate a CSRF token
 * @param {string} sessionId - Session ID associated with the token
 * @param {string} token - CSRF token to validate
 * @returns {boolean} - Whether the token is valid
 */
const validateCsrfToken = (sessionId, token) => {
  if (!sessionId || !token) {
    return false;
  }
  
  // Get stored token
  const storedData = csrfTokens.get(sessionId);
  
  if (!storedData) {
    return false;
  }
  
  // Check if token matches
  const isValid = storedData.token === token;
  
  // Check if token is expired (optional, 24 hours)
  const isExpired = Date.now() - storedData.createdAt > 24 * 60 * 60 * 1000;
  
  if (isExpired) {
    // Remove expired token
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return isValid;
};

/**
 * Clean up expired CSRF tokens
 * Should be called periodically (e.g., by a cron job)
 */
const cleanupCsrfTokens = () => {
  const now = Date.now();
  let expiredCount = 0;
  
  for (const [sessionId, data] of csrfTokens.entries()) {
    if (now - data.createdAt > 24 * 60 * 60 * 1000) {
      csrfTokens.delete(sessionId);
      expiredCount++;
    }
  }
  
  logger.debug(`Cleaned up ${expiredCount} expired CSRF tokens`);
};

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @param {string} [key] - Optional encryption key (defaults to environment variable)
 * @returns {string} - Encrypted text
 */
const encrypt = (text, key) => {
  const encryptionKey = Buffer.from(
    key || process.env.ENCRYPTION_KEY || 'a-very-secure-32-char-encryption-key',
    'utf8'
  );
  
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return `${iv.toString('hex')}:${encrypted}`;
};

/**
 * Decrypt sensitive data
 * @param {string} text - Encrypted text
 * @param {string} [key] - Optional encryption key (defaults to environment variable)
 * @returns {string} - Decrypted text
 */
const decrypt = (text, key) => {
  const [ivHex, encryptedText] = text.split(':');
  
  if (!ivHex || !encryptedText) {
    throw new Error('Invalid encrypted text format');
  }
  
  const encryptionKey = Buffer.from(
    key || process.env.ENCRYPTION_KEY || 'a-very-secure-32-char-encryption-key',
    'utf8'
  );
  
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, iv);
  
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

/**
 * Hash a password
 * @param {string} password - Password to hash
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Verify a password against a hash
 * @param {string} password - Password to verify
 * @param {string} hash - Hash to verify against
 * @returns {Promise<boolean>} - Whether the password is valid
 */
const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  return xss(input);
};

/**
 * Sanitize an object's string properties
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  const sanitized = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

/**
 * Generate a secure random token
 * @param {number} [length=32] - Token length in bytes
 * @returns {string} - Secure random token
 */
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Log a security event
 * @param {string} action - Security action
 * @param {Object} user - User performing the action
 * @param {Object} details - Action details
 */
const logSecurityEvent = (action, user, details) => {
  logger.logSecurity(action, user, details);
};

module.exports = {
  // CSRF protection
  generateCsrfToken,
  validateCsrfToken,
  cleanupCsrfTokens,
  
  // Encryption
  encrypt,
  decrypt,
  
  // Password handling
  hashPassword,
  verifyPassword,
  
  // Input sanitization
  sanitizeInput,
  sanitizeObject,
  
  // Token generation
  generateSecureToken,
  
  // Security logging
  logSecurityEvent,
};
