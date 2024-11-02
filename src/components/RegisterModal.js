import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';
import { db, auth, timestamp } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

function RegisterModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Clear previous errors
    createUserWithEmailAndPassword(auth, formData.email, formData.password)
      .then(async (userCredential) => {

        const user = userCredential.user;

        // Save user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          createdAt: timestamp()
        });

        console.log('User successfully registered and data saved to Firestore:', user);
        
        // Close the modal once user registers
        setOpen(false);
      })
      .catch((error) => {
        console.error('Error registering:', error.message);
        setError(error.message); // Set error to display to the user
      });
  };

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Register</Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ padding: 4, margin: 'auto', width: 400, backgroundColor: 'white' }}>
          <Typography variant="h6" component="h2">Register</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="First Name"
              fullWidth
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <TextField
              label="Last Name"
              fullWidth
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
            <TextField
              label="Email"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            {error && <Typography color="error">{error}</Typography>} {/* Display errors */}
            <Button type="submit" variant="contained" color="primary">Register</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default RegisterModal;
