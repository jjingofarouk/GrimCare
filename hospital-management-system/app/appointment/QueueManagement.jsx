"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './QueueManagement.module.css';

export default function QueueManagement({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [queueItems, setQueueItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQueue(doctorId = '') {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const url = doctorId
          ? `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=queue&doctorId=${doctorId}`
          : `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=queue`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedQueueItems = response.data.map((item, index) => ({
          id: item.id || `queue-${index + 1}`,
          patientName: item.appointment?.patient?.user?.name || item.appointment?.patient?.patientId || 'N/A',
          doctorName: item.appointment?.doctor?.user?.name || item.appointment?.doctor?.doctorId || 'N/A',
          queueNumber: item.queueNumber || 'N/A',
          status: item.status || 'WAITING',
          appointmentDate: item.appointment?.date ? new Date(item.appointment.date).toLocaleString() : 'N/A',
        }));
        setQueueItems(formattedQueueItems);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQueue(selectedDoctorId);
  }, [selectedDoctorId]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, {
        resource: 'queue',
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQueueItems(queueItems.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update queue status: ' + (err.response?.data?.error || err.message));
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'queueNumber', headerName: 'Queue Number', width: 120 },
    { field: 'appointmentDate', headerName: 'Appointment Date', width: 200 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusUpdate(params.row.id, 'IN_PROGRESS')}
            disabled={params.row.status !== 'WAITING'}
          >
            Start
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusUpdate(params.row.id, 'COMPLETED')}
            disabled={params.row.status !== 'IN_PROGRESS'}
          >
            Complete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Queue Management
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
            rows={queueItems}
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