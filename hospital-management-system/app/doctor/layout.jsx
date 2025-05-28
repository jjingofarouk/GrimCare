'use client';

import { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';

interface DoctorLayoutProps {
  children: ReactNode;
}

const DoctorLayout = ({ children }: DoctorLayoutProps) => {
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