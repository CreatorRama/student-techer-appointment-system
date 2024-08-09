import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid, MenuItem, InputLabel, Select, FormControl, Alert } from '@mui/material';
import { styled } from '@mui/system';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link here

// Styled components for registration page
const RegisterContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  background: 'linear-gradient(135deg, #e2c3f5 0%, #cfe2c3 100%)',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'relative' // Add relative positioning
});

const RegisterButton = styled(Button)({
  marginTop: '20px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#283593',
  },
});

// Additional fields for teacher registration
const TeacherFields = ({ formData, handleChange }) => (
  <>
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      label="Department"
      type="text"
      name="department"
      value={formData.department || ''}
      onChange={handleChange}
    />
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      label="Subject"
      type="text"
      name="subject"
      value={formData.subject || ''}
      onChange={handleChange}
    />
  </>
);

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    subject: '',
  });
  const [error, setError] = useState(''); // State to hold error messages
  const navigate = useNavigate(); // Use this hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/auth/register', userData)
      .then(response => {
        const userName = response.data.name;
        const sid = response.data._id;
        console.log(sid);
        // On successful registration, navigate to the dashboard
        if (response.data.role === 'teacher') {
          navigate('/teacher-dashboard', { state: { name: userName } });
        } else {
          navigate('/student-dashboard', { state: { name: userName, id: sid, email: response.data.email } });
        }
      })
      .catch(error => {
        // Set error message if registration fails
        console.log(error.response?.data?.message);
        setError(error.response?.data?.message || 'An error occurred. Please try again.');
        setTimeout(() => {
          setError('');
        }, 1000);
      });
  };

  return (
    <RegisterContainer>
      <Link to="/" className='hover:text-yellow-600 absolute top-2.5 left-2.5 text-blue-600 no-underline'>
        Go To Home
      </Link>
      <PersonAddOutlinedIcon style={{ fontSize: 50, color: '#3f51b5' }} />
      <Typography variant="h5" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Name"
          type="text"
          name="name"
          value={userData.name}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={userData.role}
            onChange={handleChange}
            label="Role"
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            {/* <MenuItem value="admin">Admin</MenuItem> */}
          </Select>
        </FormControl>
        {userData.role === 'teacher' && <TeacherFields formData={userData} handleChange={handleChange} />}
        <RegisterButton type="submit" fullWidth>
          Register
        </RegisterButton>
        <Grid container>
          <Grid item>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography className='hover:text-red-500'  variant="body2">{"Already have an account? Login"}</Typography>
            </Link>
          </Grid>
        </Grid>
      </form>
    </RegisterContainer>
  );
};

export default Register;
