"use client";

import React, { useState } from 'react';
import { Box, Typography, Alert, Button, TextField } from '@mui/material';
import CustomDataGrid from '../components/CustomDataGrid';
import { useApiData } from '../utils/api';
import { createDepartment, getDepartments } from './departmentService';

export default function DepartmentForm() {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: departments, error: departmentsError } = useApiData(getDepartments);

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
    } catch (err) {
      setError('Failed to create department: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Department Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'createdAt', headerName: 'Created At', width: 200 },
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
        {(error || departmentsError) && <Alert severity="error">{error || departmentsError}</Alert>}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Add Department'}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <CustomDataGrid rows={departments} columns={columns} />
      </Box>
    </Box>
  );
}