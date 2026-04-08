/**
 * Role-based access control middleware
 * 
 * Checks if the authenticated user has one of the required roles
 * 
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const checkRole = (roles) => {
  return (req, res, next) => {
    // User should be attached to request by auth middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    // Check if user has one of the required roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    
    // User has required role, proceed to next middleware
    next();
  };
};

module.exports = checkRole;
