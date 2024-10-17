import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import UserForm from './UserForm';  

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

function User() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="user-container">
      <h1>User Profile </h1>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="user tabs">
            <Tab label="Update Profile" {...a11yProps(0)} />
            <Tab label="Settings" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* USER UPDATE TAB */}
        <TabPanel value={value} index={0}>
          <UserForm />  
        </TabPanel>

        {/* SETTINGS TAB */}
        <TabPanel value={value} index={1}>
          <Typography>This is not yet done.</Typography>
        </TabPanel>
      </Box>
    </div>
  );
}

export default User;
