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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', startTime: '' });

  useEffect(() => {
    async function fetchAvailability(doctorId = '') {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const url = doctorId
          ? `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability&doctorId=${doctorId}`
          : `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedAvailability = response.data.map((item, index) => ({
          ...item,
          id: item.id || index + 1,
        }));
        setAvailability(formattedAvailability);
        setFilteredAvailability(formattedAvailability);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability(selectedDoctorId);
  }, [selectedDoctorId]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...availability];
      if (filters.status) {
        filtered = filtered.filter(item => item.status.toLowerCase().includes(filters.status.toLowerCase()));
      }
      if (filters.startTime) {
        filtered = filtered.filter(item => item.startTime && new Date(item.startTime).toLocaleString().includes(filters.startTime));
      }
      setFilteredAvailability(filtered);
    };
    applyFilters();
  }, [filters, availability]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await axios.get(
        selectedDoctorId
          ? `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability&doctorId=${selectedDoctorId}`
          : `${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const formattedAvailability = response.data.map((item, index) => ({
        ...item,
        id: item.id || index + 1,
      }));
      setAvailability(formattedAvailability);
      setFilteredAvailability(formattedAvailability);
      setError(null);
    } catch (err) {
      setError('Failed to create availability: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const columns = [
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
      <Typography variant="h5" className={styles.title}>
        Doctor Availability
      </Typography>
      <Box className={styles.filterContainer}>
        <SearchableSelect
          label="Filter by Doctor"
          options={doctors}
          value={selectedDoctorId}
          onChange={setSelectedDoctorId}
          getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
          getOptionValue={(doctor) => doctor.id}
          className={styles.searchSelect}
        />
        <TextField
          label="Filter by Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
        <TextField
          label="Filter by Start Time"
          name="startTime"
          value={filters.startTime}
          onChange={handleFilterChange}
          className={styles.filterInput}
        />
      </Box>
      <Box component="form" onSubmit={handleSubmit} className={styles.form}>
        <TextField
          label="Start Time"
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
          className={styles.textField}
        />
        <TextField
          label="End Time"
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
          className={styles.textField}
        />
        <FormControl className={styles.formControl}>
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
        <Button type="submit" variant="contained" className={styles.submitButton}>
          Add Availability
        </Button>
      </Box>
      {error && <Alert severity="error" className={styles.alert}>{error}</Alert>}
      <Box className={styles.dataGridContainer}>
        {loading ? (
          <CircularProgress className={styles.loader} />
        ) : (
          <DataGrid
            rows={filteredAvailability}
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