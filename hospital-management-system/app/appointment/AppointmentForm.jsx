"use client";

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { createAppointment, updateAppointment } from './appointmentService';
import { format } from 'date-fns';
import styles from './form.module.css';

export default function AppointmentForm({ patients, doctors, departments, onSuccess, appointment, userId }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    departmentId: '',
    date: '',
    type: 'REGULAR',
    reason: '',
    notes: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    console.log('Patients prop:', patients); // Debug
    console.log('Doctors prop:', doctors); // Debug
    console.log('Appointment prop:', appointment); // Debug
    if (appointment) {
      const date = appointment.date ? new Date(appointment.date) : null;
      setFormData({
        patientId: appointment.patientId || '',
        doctorId: appointment.doctorId || '',
        departmentId: appointment.departmentId || '',
        date: date && !isNaN(date) ? date.toISOString().slice(0, 16) : '',
        type: appointment.type || 'REGULAR',
        reason: appointment.reason || '',
        notes: appointment.notes || '',
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!formData.patientId || !formData.doctorId || !formData.date || !formData.reason) {
      setError('All required fields must be filled.');
      return false;
    }
    const selectedDate = new Date(formData.date);
    if (isNaN(selectedDate) || selectedDate < new Date()) {
      setError('Please select a valid future date.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setOpenConfirm(true);
  };

  const confirmSubmission = async () => {
    setLoading(true);
    try {
      const data = {
        ...formData,
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        date: new Date(formData.date),
        bookedById: userId,
      };
      console.log('Submitting appointment data:', data); // Debug
      let response;
      if (appointment) {
        response = await updateAppointment(appointment.id, data);
      } else {
        response = await createAppointment(data);
      }
      console.log('Appointment response:', response); // Debug
      onSuccess();
      setFormData({ patientId: '', doctorId: '', departmentId: '', date: '', type: 'REGULAR', reason: '', notes: '' });
      setOpenConfirm(false);
    } catch (err) {
      setError('Failed to process appointment');
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const reasons = ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup', 'Other'];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>Create Appointment</Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Patient</InputLabel>
        <Select name="patientId" value={formData.patientId} onChange={handleChange} required>
          <MenuItem value="">Select Patient</MenuItem>
          {patients.map((patient) => (
            <MenuItem key={patient.id} value={patient.id}>{patient.user?.name || 'Unknown'}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Doctor</InputLabel>
        <Select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
          <MenuItem value="">Select Doctor</MenuItem>
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>{doctor.user?.name || 'Unknown'} ({doctor.specialty})</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Department</InputLabel>
        <Select name="departmentId" value={formData.departmentId} onChange={handleChange}>
          <MenuItem value="">Select Department</MenuItem>
          {departments.map((dept) => (
            <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Date"
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        InputLabelProps={{ shrink: true }}
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Type</InputLabel>
        <Select name="type" value={formData.type} onChange={handleChange}>
          <MenuItem value="REGULAR">Regular</MenuItem>
          <MenuItem value="WALK_IN">Walk-In</MenuItem>
          <MenuItem value="EMERGENCY">Emergency</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Reason</InputLabel>
        <Select name="reason" value={formData.reason} onChange={handleChange} required>
          <MenuItem value="">Select Reason</MenuItem>
          {reasons.map((reason) => (
            <MenuItem key={reason} value={reason}>{reason}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        multiline
        rows={4}
      />
      {error && <Typography color="error">{error}</Typography>}
      <Box mt={2} display="flex" gap={2}>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Processing...' : appointment ? 'Update Appointment' : 'Create Appointment'}
        </Button>
        <Button variant="outlined" onClick={() => setFormData({ patientId: '', doctorId: '', departmentId: '', date: '', type: 'REGULAR', reason: '', notes: '' })}>
          Clear
        </Button>
      </Box>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          <Typography><strong>Patient:</strong> {patients.find((p) => p.id === parseInt(formData.patientId))?.user?.name || 'Unknown'}</Typography>
          <Typography><strong>Doctor:</strong> {doctors.find((d) => d.id === parseInt(formData.doctorId))?.user?.name || 'Unknown'}</Typography>
          <Typography><strong>Department:</strong> {departments.find((d) => d.id === parseInt(formData.departmentId))?.name || 'N/A'}</Typography>
          <Typography><strong>Date:</strong> {formData.date && !isNaN(new Date(formData.date)) ? format(new Date(formData.date), 'PPp') : 'Invalid Date'}</Typography>
          <Typography><strong>Type:</strong> {formData.type}</Typography>
          <Typography><strong>Reason:</strong> {formData.reason}</Typography>
          <Typography><strong>Notes:</strong> {formData.notes || 'N/A'}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmSubmission} variant="contained" disabled={loading}>Confirm</Button>
          <Button onClick={() => setOpenConfirm(false)} variant="outlined">Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}