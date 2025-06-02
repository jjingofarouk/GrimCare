import React, { useState } from 'react';
import { Box, Typography, Alert, Button, CircularProgress } from '@mui/material';
import AppointmentFilter from './AppointmentFilter';
import CustomDataGrid from '../components/CustomDataGrid';
import { updateAppointment } from './appointmentService';
import { useApiData } from '../utils/api';
import { getAppointments, getPatients, getDoctors } from './appointmentService';
import styles from './list.module.css';

export default function AppointmentList({ onEdit }) {
  const [filter, setFilter] = useState({ status: 'ALL', dateFrom: '', dateTo: '', doctorId: '', patientId: '', type: 'ALL' });
  const { data: appointments, error: appointmentsError, loading: appointmentsLoading } = useApiData(getAppointments);
  const { data: patients } = useApiData(getPatients);
  const { data: doctors } = useApiData(getDoctors);
  const [error, setError] = useState(null);

  const handleCancel = async (id) => {
    try {
      await updateAppointment(id, { status: 'CANCELLED' });
      // Refresh handled by parent via refreshKey
    } catch (err) {
      setError('Failed to cancel appointment: ' + err.message);
    }
  };

  const handleCheckIn = async (id) => {
    try {
      await updateAppointment(id, { status: 'CHECKED_IN', checkInTime: new Date() });
    } catch (err) {
      setError('Failed to check in appointment: ' + err.message);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      await updateAppointment(id, { status: 'CHECKED_OUT', checkOutTime: new Date() });
    } catch (err) {
      setError('Failed to check out appointment: ' + err.message);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (!appt || !appt.id) return false;
    const matchesStatus = filter.status === 'ALL' || appt.status === filter.status;
    const matchesDateFrom = !filter.dateFrom || new Date(appt.date) >= new Date(filter.dateFrom);
    const matchesDateTo = !filter.dateTo || new Date(appt.date) <= new Date(filter.dateTo);
    const matchesDoctor = !filter.doctorId || appt.doctorId === parseInt(filter.doctorId);
    const matchesPatient = !filter.patientId || appt.patientId === parseInt(filter.patientId);
    const matchesType = filter.type === 'ALL' || appt.type === filter.type;
    return matchesStatus && matchesDateFrom && matchesDateTo && matchesDoctor && matchesPatient && matchesType;
  });

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 200 },
    { field: 'doctorName', headerName: 'Doctor', width: 200 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    { field: 'reason', headerName: 'Reason', width: 150 },
    {
      field: 'queueNumber',
      headerName: 'Queue',
      width: 100,
      valueGetter: (params) => params.row?.queue?.queueNumber || 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(params.row)}
            disabled={params.row.status === 'CANCELLED' || params.row.status === 'CHECKED_OUT'}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCancel(params.row.id)}
            disabled={params.row.status === 'CANCELLED' || params.row.status === 'CHECKED_OUT'}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCheckIn(params.row.id)}
            disabled={params.row.status !== 'SCHEDULED'}
          >
            Check In
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCheckOut(params.row.id)}
            disabled={params.row.status !== 'CHECKED_IN'}
          >
            Check Out
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Appointments</Typography>
      <AppointmentFilter onFilter={setFilter} patients={patients} doctors={doctors} />
      {(error || appointmentsError) && <Alert severity="error">{error || appointmentsError}</Alert>}
      {appointmentsLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ height: 600, width: '100%' }}>
          <CustomDataGrid rows={filteredAppointments} columns={columns} />
        </Box>
      )}
    </Box>
  );
}