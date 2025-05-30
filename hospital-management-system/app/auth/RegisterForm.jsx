'use client';

import React, { useState } from 'react';
import { useAuth } from '../useAuth';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from '@mui/material';
import { ROLES } from '../lib/auth';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const { register, loading, user } = useAuth();

  // Restrict roles based on current user's role
  const availableRoles = user?.role === 'ADMIN' ? Object.values(ROLES) : ['USER'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, name, role);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant='h5'
        align='center'
        sx={{ fontWeight: 600, color: '#1e3a8a' }}
      >
        Register
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label='Name'
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          variant='outlined'
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#3b82f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
            },
          }}
        />
        <TextField
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          variant='outlined'
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#3b82f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
            },
          }}
        />
        <TextField
          label='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          variant='outlined'
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#3b82f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
            },
          }}
        />
        <FormControl
          fullWidth
          variant='outlined'
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: '#3b82f6',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3b82f6',
                boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
              },
            },
          }}
        >
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            label='Role'
            required
          >
            {availableRoles.map((r) => (
              <MenuItem key={r} value={r}>
                {r.replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {error && (
          <Alert severity='error' sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        <Button
          type='submit'
          variant='contained'
          disabled={loading}
          sx={{
            borderRadius: 2,
            padding: '12px',
            bgcolor: '#3b82f6',
            '&:hover': { bgcolor: '#2563eb' },
            '&:disabled': { bgcolor: '#93c5fd' },
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          {loading ? <CircularProgress size={24} color='inherit' /> : 'Register'}
        </Button>
      </Box>
    </Box>
  );
}