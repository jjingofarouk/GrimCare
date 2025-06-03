"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import CustomDataGrid from '../components/CustomDataGrid';
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
        setAvailability(response.data);
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
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`, { resource: 'availability', ...formData, doctorId: selectedDoctorId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({ startTime: '', endTime: '', status: 'AVAILABLE' });
      const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=availability&doctorId=${selectedDoctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailability(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to create availability: ' + (err.response?.data?.error || err.message));
    }
  };

  const columns = [
    { field: 'startTime', headerName: 'Start Time', width: 200, valueGetter: (params) => new Date(params.row.startTime).toLocaleString() },
    { field: 'endTime', headerName: 'End Time', width: 200, valueGetter: (params) => new Date(params.row.endTime).toLocaleString() },
    { field: 'status', headerName: 'Status', width: 120 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Doctor Availability</Typography>
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
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Start Time"
              type="datetime-local"
              name="startTime"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              label="End Time"
              type="datetime-local"
              name="endTime"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={formData.status} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}>
                <MenuItem value="AVAILABLE">Available</MenuItem>
                <MenuItem value="UNAVAILABLE">Unavailable</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained">Add Availability</Button>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ height: 400, width: '100%' }}>
              <CustomDataGrid rows={availability} columns={columns} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}