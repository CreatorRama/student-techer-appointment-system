const authMiddleware= require('../Middleware/authmiddleware.cjs');

const express = require('express');
const { register, login,adminlogin } = require('../controllers/authcontroller.cjs');
const router = express.Router();

// Existing routes
// console.log(register);
router.post('/register',register);
router.post('/login',login);
router.post('/admin',authMiddleware,adminlogin);

// New test route
router.get('/test', (req, res) => {
  res.send('Test route works!');
});

module.exports = router;
