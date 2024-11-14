// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './styles/Footer.css'; // Ensure CSS is imported to apply the styles

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Garage = lazy(() => import('./pages/Garage'));
const User = lazy(() => import('./pages/User'));
const CarQuiz = lazy(() => import('./pages/Car-Quiz'));
const LocateDealer = lazy(() => import('./pages/LocateDealer'));

function App() {
  return (
    <Router>
      <div className="content-wrap">
        <Navbar />
        <Suspense fallback={<div>Loading...</div>}>
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/garage" element={<Garage />} />
              <Route path="/user" element={<User />} />
              <Route path="/car-quiz" element={<CarQuiz />} />
              <Route path="/locate-dealer" element={<LocateDealer />} />
            </Routes>
          </div>
        </Suspense>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
