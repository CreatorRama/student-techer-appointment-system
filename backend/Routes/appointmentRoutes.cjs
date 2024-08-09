const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController.cjs');

router.post('/book', bookAppointment);

// Get all appointments for a teacher
router.get('/:teacherName', getAppointments);

// Update appointment status
router.patch('/:id/status', updateAppointmentStatus);

module.exports = router;
