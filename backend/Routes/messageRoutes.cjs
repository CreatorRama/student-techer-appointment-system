const express = require('express');
const router = express.Router();
const { sendMessage,getMessage} = require('../controllers/messageController.cjs');
const authMiddleware= require('../Middleware/authmiddleware.cjs');


router.post('/send', sendMessage);
router.get('/',getMessage);

module.exports = router;
