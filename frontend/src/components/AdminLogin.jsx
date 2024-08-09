import React, { useState } from 'react';
import { display, styled } from '@mui/system';
import { Typography, TextField, Button, Paper, IconButton, Alert } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define styled components using `styled` from @mui/system
const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
  padding: '20px',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: '20px',
  paddingTop:'0px',
  maxWidth: '400px',
  width: '100%',
  borderRadius: '15px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#fff',
  textAlign: 'center',
}));

const Title = styled(Typography)(({ theme }) => ({
  marginBottom: '10px',
  color: '#3f51b5',
}));

const Logo = styled(IconButton)(({ theme }) => ({
  marginBottom: '20px',
  fontSize: '3rem',
  color: '#ff7e5f',
}));

const Input = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
}));

const PasswordInput = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: '10px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
}));

const Error = styled(Alert)(({ theme }) => ({
  marginBottom: '20px',
}));

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/admin', { email, password });
      localStorage.setItem('token', res.data.token);

      // Assume the response contains the user's name
      const userName = res.data.name;

      // Navigate based on the role and pass the userName
      if (res.data.role === 'admin') {
        navigate('/adminlogin', { state: { name: userName } });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
      setTimeout(() => {
        setError('')
      }, 1000);
    }
  };

  return (
    <Root>
      <StyledPaper>
      <Link  to={'/'}> <LoginIcon  className='text-red-700 my-3'/></Link>
        <Title variant='h4' >Admin Login</Title>
        {error && <Error severity="error">{error}</Error>}
        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <SubmitButton type="submit" variant="contained">
            <Typography variant="body2">LOGIN</Typography>
          </SubmitButton>
        </form>
      </StyledPaper>
    </Root>
  );
};

export default AdminLogin;
