// app/adt/TriageDashboard.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getAdmissions } from './adtService';
import styles from './TriageDashboard.module.css';

// Register Chart.js components for pie chart
ChartJS.register(ArcElement, Tooltip, Legend);

export default function TriageDashboard() {
  const [triageData, setTriageData] = useState({ LOW: 0, MEDIUM: 0, HIGH: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const data = await getAdmissions();
        const triageCounts = data.reduce((acc, admission) => {
          const priority = admission.triagePriority || 'N/A';
          if (['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
            acc[priority] = (acc[priority] || 0) + 1;
          }
          return acc;
        }, { LOW: 0, MEDIUM: 0, HIGH: 0 });
        setTriageData(triageCounts);
        setError(null);
      } catch (error) {
        console.error('Error fetching triage data:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchAdmissions();
  }, []);

  const chartData = {
    labels: ['Low', 'Medium', 'High'],
    datasets: [
      {
        label: 'Triage Priority Distribution',
        data: [triageData.LOW, triageData.MEDIUM, triageData.HIGH],
        backgroundColor: ['#059669', '#d97706', '#dc2626'],
        borderColor: ['#047857', '#b45309', '#b91c1c'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#1a3c34',
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}`,
        },
      },
      title: {
        display: true,
        text: 'Triage Priority Distribution',
        color: '#1a3c34',
        font: { size: 16, weight: 'bold' },
      },
    },
  };

  const total = triageData.LOW + triageData.MEDIUM + triageData.HIGH;

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Triage Dashboard
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load triage data: {error}
        </Alert>
      )}
      {total === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No triage data available.
        </Alert>
      )}
      <Box className={styles.chartContainer}>
        <Pie data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
}