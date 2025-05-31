'use client';

import React, { useState } from 'react';
import { Tabs, Tab, Box, Paper } from '@mui/material';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleChange = (event, newValue) => {
    setIsLogin(newValue === 0);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
        padding: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          borderRadius: 4,
          maxWidth: 480,
          width: '100%',
          overflow: 'hidden',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Tabs
          value={isLogin ? 0 : 1}
          onChange={handleChange}
          centered
          sx={{
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiTab-root': {
              color: '#ffffff',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '1rem',
              padding: '12px 24px',
            },
            '& .Mui-selected': {
              color: '#1e3a8a',
              bgcolor: '#ffffff',
              borderRadius: 16,
            },
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>
        <Box sx={{ p: 3 }}>{isLogin ? <LoginForm /> : <RegisterForm />}</Box>
      </Paper>
    </Box>
  );
}