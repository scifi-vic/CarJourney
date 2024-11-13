import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Box, Modal, TextField, Button, Typography, List, ListItem, IconButton, InputAdornment } from '@mui/material';
import { db, auth, serverTimestamp } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function RegisterModal({ open, onClose }) {
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upperCase: false,
    number: false,
    specialChar: false
  });

  useEffect(() => {
    if (!open) {
      setFormData({ email: '', password: '', firstName: '', lastName: '' });
      setError(null);
      setPasswordError('');
      setPasswordCriteria({
        length: false,
        upperCase: false,
        number: false,
        specialChar: false
      });
      setShowPassword(false);
    }
  }, [open]);

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      upperCase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(Boolean);
  };

  const handlePasswordChange = (event) => {
    const password = event.target.value;
    setFormData({ ...formData, password });
    const isValid = validatePassword(password);
    setPasswordError(isValid ? '' : 'Password must meet all criteria');
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (passwordError) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        createdAt: serverTimestamp(),
      });

      console.log('User successfully registered:', user);
      onClose();
    } catch (error) {
      console.error('Error registering:', error.message);
      setError(error.message);
    }
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
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 10, right: 10, color: '#242058' }}>
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2, color: '#242058' }}>Sign Up</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            label="Email Address"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handlePasswordChange}
            required
            error={Boolean(passwordError)}
            helperText={passwordError}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
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

          <List sx={{ fontSize: '0.85rem', marginY: 2 }}>
            <ListItem sx={{ color: passwordCriteria.length ? 'green' : 'red' }}>• At least 8 characters</ListItem>
            <ListItem sx={{ color: passwordCriteria.upperCase ? 'green' : 'red' }}>• At least 1 uppercase letter</ListItem>
            <ListItem sx={{ color: passwordCriteria.number ? 'green' : 'red' }}>• At least 1 number</ListItem>
            <ListItem sx={{ color: passwordCriteria.specialChar ? 'green' : 'red' }}>• At least 1 special character</ListItem>
          </List>

          {error && (
            <Typography color="error" sx={{ mt: 1, textAlign: 'center', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '0.5rem', borderRadius: '5px' }}>
              {error}
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
            Sign Up
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default RegisterModal;