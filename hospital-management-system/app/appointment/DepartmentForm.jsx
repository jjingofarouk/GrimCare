"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField } from '@mui/material';
import CustomDataGrid from '../components/CustomDataGrid';
import api from '../utils/api';

export default function DepartmentForm() {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      try {
        setLoading(true);
        const response = await fetch(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}`);
        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        setDepartments(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Department name is required.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const response = await fetch(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create department');
      const newDepartment = await response.json();
      setDepartments([...departments, newDepartment]);
      setFormData({ name: '', description: '' });
      setError(null);
    } catch (err) {
      setError('Failed to create department: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Department Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'createdAt', headerName: 'Created At', width: 200, valueGetter: (params) => new Date(params.row.createdAt).toLocaleString() },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Manage Departments</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        <TextField
          label="Department Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Add Department'}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <CustomDataGrid rows={departments} columns={columns} loading={loading} />
      </Box>
    </Box>
  );
}