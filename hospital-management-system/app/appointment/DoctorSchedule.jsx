"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './DoctorSchedule.module.css';

export default function DoctorSchedule({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments(doctorId = '') {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const url = doctorId
          ? `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?doctorId=${doctorId}&status=SCHEDULED`
          : `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?status=SCHEDULED`;
        const response = await axios.get(url, {
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
    fetchAppointments(selectedDoctorId);
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
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Doctor Schedule
      </Typography>
      <SearchableSelect
        label="Filter by Doctor"
        options={doctors}
        value={selectedDoctorId}
        onChange={setSelectedDoctorId}
        getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
        getOptionValue={(doctor) => doctor.id}
        className={styles.searchSelect}
      />
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      <Box className={styles.dataGridContainer}>
        {loading ? (
          <CircularProgress className={styles.loader} />
        ) : (
          <DataGrid
            rows={appointments}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
            className={styles.dataGrid}
          />
        )}
      </Box>
    </Box>
  );
}