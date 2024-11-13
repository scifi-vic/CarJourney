import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, Modal, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { auth } from "../firebaseConfig"; 
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

function LoginModal({ open, onClose, onRegisterClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Clear inputs when the modal is closed
  useEffect(() => {
    if (!open) {
      setEmail('');
      setPassword('');
      setError(null);
      setShowPassword(false); // Reset password visibility
    }
  }, [open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful:', userCredential);
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error.message);
      setError(error.message);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ padding: 4, margin: 'auto', width: 300, backgroundColor: 'white', borderRadius: 2, position: 'relative' }}>
        {/* Close Button */}
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10 }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2 }}>Log In</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Log In</Button>
          <Typography align="center" sx={{ mt: 1 }}>
            Don't have an account?{' '}
            <Button onClick={onRegisterClick} color="secondary">Sign Up</Button>
          </Typography>
        </form>
      </Box>
    </Modal>
  );
}

export default LoginModal;
