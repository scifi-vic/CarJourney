import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import UserForm from './UserForm'; 
import ChangePasswordForm from '../components/ChangePasswordForm';

// IMPORT USER FORMS TO CREATE SUBMISSION BOXES
// COMPONENTS FOR TABS
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

function User( {profilePicture, setProfilePicture}) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {/* Modern User Profile Title */}
    <Box
      sx={{
        textAlign: 'center',
        backgroundColor: '#',
        padding: 1,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: 650,
        marginBottom: 3,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
        User Profile
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#666' }}>
        Manage your account settings and profile details
      </Typography>
    </Box>

    <Box sx={{ width: '100%', maxWidth: 600 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="user tabs" centered>
          <Tab label="Update Profile" {...a11yProps(0)} />
          <Tab label="Change Password" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <TabPanel value={value} index={0}>
        <UserForm profilePicture={profilePicture} setProfilePicture={setProfilePicture} />  
      </TabPanel>

      <TabPanel value={value} index={1}>
        <ChangePasswordForm />
      </TabPanel>
    </Box>
  </Box>
);
}

export default User;
