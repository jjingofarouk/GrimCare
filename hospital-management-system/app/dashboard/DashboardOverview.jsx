"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Grid } from '@mui/material';
import DashboardWidget from './DashboardWidget';
import AccountingChart from './AccountingChart';
import { getDashboardData } from './dashboardService';
import { getWards, getDoctors, getPatients, getAdmissions, getTransactions } from '../adt/adtService';
import styles from './DashboardOverview.module.css';

export default function DashboardOverview() {
  const [data, setData] = useState({});
  const [adtSummary, setAdtSummary] = useState({
    totalWards: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAdmissions: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    totalRevenue: 0,
    totalExpenses: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);

        const [wards, doctors, patients, admissions, transactions] = await Promise.all([
          getWards(),
          getDoctors(),
          getPatients(),
          getAdmissions(),
          getTransactions(),
        ]);

        const totalBeds = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
        const occupiedBeds = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0);
        const totalRevenue = transactions
          .filter((t) => t.type === 'Revenue')
          .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
          .filter((t) => t.type === 'Expense')
          .reduce((sum, t) => sum + t.amount, 0);

        setAdtSummary({
          totalWards: wards.length,
          totalDoctors: doctors.length,
          totalPatients: patients.length,
          totalAdmissions: admissions.length,
          totalBeds,
          occupiedBeds,
          totalRevenue,
          totalExpenses,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
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
          value={`UGX ${data.totalRevenue?.toLocaleString() || '0'}`}
        />
      </Box>
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        ADT Financial Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Total Wards"
            value={adtSummary.totalWards}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Total Doctors"
            value={adtSummary.totalDoctors}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Total Patients"
            value={adtSummary.totalPatients}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Total Admissions"
            value={adtSummary.totalAdmissions}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Total Beds"
            value={adtSummary.totalBeds}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="Occupied Beds"
            value={adtSummary.occupiedBeds}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="ADT Revenue"
            value={`UGX ${adtSummary.totalRevenue.toLocaleString()}`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardWidget
            title="ADT Expenses"
            value={`UGX ${adtSummary.totalExpenses.toLocaleString()}`}
          />
        </Grid>
      </Grid>
      <AccountingChart data={data.chartData || { labels: [], datasets: [] }} />
    </Box>
  );
}