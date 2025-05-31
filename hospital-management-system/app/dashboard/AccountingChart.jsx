"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './AccountingChart.module.css';

// Register required Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function AccountingChart({ data }) {
  // Chart.js data configuration
  const chartData = {
    labels: data?.labels || [],
    datasets: data?.datasets || [],
  };

  // Chart.js options configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#2d3748',
          font: { size: 14 },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#4a5568' },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#4a5568',
          callback: (value) => `$${value}`,
        },
        grid: { color: '#e2e8f0' },
      },
    },
  };

  return (
    <Box className={styles.chart}>
      <Typography variant="h6" className={styles.title}>
        Revenue Overview
      </Typography>
      <Box className={styles.chartContainer}>
        <Line data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
}