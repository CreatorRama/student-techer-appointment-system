const authMiddleware= require('../Middleware/authmiddleware.cjs');

const express = require('express');
const {getstudent,updatestudent,deletestudent} = require('../controllers/studentcontroller.cjs');
const router = express.Router();

// Existing routes
// console.log(register);
// router.get('/', addstudent);
router.get('/', getstudent);
router.patch('/:id', updatestudent);
router.delete('/:id',deletestudent);

// New test route
router.get('/test', (req, res) => {
  res.send('Test route works!');
});

module.exports = router;
