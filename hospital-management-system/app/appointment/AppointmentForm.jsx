"use client";

import React, { useState, useEffect } from 'react';
import { Box, TextField, MenuItem, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select } from '@mui/material';
import { getDoctorAvailability, createAppointment, updateAppointment } from './appointmentService';

export default function AppointmentForm({ patients, doctors, onSuccess, appointment }) {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    department: '',
    appointmentDate: '',
    reason: '',
    notes: '',
    type: 'REGULAR',
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        doctorId: appointment.doctorId || '',
        department: appointment.department || '',
        appointmentDate: appointment.appointmentDate ? new Date(appointment.appointmentDate).toISOString().slice(0, 16) : '',
        reason: appointment.reason || '',
        notes: appointment.notes || '',
        type: appointment.type || 'REGULAR',
      });
    }
  }, [appointment]);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      const date = new Date(formData.appointmentDate).toISOString().split('T')[0];
      getDoctorAvailability(formData.doctorId, date).then(slots => {
        setAvailableSlots(slots);
      }).catch(() => setError('Failed to fetch availability'));
    }
  }, [formData.doctorId, formData.appointmentDate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.patientId || !formData.doctorId || !formData.appointmentDate || !formData.reason || !formData.type) {
      setError('All required fields must be filled.');
      return false;
    }
    const selectedDate = new Date(formData.appointmentDate);
    if (selectedDate < new Date()) {
      setError('Cannot schedule appointments in the past.');
      return false;
    }
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
      const data = { ...formData, appointmentDate: new Date(formData.appointmentDate) };
      if (appointment) {
        await updateAppointment(appointment.id, data);
      } else {
        await createAppointment(data);
      }
      onSuccess();
      setFormData({ patientId: '', doctorId: '', department: '', appointmentDate: '', reason: '', notes: '', type: 'REGULAR' });
      setOpenConfirm(false);
    } catch (err) {
      setError('Failed to process appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Patient</InputLabel>
        <Select name="patientId" value={formData.patientId} onChange={handleChange} required>
          <MenuItem value="">Select Patient</MenuItem>
          {patients.map((patient) => (
            <MenuItem key={patient.id} value={patient.id}>{patient.user.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Doctor</InputLabel>
        <Select name="doctorId" value={formData.doctorId} onChange={handleChange} required>
          <MenuItem value="">Select Doctor</MenuItem>
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>{doctor.user.name} ({doctor.specialty})</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Department</InputLabel>
        <Select name="department" value={formData.department} onChange={handleChange}>
          <MenuItem value="">Select Department</MenuItem>
          <MenuItem value="Cardiology">Cardiology</MenuItem>
          <MenuItem value="Pediatrics">Pediatrics</MenuItem>
          <MenuItem value="General Medicine">General Medicine</MenuItem>
          <MenuItem value="Gynecology">Gynecology</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Appointment Date"
        type="datetime-local"
        name="appointmentDate"
        value={formData.appointmentDate}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Reason</InputLabel>
        <Select name="reason" value={formData.reason} onChange={handleChange} required>
          <MenuItem value="">Select Reason</MenuItem>
          <MenuItem value="Consultation">Consultation</MenuItem>
          <MenuItem value="Follow-up">Follow-up</MenuItem>
          <MenuItem value="Emergency">Emergency</MenuItem>
          <MenuItem value="Routine Checkup">Routine Checkup</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Type</InputLabel>
        <Select name="type" value={formData.type} onChange={handleChange} required>
          <MenuItem value="REGULAR">Regular</MenuItem>
          <MenuItem value="WALK_IN">Walk-in</MenuItem>
          <MenuItem value="EMERGENCY">Emergency</MenuItem>
        </Select>
      </FormControl>
      <TextField
        fullWidth
        label="Notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        multiline
        rows={4}
        sx={{ mb: 2 }}
      />
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Box display="flex" gap={2}>
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? 'Processing...' : appointment ? 'Update Appointment' : 'Create Appointment'}
        </Button>
        <Button variant="outlined" onClick={() => setFormData({ patientId: '', doctorId: '', department: '', appointmentDate: '', reason: '', notes: '', type: 'REGULAR' })}>
          Reset
        </Button>
      </Box>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          <Typography>Patient: {patients.find((p) => p.id === formData.patientId)?.user.name}</Typography>
          <Typography>Doctor: {doctors.find((d) => d.id === formData.doctorId)?.user.name}</Typography>
          <Typography>Date: {new Date(formData.appointmentDate).toLocaleString()}</Typography>
          <Typography>Reason: {formData.reason}</Typography>
          <Typography>Type: {formData.type}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={confirmSubmission} disabled={loading}>Confirm</Button>
          <Button onClick={() => setOpenConfirm(false)} disabled={loading}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
