"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAppointments, getPatients, getDoctors, updateAppointment } from './appointmentService';
import AppointmentFilter from './AppointmentFilter';
import styles from './AppointmentList.module.css';

export default function AppointmentList({ onEdit }) {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: 'ALL', dateFrom: '', dateTo: '', doctorId: '', patientId: '', type: 'ALL' });

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [appointmentsData, patientsData, doctorsData] = await Promise.all([
          getAppointments(),
          getPatients(),
          getDoctors(),
        ]);

        // Map appointments to include patientName and doctorName
        const mappedAppointments = appointmentsData.map(appt => ({
          id: appt.id,
          patientId: appt.patientId,
          patientName: appt.patient?.user?.name || 'N/A',
          doctorId: appt.doctorId,
          doctorName: appt.doctor?.user?.name || 'N/A',
          date: appt.date ? new Date(appt.date).toLocaleString() : 'N/A',
          type: appt.type || 'N/A',
          status: appt.status || 'N/A',
          reason: appt.reason || 'N/A',
          queueNumber: appt.queue?.queueNumber || 'N/A',
          checkInTime: appt.checkInTime ? new Date(appt.checkInTime).toLocaleString() : null,
          checkOutTime: appt.checkOutTime ? new Date(appt.checkOutTime).toLocaleString() : null,
        }));

        setAppointments(mappedAppointments);
        setPatients(patientsData);
        setDoctors(doctorsData);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch appointments, patients, or doctors');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCancel = async (id) => {
    try {
      await updateAppointment(id, { status: 'CANCELLED' });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CANCELLED' } : appt
      ));
      setError(null);
    } catch (err) {
      console.error('Error canceling appointment:', err);
      setError('Failed to cancel appointment: ' + err.message);
    }
  };

  const handleCheckIn = async (id) => {
    try {
      const checkInTime = new Date();
      await updateAppointment(id, { status: 'CHECKED_IN', checkInTime });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CHECKED_IN', checkInTime: checkInTime.toLocaleString() } : appt
      ));
      setError(null);
    } catch (err) {
      console.error('Error checking in appointment:', err);
      setError('Failed to check in appointment: ' + err.message);
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const checkOutTime = new Date();
      await updateAppointment(id, { status: 'CHECKED_OUT', checkOutTime });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CHECKED_OUT', checkOutTime: checkOutTime.toLocaleString() } : appt
      ));
      setError(null);
    } catch (err) {
      console.error('Error checking out appointment:', err);
      setError('Failed to check out appointment: ' + err.message);
    }
  };

  const filteredAppointments = appointments.filter(appt => {
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
    { field: 'queueNumber', headerName: 'Queue', width: 100 },
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
            className={styles.actionButton}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCancel(params.row.id)}
            disabled={params.row.status === 'CANCELLED' || params.row.status === 'CHECKED_OUT'}
            className={styles.actionButton}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCheckIn(params.row.id)}
            disabled={params.row.status !== 'SCHEDULED'}
            className={styles.actionButton}
          >
            Check In
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCheckOut(params.row.id)}
            disabled={params.row.status !== 'CHECKED_IN'}
            className={styles.actionButton}
          >
            Check Out
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Appointments List
      </Typography>
      <AppointmentFilter onFilter={setFilter} patients={patients} doctors={doctors} />
      {error && (
        <Alert severity="error" className={styles.alert}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {filteredAppointments.length === 0 && !error && (
            <Alert severity="info" className={styles.alert}>
              No appointments found.
            </Alert>
          )}
          <Box className={styles.tableWrapper}>
            <DataGrid
              rows={filteredAppointments}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              className={styles.dataGrid}
            />
          </Box>
        </>
      )}
    </Box>
  );
}