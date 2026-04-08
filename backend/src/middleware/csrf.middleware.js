const crypto = require('crypto');

// Store CSRF tokens (in a real application, this would be in Redis or another store)
const csrfTokens = new Map();

// Generate CSRF token
exports.generateCsrfToken = (req, res, next) => {
  // Generate a random token
  const csrfToken = crypto.randomBytes(32).toString('hex');
  
  // Store the token with the user's session ID
  const sessionId = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  
  if (sessionId) {
    csrfTokens.set(sessionId, csrfToken);
    
    // Set CSRF token in response header
    res.setHeader('X-CSRF-Token', csrfToken);
  }
  
  next();
};

// Validate CSRF token
exports.validateCsrfToken = (req, res, next) => {
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
  
  // Validate the token
  const storedToken = csrfTokens.get(sessionId);
  
  if (!storedToken || storedToken !== csrfToken) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid CSRF token',
    });
  }
  
  // Token is valid, proceed
  next();
};
