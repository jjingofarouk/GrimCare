"use client";

import React from 'react';
import { Box, Typography, Alert, Card, CardContent, Grid } from '@mui/material';
import { useApiData } from '../utils/api';
import { getAppointments } from './appointmentService';
import { formatDate } from '../utils/date';

export default function Dashboard() {
  const { data: appointments, error: appointmentsError } = useApiData(getAppointments);

  const todayAppointments = appointments.filter(
    (appt) => {
      const date = new Date(appt.date);
      const today = new Date();
      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      );
    }
  );

  const stats = {
    total: todayAppointments.length,
    scheduled: todayAppointments.filter((appt) => appt.status === 'SCHEDULED').length,
    checkedIn: todayAppointments.filter((appt) => appt.status === 'CHECKED_IN').length,
    completed: todayAppointments.filter((appt) => appt.status === 'COMPLETED').length,
    cancelled: todayAppointments.filter((appt) => appt.status === 'CANCELLED').length,
  };

  return (
    ```chartjs
    {
      "type": "bar",
      "data": {
        "labels": ["Scheduled", "Checked In", "Completed", "Cancelled"],
        "datasets": [{
          "label": "Appointments",
          "data": [${stats.scheduled}, ${stats.checkedIn}, ${stats.completed}, ${stats.cancelled}],
          "backgroundColor": ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
          "borderColor": ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
          "borderWidth": 1
        }]
      },
      "options": {
        "responsive": true,
        "plugins": {
          "title": {
            "display": true,
            "text": "Appointment Status Distribution",
            "color": "#ffffff"
          },
          "legend": {
            "labels": {
              "color": "#ffffff"
            }
          }
        },
        "scales": {
          "y": {
            "beginAtZero": true,
            "ticks": {
              "color": "#ffffff"
            }
          },
          "x": {
            "ticks": {
              "color": "#ffffff"
            }
          }
        }
      }
    }