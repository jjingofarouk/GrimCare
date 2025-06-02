import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import CustomDataGrid from '../components/CustomDataGrid';
import { useApiData } from '../utils/api';
import { getAppointments } from './appointmentService';

export default function DoctorSchedule({ doctors }) {
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const { data: appointments, error: appointmentsError } = useApiData(
    () => selectedDoctorId ? getAppointments() : Promise.resolve([]),
    [selectedDoctorId]
  );

  const filteredAppointments = appointments.filter(
    (appt) => appt.doctorId === parseInt(selectedDoctorId) && appt.status === 'SCHEDULED'
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    {
      field: 'queueNumber',
      headerName: 'Queue',
      width: 100,
      valueGetter: (params) => params.row?.queue?.queueNumber || 'N/A',
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Doctor Schedule</Typography>
      <SearchableSelect
        label="Doctor"
        options={doctors}
        value={selectedDoctorId}
        onChange={setSelectedDoctorId}
        getOptionLabel={(doctor) => `${doctor.user?.name || doctor.doctorId || 'Unknown'} (${doctor.specialty || 'N/A'})`}
        getOptionValue={(doctor) => doctor.id}
      />
      {appointmentsError && <Alert severity="error">{appointmentsError}</Alert>}
      {selectedDoctorId && (
        <Box sx={{ height: 400, width: '100%' }}>
          <CustomDataGrid rows={filteredAppointments} columns={columns} />
        </Box>
      )}
    </Box>
  );
}