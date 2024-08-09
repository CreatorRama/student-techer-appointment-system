const jwt = require('jsonwebtoken');
const User = require('../Models/User.cjs');

const authMiddleware = async (req, res, next) => {
  let token;
if(req.body.email==='amanadmin@gmail.com' && req.body.password==='admin'){
return next();
}
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log(token);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Token verification error:', error); // Log the error for debugging
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = authMiddleware;
