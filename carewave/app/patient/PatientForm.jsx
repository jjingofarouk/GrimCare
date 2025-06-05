'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  InputLabel,
  FormControl,
  Select,
} from '@mui/material';
import { createPatient, updatePatient } from './patientService';

const PatientForm = ({ patient, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    patientId: '',
    age: '',
    gender: '',
    registrationDate: '',
    referralCenter: '',
    insuranceProvider: '',
    insuranceNumber: '',
    nextOfKinName: '',
    nextOfKinContact: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    photo: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        patientId: patient.patientId || '',
        age: patient.age || '',
        gender: patient.gender || '',
        registrationDate: patient.registrationDate
          ? new Date(patient.registrationDate).toISOString().split('T')[0]
          : '',
        referralCenter: patient.referralCenter || '',
        insuranceProvider: patient.insuranceProvider || '',
        insuranceNumber: patient.insuranceNumber || '',
        nextOfKinName: patient.nextOfKinName || '',
        nextOfKinContact: patient.nextOfKinContact || '',
        emergencyContactName: patient.emergencyContactName || '',
        emergencyContactPhone: patient.emergencyContactPhone || '',
        photo: patient.photo || '',
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? URL.createObjectURL(files[0]) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (patient) {
        await updatePatient(patient.id, formData);
      } else {
        await createPatient(formData);
      }
      onSuccess();
      setFormData({
        name: '',
        patientId: '',
        age: '',
        gender: '',
        registrationDate: '',
        referralCenter: '',
        insuranceProvider: '',
        insuranceNumber: '',
        nextOfKinName: '',
        nextOfKinContact: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        photo: '',
      });
    } catch (err) {
      setError('Failed to process patient');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 4, borderRadius: 2 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        {patient ? 'Edit Patient' : 'Register Patient'}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Patient ID"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              required
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Select Gender</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Registration Date"
              name="registrationDate"
              type="date"
              value={formData.registrationDate}
              onChange={handleChange}
              required
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Referral Center (Optional)"
              name="referralCenter"
              value={formData.referralCenter}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Insurance Provider (Optional)"
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Insurance Number (Optional)"
              name="insuranceNumber"
              value={formData.insuranceNumber}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Next of Kin Name (Optional)"
              name="nextOfKinName"
              value={formData.nextOfKinName}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Next of Kin Contact (Optional)"
              name="nextOfKinContact"
              type="tel"
              value={formData.nextOfKinContact}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact Name (Optional)"
              name="emergencyContactName"
              value={formData.emergencyContactName}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Emergency Contact Phone (Optional)"
              name="emergencyContactPhone"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
 ..

            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Photo (Optional)"
              name="photo"
              type="file"
              onChange={handleChange}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              inputProps={{ accept: 'image/*' }}
              sx={{ mb: 2 }}
            />
            {formData.photo && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={formData.photo}
                  alt="Preview"
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              </Box>
            )}
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {patient && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => onSuccess()}
              disabled={loading}
              sx={{ px: 3, py: 1 }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ px: 3, py: 1 }}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Processing...' : patient ? 'Update Patient' : 'Register Patient'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PatientForm;