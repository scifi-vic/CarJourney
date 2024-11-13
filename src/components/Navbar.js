import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignInAlt } from "react-icons/fa";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../styles/Navbar.css";
import logo from '../assets/logo.png';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLoginModalOpen = () => setOpenLoginModal(true);
  const handleLoginModalClose = () => setOpenLoginModal(false);
  const handleRegisterModalOpen = () => setOpenRegisterModal(true);
  const handleRegisterModalClose = () => setOpenRegisterModal(false);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      handleMenuClose();
    }).catch((error) => console.error("Sign-out error:", error));
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "rgb(36, 32, 88)" }}>
      <Toolbar className="toolbar">
        <Box className="logo-container">
          <Typography variant="h6" component={Link} to="/" className="logo-text">
            CarJourney
          </Typography>
          <img src={logo} alt="Logo" className="logo-image" />

        </Box>

        <Box className="links">
          <Button component={Link} to="/" className="nav-link">Home</Button>
          <Button component={Link} to="/about" className="nav-link">About</Button>
          <Button component={Link} to="/garage" className="nav-link">Garage</Button>
        </Box>

        <Box className="user-icon-wrapper">
          {isLoggedIn ? (
            <IconButton onClick={handleMenuClick} className="user-icon">
              <Avatar sx={{ bgcolor: "white", color: "rgb(36, 32, 88)" }}>
                <FaUserCircle size={24} />
              </Avatar>
            </IconButton>
          ) : (
            <IconButton onClick={handleLoginModalOpen} className="user-icon">
              <FaSignInAlt size={24} style={{ color: "white" }} />
            </IconButton>
          )}
        </Box>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} sx={{ mt: 2 }}>
          <MenuItem onClick={handleMenuClose} component={Link} to="/settings">User Settings</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>

        <LoginModal
          open={openLoginModal}
          onClose={handleLoginModalClose}
          onRegisterClick={() => {
            handleLoginModalClose();
            handleRegisterModalOpen();
          }}
        />

        <RegisterModal open={openRegisterModal} onClose={handleRegisterModalClose} />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
