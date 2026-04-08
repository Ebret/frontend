/**
 * Enhanced Logging Utility for Credit Cooperative System
 * 
 * This utility provides comprehensive logging features including:
 * - Multiple log levels
 * - File and console logging
 * - Log rotation
 * - Structured logging
 * - Request logging
 * - Error logging
 */

const winston = require('winston');
const { format, transports } = winston;
const path = require('path');
const fs = require('fs');
require('winston-daily-rotate-file');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Console format (more readable for development)
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`
  )
);

// Create file transports with rotation
const fileTransports = [
  // Error logs
  new transports.DailyRotateFile({
    filename: path.join(logsDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
  }),
  
  // Combined logs
  new transports.DailyRotateFile({
    filename: path.join(logsDir, 'combined-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d',
    format: logFormat,
  }),
];

// Create logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'credit-cooperative' },
  transports: [
    // Console transport
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: consoleFormat,
    }),
    ...fileTransports,
  ],
  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: path.join(logsDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat,
    }),
    new transports.Console({
      format: consoleFormat,
    }),
  ],
  rejectionHandlers: [
    new transports.DailyRotateFile({
      filename: path.join(logsDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat,
    }),
    new transports.Console({
      format: consoleFormat,
    }),
  ],
  exitOnError: false,
});

// Add stream for Morgan HTTP request logging
logger.stream = {
  write: (message) => logger.http(message.trim()),
};

// Add convenience methods for structured logging
logger.logRequest = (req, res, responseTime) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    status: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    userId: req.user ? req.user.id : null,
  };
  
  logger.http('HTTP Request', logData);
};

logger.logError = (error, req = null) => {
  const logData = {
    message: error.message,
    stack: error.stack,
    ...(req && {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user ? req.user.id : null,
    }),
  };
  
  logger.error('Error', logData);
};

logger.logTransaction = (transaction) => {
  logger.info('Transaction', {
    transactionId: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    userId: transaction.userId,
    status: transaction.status,
  });
};

logger.logLoan = (loan, action) => {
  logger.info(`Loan ${action}`, {
    loanId: loan.id,
    userId: loan.userId,
    amount: loan.amount,
    term: loan.term,
    status: loan.status,
  });
};

logger.logSecurity = (event, user, details) => {
  logger.warn('Security Event', {
    event,
    user: user ? { id: user.id, email: user.email } : null,
    details,
  });
};

logger.logAudit = (action, user, details, targetUser = null) => {
  logger.info('Audit', {
    action,
    user: user ? { id: user.id, email: user.email } : null,
    targetUser: targetUser ? { id: targetUser.id, email: targetUser.email } : null,
    details,
    timestamp: new Date().toISOString(),
  });
};

// Export logger
module.exports = logger;
