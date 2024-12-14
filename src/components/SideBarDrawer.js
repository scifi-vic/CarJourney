import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import GarageIcon from "@mui/icons-material/Garage";
import UserIcon from "@mui/icons-material/Person";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MailIcon from "@mui/icons-material/Mail"; // Message Icon
import CalculateIcon from "@mui/icons-material/Calculate";
import QuizIcon from "@mui/icons-material/Quiz";
import PlaceIcon from "@mui/icons-material/Place";
import { Link } from "react-router-dom";
import { auth, onAuthStateChanged } from "../firebaseConfig";

export default function SideBarDrawer({ drawerOpen, setDrawerOpen }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update the logged-in state
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const toggleDrawer = (isOpen) => setDrawerOpen(isOpen);

  const menuItems = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    ...(isLoggedIn
      ? [
          { text: "My Garage", path: "/garage", icon: <GarageIcon /> },
          { text: "My Profile", path: "/user", icon: <UserIcon /> },
          { text: "Add A Listing", path: "/add-car", icon: <AddBoxIcon /> },
          { text: "Messages", path: "/messaging", icon: <MailIcon /> }, // Updated with MailIcon
        ]
      : []),
    { text: "Finance Calculator", path: "/finance-calculator", icon: <CalculateIcon /> },
    { text: "Car Quiz", path: "/car-quiz", icon: <QuizIcon /> },
    { text: "Locate Dealer", path: "/locate-dealer", icon: <PlaceIcon /> },
  ];

  const DrawerList = (
    <Box
      sx={{ width: 250, marginTop: 2 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
      {DrawerList}
    </Drawer>
  );
}
