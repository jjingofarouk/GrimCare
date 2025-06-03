"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import CustomDataGrid from '../components/CustomDataGrid';
import api from '../api';

export default function DoctorSchedule({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      if (!selectedDoctorId) {
        setAppointments([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?doctorId=${selectedDoctorId}`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        const data = await response.json();
        const filteredAppointments = data
          .filter((appt) => appt.status === 'SCHEDULED')
          .map((appt) => ({
            id: appt.id,
            patientName: appt.patient?.user?.name || 'N/A',
            date: appt.date ? new Date(appt.date).toLocaleString() : 'N/A',
            type: appt.type || 'N/A',
            reason: appt.reason || 'N/A',
            queueNumber: appt.queueNumber || 'N/A',
          }));
        setAppointments(filteredAppointments);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, [selectedDoctorId]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'queueNumber', headerName: 'Queue', width: 100 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Doctor Schedule</Typography>
      <SearchableSelect
        label="Doctor"
        options={doctors}
        value={selectedDoctorId}
        onChange={setSelectedDoctorId}
        getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
        getOptionValue={(doctor) => doctor.id}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {selectedDoctorId && (
        <Box sx={{ height: 400, width: '100%' }}>
          <CustomDataGrid rows={appointments} columns={columns} loading={loading} />
        </Box>
      )}
    </Box>
  );
}