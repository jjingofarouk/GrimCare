"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import styles from './ClinicalForm.module.css';

export default function ClinicalForm({ patients, onSuccess, patientType }) {
  const [formData, setFormData] = useState({
    patientId: '',
    diagnosis: '',
    treatment: '',
    triageStatus: '',
    admissionDate: '',
    ipNumber: '',
    department: '',
    admittingDoctor: '',
    dischargeDate: '',
    dischargingDoctor: '',
    assignedDoctor: '',
    recentResults: '',
    status: 'active',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, patientType }));
  }, [patientType]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await onSuccess(formData);
      setFormData({
        patientId: '',
        diagnosis: '',
        treatment: '',
        triageStatus: '',
        admissionDate: '',
        ipNumber: '',
        department: '',
        admittingDoctor: '',
        dischargeDate: '',
        dischargingDoctor: '',
        assignedDoctor: '',
        recentResults: '',
        status: 'active',
        patientType,
      });
    } catch (err) {
      setError('Failed to create record');
    }
  };

  return (
    <Box component="form" className={styles.form} onSubmit={handleSubmit}>
      <FormControl fullWidth className={styles.field}>
        <InputLabel>Patient</InputLabel>
        <Select
          name="patientId"
          value={formData.patientId}
          onChange={handleChange}
          required
        >
          <MenuItem value="">Select Patient</MenuItem>
          {patients.map((patient) => (
            <MenuItem key={patient.id} value={patient.id}>
              {patient.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Diagnosis"
        name="diagnosis"
        value={formData.diagnosis}
        onChange={handleChange}
        required
        fullWidth
        className={styles.field}
      />
      <TextField
        label="Treatment"
        name="treatment"
        value={formData.treatment}
        onChange={handleChange}
        required
        fullWidth
        multiline
        rows={4}
        className={styles.field}
      />
      {patientType === 'emergency' && (
        <FormControl fullWidth className={styles.field}>
          <InputLabel>Triage Status</InputLabel>
          <Select
            name="triageStatus"
            value={formData.triageStatus}
            onChange={handleChange}
            required
          >
            <MenuItem value="">Select Triage Status</MenuItem>
            <MenuItem value="critical">Critical</MenuItem>
            <MenuItem value="emergency">Emergency</MenuItem>
            <MenuItem value="urgent">Urgent</MenuItem>
            <MenuItem value="semi-urgent">Semi-Urgent</MenuItem>
            <MenuItem value="non-urgent">Non-Urgent</MenuItem>
          </Select>
        </FormControl>
      )}
      {patientType === 'inpatient' && (
        <>
          <TextField
            label="Admission Date"
            name="admissionDate"
            type="date"
            value={formData.admissionDate}
            onChange={handleChange}
            required
            fullWidth
            className={styles.field}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="IP Number"
            name="ipNumber"
            value={formData.ipNumber}
            onChange={handleChange}
            required
            fullWidth
            className={styles.field}
          />
          <TextField
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            fullWidth
            className={styles.field}
          />
          <TextField
            label="Admitting Doctor"
            name="admittingDoctor"
            value={formData.admittingDoctor}
            onChange={handleChange}
            required
            fullWidth
            className={styles.field}
          />
          <FormControl fullWidth className={styles.field}>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="admitted">Admitted</MenuItem>
              <MenuItem value="discharged">Discharged</MenuItem>
            </Select>
          </FormControl>
          {formData.status === 'discharged' && (
            <>
              <TextField
                label="Discharge Date"
                name="dischargeDate"
                type="date"
                value={formData.dischargeDate}
                onChange={handleChange}
                required
                fullWidth
                className={styles.field}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Discharging Doctor"
                name="dischargingDoctor"
                value={formData.dischargingDoctor}
                onChange={handleChange}
                required
                fullWidth
                className={styles.field}
              />
            </>
          )}
        </>
      )}
      {(patientType === 'emergency' || patientType === 'outpatient') && (
        <TextField
          label="Assigned Doctor"
          name="assignedDoctor"
          value={formData.assignedDoctor}
          onChange={handleChange}
          required
          fullWidth
          className={styles.field}
        />
      )}
      <TextField
        label="Recent Results"
        name="recentResults"
        value={formData.recentResults}
        onChange={handleChange}
        fullWidth
        multiline
        rows={4}
        className={styles.field}
      />
      {error && (
        <Typography color="error" className={styles.error}>
          {error}
        </Typography>
      )}
      <Button type="submit" variant="contained" className={styles.button}>
        Create Record
      </Button>
    </Box>
  );
}