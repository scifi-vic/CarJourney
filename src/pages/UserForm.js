import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { db, auth } from "../firebaseConfig";
import { updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DeleteAccountForm from "../components/DeleteAccountForm";

function UserForm({ profilePicture, setProfilePicture }) {
  // Calculate the maximum date (today's date minus 18 years)
  const getMaxDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0]; // Format as yyyy-mm-dd
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
  });

  const [updateMessage, successfulUpdateMessage] = useState(false); 

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      // Restrict input to numbers only and limit to 10 characters
      if (!/^\d*$/.test(value) || value.length > 10) {
        return; // Ignore invalid input
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const currentUser = auth.currentUser.uid;
      const userInfo = doc(db, "users", currentUser);

      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        email: formData.email,
        
      }

      // Update the Firestore document
      await updateDoc(userInfo, profileData);

      console.log("User profile updated successfully");
      successfulUpdateMessage(true); 
      
      setTimeout(() => successfulUpdateMessage(false), 4000); 

    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  // const handleProfilePictureChange = async (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setProfilePicture(reader.result); // Set the profile picture with the data URL
  //     };
  //     reader.readAsDataURL(file); // Convert image to base64 URL
  //   }
  // };

  // Handle images
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();


    // Read Image
    reader.onloadend = () => {
      console.log(reader.result);
      setProfilePicture(reader.result);
      updateDoc(doc(db, 'users', auth.currentUser.uid), {
        profilePicture: reader.result, // Save Base64 string to makeModelData
      });


    };
    // Convert Image
    if (file) {
        reader.readAsDataURL(file); // Convert image to Base64
    }

  };

  // Handle Image File Click
  const handleImageClick = () => {
    document.getElementById('car-image-input').click();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
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
              borderRadius: "50%",
              marginBottom: 2,
            }}
          />

          <input
            accept="image/*"
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
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
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 300,
          gap: 2,
        }}
      >
        <TextField
          label="First name"
          variant="outlined"
          fullWidth
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <TextField
          label="Last name"
          variant="outlined"
          fullWidth
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <TextField
          label="Date of Birth"
          variant="outlined"
          type="date"
          fullWidth
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }} // This keeps the label from covering the placeholder
          inputProps={{ placeholder: "mm/dd/yyyy" }}
        />

        <TextField
          label="Phone Number"
          variant="outlined"
          fullWidth
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          inputProps={{
            inputMode: "numeric", // Optimized for numeric keyboards on mobile
            pattern: "[0-9]*",    // Ensure only numeric input is accepted
            maxLength: 10,        // Limit input length to 10 characters
          }}
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Button type="submit" variant="contained" fullWidth>
          Submit
        </Button>

        {updateMessage && (
          <Typography
            variant="body2"
            sx={{
              color: "blue",
              marginTop: 2,
              textAlign: "center",
            }}
            >
            Profile updated successfully!
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default UserForm;
