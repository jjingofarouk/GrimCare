import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import SearchableSelect from '../components/SearchableSelect';
import CustomDataGrid from '../components/CustomDataGrid';
import axios from 'axios';
import api from '../api';

export default function AppointmentHistory({ patients }) {
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedPatientId) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?patientId=${selectedPatientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data.map(appt => ({
          id: appt.id,
          doctorName: appt.doctor?.user?.name || 'N/A',
          date: appt.date ? new Date(appt.date).toLocaleString() : 'N/A',
          type: appt.type || 'N/A',
          status: appt.status || 'N/A',
          reason: appt.reason || 'N/A',
          notes: appt.notes || 'N/A',
        })));
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [selectedPatientId]);

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
      {error && <Alert severity="error">{error}</Alert>}
      {selectedPatientId && (
        <Box sx={{ height: 400, width: '100%' }}>
          <CustomDataGrid rows={appointments} columns={columns} />
        </Box>
      )}
    </Box>
  );
}