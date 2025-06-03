"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import CustomDataGrid from '../components/CustomDataGrid';
import api from '../api';

export default function DoctorAvailability({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [formData, setFormData] = useState({ startTime: '', endTime: '', status: 'AVAILABLE' });
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAvailability() {
      if (!selectedDoctorId) {
        setAvailability([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${api.BASE_URL}${api.API_ROUTES.AVAILABILITY}?doctorId=${selectedDoctorId}`);
        if (!response.ok) throw new Error('Failed to fetch availability');
        const data = await response.json();
        setAvailability(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAvailability();
  }, [selectedDoctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`${api.BASE_URL}${api.API_ROUTES.AVAILABILITY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, doctorId: selectedDoctorId }),
      });
      if (!response.ok) throw new Error('Failed to create availability');
      const newAvailability = await response.json();
      setAvailability([...availability, newAvailability]);
      setFormData({ startTime: '', endTime: '', status: 'AVAILABLE' });
      setError(null);
    } catch (err) {
      setError('Failed to create availability: ' + err.message);
    } finally {
      setLoading(false);
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
            <Button type="submit" variant="contained" disabled={loading}>Add Availability</Button>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          <Box sx={{ height: 400, width: '100%' }}>
            <CustomDataGrid rows={availability} columns={columns} loading={loading} />
          </Box>
        </>
      )}
    </Box>
  );
}