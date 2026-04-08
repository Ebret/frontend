/**
 * Cache Service for Credit Cooperative System
 * 
 * This service provides caching functionality using Redis including:
 * - Simple key-value caching
 * - Cache middleware for Express routes
 * - Cache invalidation
 * - Cache statistics
 */

const Redis = require('ioredis');
const logger = require('../utils/logger');

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Handle Redis events
redis.on('connect', () => {
  logger.info('Redis client connected');
});

redis.on('error', (error) => {
  logger.error('Redis client error', error);
});

/**
 * Cache middleware for Express routes
 * @param {string} prefix - Cache key prefix
 * @param {number} expiry - Cache expiry in seconds
 * @returns {Function} - Express middleware
 */
const cacheMiddleware = (prefix, expiry = 3600) => {
  return async (req, res, next) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Skip cache for authenticated requests with specific roles
    if (req.user && ['ADMIN', 'GENERAL_MANAGER', 'CREDIT_OFFICER'].includes(req.user.role)) {
      return next();
    }
    
    // Generate cache key
    const key = `${prefix}:${req.originalUrl}`;
    
    try {
      // Check if data exists in cache
      const cachedData = await redis.get(key);
      
      if (cachedData) {
        // Parse cached data
        const data = JSON.parse(cachedData);
        
        // Return cached response
        return res.status(200).json({
          status: 'success',
          data,
          cached: true,
        });
      }
      
      // Store original json method
      const originalJson = res.json;
      
      // Override json method
      res.json = function(body) {
        // Restore original method
        res.json = originalJson;
        
        // Only cache successful responses
        if (res.statusCode === 200 && body.status === 'success') {
          // Store data in cache
          redis.setex(key, expiry, JSON.stringify(body.data));
          
          // Increment cache miss counter
          incrementCacheMiss(prefix);
        }
        
        // Call original method
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error', error);
      next();
    }
  };
};

/**
 * Clear cache by pattern
 * @param {string} pattern - Cache key pattern
 * @returns {Promise<number>} - Number of keys deleted
 */
const clearCache = async (pattern) => {
  try {
    // Get keys matching pattern
    const keys = await redis.keys(pattern);
    
    if (keys.length > 0) {
      // Delete keys
      const deleted = await redis.del(keys);
      logger.info(`Cleared ${deleted} cache keys matching pattern: ${pattern}`);
      return deleted;
    }
    
    return 0;
  } catch (error) {
    logger.error('Clear cache error', error);
    throw error;
  }
};

/**
 * Get cache statistics
 * @returns {Promise<Object>} - Cache statistics
 */
const getCacheStats = async () => {
  try {
    // Get Redis info
    const info = await redis.info();
    
    // Parse info
    const stats = {};
    info.split('\r\n').forEach((line) => {
      const parts = line.split(':');
      if (parts.length === 2) {
        stats[parts[0]] = parts[1];
      }
    });
    
    // Get hit/miss counters
    const hits = await redis.get('cache:hits') || 0;
    const misses = await redis.get('cache:misses') || 0;
    
    // Calculate hit ratio
    const hitRatio = parseInt(hits) / (parseInt(hits) + parseInt(misses) || 1);
    
    return {
      hitRatio,
      hits: parseInt(hits),
      misses: parseInt(misses),
      usedMemory: stats.used_memory_human,
      connectedClients: stats.connected_clients,
      uptime: stats.uptime_in_seconds,
    };
  } catch (error) {
    logger.error('Get cache stats error', error);
    return {
      hitRatio: 0,
      hits: 0,
      misses: 0,
      error: error.message,
    };
  }
};

/**
 * Increment cache hit counter
 * @param {string} prefix - Cache key prefix
 */
const incrementCacheHit = async (prefix) => {
  try {
    await redis.incr('cache:hits');
    await redis.incr(`cache:hits:${prefix}`);
  } catch (error) {
    logger.error('Increment cache hit error', error);
  }
};

/**
 * Increment cache miss counter
 * @param {string} prefix - Cache key prefix
 */
const incrementCacheMiss = async (prefix) => {
  try {
    await redis.incr('cache:misses');
    await redis.incr(`cache:misses:${prefix}`);
  } catch (error) {
    logger.error('Increment cache miss error', error);
  }
};

/**
 * Optimize cache TTLs based on usage patterns
 */
const optimizeCacheTTLs = async () => {
  try {
    // Get all cache prefix stats
    const keys = await redis.keys('cache:hits:*');
    const prefixes = keys.map((key) => key.replace('cache:hits:', ''));
    
    for (const prefix of prefixes) {
      const hits = parseInt(await redis.get(`cache:hits:${prefix}`)) || 0;
      const misses = parseInt(await redis.get(`cache:misses:${prefix}`)) || 0;
      
      // Calculate hit ratio
      const hitRatio = hits / (hits + misses || 1);
      
      // Adjust TTL based on hit ratio
      let ttl = 3600; // Default 1 hour
      
      if (hitRatio > 0.9) {
        // High hit ratio, increase TTL
        ttl = 7200; // 2 hours
      } else if (hitRatio < 0.5) {
        // Low hit ratio, decrease TTL
        ttl = 1800; // 30 minutes
      }
      
      logger.info(`Optimized cache TTL for ${prefix}: ${ttl}s (hit ratio: ${hitRatio.toFixed(2)})`);
      
      // Store optimized TTL
      await redis.set(`cache:ttl:${prefix}`, ttl);
    }
    
    return { success: true, prefixesOptimized: prefixes.length };
  } catch (error) {
    logger.error('Optimize cache TTLs error', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  redis,
  cacheMiddleware,
  clearCache,
  getCacheStats,
  optimizeCacheTTLs,
};
