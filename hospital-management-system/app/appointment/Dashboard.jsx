"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert, Card, CardContent, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import api from '../api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointments() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api.BASE_URL}${api.API_ROUTES.APPOINTMENT}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointments();
  }, []);

  const todayAppointments = appointments.filter((appt) => {
    const date = new Date(appt.date);
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  });

  const stats = {
    total: todayAppointments.length,
    scheduled: todayAppointments.filter((appt) => appt.status === 'SCHEDULED').length,
    checkedIn: todayAppointments.filter((appt) => appt.status === 'CHECKED_IN').length,
    completed: todayAppointments.filter((appt) => appt.status === 'COMPLETED').length,
    cancelled: todayAppointments.filter((appt) => appt.status === 'CANCELLED').length,
  };

  const chartData = {
    labels: ['Scheduled', 'Checked In', 'Completed', 'Cancelled'],
    datasets: [
      {
        label: 'Appointments',
        data: [stats.scheduled, stats.checkedIn, stats.completed, stats.cancelled],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Appointment Status Distribution',
        color: '#ffffff',
      },
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff',
        },
      },
      x: {
        ticks: {
          color: '#ffffff',
        },
      },
    },
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Daily Appointment Dashboard
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ mt: 2, height: 400 }}>
            <Bar data={chartData} options={chartOptions} />
          </Box>
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
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Today's Appointments
            </Typography>
            {todayAppointments.map((appt) => (
              <Card key={appt.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography>
                    <strong>Patient:</strong> {appt.patient?.user?.name || appt.patient?.patientId || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Doctor:</strong> {appt.doctor?.user?.name || appt.doctor?.doctorId || 'N/A'}
                  </Typography>
                  <Typography>
                    <strong>Time:</strong> {new Date(appt.date).toLocaleString()}
                  </Typography>
                  <Typography>
                    <strong>Status:</strong> {appt.status}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}