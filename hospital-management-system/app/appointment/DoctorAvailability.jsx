"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Paper } from '@mui/material';
import { getDoctors, getDoctorAvailability } from './appointmentService';
import styles from './DoctorAvailability.module.css';

export default function DoctorAvailability() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (err) {
        setError('Failed to fetch doctors');
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchAvailability = async () => {
        try {
          const slots = await getDoctorAvailability(selectedDoctor, selectedDate);
          setAvailability(slots);
        } catch (err) {
          setError('Failed to fetch availability');
        }
      };
      fetchAvailability();
    }
  }, [selectedDoctor, selectedDate]);

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>Doctor Availability</Typography>
      {error && <p className={styles.error}>{error}</p>}
      <FormControl fullWidth className={styles.select}>
        <Select value={selectedDoctor} onChange={handleDoctorChange} displayEmpty>
          <MenuItem value="">Select Doctor</MenuItem>
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>{doctor.name} ({doctor.specialization})</MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth className={styles.select}>
        <input type="date" value={selectedDate} onChange={handleDateChange} />
      </FormControl>
      <Paper elevation={3} className={styles.availabilitySection}>
        <Typography variant="h5" gutterBottom>Available Slots</Typography>
        {availability.length === 0 ? (
          <Typography>No available slots for selected date</Typography>
        ) : (
          availability.map((slot, index) => (
            <Typography key={index}>{new Date(slot.start).toLocaleTimeString()} - {new Date(slot.end).toLocaleTimeString()}</Typography>
          ))
        )}
      </Paper>
    </Box>
  );
}
