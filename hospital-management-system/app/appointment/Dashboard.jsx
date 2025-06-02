"use client";

import React from "react";
import { Box, Typography, Alert, Card, CardContent, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2"; // Import Bar component from react-chartjs-2
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"; // Import required Chart.js components
import { useApiData } from "../utils/api";
import { getAppointments } from "./appointmentService";
import { formatDate } from "../utils/date";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { data: appointments = [], error: appointmentsError } = useApiData(getAppointments);

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
    scheduled: todayAppointments.filter((appt) => appt.status === "SCHEDULED").length,
    checkedIn: todayAppointments.filter((appt) => appt.status === "CHECKED_IN").length,
    completed: todayAppointments.filter((appt) => appt.status === "COMPLETED").length,
    cancelled: todayAppointments.filter((appt) => appt.status === "CANCELLED").length,
  };

  // Chart.js data and options
  const chartData = {
    labels: ["Scheduled", "Checked In", "Completed", "Cancelled"],
    datasets: [
      {
        label: "Appointments",
        data: [stats.scheduled, stats.checkedIn, stats.completed, stats.cancelled],
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
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
        text: "Appointment Status Distribution",
        color: "#ffffff",
      },
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#ffffff",
        },
      },
      x: {
        ticks: {
          color: "#ffffff",
        },
      },
    },
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Daily Appointment Dashboard
      </Typography>
      {appointmentsError && <Alert severity="error">{appointmentsError}</Alert>}

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
                <strong>Patient:</strong>{" "}
                {appt.patient?.user?.name || appt.patient?.patientId || "N/A"}
              </Typography>
              <Typography>
                <strong>Doctor:</strong>{" "}
                {appt.doctor?.user?.name || appt.doctor?.doctorId || "N/A"}
              </Typography>
              <Typography>
                <strong>Time:</strong> {formatDate(appt.date)}
              </Typography>
              <Typography>
                <strong>Status:</strong> {appt.status}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}