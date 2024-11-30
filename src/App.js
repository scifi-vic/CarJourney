// src/App.js
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box } from '@mui/material'; // Ensure Box is imported from MUI
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MessagePage from './components/MessagePage';
import './styles/Footer.css'; // Ensure CSS is imported to apply the styles
import UserInbox from './components/UserInbox';
import { auth } from './firebaseConfig'; 

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Garage = lazy(() => import('./pages/Garage'));
const User = lazy(() => import('./pages/User'));
const CarQuiz = lazy(() => import('./pages/Car-Quiz'));
const LocateDealer = lazy(() => import('./pages/LocateDealer'));

function App() {
  // Load initial profile picture from localStorage or use default if not found
  const initialProfilePicture = localStorage.getItem('profilePicture') || 'https://i.imgur.com/GwXJvVn.jpeg';
  const [profilePicture, setProfilePicture] = useState(initialProfilePicture);

  // Update localStorage whenever profilePicture changes
  useEffect(() => {
    localStorage.setItem('profilePicture', profilePicture);
  }, [profilePicture]);

  const currentUserId = auth.currentUser?.uid;
  
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <Navbar profilePicture={profilePicture} />

        {/* Main content area */}
        <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/messaging" element={<MessagePage currentUserId={currentUserId}/>} />
              <Route path="/car-quiz" element={<CarQuiz />} />
              <Route path="/locate-dealer" element={<LocateDealer />} />
              <Route path="/user" element={<User profilePicture={profilePicture} setProfilePicture={setProfilePicture} />}
/>
            </Routes>
          </Suspense>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
