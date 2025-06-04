import React from 'react';
import { Box } from '@mui/material';

export default function AdtLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Box sx={{ flex: 1, minWidth: 100 }}>
        {children}
      </Box>
    </Box>
  );
}