"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, FormControl, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAvailability, createAvailability } from './appointmentService';
import { format } from 'date-fns';

export default function DoctorAvailability({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ startTime: '', endTime: '', status: 'AVAILABLE' });

  useEffect(() => {
    if (selectedDoctorId) {
      const fetchAvailability = async () => {
        try {
          const data = await getAvailability({ doctorId: selectedDoctorId });
          setAvailability(data);
        } catch (err) {
          setError('Failed to fetch availability');
        }
      };
      fetchAvailability();
    }
  }, [selectedDoctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAvailability({ ...formData, doctorId: selectedDoctorId });
      setFormData({ startTime: '', endTime: '', status: 'AVAILABLE' });
      const data = await getAvailability({ doctorId: selectedDoctorId });
      setAvailability(data);
    } catch (err) {
      setError('Failed to create availability');
    }
  };

  const columns = [
    { field: 'startTime', headerName: 'Start Time', width: 200, valueGetter: (params) => format(new Date(params.row.startTime), 'PPp') },
    { field: 'endTime', headerName: 'End Time', width: 200, valueGetter: (params) => format(new Date(params.row.endTime), 'PPp') },
    { field: 'status', headerName: 'Status', width: 120 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Doctor Availability</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} displayEmpty>
          <MenuItem value="">Select Doctor</MenuItem>
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>{doctor.user.name} ({doctor.specialty})</MenuItem>
          ))}
        </Select>
      </FormControl>
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
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={availability}
              columns={columns}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          </Box>
        </>
      )}
    </Box>
  );
}
