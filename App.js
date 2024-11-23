// src/App.js
import React, { useState, useEffect, Suspense, lazy } from 'react';
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

// Miguel
const CarListing = lazy(() => import('./pages/CarListing'));
const Finance = lazy(() => import('./pages/Finance'));
const AddCar = lazy(() => import('./pages/Add-Car'));
const FavoriteCar = lazy(() => import('./pages/Favorite-Car'));
const SaveSearch = lazy(() => import('./pages/SaveSearch'));

// Amaar
const CarSearchPage = lazy(() => import('./pages/CarSearchPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const AdvancedSearchPage = lazy(() => import('./pages/AdvancedSearchPage'));


function App() {

  return (
    <div>
      {/* Router */}
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
                {/* Miguel */}
                <Route path="/car-listing" element={<CarListing />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/add-car" element={<AddCar />} />
                <Route path="/favorited-cars" element={<FavoriteCar />} />
                <Route path="/saved-searches" element={<SaveSearch />} />
                {/* Amaar */}
                <Route path="/search" element={<CarSearchPage />} />
                <Route path="/results" element={<ResultsPage />} /> {/* Route for ResultsPage */}
                <Route path="/advanced-search" element={<AdvancedSearchPage />} /> {/* Route for AdvancedSearchPage */}
              </Routes>     
            </div>
          </Suspense>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
