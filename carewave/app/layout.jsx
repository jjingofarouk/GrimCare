import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 3 }, mt: '64px' }}>
            {children}
          </Box>
        </Box>
      </body>
    </html>
  );
}