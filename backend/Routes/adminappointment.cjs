const express = require('express');
const router = express.Router();
const { bookAppointment} = require('../controllers/adminappointmentcontroller.cjs');

router.post('/appointment', bookAppointment);

module.exports = router;
