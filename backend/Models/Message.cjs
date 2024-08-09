
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: false },
  content: { type: String, required: true },
  sendAt: { type: String, required:true},
  time:{type: String, required: false}
});

module.exports = mongoose.model('Message',messageSchema);
