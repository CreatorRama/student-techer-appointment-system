// Models/TeacherAppointment.cjs
const mongoose = require('mongoose');

const teacherAppointmentSchema = new mongoose.Schema({
  TeacherName: { type: String, required: true },
  studentName: { type:String,required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TeacherAppointment', teacherAppointmentSchema);
