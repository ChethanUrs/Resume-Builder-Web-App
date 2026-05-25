const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Check if Bearer prefix is used
  const tokenParts = authHeader.split(' ');
  const token = tokenParts[0] === 'Bearer' ? tokenParts[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token format is invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_token_for_resume_builder_2026_antigravity');
    
    // Attach user payload to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

module.exports = auth;
