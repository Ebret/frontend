// Authentication middleware
exports.authenticate = (req, res, next) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. No token provided.',
    });
  }

  const token = authHeader.split(' ')[1];

  // In a real application, we would verify the token
  // For this mock, we'll just check if it exists
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication required. Invalid token.',
    });
  }

  // Add user to request (mock user for now)
  req.user = {
    id: 1,
    email: 'john.doe@example.com',
    role: 'ADMIN',
  };

  next();
};

// Role-based authorization middleware
exports.authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to access this resource',
      });
    }

    next();
  };
};
