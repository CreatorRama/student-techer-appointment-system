const Teacher = require('../Models/Teacher.cjs');

exports.addTeacher = async (req, res) => {
  // console.log(req.body);
  const { name, email, password, department, subject } = req.body;
  if (!name || !email || !password || !department || !subject) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const teacher = new Teacher({
      name,
      email,
      password,
      department,
      subject,
    });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error adding teacher', error });
  }
};


exports.getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.updateTeacher = async (req, res) => {
  const { id } = req.params;
  const { name, department, subject } = req.body;
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { name, department, subject },
      { new: true }
    );
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ message: 'Error updating teacher', error });
  }
};

exports.deleteTeacher = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await Teacher.findByIdAndDelete(id);
    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Error deleting teacher', error });
  }
};
