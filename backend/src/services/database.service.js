/**
 * Database Service for Credit Cooperative System
 * 
 * This service provides optimized database operations including:
 * - Connection management
 * - Query optimization
 * - Transaction support
 * - Caching
 * - Monitoring
 */

const { PrismaClient } = require('@prisma/client');
const logger = require('../utils/logger');
const { redis } = require('./cache.service');

class DatabaseService {
  constructor() {
    this.prisma = new PrismaClient({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });
    
    // Set up logging
    this.setupLogging();
    
    // Initialize metrics
    this.metrics = {
      queryCount: 0,
      errorCount: 0,
      slowQueryCount: 0,
      totalQueryTime: 0,
    };
    
    // Reset metrics every hour
    setInterval(() => this.resetMetrics(), 60 * 60 * 1000);
  }
  
  /**
   * Set up Prisma logging
   */
  setupLogging() {
    this.prisma.$on('query', (e) => {
      this.metrics.queryCount++;
      this.metrics.totalQueryTime += e.duration;
      
      // Log slow queries (over 100ms)
      if (e.duration > 100) {
        this.metrics.slowQueryCount++;
        logger.warn('Slow query detected', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      } else {
        logger.debug('Query executed', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
        });
      }
    });
    
    this.prisma.$on('error', (e) => {
      this.metrics.errorCount++;
      logger.error('Prisma error', e);
    });
    
    this.prisma.$on('info', (e) => {
      logger.info('Prisma info', e);
    });
    
    this.prisma.$on('warn', (e) => {
      logger.warn('Prisma warning', e);
    });
  }
  
  /**
   * Reset metrics
   */
  resetMetrics() {
    // Log current metrics before reset
    logger.info('Database metrics', this.metrics);
    
    // Reset metrics
    this.metrics = {
      queryCount: 0,
      errorCount: 0,
      slowQueryCount: 0,
      totalQueryTime: 0,
    };
  }
  
  /**
   * Execute a function within a transaction
   * @param {Function} callback - Function to execute within transaction
   * @returns {Promise<any>} - Result of the callback
   */
  async executeWithTransaction(callback) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        return await callback(tx);
      });
    } catch (error) {
      logger.error('Transaction failed', error);
      throw error;
    }
  }
  
  /**
   * Optimize user queries with selective includes
   * @param {Object} options - Query options
   * @returns {Object} - Optimized query
   */
  optimizeUserQuery(options = {}) {
    const { id, email, includeLoans, includeTransactions, includeAccounts, includeDamayan } = options;
    
    // Base query
    const query = {
      where: {},
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true,
        password: false, // Explicitly exclude password
      },
    };
    
    // Add filters
    if (id) query.where.id = id;
    if (email) query.where.email = email;
    
    // Add includes based on flags
    if (includeLoans) {
      query.select.loans = {
        select: {
          id: true,
          loanNumber: true,
          amount: true,
          term: true,
          interestRate: true,
          status: true,
          purpose: true,
          approvedAt: true,
          disbursedAt: true,
          dueDate: true,
          createdAt: true,
          updatedAt: true,
        },
      };
    }
    
    if (includeTransactions) {
      query.select.transactions = {
        select: {
          id: true,
          transactionNumber: true,
          type: true,
          amount: true,
          description: true,
          status: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10, // Limit to last 10 transactions
      };
    }
    
    if (includeAccounts) {
      query.select.accounts = {
        select: {
          id: true,
          accountNumber: true,
          type: true,
          balance: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      };
    }
    
    if (includeDamayan) {
      query.select.damayanMembership = {
        select: {
          id: true,
          status: true,
          joinDate: true,
          contributions: {
            select: {
              id: true,
              amount: true,
              contributionDate: true,
              type: true,
            },
            orderBy: {
              contributionDate: 'desc',
            },
            take: 5, // Limit to last 5 contributions
          },
          assistanceRequests: {
            select: {
              id: true,
              amount: true,
              reason: true,
              status: true,
              requestDate: true,
              approvedDate: true,
              disbursedDate: true,
            },
            orderBy: {
              requestDate: 'desc',
            },
            take: 5, // Limit to last 5 requests
          },
        },
      };
    }
    
    return query;
  }
  
  /**
   * Execute query with caching
   * @param {string} cacheKey - Cache key
   * @param {Function} queryFn - Function that returns a Prisma query
   * @param {number} ttl - Cache TTL in seconds
   * @returns {Promise<any>} - Query result
   */
  async executeWithCache(cacheKey, queryFn, ttl = 3600) {
    try {
      // Try to get from cache first
      const cachedResult = await redis.get(cacheKey);
      
      if (cachedResult) {
        logger.debug('Cache hit', { cacheKey });
        return JSON.parse(cachedResult);
      }
      
      // Cache miss, execute query
      logger.debug('Cache miss', { cacheKey });
      const result = await queryFn();
      
      // Store in cache
      await redis.setex(cacheKey, ttl, JSON.stringify(result));
      
      return result;
    } catch (error) {
      logger.error('Cache execution failed', error);
      // Fall back to direct query execution
      return queryFn();
    }
  }
  
  /**
   * Invalidate cache by key pattern
   * @param {string} pattern - Cache key pattern
   */
  async invalidateCache(pattern) {
    try {
      const keys = await redis.keys(pattern);
      
      if (keys.length > 0) {
        await redis.del(keys);
        logger.debug('Cache invalidated', { pattern, keysCount: keys.length });
      }
    } catch (error) {
      logger.error('Cache invalidation failed', error);
    }
  }
  
  /**
   * Disconnect from database
   */
  async disconnect() {
    await this.prisma.$disconnect();
    logger.info('Disconnected from database');
  }
}

// Export singleton instance
module.exports = new DatabaseService();
