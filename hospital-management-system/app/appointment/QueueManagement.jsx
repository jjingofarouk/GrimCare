"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, CircularProgress, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './Queue.module.css';

export default function QueueManagement({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [queueItems, setQueueItems] = useState([]);
  const [filteredQueueItems, setFilteredQueueItems] = useState([]);
  const [filter, setFilter] = useState({ status: '', date: '' });
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
        applyFilters(formattedQueueItems, filter);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, [selectedDoctorId]);

  const applyFilters = (data, currentFilter) => {
    let filtered = [...data];
    if (currentFilter.status) {
      filtered = filtered.filter(item => item.status === currentFilter.status);
    }
    if (currentFilter.date) {
      const filterDate = new Date(currentFilter.date).toDateString();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.appointmentDate).toDateString();
        return itemDate === filterDate;
      });
    }
    setFilteredQueueItems(filtered);
  };

  useEffect(() => {
    applyFilters(queueItems, filter);
  }, [filter, queueItems]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, {
        resource: 'queue',
        status: newStatus,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedQueueItems = queueItems.map(item =>
        item.id === id ? { ...item, status: newStatus } : item
      );
      setQueueItems(updatedQueueItems);
      applyFilters(updatedQueueItems, filter);
      setError(null);
    } catch (err) {
      setError('Failed to update queue status: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
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
        <Box className={styles.actions}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusUpdate(params.row.id, 'IN_PROGRESS')}
            disabled={params.row.status !== 'WAITING'}
            className={styles.actionButton}
          >
            Start
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleStatusUpdate(params.row.id, 'COMPLETED')}
            disabled={params.row.status !== 'IN_PROGRESS'}
            className={styles.actionButton}
          >
            Complete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" gutterBottom className={styles.title}>
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
      <Box className={styles.filterContainer}>
        <TextField
          label="Filter by Date"
          type="date"
          name="date"
          value={filter.date}
          onChange={handleFilterChange}
          InputLabelProps={{ shrink: true }}
          className={styles.filterInput}
        />
        <FormControl className={styles.filterInput}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="WAITING">Waiting</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      {selectedDoctorId && (
        <Box className={styles.gridContainer}>
          {loading ? (
            <CircularProgress className={styles.loader} />
          ) : (
            <DataGrid
              rows={filteredQueueItems}
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