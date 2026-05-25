const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth Middleware: Decodes JWT and attaches standard user object to request
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const tokenParts = authHeader.split(' ');
  const token = tokenParts[0] === 'Bearer' ? tokenParts[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: 'Authorization token format is invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_token_for_ecommerce_app_2026_antigravity');
    req.user = decoded; // Attach { id, isAdmin }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid or has expired' });
  }
};

// Admin Guard: Restricts routing specifically to system administrators
const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user && user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized: Administrator credentials required' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Authorization error checking roles' });
  }
};

module.exports = { auth, admin };
