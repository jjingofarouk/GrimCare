'use client';

import React, { useState } from 'react';
import './styles/globals.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from './useAuth';
import { Box } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loadingAuth } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {loadingAuth ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              <p>Loading...</p>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Header toggleSidebar={toggleSidebar} />
              <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  mt: 8, // Offset for fixed AppBar (64px)
                  ml: { xs: 0, md: isSidebarOpen ? 31.0 : 0 }, // 250px ≈ 31.0rem
                  transition: 'margin-left 0.3s ease',
                }}
              >
                {children}
              </Box>
            </Box>
          )}
        </ErrorBoundary>
      </body>
    </html>
  );
}