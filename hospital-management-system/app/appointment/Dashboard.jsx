"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Card, CardContent, Grid } from '@mui/material';
import { getAppointments } from './appointmentService';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments();
        const today = new Date();
        const todayAppointments = data.filter(
          (appt) => new Date(appt.date) >= startOfDay(today) && new Date(appt.date) <= endOfDay(today)
        );
        setAppointments(todayAppointments);
      } catch (err) {
        setError('Failed to fetch appointments');
      }
    };
    fetchAppointments();
  }, []);

  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((appt) => appt.status === 'SCHEDULED').length,
    checkedIn: appointments.filter((appt) => appt.status === 'CHECKED_IN').length,
    completed: appointments.filter((appt) => appt.status === 'COMPLETED').length,
    cancelled: appointments.filter((appt) => appt.status === 'CANCELLED').length,
  };

  const chartData = {
    labels: ['Scheduled', 'Checked In', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Appointments',
        data: [stats.scheduled, stats.checkedIn, stats.completed, stats.cancelled],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Daily Appointment Dashboard</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Appointments</Typography>
              <Typography variant="h4">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Scheduled</Typography>
              <Typography variant="h4">{stats.scheduled}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Checked In</Typography>
              <Typography variant="h4">{stats.checkedIn}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4, height: 400 }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { title: { display: true, text: 'Appointment Status Distribution' } },
          }}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Today's Appointments</Typography>
        {appointments.map((appt) => (
          <Card key={appt.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography><strong>Patient:</strong> {appt.patient.user.name}</Typography>
              <Typography><strong>Doctor:</strong> {appt.doctor.user.name}</Typography>
              <Typography><strong>Time:</strong> {format(new Date(appt.date), 'PPp')}</Typography>
              <Typography><strong>Status:</strong> {appt.status}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
