"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import styles from './AccountingChart.module.css';

// Register required Chart.js components for pie chart
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AccountingChart({ data }) {
  // Chart.js data configuration for pie chart
  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        data: data?.datasets?.[0]?.data || [],
        backgroundColor: ['#2196F3', '#4CAF50', '#FFC107', '#F44336', '#AB47BC'],
        borderColor: ['#1976D2', '#388E3C', '#FFA000', '#D32F2F', '#8E24AA'],
        borderWidth: 1,
      },
    ],
  };

  // Chart.js options configuration for pie chart
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
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed}`,
        },
      },
    },
  };

  return (
    <Box className={styles.chart}>
      <Typography variant="h6" className={styles.title}>
        Revenue Overview
      </Typography>
      <Box className={styles.chartContainer}>
        <Pie data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
}