'use client';

import React, { useState } from 'react';
import './globals.css';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from './useAuth';
import { Box } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';

export default function RootLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
              Loading...
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              {user && <Header toggleSidebar={toggleSidebar} />}
              {user && <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />}
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  mt: 8, // Offset for fixed AppBar
                  ml: { xs: 0, md: isSidebarOpen ? 31.25 : 0 }, // 250px = 31.25rem
                  transition: 'margin-left 0.3s',
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