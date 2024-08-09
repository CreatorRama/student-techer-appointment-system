require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./Config/db.cjs');

const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

connectDB();

const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(express.json());

app.use('/api/auth', require('./Routes/auth.cjs'));
app.use('/api/teachers', require('./Routes/Teachers.cjs'));
app.use('/api/appointments', require('./Routes/appointmentRoutes.cjs'));
app.use('/api/teacher-appointments', require('./Routes/teacherAppointmentRoutes.cjs'));
app.use('/api/messages', require('./Routes/messageRoutes.cjs'));
app.use('/api/students', require('./Routes/student.cjs'));
app.use('/api/replies', require('./Routes/replies.cjs'));
app.use('/api/adminappointments', require('./Routes/adminappointment.cjs'));

app.get('/', (req, res) => {
  res.send('Hello from the root endpoint!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
