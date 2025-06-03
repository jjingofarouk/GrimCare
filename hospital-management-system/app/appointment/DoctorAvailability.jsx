

"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SearchableSelect from '../components/SearchableSelect';
import axios from 'axios';
import api from '../api';

export default function DoctorAvailability({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [formData, setFormData] = useState({ startTime: '', endTime: '', status: 'AVAILABLE' });
  const [availability, setAvailability] = useState([]);
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
          id: item.id || index + 1, // Ensure unique ID for DataGrid
        }));
        setAvailability(formattedAvailability);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [selectedDoctorId]);

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
      setError(null);
    } catch (err) {
      setError('Failed to create availability: ' + (err.response?.data?.error || err.message));
    }
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
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto', bgcolor: '#f5f5f5', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: '#1976d2' }}>
        Doctor Availability
      </Typography>
      <SearchableSelect
        label="Doctor"
        options={doctors}
        value={selectedDoctorId}
        onChange={setSelectedDoctorId}
        getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
        getOptionValue={(doctor) => doctor.id}
      />
      {selectedDoctorId && (
        <>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Start Time"
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ minWidth: 200 }}
            />
            <TextField
              label="End Time"
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 120 }}>
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
            <Button type="submit" variant="contained" sx={{ bgcolor: '#1976d2' }}>
              Add Availability
            </Button>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ height: 400, width: '100%', bgcolor: 'white', borderRadius: 2 }}>
              <DataGrid
                rows={availability}
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