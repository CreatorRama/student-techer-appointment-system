require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./Config/db.cjs');

const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

// Enable trust proxy
app.set('trust proxy', 1); // This allows Express to trust the X-Forwarded-For header

connectDB();

const allowedOrigins = ['http://localhost:5173','https://student-techer-appointment-system.vercel.app'];

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
  keyGenerator: (req, res) => req.ip, // This ensures the rate limiting is based on the correct IP
});
app.use(limiter);



app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.send('Test route works');
});

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

app.use((req, res) => {
  console.log(`[${new Date().toISOString()}] 404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).send('Route not found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
