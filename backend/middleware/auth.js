const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware
 * 
 * Verifies JWT token and attaches user to request
 */
module.exports = async function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token, authorization denied'
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID
    const user = await User.findById(decoded.user.id).select('-password');
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token, user not found'
      });
    }
    
    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'User account is inactive'
      });
    }
    
    // Attach user to request
    req.user = user;
    
    // Proceed to next middleware
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};
