"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, TextField, Button } from '@mui/material';
import CustomDataGrid from '../components/CustomDataGrid';
import axios from 'axios';
import api from '../api';

export default function DepartmentForm() {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDepartments() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=departments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Ensure each department has a unique id for DataGrid
        const formattedDepartments = response.data.map((dept, index) => ({
          ...dept,
          id: dept.id || index + 1, // Fallback to index if id is missing
        }));
        setDepartments(formattedDepartments);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
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
      const token = localStorage.getItem('token');
      await axios.post(`${api.BASE_URL}${api.API_ROUTES.DEPARTMENT}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ name: '', description: '' });
      const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=departments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedDepartments = response.data.map((dept, index) => ({
        ...dept,
        id: dept.id || index + 1,
      }));
      setDepartments(formattedDepartments);
      setError(null);
    } catch (err) {
      setError('Failed to create department: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Department Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    {
      field: 'createdAt',
      headerName: 'Created At',
      width: 200,
      valueGetter: (params) => {
        const date = params.row.createdAt;
        return date ? new Date(date).toLocaleString() : 'N/A';
      },
    },
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
        {(error) && <Alert severity="error">{error}</Alert>}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Creating...' : 'Add Department'}
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box sx={{ height: 400, width: '100%' }}>
          <CustomDataGrid rows={departments} columns={columns} />
        </Box>
      )}
    </Box>
  );
}