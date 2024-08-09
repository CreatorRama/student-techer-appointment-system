import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'
// import './styles/index.css'; // Import global styles if any

// Create a root element for React to render into
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component into the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
