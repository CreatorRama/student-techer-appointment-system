import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/system';
import { Card, CardContent, Grid, Typography, Button, Modal, Box, TextField, IconButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MessageIcon from '@mui/icons-material/Message';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

// Styled components
const Root = styled('div')({
  padding: '20px',
  backgroundColor: '#f0f2f5',
  minHeight: '100vh',
});

const Title = styled(Typography)({
  marginBottom: '20px',
  color: '#3f51b5',
  textAlign: 'center',
});

const StyledCard = styled(Card)({
  minHeight: '150px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#3f51b5',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const StudentCard = styled(Card)({
  marginBottom: '20px',
  backgroundColor: '#e3f2fd',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
});

const ModalStyle = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalContent = styled(Box)({
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  outline: 'none',
  width:'75vw',
  maxHeight: '80vh',
  overflowY: 'auto',
});

const Form = styled('form')({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
});

const LogoutIconStyled = styled(IconButton)({
  position: 'absolute',
  top: '20px',
  right: '20px',
});
const formatTime = (time) => {
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const AdminPanel = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState({ name: '', email: '', password: '', department: '', subject: '' });
  const [open, setOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState({});
const [messagesOpen, setMessagesOpen] = useState(false);
  const [appointment, setAppointment] = useState({ studentName: '', teacherName: '', date: '', time: '' });
  const apiUrl = import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');


  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchMessages();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/teachers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log(res);
      setTeachers(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      // console.log(res.data); // Log the response data
      setMessages(res.data.messages); // Set the correct part of the response data
    } catch (error) {
      console.error(error);
    }
  };
  

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/students`);
      const studentsData = response.data;

      // Initialize students and approval status
      setStudents(studentsData);
      const approvedMap = {};
      studentsData.forEach(student => {
        approvedMap[student._id] = student.status === 'approved';
      });
      setApprovedStudents(approvedMap);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const addOrUpdateTeacher = async (e) => {
    e.preventDefault();
    try {
      if (editingTeacherId) {
        await axios.put(`${apiUrl}/api/teachers/${editingTeacherId}`, teacher, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        await axios.post('http://localhost:5000/api/teachers', teacher, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      }
      fetchTeachers();
      setTeacher({ name: '', email: '', password: '', department: '', subject: '' });
      setOpen(false);
      setEditingTeacherId(null);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const editTeacher = (id) => {
    const teacherToEdit = teachers.find((t) => t._id === id);
    setTeacher({ name: teacherToEdit.name, email: teacherToEdit.email, password: teacherToEdit.password, department: teacherToEdit.department, subject: teacherToEdit.subject });
    setEditingTeacherId(id);
    setOpen(true);
  };

  const deleteTeacher = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/teachers/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      fetchTeachers();
      setEditingTeacherId(null);
      setTeacher({ name: '', email: '', password: '', department: '', subject: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleScheduleOpen = (student) => {
    setAppointment({ ...appointment, studentName: student.name });
    setScheduleOpen(true);
  };

  const handleScheduleClose = () => {
    setScheduleOpen(false);
    setAppointment({ studentName: '', teacherName: '', date: '', time: '' })
  };

  const handleScheduleAppointment = async (e) => {
    e.preventDefault();
    console.log(appointment);
    const {studentName,teacherName,date,time}=appointment
 const t=formatTime(time)
    try {
      await axios.post(`${apiUrl}/api/adminappointments/appointment`,{studentName,teacherName,date,t}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setScheduleOpen(false);
      setAppointment({ studentName: '', teacherName: '', date: '', time: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveAppointment = async (studentId) => {
    try {
      await axios.patch(`${apiUrl}/api/students/${studentId}`, { status: 'approved' });

      setApprovedStudents(prevState => ({
        ...prevState,
        [studentId]: true,
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deletestudent = async (studentId) => {
    try {
      // Make API call to approve appointment
      const res=await axios.delete(`${apiUrl}/api/students/${studentId}`);

      console.log(res);
      fetchStudents()
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleOpenManageTeachers = () => {
    setTeacher({ name: '', email: '', password: '', department: '', subject: '' });
    setEditingTeacherId(null);
    setOpen(true);
  };

  const handleopenmessages=()=>{
    setMessagesOpen(true)
  }

  return (
    <Root>
      <LogoutIconStyled onClick={handleLogout} color="primary">
        <LogoutIcon />
      </LogoutIconStyled>
      <Title variant="h3">Admin Dashboard</Title>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StyledCard onClick={handleOpenManageTeachers}>
            <CardContent className='hover:text-green-500' style={{ cursor: 'pointer' }}>
              <PeopleIcon fontSize="large" />
              <Typography variant="h5">Manage Teachers</Typography>
              <Typography>View and manage teacher profiles</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardContent className='hover:text-red-500' style={{ cursor: 'pointer' }}>
              <ScheduleIcon fontSize="large" />
              <Typography variant="h5">Appointments</Typography>
              <Typography>Approve and schedule appointments</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <StyledCard onClick={handleopenmessages}>
            <CardContent className='hover:text-yellow-500'>
              <MessageIcon fontSize="large" />
              <Typography style={{ cursor: 'pointer' }} variant="h5">Messages</Typography>
              <Typography>View messages from users</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      <ModalStyle  open={open} onClose={() => setOpen(false)}>
        <ModalContent>
          <Typography variant="h6">{editingTeacherId ? 'Edit Teacher' : 'Add a New Teacher'}</Typography>
          <Form onSubmit={addOrUpdateTeacher}>
            <TextField
              label="Name"
              value={teacher.name}
              onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              value={teacher.email}
              onChange={(e) => setTeacher({ ...teacher, email: e.target.value })}
              required
            />
            <TextField
              label="Password"
              value={teacher.password}
              onChange={(e) => setTeacher({ ...teacher, password: e.target.value })}
              required
              type="password"
            />
            <TextField
              label="Department"
              value={teacher.department}
              onChange={(e) => setTeacher({ ...teacher, department: e.target.value })}
              required
            />
            <TextField
              label="Subject"
              value={teacher.subject}
              onChange={(e) => setTeacher({ ...teacher, subject: e.target.value })}
              required
            />
            <Button type="submit" variant="contained" color="primary">
              {editingTeacherId ? 'Update Teacher' : 'Add Teacher'}
            </Button>
          </Form>
          <Typography className='text-grey-500 py-4' variant="h5">Teachers List</Typography>
          <div>
            {teachers.map((t) => (
              <StudentCard key={t._id}>
                <CardContent>
                  <Typography variant="h6">{t.name}</Typography>
                  <Typography>Email: {t.email}</Typography>
                  <Typography>Department: {t.department}</Typography>
                  <Typography>Subject: {t.subject}</Typography>
                  <Button variant="contained" color="primary" onClick={() => editTeacher(t._id)}>
                    Edit
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() => deleteTeacher(t._id)}>
                    Delete
                  </Button>
                </CardContent>
              </StudentCard>
            ))}
          </div>
        </ModalContent>
      </ModalStyle>

      <ModalStyle open={scheduleOpen} onClose={handleScheduleClose}>
        <ModalContent>
          <Typography variant="h6">Schedule Appointment</Typography>
          <Form onSubmit={handleScheduleAppointment}>
            <TextField
              label="Student Name"
              value={appointment.studentName}
              onChange={(e) => setAppointment({ ...appointment, studentName: e.target.value })}
              required
              disabled
            />
         <TextField
              select
              variant="outlined"
              fullWidth
              label="Select Teacher"     
              value={appointment.teacherName}       
              onChange={(e) => setAppointment({ ...appointment, teacherName: e.target.value })}
              SelectProps={{ native: true }}
              style={{ marginBottom: '20px' }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <option value="">--Select Teacher--</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher.name}>
                  {teacher.name}
                </option>
              ))}
            </TextField>
            <TextField
              label="Date"
              value={appointment.date}
              onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
              required
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Time"
              value={appointment.time}
              onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
              required
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button type="submit" variant="contained" color="primary">
              Schedule
            </Button>
          </Form>
        </ModalContent>
      </ModalStyle>

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student._id}>
            <StudentCard>
              <CardContent>
                <Typography variant="h6">{student.name}</Typography>
                <Typography>Email: {student.email}</Typography>
                <Typography>Role: {student.role}</Typography>
                <Button variant="contained" color="primary" onClick={() => handleScheduleOpen(student)}>
                  Schedule Appointment
                </Button>
                <Button
            variant="contained"
            color="success"
            style={{ marginLeft: '10px' }}
            onClick={() => handleApproveAppointment(student._id)}
            disabled={approvedStudents[student._id]}
          >
            {approvedStudents[student._id] ? 'Approved' : 'Approve'}
          </Button>
                <Button
                  variant="contained"
                  color="success"
                  style={{ marginLeft: '10px',marginBlock:'10px'}}
                  onClick={() => deletestudent(student._id)} // Adjust if needed
                >
                  delete
                </Button>
              </CardContent>
            </StudentCard>
          </Grid>
        ))}
      </Grid>

      <ModalStyle open={messagesOpen} onClose={() => setMessagesOpen(false)}>
  <ModalContent>
    <Typography variant="h6">Messages</Typography>
    <Box>
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <Card key={index} style={{ marginBottom: '10px' }}>
            <CardContent>
              <Typography className='text-red-500' variant="h6">Student Name: {message.studentName}</Typography>
              <Typography  className='text-blue-500' variant="subtitle1">Teacher Name: {message.teacherName}</Typography>
              <Typography  className='text-green-500'>Message: {message.content}</Typography>
              <Typography  className='text-yellow-500'>Date: {message.sendAt}</Typography>
              <Typography  className='text-pink-500'>Time: {message.time}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No messages available</Typography>
      )}
    </Box>
  </ModalContent>
</ModalStyle>

    </Root>
  );
};

export default AdminPanel;
