import React, { useState } from 'react';
import { useNavigate,} from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl, Alert } from '@mui/material';
import { styled } from '@mui/system';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ErrorIcon from '@mui/icons-material/Error';
import { Link } from 'react-router-dom'; // Import Link here
import '../styles/Login.css';

// Styled components for login page
const LoginContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  position: 'relative' // Add relative positioning
});

const LoginButton = styled(Button)({
  marginTop: '20px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#283593',
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const [error, setError] = useState(''); // State for error messages
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);

      // Assume the response contains the user's name
      const userName = res.data.name;
      const sid = res.data._id;

      // Navigate based on the role and pass the userName
      if (res.data.role === 'teacher' && role === 'teacher') {
        navigate('/teacher-dashboard', { state: { name: userName, id: sid } });
      } else if (res.data.role === 'admin') {
        setError('Invalid Credentials');
      } else if (res.data.role === 'student' && role === 'student') {
        navigate('/student-dashboard', { state: { name: userName, id: sid, email: res.data.email } });
      } else if ((res.data.role === 'teacher' && role === 'student') || (res.data.role === 'student' && role === 'teacher')) {
        setError('Invalid Role');
        setTimeout(() => {
          setError('');
        }, 1000);
      } else {
        setError('Role is wrong');
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
      setTimeout(() => {
        setError('');
      }, 1000);
    }
  };

  return (
    <LoginContainer>
      <Link to="/" className='hover:text-yellow-600 absolute top-2.5 left-2.5 text-blue-600 no-underline'>
        Go To Home
      </Link>
      <LockOutlinedIcon id='lockicon' style={{ fontSize: '50px', color: 'rgb(56,189,200)' }} />
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={login} style={{ width: '100%' }}>
        {error && (
          <Alert severity="error" className={`-my-14 flex sm:min-w-40 absolute items-center`}>
            <ErrorIcon style={{ marginRight: '10px' }} /> {error}
          </Alert>
        )}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError('');
          }}
        />
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label="Role"
          >
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            {/* <MenuItem value="admin">Admin</MenuItem> */}
          </Select>
        </FormControl>
        <LoginButton type="submit" fullWidth>
          Login
        </LoginButton>
        <Grid container>
          <Grid item>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography className='hover:text-red-500'  variant="body2">{"Don't have an account? Register"}</Typography>
            </Link>
          </Grid>
        </Grid>
      </form>
    </LoginContainer>
  );
};

export default Login;
