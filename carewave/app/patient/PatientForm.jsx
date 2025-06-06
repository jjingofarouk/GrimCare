'use client';
import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import { createPatient, updatePatient } from './patientService';

export default function PatientForm({ patient, onSuccess }) {
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    address: '',
    emergencyContact: '',
    emergencyContactPhone: '',
    insuranceProvider: '',
    insurancePolicy: '',
    bloodType: '',
    allergies: '',
    medicalHistory: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        patientId: patient.patientId || '',
        name: patient.name || '',
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        address: patient.address || '',
        emergencyContact: patient.emergencyContact || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
        insuranceProvider: patient.insuranceProvider || '',
        insurancePolicy: patient.insurancePolicy || '',
        bloodType: patient.bloodType || '',
        allergies: patient.allergies || '',
        medicalHistory: patient.medicalHistory || '',
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (patient) {
        await updatePatient(patient.id, formData);
        alert('Patient updated successfully');
      } else {
        await createPatient(formData);
        alert('Patient registered successfully');
      }
      onSuccess();
    } catch (error) {
      alert(`Error ${patient ? 'updating' : 'registering'} patient`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Patient ID"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Emergency Contact"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Emergency Contact Phone"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Insurance Provider"
            name="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Insurance Policy"
            name="insurancePolicy"
            value={formData.insurancePolicy}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Blood Type"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
          >
            <MenuItem value="A+">A+</MenuItem>
            <MenuItem value="A-">A-</MenuItem>
            <MenuItem value="B+">B+</MenuItem>
            <MenuItem value="B-">B-</MenuItem>
            <MenuItem value="AB+">AB+</MenuItem>
            <MenuItem value="AB-">AB-</MenuItem>
            <MenuItem value="O+">O+</MenuItem>
            <MenuItem value="O-">O-</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            multiline
            rows={2}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Medical History"
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" size="large">
            {patient ? 'Update Patient' : 'Register Patient'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}