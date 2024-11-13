import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Box, Modal, TextField, Button, Typography, List, ListItem, IconButton, InputAdornment } from '@mui/material';
import { db, auth, serverTimestamp } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore";
import './RegisterModal.css'; // Import the CSS file
import CloseIcon from '@mui/icons-material/Close'; // Close icon for the button
import Visibility from '@mui/icons-material/Visibility'; // Visibility icon
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // VisibilityOff icon

function RegisterModal({ open, onClose }) {
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    upperCase: false,
    number: false,
    specialChar: false
  });

  // Reset the form data when the modal closes
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
      setShowPassword(false); // Reset password visibility
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
      onClose(); // Close the modal after successful registration
    } catch (error) {
      console.error('Error registering:', error.message);
      setError(error.message);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-container">
        {/* Close Button */}
        <IconButton className="close-button" onClick={onClose}>
          <CloseIcon />
        </IconButton>
        
        <Typography className="modal-header">Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            fullWidth
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            className="text-field"
          />
          <TextField
            label="Last Name"
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            className="text-field"
          />
          <TextField
            label="Email Address"
            fullWidth
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="text-field"
          />
          <TextField
            label="Password"
            fullWidth
            type={showPassword ? "text" : "password"} // Toggle type based on showPassword state
            value={formData.password}
            onChange={handlePasswordChange}
            required
            error={Boolean(passwordError)}
            helperText={passwordError}
            className="text-field"
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
          
          {/* Password Validation Criteria */}
          <List className="password-criteria">
            <ListItem className={`password-criteria-item ${passwordCriteria.length ? 'valid' : 'invalid'}`}>
              • At least 8 characters
            </ListItem>
            <ListItem className={`password-criteria-item ${passwordCriteria.upperCase ? 'valid' : 'invalid'}`}>
              • At least 1 uppercase letter
            </ListItem>
            <ListItem className={`password-criteria-item ${passwordCriteria.number ? 'valid' : 'invalid'}`}>
              • At least 1 number
            </ListItem>
            <ListItem className={`password-criteria-item ${passwordCriteria.specialChar ? 'valid' : 'invalid'}`}>
              • At least 1 special character
            </ListItem>
          </List>

          {error && <Typography className="error-message">{error}</Typography>}
          <Button type="submit" variant="contained" className="signup-button">
            Sign Up
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default RegisterModal;
