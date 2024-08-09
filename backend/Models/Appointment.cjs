const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  StudentName: { type:String,required: true },
  StudentEmail: {type:String, required: true}, 
  TeacherName: { type:String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
