import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Modal, TextField, Button, Typography } from '@mui/material';

function LoginModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Login successful:', userCredential);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error logging in:', error.message);
      });
  };

  return (
    <div>

      <Button onClick={() => setOpen(true)}>Login</Button>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{ padding: 4, margin: 'auto', width: 400, backgroundColor: 'white' }}>
          <Typography variant="h6" component="h2">Login</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              fullWidth
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary">Login</Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default LoginModal;
