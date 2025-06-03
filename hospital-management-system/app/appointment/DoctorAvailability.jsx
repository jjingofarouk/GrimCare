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

  useEffect(() => {
    async function fetchAvailability() {
      if (!selectedDoctorId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability&doctorId=${selectedDoctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const formattedAvailability = response.data.map((item, index) => ({
          ...item,
          id: item.id || index + 1,
        }));
        setAvailability(formattedAvailability);
        applyFilters(formattedAvailability, filter);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [selectedDoctorId]);

  const applyFilters = (data, currentFilter) => {
    let filtered = [...data];
    if (currentFilter.status) {
      filtered = filtered.filter(item => item.status === currentFilter.status);
    }
    if (currentFilter.date) {
      const filterDate = new Date(currentFilter.date).toDateString();
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.startTime).toDateString();
        return itemDate === filterDate;
      });
    }
    setFilteredAvailability(filtered);
  };

  useEffect(() => {
    applyFilters(availability, filter);
  }, [filter, availability]);

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
      const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability&doctorId=${selectedDoctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedAvailability = response.data.map((item, index) => ({
        ...item,
        id: item.id || index + 1,
      }));
      setAvailability(formattedAvailability);
      applyFilters(formattedAvailability, filter);
      setError(null);
    } catch (err) {
      setError('Failed to create availability: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
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
      <Typography variant="h5" gutterBottom className={styles.title}>
        Doctor Availability
      </Typography>
      <SearchableSelect
        label=" "
        options={doctors}
        value={selectedDoctorId}
        onChange={setSelectedDoctorId}
        getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
        getOptionValue={(doctor) => doctor.id}
      />
      {selectedDoctorId && (
        <>
          <Box component="form" onSubmit={handleSubmit} className={styles.form}>
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
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
              </Select>
            </FormControl>
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
        </>
      )}
    </Box>
  );
}