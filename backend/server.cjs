// server.cjs
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Added for security
const rateLimit = require('express-rate-limit'); // Added for rate limiting
const connectDB = require('./Config/db.cjs');

const app = express();

// Set Mongoose strictQuery configuration
const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Adjust based on your needs

connectDB();

// Define allowed origins
const allowedOrigins = ['http://localhost:5173']; // Add your frontend origin here

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Apply security headers
app.use(helmet()); // Added for security

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter); // Apply rate limiting to all requests

app.use(express.json());

// Define routes
app.use('/api/auth', require('./Routes/auth.cjs'));
app.use('/api/teachers', require('./Routes/Teachers.cjs'));
app.use('/api/appointments', require('./Routes/appointmentRoutes.cjs'));
app.use('/api/teacher-appointments', require('./Routes/teacherAppointmentRoutes.cjs'));
app.use('/api/messages', require('./Routes/messageRoutes.cjs'));
app.use('/api/students', require('./Routes/student.cjs'));
app.use('/api', require('./Routes/replies.cjs'));
app.use('/api', require('./Routes/adminappointment.cjs'));

// Root route
app.get('/', (req, res) => {
  res.send('Hello from the root endpoint!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
