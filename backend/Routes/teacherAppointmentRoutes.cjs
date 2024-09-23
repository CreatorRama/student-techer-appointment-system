// import authMiddleware from '../Middleware/authmiddleware.cjs';

const express = require('express');
const router = express.Router();
const { scheduleAppointment } = require('../controllers/teacherAppointmentController.cjs');

router.post('/schedule', scheduleAppointment);

module.exports = router;