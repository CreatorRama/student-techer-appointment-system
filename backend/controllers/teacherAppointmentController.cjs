const sendApprovalEmail=require('../Config/mailer.cjs');

const Teacher=require('../Models/Teacher.cjs');

const TeacherAppointment = require('../Models/TeacherAppointment.cjs');
const User = require('../Models/User.cjs');

exports.scheduleAppointment = async (req, res) => {
  const { teacherId, studentId, date, time } = req.body;
  console.log(teacherId);

  try {
    // Find the student by ID to get the student's name
    const student = await User.findById(studentId);
    const teacher = await Teacher.findById(teacherId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const {email}=student
    console.log(email);

    // Create the appointment with the student's name
    const appointment = new TeacherAppointment({
      TeacherName:teacher.name,
      studentName: student.name, // Use the student's name
      date,
      time,
      status: 'approved',
    });

    await appointment.save();  
    
    res.status(201).json(appointment);
    const appointmentDetails = `Teacher: ${teacher.name}\nDate: ${date}\nTime: ${time}`;
    await sendApprovalEmail(email, appointmentDetails,'approved');
  } catch (error) {
    res.status(400).json({ message: 'Error creating appointment', error });
  }
};