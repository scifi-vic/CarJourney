import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import SideBarDrawer from './components/SideBarDrawer';
// import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from "./pages/Home";
import About from "./pages/About";
import User from "./pages/User";
import Garage from "./pages/Garage";
import { RiEdgeFill } from 'react-icons/ri';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<SideBarDrawer />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/garage" element={<Garage />} />
            <Route path="/user" element={<User />} />
          </Route>
        </Routes> 
    </BrowserRouter>
  );
}

export default App
