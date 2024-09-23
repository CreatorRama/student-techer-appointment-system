const jwt = require('jsonwebtoken');
const User = require('../Models/User.cjs');

const authMiddleware = async (req, res, next) => {
  console.log('Auth middleware hit');


  let token;
  // if (req.body.email == "amanadmin@gmail.com" && req.body.password == "admin") {
  //   return next()
  // }
  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // res.status(401).json({ message: 'Not authorized, no token' });
    return next();
  }
};

module.exports = authMiddleware;
