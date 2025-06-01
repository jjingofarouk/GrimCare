// app/adt/DoctorForm.jsx
"use client";
import { v4 as uuidv4 } from 'uuid';
import React, { useState } from 'react';
import { TextField, Button, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

export default function DoctorForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    specialty: '',
    licenseNumber: '',
    phone: '',
    office: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const doctorId = `D${Math.floor(1000000 + Math.random() * 9000000)}`;
      await axios.post('/api/doctor', { ...formData, doctorId });
      onSubmit();
      setFormData({
        email: '',
        name: '',
        specialty: '',
        licenseNumber: '',
        phone: '',
        office: '',
      });
    } catch (error) {
      console.error('Error creating doctor:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>Add New Doctor</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="License Number"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Office"
              name="office"
              value={formData.office}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Add Doctor
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}