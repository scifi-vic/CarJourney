// LoginModal.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Box, Modal, TextField, Button, Typography, IconButton, InputAdornment, Link } from '@mui/material';
import { auth } from "../firebaseConfig"; 
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';

function LoginModal({ open, onClose, onRegisterClick }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      setEmail('');
      setPassword('');
      setError(null);
      setForgotPasswordMessage(null);
      setShowPassword(false);
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
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async () => {
    setForgotPasswordMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setForgotPasswordMessage('If an account exists, a reset email has been sent.');
    } catch (error) {
      console.error('Error during password reset:', error);
      setForgotPasswordMessage('Failed to send reset email. Please check your email address.');
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          padding: 4,
          margin: 'auto',
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'white',
          borderRadius: 3,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Close Button */}
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: '#242058' }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2, color: '#242058' }}>Log In</Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              '& .MuiOutlinedInput-root.Mui-focused': {
                borderColor: '#3a4579',
                boxShadow: '0 0 8px rgba(58, 69, 121, 0.3)',
              },
            }}
          />
          
          <TextField
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': { borderRadius: '8px' },
              '& .MuiOutlinedInput-root.Mui-focused': {
                borderColor: '#3a4579',
                boxShadow: '0 0 8px rgba(58, 69, 121, 0.3)',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" sx={{ mt: 1, textAlign: 'center', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '0.5rem', borderRadius: '5px' }}>
              {error}
            </Typography>
          )}
          
          {forgotPasswordMessage && (
            <Typography color="primary" sx={{ mt: 1, textAlign: 'center', backgroundColor: 'rgba(0, 128, 0, 0.1)', padding: '0.5rem', borderRadius: '5px' }}>
              {forgotPasswordMessage}
            </Typography>
          )}
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#242058',
              fontWeight: 'bold',
              borderRadius: '8px',
              padding: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'background-color 0.3s ease, transform 0.2s ease',
              '&:hover': {
                backgroundColor: '#3a4579',
                transform: 'scale(1.02)',
              },
            }}
          >
            Log In
          </Button>

          <Typography align="center" sx={{ mt: 1, color: '#242058' }}>
            <Link onClick={handleForgotPassword} sx={{ cursor: 'pointer', color: '#3a4579', textDecoration: 'underline' }}>
              Forgot Password?
            </Link>
          </Typography>
          
          <Typography align="center" sx={{ mt: 1, color: '#242058' }}>
            Don't have an account?{' '}
            <Button onClick={onRegisterClick} color="secondary" sx={{ fontWeight: 'bold', textDecoration: 'underline', '&:hover': { color: '#3a4579' } }}>
              Sign Up
            </Button>
          </Typography>
        </form>
      </Box>
    </Modal>
  );
}

export default LoginModal;
