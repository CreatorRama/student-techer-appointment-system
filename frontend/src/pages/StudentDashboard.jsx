import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Tabs, Tab, Box, Card, CardContent
} from '@mui/material';
import { fontSize, styled } from '@mui/system';

// Styled components
// const DashboardContainer = styled(Container)({
//   // display: 'flex',
//   // flexDirection: 'column',
//   // alignItems: 'center',
//   // padding: '20px',
//   // background: '#f5f7fa',
//   // minHeight: '100vh',
// });

const Header = styled(Box)({
  // width: '100%',
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
  '@media (max-width: 600px)': {
    width: '40px', // Apply width of 40px for screens less than 600px
    fontSize:'10px',
  },
});

const DashboardTabs = styled(Tabs)({
  marginBottom: '20px',
});

const DashboardTabPanel = styled(Box)({
  padding: '20px',
  background: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  width: '100%',
});

const DashboardCard = styled(Card)({
  maxWidth: '100%',
  margin: '20px 0',
});

const ResultCard = styled(Card)({
  marginBottom: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const ResultContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});

const MessageCard = styled(Card)({
  marginBottom: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const MessageContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
});



const formatTime = (time) => {
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

const StudentDashboard = () => {
  const [value, setValue] = useState(0);
  const [teacher, setTeacher] = useState('');
  const [teachers, setTeachers] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [message, setMessage] = useState('');
  const [messagesent, setMessagesent] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [searchResults, setSearchResults] = useState({ name: '', department: '', subject: '' });
  const [searchResultMessage, setSearchResultMessage] = useState('');
  const [teacherid, setTeacherId] = useState('');
  const [replies, setReplies] = useState([]);
  const [searchresult,setsearchresult]=useState('')
  const [showReplies, setShowReplies] = useState(false);  // New state for delayed rendering
  const navigate = useNavigate();
  const location = useLocation();
  const { name, id, email } = location.state || {};

  const apiUrl = import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/teachers`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setTeachers(res.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    const fetchReplies = async () => {
      // console.log(name);
      try {
        const res = await axios.get(`${apiUrl}/api/replies/get?studentName=${name}`);
        // console.log(res);
        setReplies([res.data.reply,res.data.teachernames]);
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    fetchTeachers();
    fetchReplies();
  }, [name]);

  useEffect(() => {
    const savedTab = sessionStorage.getItem('activeTab');
    if (savedTab !== null) {
      setValue(Number(savedTab));
    }
  }, []);

  useEffect(() => {
    if (replies.length > 0) {
      const timer = setTimeout(() => {
        setShowReplies(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [replies]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    sessionStorage.setItem('activeTab', newValue);
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
  function lowercaseFirstAndUppercaseRest(string) {
    if (string.length === 0) return string; // handle empty string
    return string.charAt(0).toLowerCase() + string.slice(1).toUpperCase();
  }

  const handleSearchTeacher = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/teachers`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      });
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        const ele=element.name
        if (ele === teacher || ele.toLowerCase()===teacher || ele.toUpperCase()===teacher ||capitalizeFirstLetter(ele)===teacher || lowercaseFirstAndUppercaseRest(ele)==teacher) {
          setSearchResults(element);
        }
        else{
          setSearchResultMessage('No Results Found')
          setTimeout(() => {
            setSearchResultMessage('')
          }, 2000);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOptionChange = (e) => {
    setTeacherId(e.target.value);
  };
// console.log(appointmentTime);
  
  const handleBookAppointment = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/appointments/book`, {
        studentId: id,
        teacherId: teacherid,
        StudentEmail: email,
        date: appointmentDate,
        time: appointmentTime!==''?formatTime(appointmentTime):''
      });
      setResponseMessage(response.data.message);
      setTimeout(() => {
        setResponseMessage('');
      }, 1000);
      setTeacherId('');
      setAppointmentDate('');
      setAppointmentTime('');
    } catch (error) {
      console.error('Error booking appointment:', error);
      const isDateEmpty = !appointmentDate;
      const isTimeEmpty = !appointmentTime;
      
      setResponseMessage(
        isDateEmpty && isTimeEmpty ? 'Please enter date and time' :
        isDateEmpty ? 'Please enter date' :
        isTimeEmpty ? 'Please enter time' :
        ''
      );
      setTimeout(() => {
        setResponseMessage('');       
      }, 1000);
    }
  };


  const handleSendMessage = async () => {
    const d=new Date(Date.now())
    console.log(d);
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
   const date=d.toLocaleDateString()
   const time=`${hours}:${minutes}`
   console.log(time);
    try {
      const response = await axios.post(`${apiUrl}/api/messages/send`, {
        studentId: id,
        teacherId: teacherid,
        content: message,
        sendAt:date,
        time:formatTime(time)
      });

      setMessage('');
      setTeacherId('');
      setMessagesent('Message sent successfully');
      setTimeout(() => {
        setMessagesent('');
      }, 1000);
      console.log('Message sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLogout = () => {
    if(name!==undefined) localStorage.removeItem('token');
    sessionStorage.removeItem('activeTab');
    navigate('/login');
  };

  const changedate = (() => {
    return (date) => {
      const dateObject = new Date(date);
      if (isNaN(dateObject.getTime())) {
        console.error("Invalid date:", date);
        return "Invalid Date";
      }
      return dateObject.toLocaleString();
    };
  })();

  return (
    <Container className='flex flex-col items-center p-5 bg-[#f5f7fa] min-h-screen'>
      <Header>
      <Typography 
  variant="h4"
  sx={{
    fontSize: {
      xs: '0.9rem', // small font size for devices less than 500px
      sm: '2.125rem', // normal h4 font size for larger devices
    },
  }}
>
  Student Dashboard
</Typography>
        <Typography variant="h6">Welcome, {name}!</Typography>
        <LogoutButton style={{marginTop:'-10px'}} onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <DashboardTabs
  value={value}
  onChange={handleChange}
  aria-label="dashboard tabs"
  variant="scrollable"
  scrollButtons="auto"
  sx={{
    borderBottom: '1px solid #ddd',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px', /* Adjust the height as needed */
      background: 'linear-gradient(#ff2e5f, #bbb99b)', /* Gradient color */
      zIndex: 1,
    },
    '& .MuiTabs-flexContainer': {
      position: 'relative',
      zIndex: 2, /* Ensure tabs are above the gradient border */
    },
  }}
>
  <Tab label="Search Teacher" sx={{ minWidth: 'fit-content' }} />
  <Tab label="Book Appointment" sx={{ minWidth: 'fit-content' }} />
  <Tab label="Send Message" sx={{ minWidth: 'fit-content' }} />
  <Tab label="Received Messages" sx={{ minWidth: 'fit-content' }} />
</DashboardTabs>


      <DashboardTabPanel hidden={value !== 0}>
        <DashboardCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Search for a Teacher
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              label="Teacher Name"
              value={teacher}
              onChange={(e) => {
                if (e.target.value.length === 0) {
                  setSearchResults({ name: '', department: '', subject: '' });
                }
                setTeacher(e.target.value);
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              style={{ marginTop: '20px' }}
              onClick={handleSearchTeacher}
            >
              Search
            </Button>
            {searchResults.name !== '' ? (
              <ResultCard>
                <ResultContent>
                  <Typography variant="h6">Name: {searchResults.name}</Typography>
                  <Typography variant="body1">Department: {searchResults.department}</Typography>
                  <Typography variant="body1">Subject: {searchResults.subject}</Typography>
                </ResultContent>
              </ResultCard>
            ) :<Typography variant="h6" className='text-red-700'>{searchResultMessage}</Typography>}
          </CardContent>
        </DashboardCard>
      </DashboardTabPanel>
      <DashboardTabPanel hidden={value !== 1}>
        <DashboardCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Book an Appointment
            </Typography>
            <TextField
              select
              variant="outlined"
              fullWidth
              label="Select Teacher"
              value={teacherid}
              onChange={handleOptionChange}
              SelectProps={{ native: true }}
              style={{ marginBottom: '20px' }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <option value="">--Select Teacher--</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </TextField>
            <TextField
              type="date"
              variant="outlined"
              fullWidth
              label="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              style={{ marginBottom: '20px' }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              type="time"
              variant="outlined"
              fullWidth
              label="Appointment Time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              style={{ marginBottom: '20px' }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleBookAppointment}
            >
              Book Appointment
            </Button>
            {responseMessage && (
              <Typography variant="body1" style={{ marginTop: '20px',color:'red' }}>
                {responseMessage}
              </Typography>
            )}
          </CardContent>
        </DashboardCard>
      </DashboardTabPanel>
      <DashboardTabPanel hidden={value !== 2}>
        <DashboardCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Send Message to Teacher
            </Typography>
            <TextField
              select
              variant="outlined"
              fullWidth
              label="Select Teacher"
              value={teacherid}
              onChange={handleOptionChange}
              SelectProps={{ native: true }}
              style={{ marginBottom: '20px' }}
              InputLabelProps={{
                shrink: true,
              }}
            >
              <option value="">--Select Teacher--</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </TextField>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ marginBottom: '20px' }}
              InputProps={{
                style: {
                  color: 'red',
                },}}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSendMessage}
            >
              Send Message
            </Button>
            {messagesent && (
              <Typography  variant="body1" style={{ marginTop: '20px',background:
              'linear-gradient(90deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82)',
              WebkitBackgroundClip:'text',
              WebkitTextFillColor:'transparent',
              fontSize:'1rem',
              fontWeight:'bold'             
              }}>

                {messagesent}
              </Typography>
            )}
          </CardContent>
        </DashboardCard>
      </DashboardTabPanel>
      <DashboardTabPanel hidden={value !== 3}>
        <DashboardCard>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Received Messages
            </Typography>
            {showReplies ? (
              replies.length > 0 ? (
                replies[0].map((reply, index) => (
                  <MessageCard key={index}>
                    <MessageContent>
                      <Typography className='text-red-300' variant="body1">Teacher: {replies[1][index].name}</Typography>
                      <Typography className='text-blue-500' variant="body1">Message: {reply.content}</Typography>
                      <Typography className='text-green-500' variant="body1">Date: {reply.sendAt}</Typography>
                      <Typography className='text-yellow-300' variant="body1">Time: {(reply.time)}</Typography>
                    </MessageContent>
                  </MessageCard>
                ))
              ) : (
                <Typography variant="body1">No messages received</Typography>
              )
            ) : (
              <Typography variant="body1">Loading messages...</Typography>
            )}
          </CardContent>
        </DashboardCard>
      </DashboardTabPanel>
    </Container>
  );
};

export default StudentDashboard;
