"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import AppointmentCard from './AppointmentCard';
import { getAppointments, updateAppointment, deleteAppointment } from './appointmentService';

export default function AppointmentList({ onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'ALL',
    dateFrom: '',
    dateTo: '',
    doctorId: '',
    patientId: '',
    department: '',
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        setAppointments(data);
      } catch (err) {
        setError('Failed to fetch appointments');
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      await updateAppointment(id, { status: 'CANCELLED' });
      setAppointments(appointments.map((appt) => appt.id === id ? { ...appt, status: 'CANCELLED' } : appt));
    } catch (err) {
      setError('Failed to cancel appointment');
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await updateAppointment(id, { checkInTime: new Date(), status: 'CHECKED_IN' });
      setAppointments(appointments.map((appt) => appt.id === id ? { ...appt, checkInTime: new Date(), status: 'CHECKED_IN' } : appt));
    } catch (err) {
      setError('Failed to check in');
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await updateAppointment(id, { checkOutTime: new Date(), status: 'COMPLETED' });
      setAppointments(appointments.map((appt) => appt.id === id ? { ...appt, checkOutTime: new Date(), status: 'COMPLETED' } : appt));
    } catch (err) {
      setError('Failed to check out');
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = filters.status === 'ALL' || appt.status === filters.status;
    const matchesDateFrom = !filters.dateFrom || new Date(appt.appointmentDate) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(appt.appointmentDate) <= new Date(filters.dateTo);
    const matchesDoctor = !filters.doctorId || appt.doctorId === parseInt(filters.doctorId);
    const matchesPatient = !filters.patientId || appt.patientId === parseInt(filters.patientId);
    const matchesDepartment = !filters.department || appt.department === filters.department;
    return matchesStatus && matchesDateFrom && matchesDateTo && matchesDoctor && matchesPatient && matchesDepartment;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Appointments</Typography>
      <Box display="flex" gap={2} mb={3}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select name="status" value={filters.status} onChange={handleFilterChange}>
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
            <MenuItem value="CHECKED_IN">Checked In</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="From Date"
          type="date"
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To Date"
          type="date"
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Department</InputLabel>
          <Select name="department" value={filters.department} onChange={handleFilterChange}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Cardiology">Cardiology</MenuItem>
            <MenuItem value="Pediatrics">Pediatrics</MenuItem>
            <MenuItem value="General Medicine">General Medicine</MenuItem>
            <MenuItem value="Gynecology">Gynecology</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <Box>
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onEdit={onEdit}
            onCancel={handleCancel}
            onCheckIn={handleCheckIn}
            onCheckOut={handleCheckOut}
          />
        ))}
      </Box>
    </Box>
  );
}
