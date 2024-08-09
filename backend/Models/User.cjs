const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default:'pending' },
  // Other fields as necessary
});


module.exports = mongoose.model('User', userSchema);
