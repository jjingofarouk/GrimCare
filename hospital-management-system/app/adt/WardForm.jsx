// app/adt/WardForm.jsx
"use client";
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

export default function WardForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    wardNumber: '',
    totalBeds: '',
    department: '',
    location: '',
    nurseInCharge: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'totalBeds' ? parseInt(value) || '' : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const wardNumber = `W${Math.floor(1000000 + Math.random() * 9000000)}`;
      await axios.post('/api/wards', { ...formData, wardNumber, occupiedBeds: 0 });
      onSubmit();
      setFormData({
        name: '',
        wardNumber: '',
        totalBeds: '',
        department: '',
        location: '',
        nurseInCharge: '',
      });
    } catch (error) {
      console.error('Error creating ward:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Ward</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ward Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Total Beds"
              name="totalBeds"
              value={formData.totalBeds}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nurse in Charge"
              name="nurseInCharge"
              value={formData.nurseInCharge}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Ward
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}