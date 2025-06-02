import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import CustomDataGrid from './CustomDataGrid';
import { useApiData } from '../utils/api';
import { getAppointments } from './appointmentService';

export default function AppointmentHistory({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const { data: appointments, error: appointmentsError } = useApiData(
    () => selectedPatientId ? getAppointments() : Promise.resolve([]),
    [selectedPatientId]
  );

  const filteredAppointments = appointments.filter(
    (appt) => appt.patientId === parseInt(selectedPatientId)
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    { field: 'notes', headerName: 'Notes', width: 200 },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Appointment History</Typography>
      <SearchableSelect
        label="Patient"
        options={patients}
        value={selectedPatientId}
        onChange={setSelectedPatientId}
        getOptionLabel={(patient) => patient.user?.name || patient.patientId || 'Unknown'}
        getOptionValue={(patient) => patient.id}
      />
      {appointmentsError && <Alert severity="error">{appointmentsError}</Alert>}
      {selectedPatientId && (
        <Box sx={{ height: 400, width: '100%' }}>
          <CustomDataGrid rows={filteredAppointments} columns={columns} />
        </Box>
      )}
    </Box>
  );
}