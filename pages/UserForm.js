import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

// USER SUBMISSION FORMS
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    phone: '',
    email: ''
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

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'flex-start',  
        alignItems: 'flex-start', 
        marginTop: 5,  
        gap: 5,  
        width: '100%', 
        padding: 0,  
        ml: 0,  
      }} 
    >
      {/* IMAGE BOX */}
      <Box 
        component="img"
        src="https://i.imgur.com/GwXJvVn.jpeg"
        alt="Profile Picture"
        sx={{ 
          width: 165,  
          height: 165, 
          borderRadius: '50%',
          mt: 2,  // UPDATE MARGINS FOR TOP LEFT AND RIGHT
          ml: 2,
          mr: 7,
        }} 
      />

      {/* BOX FORMS */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '300px',
          gap: 2,  
        }}
      >
        {/* NAME FIELD */}
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* DOB FIELD */}
        <TextField
          label="Date of Birth"
          variant="outlined"
          type="date"
          fullWidth
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* PHONE NUMBER FIELD */}
        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* EMAIL FIELD */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* SUBMIT BUTTON */}
        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>
      </Box>
    </Box>
  );
}

export default UserForm;
