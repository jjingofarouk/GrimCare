"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import DashboardWidget from './DashboardWidget';
import AccountingChart from './AccountingChart';
import { getDashboardData } from './dashboardService';
import styles from './DashboardOverview.module.css';

export default function DashboardOverview() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError('Failed to fetch dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Accounting Dashboard
      </Typography>
      {error && <Alert severity="error" className={styles.error}>{error}</Alert>}
      <Box className={styles.widgets}>
        <DashboardWidget
          title="Total Transactions"
          value={data.totalTransactions || 0}
        />
        <DashboardWidget
          title="Pending Transactions"
          value={data.pendingTransactions || 0}
        />
        <DashboardWidget
          title="Total Revenue"
          value={`$${data.totalRevenue?.toFixed(2) || '0.00'}`}
        />
      </Box>
      <AccountingChart data={data.chartData || { labels: [], datasets: [] }} />
    </Box>
  );
}