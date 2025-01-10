import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { auth } from '../firebaseConfig';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!auth.currentUser) {
      setMessage("No user is currently logged in.");
      return;
    }

    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update the password
      await updatePassword(auth.currentUser, newPassword);
      setMessage("Password updated successfully!");
    } catch (error) {
      setMessage("Error: Incorrect Password. Please try again.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handlePasswordChange}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        marginTop: 2
      }}
    >
      <Typography variant="h6">Change Password</Typography>

      <TextField
        label="Current Password"
        variant="outlined"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />

      <TextField
        label="New Password"
        variant="outlined"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />

      <Button type="submit" variant="contained" color="primary">
        Update Password
      </Button>

      {message && <Typography variant="body2" color="textSecondary">{message}</Typography>}
    </Box>
  );
}

export default ChangePasswordForm;
