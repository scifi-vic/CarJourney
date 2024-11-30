// src/components/LogOutButton.js

import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Adjust the path if necessary
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';

function LogOutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        navigate('/'); // Redirect to home or login page after logout
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <IconButton color="inherit" onClick={handleLogout}>
      <LogoutIcon />
    </IconButton>
  );
}

export default LogOutButton;
