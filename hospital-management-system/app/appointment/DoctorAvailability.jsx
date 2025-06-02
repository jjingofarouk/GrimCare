"use client";

import React, { useState } from 'react';
import { Box, Typography, Alert, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import CustomDataGrid from '../components/CustomDataGrid';
import { useApiData } from '../utils/api';
import { getAvailability, createAvailability } from './appointmentService';

export default function DoctorAvailability({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [formData, setFormData] = useState({ startTime: '', endTime: '', status: 'AVAILABLE' });
  const { data: availability, error: availabilityError } = useApiData(
    () => selectedDoctorId ? getAvailability({ doctorId: selectedDoctorId }) : Promise.resolve([]),
    [selectedDoctorId]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAvailability({ ...formData, doctorId: selectedDoctorId });
      setFormData({ startTime: '', endTime: '', status: 'AVAILABLE' });
    } catch (err) {
      setError('Failed to create availability: ' + err.message);
    }
  };

  const columns = [
    { field: 'startTime', headerName: 'Start Time', width: 200 },
    { field: 'endTime', headerName: 'End Time', width: 200 },
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
          {availabilityError && <Alert severity="error">{availabilityError}</Alert>}
          <Box sx={{ height: 400, width: '100%' }}>
            <CustomDataGrid rows={availability} columns={columns} />
          </Box>
        </>
      )}
    </Box>
  );
}