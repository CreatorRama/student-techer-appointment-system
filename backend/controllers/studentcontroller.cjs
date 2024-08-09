const User = require('../Models/User.cjs');
const mongoose = require('mongoose');

exports.addstudent = async (req, res) => {
  // console.log(req.body);
  const { name, email, password, department, subject } = req.body;
  if (!name || !email || !password || !department || !subject) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const teacher = new T({
      name,
      email,
    });
    await User.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error adding teacher', error });
  }
};


exports.getstudent = async (req, res) => {
  try {
    const students = await User.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


exports.updatestudent = async (req, res) => {
  try {
    const studentId = req.params.id; 
    console.log(`Received studentId: ${studentId}`);

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format' });
    }

    const objectId = mongoose.Types.ObjectId(studentId);
    const { status } = req.body;

    console.log(`Updating student with ID: ${objectId}, status: ${status}`);

    const student = await User.findByIdAndUpdate(
      objectId,
      { status },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Error updating student', error });
  }
};



exports.deletestudent = async (req, res) => {
  const studentId = req.params.id;
  console.log(studentId);
  try {
    await User.findByIdAndDelete(studentId);
    res.json({ message: 'student deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting teacher', error });
  }
};
