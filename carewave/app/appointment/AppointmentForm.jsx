"use client";

import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './AppointmentForm.module.css';

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
  const [fetchedPatients, setFetchedPatients] = useState([]);
  const [fetchedDoctors, setFetchedDoctors] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const [patientsRes, doctorsRes] = await Promise.all([
          axios.get(`${api.BASE_URL}${api.API_ROUTES.PATIENT}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.DOCTOR}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setFetchedPatients(patientsRes.data);
        setFetchedDoctors(doctorsRes.data);
      } catch (err) {
        setError('Failed to fetch patients or doctors: ' + (err.response?.data?.error || err.message));
      }
    }
    fetchData();
  }, []);

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
        date: formData.date,
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
    <Box className={styles.container}>
      <Box component="form" onSubmit={handleSubmit} className={`${styles.formBox} ${styles.fadeIn}`}>
        <Typography variant="h6" className={styles.title}>Create Appointment</Typography>
        <SearchableSelect
          label=" "
          options={fetchedPatients.length > 0 ? fetchedPatients : patients}
          value={formData.patientId}
          onChange={(value) => setFormData({ ...formData, patientId: value })}
          getOptionLabel={(patient) => patient.user?.name || patient.patientId || 'Unknown'}
          getOptionValue={(patient) => patient.id}
          required
          className={styles.formControl}
        />
        <SearchableSelect
          label=" "
          options={fetchedDoctors.length > 0 ? fetchedDoctors : doctors}
          value={formData.doctorId}
          onChange={(value) => setFormData({ ...formData, doctorId: value })}
          getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
          getOptionValue={(doctor) => doctor.id}
          required
          className={styles.formControl}
        />
        <FormControl fullWidth className={styles.formControl}>
          <InputLabel className={styles.inputLabel}>Department</InputLabel>
          <Select name="departmentId" value={formData.departmentId} onChange={handleChange} className={styles.select}>
            <MenuItem value="">Select Department</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          className={styles.formControl}
          label=" "
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          InputLabelProps={{ shrink: true }}
          className={styles.textField}
        />
        <FormControl fullWidth className={styles.formControl}>
          <InputLabel className={styles.inputLabel}>Type</InputLabel>
          <Select name="type" value={formData.type} onChange={handleChange} className={styles.select}>
            <MenuItem value="REGULAR">Regular</MenuItem>
            <MenuItem value="WALK_IN">Walk-In</MenuItem>
            <MenuItem value="EMERGENCY">Emergency</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth className={styles.formControl}>
          <InputLabel className={styles.inputLabel}>Reason</InputLabel>
          <Select name="reason" value={formData.reason} onChange={handleChange} required className={styles.select}>
            <MenuItem value="">Select Reason</MenuItem>
            {reasons.map((reason) => (
              <MenuItem key={reason} value={reason}>{reason}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          className={styles.formControl}
          label=" "
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          multiline
          rows={4}
          className={styles.textField}
        />
        {error && <Typography className={styles.errorText}>{error}</Typography>}
        <Box mt={2} display="flex" gap={2} justifyContent="center">
          <Button type="submit" variant="contained" disabled={loading} className={styles.submitButton}>
            {loading ? 'Processing...' : appointment ? 'Update Appointment' : 'Create Appointment'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setFormData({ patientId: '', doctorId: '', departmentId: '', date: '', type: 'REGULAR', reason: '', notes: '' })}
            className={styles.clearButton}
          >
            Clear
          </Button>
        </Box>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} className={styles.dialog}>
          <DialogTitle className={styles.dialogTitle}>Confirm Appointment</DialogTitle>
          <DialogContent className={styles.dialogContent}>
            <Typography><strong>Patient:</strong> {(fetchedPatients.length > 0 ? fetchedPatients : patients).find((p) => p.id === parseInt(formData.patientId))?.user?.name || 'Unknown'}</Typography>
            <Typography><strong>Doctor:</strong> {(fetchedDoctors.length > 0 ? fetchedDoctors : doctors).find((d) => d.id === parseInt(formData.doctorId))?.user?.name || 'Unknown'}</Typography>
            <Typography><strong>Department:</strong> {departments.find((d) => d.id === parseInt(formData.departmentId))?.name || 'N/A'}</Typography>
            <Typography><strong>Date:</strong> {formData.date ? new Date(formData.date).toLocaleString() : 'N/A'}</Typography>
            <Typography><strong>Type:</strong> {formData.type}</Typography>
            <Typography><strong>Reason:</strong> {formData.reason}</Typography>
            <Typography><strong>Notes:</strong> {formData.notes || 'N/A'}</Typography>
          </DialogContent>
          <DialogActions className={styles.dialogActions}>
            <Button onClick={confirmSubmission} variant="contained" disabled={loading} className={styles.dialogButton}>Confirm</Button>
            <Button onClick={() => setOpenConfirm(false)} variant="outlined" className={styles.dialogCancelButton}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
