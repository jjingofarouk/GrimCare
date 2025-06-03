"use client";

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';

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
        resource: 'appointment',
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        date: new Date(formData.date),
        type: formData.type,
        reason: formData.reason,
        notes: formData.notes,
        bookedById: userId,
      };
      const token = localStorage.getItem('token');
      let response;
      if (appointment) {
        response = await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${appointment.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        response = await axios.post(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSuccess();
      setFormData({ patientId: '', doctorId: '', departmentId: '', date: '', type: 'REGULAR', reason: '', notes: '' });
      setOpenConfirm(false);
    } catch (err) {
      setError('Failed to process appointment: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const reasons = ['Consultation', 'Follow-up', 'Emergency', 'Routine Checkup', 'Other'];

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h6" gutterBottom>Create Appointment</Typography>
      <SearchableSelect
        label="Patient"
        options={patients}
        value={formData.patientId}
        onChange={(value) => setFormData({ ...formData, patientId: value })}
        getOptionLabel={(patient) => patient.user?.name || patient.patientId || 'Unknown'}
        getOptionValue={(patient) => patient.id}
        required
      />
      <SearchableSelect
        label="Doctor"
        options={doctors}
        value={formData.doctorId}
        onChange={(value) => setFormData({ ...formData, doctorId: value })}
        getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
        getOptionValue={(doctor) => doctor.id}
        required
      />
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
          <Typography><strong>Date:</strong> {new Date(formData.date).toLocaleString()}</Typography>
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