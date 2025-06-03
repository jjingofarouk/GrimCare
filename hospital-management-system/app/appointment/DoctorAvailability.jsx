"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';
import styles from './DoctorAvailability.module.css';

export default function DoctorAvailability({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [formData, setFormData] = useState({ startTime: '', endTime: '', status: 'AVAILABLE' });
  const [availability, setAvailability] = useState([]);
  const [filteredAvailability, setFilteredAvailability] = useState([]);
  const [filter, setFilter] = useState({ status: '', date: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch all availability data on component mount
  useEffect(() => {
    async function fetchAllAvailability() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedAvailability = response.data.map((item, index) => ({
          ...item,
          id: item.id || index + 1,
          doctorName: getDoctorName(item.doctorId),
        }));
        setAvailability(formattedAvailability);
        applyFilters(formattedAvailability, filter, selectedDoctorId);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAllAvailability();
  }, []);

  // Helper function to get doctor name by ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    return doctor ? `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})` : 'Unknown Doctor';
  };

  const applyFilters = (data, currentFilter, doctorFilter = '') => {
    let filtered = [...data];
    
    // Filter by selected doctor
    if (doctorFilter) {
      filtered = filtered.filter(item => item.doctorId === doctorFilter);
    }
    
    // Filter by status
    if (currentFilter.status) {
      filtered = filtered.filter(item => item.status === currentFilter.status);
    }
    
    // Filter by date
    if (currentFilter.date) {
      const filterDate = new Date(currentFilter.date).toDateString();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.startTime).toDateString();
        return itemDate === filterDate;
      });
    }
    
    setFilteredAvailability(filtered);
  };

  // Apply filters when filter state or selected doctor changes
  useEffect(() => {
    applyFilters(availability, filter, selectedDoctorId);
  }, [filter, availability, selectedDoctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId) {
      setError('Please select a doctor to add availability.');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      setError('Start and End times are required.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`,
        { resource: 'availability', ...formData, doctorId: selectedDoctorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFormData({ startTime: '', endTime: '', status: 'AVAILABLE' });
      
      // Refresh all availability data
      const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedAvailability = response.data.map((item, index) => ({
        ...item,
        id: item.id || index + 1,
        doctorName: getDoctorName(item.doctorId),
      }));
      setAvailability(formattedAvailability);
      applyFilters(formattedAvailability, filter, selectedDoctorId);
      setError(null);
    } catch (err) {
      setError('Failed to create availability: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleDoctorFilterChange = (doctorId) => {
    setSelectedDoctorId(doctorId);
  };

  const columns = [
    {
      field: 'doctorName',
      headerName: 'Doctor',
      width: 250,
      renderCell: (params) => params.row.doctorName || 'Unknown Doctor',
    },
    {
      field: 'startTime',
      headerName: 'Start Time',
      width: 200,
      renderCell: (params) => (params.row.startTime ? new Date(params.row.startTime).toLocaleString() : 'N/A'),
    },
    {
      field: 'endTime',
      headerName: 'End Time',
      width: 200,
      renderCell: (params) => (params.row.endTime ? new Date(params.row.endTime).toLocaleString() : 'N/A'),
    },
    { field: 'status', headerName: 'Status', width: 120 },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" gutterBottom className={styles.title}>
        Doctor Availability
      </Typography>
      
      {/* Doctor Filter Section */}
      <Box className={styles.filterContainer}>
        <SearchableSelect
          label="Filter by Doctor (Optional)"
          options={doctors}
          value={selectedDoctorId}
          onChange={handleDoctorFilterChange}
          getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
          getOptionValue={(doctor) => doctor.id}
          allowClear={true}
        />
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
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Add Availability Form */}
      <Box component="form" onSubmit={handleSubmit} className={styles.form}>
        <SearchableSelect
          label="Select Doctor (Required for adding availability)"
          options={doctors}
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
          getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
          getOptionValue={(doctor) => doctor.id}
        />
        <TextField
          label="Start Time"
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
          className={styles.input}
        />
        <TextField
          label="End Time"
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
          className={styles.input}
        />
        <FormControl className={styles.input}>
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          >
            <MenuItem value="AVAILABLE">Available</MenuItem>
            <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" className={styles.button}>
          Add Availability
        </Button>
      </Box>

      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      
      {loading ? (
        <CircularProgress className={styles.loader} />
      ) : (
        <Box className={styles.gridContainer}>
          <DataGrid
            rows={filteredAvailability}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
            getRowId={(row) => row.id}
          />
        </Box>
      )}
    </Box>
  );
}