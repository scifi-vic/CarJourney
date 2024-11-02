// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Garage from './pages/Garage';
import User from './pages/User';
import CarQuiz from './pages/Car-Quiz';
import LocateDealer from './pages/LocateDealer'; // Import for LocateDealer component

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/garage" element={<Garage />} />
        <Route path="/user" element={<User />} />
        <Route path="/car-quiz" element={<CarQuiz />} />
        <Route path="/locate-dealer" element={<LocateDealer />} /> {/* Route for Locate Dealer */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
