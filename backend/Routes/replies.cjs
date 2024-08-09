const express = require('express');
const router = express.Router();
const {setreply,sendreply}=require('../controllers/repliescontroller.cjs')
console.log(sendreply);

router.post('/reply',setreply)
router.get('/get',sendreply)

module.exports=router