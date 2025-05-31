"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import styles from './AccountingChart.module.css';

export default function AccountingChart({ data }) {
  return (
    <Box className={styles.chart}>
      <Typography variant="h6" className={styles.title}>
        Revenue Overview
      </Typography>
      <Box className={styles.chartContainer}>
        ```chartjs
        {
          type: 'line',
          data: {
            labels: data.labels || [],
            datasets: data.datasets || []
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#2d3748',
                  font: { size: 14 }
                }
              }
            },
            scales: {
              x: {
                ticks: { color: '#4a5568' },
                grid: { display: false }
              },
              y: {
                ticks: {
                  color: '#4a5568',
                  callback: value => `$${value}`
                },
                grid: { color: '#e2e8f0' }
              }
            }
          }
        }
        ```
      </Box>
    </Box>
  );
}