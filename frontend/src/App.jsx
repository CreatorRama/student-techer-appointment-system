// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Register from './pages/Register';
import Home from './pages/Home';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard.jsx';
import AdminLogin from './components/AdminLogin';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import Studentprivateroute from './components/loginprivateroute';
import Teacherprivateroute from './components/registerprivateroute';
import './index.css'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/adminlogin" element={<AdminPanel />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/teacher-dashboard" element={<Teacherprivateroute element={<TeacherDashboard />} />} /> 
        <Route path="/student-dashboard" element={<Studentprivateroute element={<StudentDashboard />} />} />
        <Route path="/adminpanel" element={<PrivateRoute element={<AdminPanel />} />} /> {/* Protect this route */}
      </Routes>
    </Router>
  );
};

export default App;
