const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check for authorization header and extract the token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // 2. Verify token using JWT_SECRET
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Attach user to request, excluding password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();

    } catch (error) {
      console.error('JWT verification failed:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  } else {
    // 4. No token found in header
    return res.status(401).json({ message: 'Authorization token missing' });
  }
};

module.exports = { protect };