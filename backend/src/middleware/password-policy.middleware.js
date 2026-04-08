// Password policy middleware
exports.validatePasswordStrength = (req, res, next) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({
      status: 'error',
      message: 'Password is required',
    });
  }
  
  // Check password length
  if (password.length < 8) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 8 characters long',
    });
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must contain at least one uppercase letter',
    });
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must contain at least one lowercase letter',
    });
  }
  
  // Check for numbers
  if (!/\d/.test(password)) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must contain at least one number',
    });
  }
  
  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must contain at least one special character',
    });
  }
  
  // Password meets all requirements
  next();
};
