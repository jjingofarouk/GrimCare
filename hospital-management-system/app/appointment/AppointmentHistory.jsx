
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, FormControl, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAppointments } from './appointmentService';
import { format } from 'date-fns';

export default function AppointmentHistory({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedPatientId) {
      const fetchAppointments = async () => {
        try {
          const data = await getAppointments();
          const patientAppointments = data.filter((appt) => appt.patient.id === parseInt(selectedPatientId));
          setAppointments(patientAppointments);
        } catch (err) {
          setError('Failed to fetch appointment history');
        }
      };
      fetchAppointments();
    }
  }, [selectedPatientId]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'doctorName', headerName: 'Doctor', width: 150, valueGetter: (params) => params.row.doctor.user.name },
    { field: 'date', headerName: 'Date', width: 200, valueGetter: (params) => format(new Date(params.row.date), 'PPp') },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 200 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Appointment History</Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <Select value={selectedPatientId} onChange={(e) => setSelectedPatientId(e.target.value)} displayEmpty>
          <MenuItem value="">Select Patient</MenuItem>
          {patients.map((patient) => (
            <MenuItem key={patient.id} value={patient.id}>{patient.user.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {error && <Alert severity="error">{error}</Alert>}
      {selectedPatientId && (
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
