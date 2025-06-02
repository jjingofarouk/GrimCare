"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Card, CardContent } from '@mui/material';
import { getAppointments, getQueue } from './appointmentService';
import styles from './AppointmentDashboard.module.css';

export default function AppointmentDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    emergency: 0,
    walkIn: 0
  });
  const [queue, setQueue] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointments = await getAppointments();
        const queueData = await getQueue();
        setStats({
          total: appointments.length,
          scheduled: appointments.filter(a => a.status === 'SCHEDULED').length,
          completed: appointments.filter(a => a.status === 'COMPLETED').length,
          cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
          emergency: appointments.filter(a => a.type === 'EMERGENCY').length,
          walkIn: appointments.filter(a => a.type === 'WALK_IN').length
        });
        setQueue(queueData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>Daily Appointment Dashboard</Typography>
      {error && <p className={styles.error}>{error}</p>}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Appointments</Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Scheduled</Typography>
              <Typography variant="h4">{stats.scheduled}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Completed</Typography>
              <Typography variant="h4">{stats.completed}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Cancelled</Typography>
              <Typography variant="h4">{stats.cancelled}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Emergency</Typography>
              <Typography variant="h4">{stats.emergency}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Walk-Ins</Typography>
              <Typography variant="h4">{stats.walkIn}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Paper elevation={3} className={styles.queueSection}>
        <Typography variant="h5" gutterBottom>Current Queue</Typography>
        {queue.map((deptQueue, index) => (
          <Box key={index} className={styles.queueItem}>
            <Typography variant="h6">{deptQueue.department}</Typography>
            <Typography>Patients in Queue: {deptQueue.patients.length}</Typography>
            {deptQueue.patients.map((patient, i) => (
              <Typography key={i}>
                {patient.name} (#{patient.queuePosition}) - {patient.appointmentReason}
              </Typography>
            ))}
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
