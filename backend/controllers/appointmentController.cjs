const Appointment = require('../Models/Appointment.cjs');
const User = require('../Models/User.cjs');
const Teacher=require('../Models/Teacher.cjs');
const sendApprovalEmail = require('../Config/mailer.cjs'); // Import the mailer module

exports.bookAppointment = async (req, res) => {
  try {
    const { studentId, teacherId,StudentEmail,date, time } = req.body;
    const student = await User.findById(studentId);
    const teacher = await Teacher.findById(teacherId);
    const appointment = new Appointment({ StudentName:student.name, TeacherName:teacher.name,StudentEmail, date, time });
    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all appointments for a specific teacher
exports.getAppointments = async (req, res) => {
  const { teacherName } = req.params;
  try {
    const appointments = await Appointment.find({ TeacherName: teacherName });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });

    if (status === 'approved' || status==='rejected') {
      // Fetch student email (assuming you have it in the appointment details)
      const studentEmail = updatedAppointment.StudentEmail; // Ensure you have this field in your Appointment model
      const appointmentDetails = `Teacher: ${updatedAppointment.TeacherName}\nDate: ${updatedAppointment.date}\nTime: ${updatedAppointment.time}`;
      await sendApprovalEmail(studentEmail, appointmentDetails,status);
    }

    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
};

