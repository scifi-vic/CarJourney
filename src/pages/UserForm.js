import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DeleteAccountForm from '../components/DeleteAccountForm';
// Calculate the maximum date (today's date minus 18 years)
const getMaxDate = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split('T')[0]; // Format as yyyy-mm-dd
};

function UserForm( {profilePicture, setProfilePicture}) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
    localStorage.setItem('userData', JSON.stringify(formData));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result); // Set the profile picture with the data URL
      };
      reader.readAsDataURL(file); // Convert image to base64 URL
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        alignItems: 'flex-start',
        gap: 5,
        marginTop: 5,
        marginLeft: 2,
        maxWidth: 800,
      }}
    >
      {/* Wrapper for the Left Section to add margin without affecting internal alignment */}
      <Box sx={{ marginRight: 4 }}>
        <Box 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box 
            component="img"
            src={profilePicture} // Ensure the src uses the updated state
            alt="Profile Picture"
            sx={{ 
              width: 165,
              height: 165,
              borderRadius: '50%',
              marginBottom: 2,
            }} 
          />
          
          <input
            accept="image/*"
            type="file"
            onChange={handleProfilePictureChange}
            style={{ display: 'none' }}
            id="upload-photo"
          />
          <label htmlFor="upload-photo">
            <Button variant="contained" component="span" fullWidth>
              Upload Photo
            </Button>
          </label>
        </Box>
      </Box>

      {/* Right Section: Form Fields */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 300,
          gap: 2,
        }}
      >
        <TextField label="First name" variant="outlined" fullWidth name="first-name" value={formData.firstName} onChange={handleChange} required />

        <TextField label="Last name" variant="outlined" fullWidth name="last-name" value={formData.lastName} onChange={handleChange} required />

        <TextField label="Date of Birth" variant="outlined" type="date" fullWidth name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required InputLabelProps={{ shrink: true }} // This keeps the label from covering the placeholder
        inputProps={{ placeholder: 'mm/dd/yyyy' }} />

        <TextField label="Phone Number" variant="outlined" fullWidth name="phone" value={formData.phone} onChange={handleChange} required />

        <TextField label="Email" variant="outlined" fullWidth name="email" value={formData.email} onChange={handleChange} required />
        
        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default UserForm;
