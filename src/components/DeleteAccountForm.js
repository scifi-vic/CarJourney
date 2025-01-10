import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { auth } from '../firebaseConfig';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore'; // For Firestore (optional)
import { db } from '../firebaseConfig'; // Ensure this is your Firestore configuration

function DeleteAccountForm() {
  const [message, setMessage] = useState('');

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        const user = auth.currentUser;

        if (user) {
          // Optional: Delete user data from Firestore
          await deleteDoc(doc(db, "users", user.uid));

          // Delete the user's Firebase Auth account
          await deleteUser(user);

          setMessage("Account deleted successfully.");
          // Optionally redirect after deletion
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          setMessage("No user is logged in.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        setMessage("Failed to delete the account. Please try again later.");
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centers content horizontally
        justifyContent: 'flex-start', // Move content to the top of the container
        textAlign: 'center', // Centers text inside Typography components
        gap: 4,
        maxWidth: 400,
        marginTop: 2,
        margin: '0 auto', // Centers the entire form horizontally
        minHeight: '50vh', // Ensures some vertical centering
      }}
    >
      <Typography variant="h6" color="error">Delete Account</Typography>
      <Typography variant="body2" color="textSecondary">
        Deleting your account is permanent and cannot be undone. All your data will be erased.
      </Typography>
      <Button 
        variant="contained" 
        color="error" 
        onClick={handleDeleteAccount}
      >
        Delete My Account
      </Button>
      {message && <Typography variant="body2" color="textSecondary">{message}</Typography>}
    </Box>
  );
}

export default DeleteAccountForm;
