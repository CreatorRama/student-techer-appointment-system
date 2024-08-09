import React from 'react';
import { Navigate } from 'react-router-dom';

const Teacherprivateroute = ({ element }) => {
    const isAuthenticated = localStorage.getItem('token') && localStorage.getItem('token')!='undefined'; // Check if the token exists

    return isAuthenticated ? element : <Navigate to="/login" />;
  
};

export default Teacherprivateroute ;