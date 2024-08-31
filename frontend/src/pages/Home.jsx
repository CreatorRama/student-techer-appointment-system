import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

// Keyframes for the color transition effect
const colorTransition = keyframes`
  0% {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
  50% {
    background: linear-gradient(135deg, #e2c3f5 0%, #cfe2c3 100%);
  }
  100% {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  }
`;

const HomeContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  textAlign: 'center',
  animation: `${colorTransition} 5s ease-in-out infinite`,
  backgroundSize: '200% 200%',
});

const HomeButton = styled(Button)({
  marginTop: '20px',
  padding: '10px 20px',
  borderRadius: '30px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#283593',
  },
});

const Home = () => {
  return (
    <HomeContainer className='overflow-hidden'>
      <Typography variant="h2" gutterBottom>
        Welcome to Our Platform
      </Typography>
      <Typography variant="h6" gutterBottom>
        Your journey to learning and teaching starts here.
      </Typography>
      <Box>
        <Link to="/login" style={{ textDecoration: 'none' }}>
          <HomeButton startIcon={<LoginIcon />}>Login</HomeButton>
        </Link>
        <Link to="/register" style={{ textDecoration: 'none', marginLeft: '10px' }}>
          <HomeButton startIcon={<AppRegistrationIcon />}>Register</HomeButton>
        </Link>
        <Link to="/admin" style={{ textDecoration: 'none', marginLeft: '10px' }}>
          <HomeButton startIcon={<AdminPanelSettingsIcon />}>Admin Login</HomeButton>
        </Link>
      </Box>
    </HomeContainer>
  );
};

export default Home;
