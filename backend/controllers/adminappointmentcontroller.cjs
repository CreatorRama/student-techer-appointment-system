const sendApprovalEmail = require('../Config/mailer.cjs'); 
const User = require('../Models/User.cjs');
const Teacher=require('../Models/Teacher.cjs');
const Appointment=require('../Models/adminappointments.cjs');

exports.bookAppointment = async (req, res) => {
    try {
      const { studentName, teacherName, date, t } = req.body;
      console.log('Received booking request:', { studentName, teacherName, date, t });
  
      if (!studentName || !teacherName) {
        return res.status(400).json({ message: 'StudentName and TeacherName are required' });
      }
  
      const student = await User.findOne({ name: studentName });
      const teacher = await Teacher.findOne({ name: teacherName });
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      if (!teacher) {
        return res.status(404).json({ message: 'Teacher not found' });
      }
  
      const appointment = new Appointment({
        StudentName:studentName,
        TeacherName:teacherName,
        StudentEmail: student.email,
        TeacherEmail: teacher.email,
        date,
        time: t
      });
      await appointment.save();
  
      const appointmentDetails = `Teacher: ${teacherName}\nDate: ${date}\nTime: ${t}`;
  
      await sendApprovalEmail(student.email, appointmentDetails, 'approved');
  
      res.status(201).json({ message: 'Appointment booked successfully', appointment });
    } catch (error) {
      console.error('Error booking appointment:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  