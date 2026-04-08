// Store request counts (in a real application, this would be in Redis or another store)
const requestCounts = new Map();

// Rate limit middleware
const rateLimit = (options = {}) => {
  const {
    windowMs = 60 * 1000, // 1 minute
    max = 100, // 100 requests per windowMs
    message = 'Too many requests, please try again later.',
    statusCode = 429, // Too Many Requests
    keyGenerator = (req) => {
      // Use IP address as default key
      return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    },
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    
    // Initialize or get current count
    const now = Date.now();
    const requestRecord = requestCounts.get(key) || { count: 0, resetTime: now + windowMs };
    
    // Reset count if window has expired
    if (now > requestRecord.resetTime) {
      requestRecord.count = 0;
      requestRecord.resetTime = now + windowMs;
    }
    
    // Increment count
    requestRecord.count += 1;
    
    // Store updated record
    requestCounts.set(key, requestRecord);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - requestRecord.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(requestRecord.resetTime / 1000));
    
    // If over limit, send error response
    if (requestRecord.count > max) {
      return res.status(statusCode).json({
        status: 'error',
        message,
      });
    }
    
    // Continue to next middleware
    next();
  };
};

// Export different rate limit configurations
exports.standardLimiter = rateLimit();

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many login attempts, please try again later.',
});

exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
});

// Custom rate limiter for specific endpoints
exports.createRateLimiter = (options) => rateLimit(options);
