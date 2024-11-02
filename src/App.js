// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Garage from './pages/Garage';
import User from './pages/User';
import CarQuiz from './pages/Car-Quiz'; // Updated import for Car-Quiz.js

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/user" element={<User />} />
        <Route path="/car-quiz" element={<CarQuiz />} /> {/* Route for Car Quiz */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
