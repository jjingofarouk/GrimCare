"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';

export default function DoctorSchedule({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      if (!selectedDoctorId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?doctorId=${selectedDoctorId}&status=SCHEDULED`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedAppointments = response.data.map((appt, index) => ({
          id: appt.id || `appt-${index + 1}`,
          patientName: appt.patient?.user?.name || appt.patient?.patientId || 'N/A',
          date: appt.date ? new Date(appt.date).toLocaleString() : 'N/A',
          type: appt.type || 'N/A',
          reason: appt.reason || 'N/A',
          queueNumber: appt.queue?.queueNumber || 'N/A',
        }));
        setAppointments(formattedAppointments);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
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
    { field: 'queueNumber', headerName: 'Queue Number', width: 120 },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 1000, mx: 'auto', bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
        Doctor Schedule
      </Typography>
      <SearchableSelect
        label="Doctor"
        options={doctors}
        value={selectedDoctorId}
        onChange={setSelectedDoctorId}
        getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
        getOptionValue={(doctor) => doctor.id}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {selectedDoctorId && (
        <Box sx={{ height: 400, width: '100%', mt: 2, bgcolor: 'white', borderRadius: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <DataGrid
              rows={appointments}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
              getRowId={(row) => row.id}
            />
          )}
        </Box>
      )}
    </Box>
  );
}