"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';

export default function AppointmentHistory({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const url = selectedPatientId 
          ? `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?patientId=${selectedPatientId}`
          : `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedAppointments = response.data.map((appt, index) => ({
          id: appt.id || `appt-${index + 1}`,
          doctorName: appt.doctor?.user?.name || appt.doctor?.doctorId || 'N/A',
          date: appt.date ? new Date(appt.date).toLocaleString() : 'N/A',
          type: appt.type || 'N/A',
          status: appt.status || 'N/A',
          reason: appt.reason || 'N/A',
          notes: appt.notes || 'N/A',
        }));
        setAppointments(formattedAppointments);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [selectedPatientId]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 200 },
  ];

  return (
    <Box sx={{ p: 2, maxWidth: 1000, mx: 'auto', bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
        Appointment History
      </Typography>
      <SearchableSelect
        label="Patient (optional)"
        options={[{ id: '', user: { name: 'All Patients' } }, ...patients]}
        value={selectedPatientId}
        onChange={setSelectedPatientId}
        getOptionLabel={(patient) => patient.user?.name || patient.patientId || 'All Patients'}
        getOptionValue={(patient) => patient.id}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
    </Box>
  );
}