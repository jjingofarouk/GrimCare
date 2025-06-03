"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AppointmentFilter from './AppointmentFilter';
import axios from 'axios';
import api from '../api';
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
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const [appointmentsData, patientsData, doctorsData] = await Promise.all([
          axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=patients`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}?resource=doctors`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setAppointments(appointmentsData.data.map(appt => ({
          id: appt.id,
          patientId: appt.patientId,
          patientName: appt.patient?.user?.name || 'N/A',
          doctorId: appt.doctorId,
          doctorName: appt.doctor?.user?.name || 'N/A',
          date: appt.date ? new Date(appt.date).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A',
          type: appt.type || 'N/A',
          status: appt.status || 'N/A',
          reason: appt.reason || 'N/A',
          queueNumber: appt.queue?.queueNumber || 'N/A',
          checkInTime: appt.checkInTime ? new Date(appt.checkInTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : null,
          checkOutTime: appt.checkOutTime ? new Date(appt.checkOutTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : null,
        })));
        setPatients(patientsData.data);
        setDoctors(doctorsData.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.error || error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, { resource: 'appointment', status: 'CANCELLED' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CANCELLED' } : appt
      ));
      setError(null);
    } catch (err) {
      setError('Failed to cancel appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCheckIn = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const checkInTime = new Date();
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, { resource: 'appointment', status: 'CHECKED_IN', checkInTime }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CHECKED_IN', checkInTime: checkInTime.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) } : appt
      ));
      setError(null);
    } catch (err) {
      setError('Failed to check in appointment: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleCheckOut = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const checkOutTime = new Date();
      await axios.put(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}/${id}`, { resource: 'appointment', status: 'CHECKED_OUT', checkOutTime }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointments.map(appt =>
        appt.id === id ? { ...appt, status: 'CHECKED_OUT', checkOutTime: checkOutTime.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) } : appt
      ));
      setError(null);
    } catch (err) {
      setError('Failed to check out appointment: ' + (err.response?.data?.error || err.message));
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
    { field: 'id', headerName: 'ID', width: 80, align: 'center', headerAlign: 'center' },
    { field: 'patientName', headerName: 'Patient', width: 180 },
    { field: 'doctorName', headerName: 'Doctor', width: 180 },
    { field: 'date', headerName: 'Date', width: 160 },
    { field: 'type', headerName: 'Type', width: 100, align: 'center', headerAlign: 'center' },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 100, 
      align: 'center', 
      headerAlign: 'center',
      renderCell: (params) => (
        <Box className={`${styles.status} ${styles[`status${params.value}`]}`}>
          {params.value}
        </Box>
      )
    },
    { field: 'reason', headerName: 'Reason', width: 140 },
    { field: 'queueNumber', headerName: 'Queue', width: 80, align: 'center', headerAlign: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 320,
      renderCell: (params) => (
        <Box className={styles.actionContainer}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => onEdit(params.row)}
            disabled={params.row.status === 'CANCELLED' || params.row.status === 'CHECKED_OUT'}
            className={`${styles.actionButton} ${styles.editButton}`}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCancel(params.row.id)}
            disabled={params.row.status === 'CANCELLED' || params.row.status === 'CHECKED_OUT'}
            className={`${styles.actionButton} ${styles.cancelButton}`}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCheckIn(params.row.id)}
            disabled={params.row.status !== 'SCHEDULED'}
            className={`${styles.actionButton} ${styles.checkInButton}`}
          >
            Check In
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCheckOut(params.row.id)}
            disabled={params.row.status !== 'CHECKED_IN'}
            className={`${styles.actionButton} ${styles.checkOutButton}`}
          >
            Check Out
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h6" className={styles.title}>
          Appointments
        </Typography>
        <AppointmentFilter onFilter={setFilter} patients={patients} doctors={doctors} />
      </Box>
      {error && (
        <Alert severity="error" className={styles.alert}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box className={styles.loading}>
          <CircularProgress size={32} />
        </Box>
      ) : (
        <>
          {filteredAppointments.length === 0 && !error && (
            <Alert severity="info" className={styles.alert}>
              No appointments found
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
              autoHeight
            />
          </Box>
        </>
      )}
    </Box>
  );
}