import React, { useState } from 'react';
import { Tabs, Tab, Box, Container } from '@mui/material';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Tabs value={tabValue} onChange={(e, newVal) => setTabValue(newVal)} centered>
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      
      <Box sx={{ mt: 3 }}>
        {tabValue === 0 ? <Login /> : <Register />}
      </Box>
    </Container>
  );
};

export default AuthPage;