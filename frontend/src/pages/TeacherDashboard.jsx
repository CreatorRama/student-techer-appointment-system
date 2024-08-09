import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, Box, Card, CardContent, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { styled } from '@mui/system';
import MessageCard from '../components/MessageCard';  // Adjust the path as necessary

// Styled components
const DashboardContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  background: '#f5f7fa',
  minHeight: '100vh',
});

const Header = styled(Box)({
  width: '100%',
  padding: '20px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  textAlign: 'center',
  borderRadius: '10px',
  marginBottom: '20px',
  position: 'relative',
});

const LogoutButton = styled(Button)({
  position: 'absolute',
  top: '20px',
  right: '20px',
  backgroundColor: '#f44336',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#c62828',
  },
});

const NavButton = styled(Button)({
  backgroundColor: '#3f51b5',
  color: '#fff',
  margin: '0 5px',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
});

const DashboardCard = styled(Card)({
  width: '100%',
  marginBottom: '20px',
});

const Section = styled('div')({
  display: 'none',
  padding: '20px',
  backgroundColor: '#fff',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

const activeStyle = {
  display: 'block',
};

// Helper function to convert time to 12-hour format with AM/PM
const formatTime = (time) => {
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const AppointmentCard = ({ appointment, onApprove, onReject }) => {
  return (
    <Card variant="outlined" style={{ marginBottom: '10px' }}>
      <CardContent>
        <Typography variant="h6">Student Name: {appointment.StudentName}</Typography>
        <Typography variant="body1">Date: {new Date(appointment.date).toLocaleDateString()}</Typography>
        <Typography variant="body1">Time: {formatTime(appointment.time)}</Typography>
        <Typography variant="body1">Status: {appointment.status}</Typography>
        <Button variant="contained" color="primary" onClick={() => onApprove(appointment._id)} style={{ marginRight: '10px' }}>
          Approve
        </Button>
        <Button variant="contained" color="secondary" onClick={() => onReject(appointment._id)}>
          Reject
        </Button>
      </CardContent>
    </Card>
  );
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('');
  const [studentId, setStudentId] = useState('');
  const [students, setStudents] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { name, id } = location.state || {};

  useEffect(() => {
    // Fetch student names
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/students'); // Adjust the API endpoint as needed
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    // Get messages
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/messages?teacherId=${id}`);
        console.log(response);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    setActiveSection('schedule')

    fetchStudents();
    fetchMessages();
  }, [id]);

  useEffect(() => {
    // Fetch appointments for the teacher
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/appointments/${name}`); // Adjust the API endpoint as needed
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, [name]);

  useEffect(() => {
    // Load active section from localStorage
    const savedSection = localStorage.getItem('activeSection');
    if (savedSection) {
      setActiveSection(savedSection);
    }
  }, []);

  useEffect(() => {
    // Save active section to localStorage whenever it changes
    if (activeSection) {
      localStorage.setItem('activeSection', activeSection);
    }
  }, [activeSection]);
console.log(name);
  const handleLogout = () => {
   if(name!==undefined) localStorage.removeItem('token');
    localStorage.removeItem('activeSection');
    navigate('/login');
  };

  const showSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const handleSchedule = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/teacher-appointments/schedule', {
        teacherId: id,
        studentId: studentId,
        date,
        time: formatTime(time),
      });
      setDate('');
      setStudentId('');
      setTime('');
      alert('Appointment scheduled successfully');
    } catch (error) {
      console.error(error);
      alert('Error scheduling appointment');
    }
  };

  const handleApprove = async (appointmentId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/appointments/${appointmentId}/status`, { status: 'approved' });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) => (appt._id === appointmentId ? { ...appt, status: 'approved' } : appt))
      );
    } catch (error) {
      console.error('Error approving appointment:', error);
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/api/appointments/${appointmentId}/status`, { status: 'rejected' });
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) => (appt._id === appointmentId ? { ...appt, status: 'rejected' } : appt))
      );
    } catch (error) {
      console.error('Error rejecting appointment:', error);
    }
  };

  const handleSendReply = async (studentName, replyContent) => {
    const d = new Date(Date.now());
    const date = d.toLocaleDateString();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    console.log(replyContent);
    try {
      const response = await axios.post('http://localhost:5000/api/reply', {
        teacherId: id,
        studentName: studentName,
        sendAt: date,
        time: formatTime(formattedTime),
        content: replyContent,
      });
      console.log(response.data);
      // Optionally update messages state if needed
      alert('Reply sent successfully');
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Error sending reply');
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <Typography variant="h4">Teacher Dashboard</Typography>
        <Typography variant='h5'>Welcome! {name}</Typography>
        <LogoutButton variant="contained" onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <Box mb={2}>
        <NavButton onClick={() => showSection('schedule')}>Schedule Appointment</NavButton>
        <NavButton onClick={() => showSection('view-appointments')}>View Appointments</NavButton>
        <NavButton onClick={() => showSection('view-messages')}>View Messages</NavButton>
      </Box>

      <Section id="schedule" style={activeSection === 'schedule' ? activeStyle : {}}>
        <Typography variant="h5" gutterBottom>Schedule Appointment</Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel id="student-select-label">Select Student</InputLabel>
          <Select
            labelId="student-select-label"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            label="Select Student"
          >
            {students.map(student => (
              <MenuItem key={student._id} value={student._id}>{student.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          label="Time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSchedule} style={{ marginTop: '10px' }}>
          Schedule
        </Button>
      </Section>

      <Section id="view-appointments" style={activeSection === 'view-appointments' ? activeStyle : {}}>
        <Typography variant="h5" gutterBottom>View Appointments</Typography>
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        ))}
      </Section>

      <Section id="view-messages" style={activeSection === 'view-messages' ? activeStyle : {}}>
        <Typography variant="h5" gutterBottom>View Messages</Typography>
        {messages.map((message) => (
          <MessageCard
            key={message._id}
            message={message}
            onSendReply={handleSendReply}
          />
        ))}
      </Section>
    </DashboardContainer>
  );
};

export default TeacherDashboard;
