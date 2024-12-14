import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars } from "react-icons/fa";
import RegisterModal from "./RegisterModal";
import LoginModal from "./LoginModal";
import SideBarDrawer from "./SideBarDrawer.js";
import MessagePage from "./MessagePage.js";
import UserInbox from "./UserInbox.js";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "../styles/Navbar.css";
import logo from "../assets/logo.png";

function Navbar({ profilePicture }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleModal = (modalSetter) => modalSetter((prev) => !prev);
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const navigate = useNavigate();
  const handleSignOut = () => {
    signOut(auth)
      .then(handleMenuClose)
      .catch((error) => console.error("Sign-out error:", error));
      navigate('/');
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "rgb(36, 32, 88)",
        zIndex: 1200, // Ensure lower than sidebar toggle button
      }}
    >
      <Toolbar className="toolbar">
        {/* Left Section: Logo and Toggle Button */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            className="logo-container"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <MenuIcon onClick={() => toggleDrawer()} />
            <img src={logo} alt="Logo" className="logo-image" />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              className="logo-text"
            >
              CarJourney
            </Typography>
          </Box>
        </Box>

        {/* Center Links */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
          }}
        >
          <Button component={Link} to="/" className="nav-link">
            Home
          </Button>
          <Button component={Link} to="/search" className="nav-link">
            Search
          </Button>
          <Button component={Link} to="/finance" className="nav-link">
            Finance Calculator
          </Button>
          {isLoggedIn && (
            <Button component={Link} to="/garage" className="nav-link">
              Garage
            </Button>
          )}
          {isLoggedIn && (
            <Button component={Link} to="/messaging" className="nav-link">
              Messages
            </Button>
          )}
          <Button component={Link} to="/car-quiz" className="nav-link">
            Car Quiz
          </Button>
          <Button component={Link} to="/locate-dealer" className="nav-link">
            Locate Dealer
          </Button>
          <Button component={Link} to="/compare-cars" className="nav-link">
            Compare Cars
          </Button>
        </Box>

        {/* Right Aligned User Icon / Login & Register */}
        <Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
          {isLoggedIn ? (
            <>
              <IconButton
                onClick={handleMenuClick}
                className="user-icon"
                aria-label="User menu"
              >
                <Avatar
                  src={profilePicture}
                  sx={{ bgcolor: "white", color: "rgb(36, 32, 88)" }}
                />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{ mt: 2 }}
              >
                <MenuItem onClick={handleMenuClose} component={Link} to="/user">
                  User Settings
                </MenuItem>
                <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                onClick={() => toggleModal(setOpenLoginModal)}
              >
                Login
              </Button>
              <Button
                color="inherit"
                onClick={() => toggleModal(setOpenRegisterModal)}
              >
                Register
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          edge="end"
          color="inherit"
          onClick={toggleDrawer}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <FaBars />
        </IconButton>

        {/* Drawer for Mobile Links */}
        <SideBarDrawer
          drawerOpen={drawerOpen}
          setDrawerOpen={(bool) => setDrawerOpen(bool)}
        />
        {/* <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
          <List>
            <ListItem button component={Link} to="/" onClick={toggleDrawer}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/about" onClick={toggleDrawer}>
              <ListItemText primary="About" />
            </ListItem>
            {isLoggedIn && (
              <ListItem button component={Link} to="/garage" onClick={toggleDrawer}>
                <ListItemText primary="Garage" />
              </ListItem>
            )}

            {isLoggedIn && (
              <ListItem button component={Link} to="/messaging" onClick={toggleDrawer}>
                <ListItemText primary="Messaging" />
              </ListItem>
            )}

            <ListItem button component={Link} to="/car-quiz" onClick={toggleDrawer}>
              <ListItemText primary="Car Quiz" />
            </ListItem>
            <ListItem button component={Link} to="/locate-dealer" onClick={toggleDrawer}>
              <ListItemText primary="Locate Dealer" />
            </ListItem>
          </List>
        </Drawer> */}

        {/* Modals */}
        <LoginModal
          open={openLoginModal}
          onClose={() => toggleModal(setOpenLoginModal)}
          onRegisterClick={() => {
            toggleModal(setOpenLoginModal);
            toggleModal(setOpenRegisterModal);
          }}
        />
        <RegisterModal
          open={openRegisterModal}
          onClose={() => toggleModal(setOpenRegisterModal)}
        />
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
