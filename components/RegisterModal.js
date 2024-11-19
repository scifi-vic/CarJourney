// RegisterModal.js
import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { Box, Modal, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import { db, auth } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function RegisterModal({ open, onClose }) {
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    number: false,
    specialChar: false,
  });
  const [verificationMessage, setVerificationMessage] = useState('');

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  const resetForm = () => {
    setFormData({ email: '', password: '', firstName: '', lastName: '' });
    setError('');
    setPasswordError('');
    setPasswordCriteria({ length: false, number: false, specialChar: false });
    setShowPassword(false);
    setVerificationMessage('');
  };

  const validatePassword = (password) => {
    const criteria = {
      length: password.length >= 8,
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
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
    setError('');
    setVerificationMessage('');

    if (!validatePassword(formData.password)) {
      setPasswordError("Invalid password. Ensure it meets the criteria.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`
      });

      await sendEmailVerification(user)
        .then(() => {
          setVerificationMessage('A verification email has been sent. Please check your inbox and verify your account.');
        })
        .catch(() => {
          setError('Failed to send verification email. Please try again later.');
        });
    } catch (error) {
      setError(`Registration failed: ${error.message}`);
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            margin="normal"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <TextField
            label="Email Address"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            margin="normal"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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

          {/* Password Criteria Display */}
          <Box sx={{ mt: 1 }}>
            <Typography
              color={passwordCriteria.length ? 'green' : 'red'}
              sx={{ fontSize: '0.85rem' }}
            >
              • At least 8 characters
            </Typography>
            <Typography
              color={passwordCriteria.number ? 'green' : 'red'}
              sx={{ fontSize: '0.85rem' }}
            >
              • Contains a number
            </Typography>
            <Typography
              color={passwordCriteria.specialChar ? 'green' : 'red'}
              sx={{ fontSize: '0.85rem' }}
            >
              • Contains a special character
            </Typography>
          </Box>

          {error && (
            <Typography color="error" sx={{ mt: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '5px' }}>
              {error}
            </Typography>
          )}

          {verificationMessage && (
            <Typography color="primary" sx={{ mt: 1, textAlign: 'center', padding: '0.5rem', borderRadius: '5px' }}>
              {verificationMessage}
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
              '&:hover': { backgroundColor: '#3a4579' },
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
