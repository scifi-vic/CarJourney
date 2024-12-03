import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import GarageIcon from '@mui/icons-material/Garage';
import UserIcon from '@mui/icons-material/Person';
import AboutIcon from '@mui/icons-material/Info';
import { Link } from 'react-router-dom';

const menuItems = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'My Garage', path: '/garage', icon: <GarageIcon /> },
  { text: 'Profile', path: '/user', icon: <UserIcon /> },
  { text: 'About', path: '/about', icon: <AboutIcon /> },
];

export default function SideBarDrawer({drawerOpen, setDrawerOpen}) {

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const DrawerList = (
    <Box
      sx={{
        width: 250, 
        marginTop: "24",
      }}
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
    <Box>
      {/* <Button
        onClick={() => toggleDrawer()}
        sx={{
          position: 'fixed',
          top: '80px', // Place it below the navbar
          left: '16px',
          zIndex: 1300,
          backgroundColor: 'rgb(36, 32, 88)', // Match navbar color
          color: 'white',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <MenuIcon />
      </Button> */}

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() =>toggleDrawer()}>
        {DrawerList}
      </Drawer>
    </Box>
  );
}
