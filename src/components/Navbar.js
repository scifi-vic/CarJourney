import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { FaUserCircle, FaSignInAlt } from "react-icons/fa"; // Icons for logged in and logged out states
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../styles/Navbar.css";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle for login state
  const [anchorEl, setAnchorEl] = useState(null); // Anchor for dropdown menu
  const [openRegisterModal, setOpenRegisterModal] = useState(false); // Register modal state
  const [openLoginModal, setOpenLoginModal] = useState(false); // Login modal state

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Set login state based on user presence
    });
    return unsubscribe; // Clean up listener on component unmount
  }, []);

  // Open the dropdown menu
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close the dropdown menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Open/Close Modals for Login and Register
  const handleLoginModalOpen = () => setOpenLoginModal(true);
  const handleLoginModalClose = () => setOpenLoginModal(false);

  const handleRegisterModalOpen = () => setOpenRegisterModal(true);
  const handleRegisterModalClose = () => setOpenRegisterModal(false);

  // Sign out user
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        handleMenuClose(); // Close menu on sign out
      })
      .catch((error) => console.error("Sign-out error:", error));
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "rgb(36, 32, 88)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", height: "80px", padding: "0 20px" }}>
        
        {/* Logo or Brand Name */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ color: "white", textDecoration: "none", fontSize: "24px" }}
        >
          CarJourney
        </Typography>
        
        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Button component={Link} to="/" color="inherit" sx={{ fontSize: "18px", color: "aliceblue" }}>
            Home
          </Button>
          <Button component={Link} to="/about" color="inherit" sx={{ fontSize: "18px", color: "aliceblue" }}>
            About
          </Button>
          <Button component={Link} to="/garage" color="inherit" sx={{ fontSize: "18px", color: "aliceblue" }}>
            Garage
          </Button>
        </Box>

        {/* User Icon */}
        {isLoggedIn ? (
          <IconButton onClick={handleMenuClick} sx={{ color: "white" }}>
            <FaUserCircle size={24} />
          </IconButton>
        ) : (
          <IconButton onClick={handleLoginModalOpen} sx={{ color: "white" }}>
            <FaSignInAlt size={24} />
          </IconButton>
        )}

        {/* Dropdown Menu (Logged In) */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 2 }}
        >
          <MenuItem onClick={handleMenuClose} component={Link} to="/settings">User Settings</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>

        {/* Login Modal (Logged Out) */}
        <LoginModal
          open={openLoginModal}
          onClose={handleLoginModalClose}
          onRegisterClick={() => {
            handleLoginModalClose();
            handleRegisterModalOpen();
          }}
        />

        {/* Register Modal (Logged Out) */}
        <RegisterModal open={openRegisterModal} onClose={handleRegisterModalClose} />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
