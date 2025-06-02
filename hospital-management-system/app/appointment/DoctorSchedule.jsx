import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, FormControl, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAppointments } from './appointmentService';
import { format } from 'date-fns';

export default function DoctorSchedule({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDoctorId) {
      const fetchAppointments = async () => {
        try {
          const data = await getAppointments();
          const doctorAppointments = data.filter((appt) => appt.doctor.id === parseInt(selectedDoctorId) && appt.status === 'SCHEDULED');
          setAppointments(doctorAppointments);
        } catch (err) {
          setError('Failed to fetch doctor schedule');
        }
      };
      fetchAppointments();
    }
  }, [selectedDoctorId]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150, valueGetter: (params) => params.row.patient.user.name },
    { field: 'date', headerName: 'Date', width: 200, valueGetter: (params) => format(new Date(params.row.date), 'PPp') },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'queueNumber', headerName: 'Queue', width: 100, valueGetter: (params) => params.row.queue?.queueNumber || 'N/A' },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Doctor Schedule</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select value={selectedDoctorId} onChange={(e) => setSelectedDoctorId(e.target.value)} displayEmpty>
          <MenuItem value="">Select Doctor</MenuItem>
          {doctors.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>{doctor.user.name} ({doctor.specialty})</MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && <Alert severity="error">{error}</Alert>}
      {selectedDoctorId && (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={appointments}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </Box>
  );
}
