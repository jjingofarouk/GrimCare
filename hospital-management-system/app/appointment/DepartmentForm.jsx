"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, FormControl } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { createDepartment, getDepartments } from './departmentService';

export default function DepartmentForm() {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await getDepartments();
        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to fetch departments');
        console.error('Fetch departments error:', err);
      }
    };
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
      await createDepartment(formData);
      setFormData({ name: '', description: '' });
      const data = await getDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to create department');
      console.error('Create department error:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Department Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300, valueGetter: (params) => params.row.description || 'N/A' },
    { field: 'createdAt', headerName: 'Created At', width: 200, valueGetter: (params) => params.row.createdAt ? new Date(params.row.createdAt).toLocaleString() : 'N/A' },
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
        <DataGrid
          rows={departments}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}