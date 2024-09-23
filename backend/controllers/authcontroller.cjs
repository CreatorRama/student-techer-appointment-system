const User = require('../Models/User.cjs');
const Teacher = require('../Models/Teacher.cjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30m',
  });
};

const register = async (req, res) => {
  const { name, email, password, role, department, subject } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(existingUser);
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === 'teacher') {
      // Create a teacher user
      const teacher = new Teacher({ name, email, password: hashedPassword, department, subject });
      await teacher.save();

      res.status(201).json({
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: 'teacher',
        department: teacher.department,
        subject: teacher.subject,
        token: generateToken(teacher._id),
      });
    } else if (role === 'student') {
      // Create a regular user
      const user = new User({ name, email, password: hashedPassword, role });
      await user.save();

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid role' });
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await Teacher.findOne({ email });
    }

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error', error });
  }
}

const adminlogin = async (req, res) => {
  console.log('Admin login function called');
  console.log('Request body:', req.body);
  
  const { email, password } = req.body;

  if (!email || !password) {
    console.log('Email or password missing');
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email !== "amanadmin@gmail.com" || password !== "admin") {
    console.log('Invalid email or password');
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  try {
    const token = generateToken(6307552891);
    res.json({
      _id: 6307552891,
      name: 'Aman Pandey',
      email: email,
      role: 'admin',
      token: token,
    });
  } catch (error) {
    console.error('Error in adminlogin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { register, login, adminlogin }
