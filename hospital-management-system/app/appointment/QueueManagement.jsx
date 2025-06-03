"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';

export default function QueueManagement({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [queueItems, setQueueItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchQueue() {
      if (!selectedDoctorId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=queue&doctorId=${selectedDoctorId}`, {
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
    fetchQueue();
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
    <Box sx={{ p: 2, maxWidth: 1000, mx: 'auto', bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
        Queue Management
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
              rows={queueItems}
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