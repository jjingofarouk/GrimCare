"use client"
import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Grid, Paper, Typography, Box } from '@mui/material';
import { createAdmission, updateAdmission } from './adtService';

export default function AdmissionForm({ admission, onSubmit, patients, doctors, wards }) {
  const [formData, setFormData] = useState({
    patientId: admission?.patientId || '',
    wardId: admission?.wardId || '',
    admissionDate: admission?.admissionDate ? new Date(admission.admissionDate).toISOString().split('T')[0] : '',
    doctorId: admission?.doctorId || '',
    status: admission?.status || 'ADMITTED',
    triagePriority: admission?.triagePriority || '',
    triageNotes: admission?.triageNotes || '',
    dischargeNotes: admission?.dischargeNotes || '',
    dischargeDate: admission?.dischargeDate ? new Date(admission.dischargeDate).toISOString().split('T')[0] : '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (admission?.id) {
        await updateAdmission(admission.id, formData);
      } else {
        await createAdmission(formData);
      }
      onSubmit();
      setFormData({
        patientId: '',
        wardId: '',
        admissionDate: '',
        doctorId: '',
        status: 'ADMITTED',
        triagePriority: '',
        triageNotes: '',
        dischargeNotes: '',
        dischargeDate: '',
      });
    } catch (error) {
      console.error('Error submitting admission:', error);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {admission?.id ? 'Update Admission' : 'New Admission'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Patient"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              fullWidth
              required
            >
              {patients.map((patient) => (
                <MenuItem key={patient.id} value={patient.id}>
                  {patient.user.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Ward"
              name="wardId"
              value={formData.wardId}
              onChange={handleChange}
              fullWidth
            >
              {wards.map((ward) => (
                <MenuItem key={ward.id} value={ward.id}>
                  {ward.name} ({ward.occupiedBeds}/{ward.totalBeds})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Admission Date"
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Doctor"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              fullWidth
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.user.name} ({doctor.specialty})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="ADMITTED">Admitted</MenuItem>
              <MenuItem value="DISCHARGED">Discharged</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Triage Priority"
              name="triagePriority"
              value={formData.triagePriority}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Triage Notes"
              name="triageNotes"
              value={formData.triageNotes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Discharge Notes"
              name="dischargeNotes"
              value={formData.dischargeNotes}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="date"
              label="Discharge Date"
              name="dischargeDate"
              value={formData.dischargeDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {admission?.id ? 'Update Admission' : 'Add Admission'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}