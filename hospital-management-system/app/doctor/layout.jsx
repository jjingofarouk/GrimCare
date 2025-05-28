// app/doctor/layout.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

const DoctorLayout = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Doctor Management - Uganda Health System
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, p: 2 }}>
        {children}
      </Container>
    </Box>
  );
};

export default DoctorLayout;