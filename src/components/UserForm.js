import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import { db, timestamp } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';


// USER SUBMISSION FORMS
function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '',
    phone: '',
    email: ''
  });

  const auth = getAuth(); // Initialize Firebase Auth here

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const user = auth.currentUser; // Get currently logged-in user
    
    if (user) {
      console.log("Current user UID:", user.uid); 
      console.log("Form Data:", formData); 
      
      const userRef = doc(db, 'users', user.uid); 
      
      try {
        // CREATE OR UPDATE USER DOCUMENT IN FIRESTORE
        await setDoc(userRef, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dateOfBirth: formData.dateOfBirth, 
          phone: formData.phone, 
          email: formData.email,
          updatedAt: timestamp() 
        }, { merge: true }); 
  
        console.log('User profile updated successfully');
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    } else {
      console.log('No user is currently logged in');
    }
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
        {/* FIRST NAME FIELD */}
        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          name="firstName" // Correct attribute name
          value={formData.firstName}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          required
        />

        {/* LAST NAME FIELD */}
        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          name="lastName" // Correct attribute name
          value={formData.lastName}
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
