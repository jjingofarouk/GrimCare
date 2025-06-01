"use client";
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, Box, Alert } from '@mui/material';
import { getWards, getDoctors, getPatients, getAdmissions, getTransactions } from './adtService';

export default function FinancialSummary() {
  const [summary, setSummary] = useState({
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
    const fetchSummaryData = async () => {
      try {
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

        setSummary({
          totalWards: wards.length,
          totalDoctors: doctors.length,
          totalPatients: patients.length,
          totalAdmissions: admissions.length,
          totalBeds,
          occupiedBeds,
          totalRevenue,
          totalExpenses,
        });
      } catch (error) {
        console.error('Error fetching summary data:', error);
        setError('Failed to load financial summary');
      }
    };

    fetchSummaryData();
  }, []);

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        ADT Financial Summary
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{summary.totalWards}</Typography>
            <Typography color="textSecondary">Total Wards</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{summary.totalDoctors}</Typography>
            <Typography color="textSecondary">Total Doctors</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{summary.totalPatients}</Typography>
            <Typography color="textSecondary">Total Patients</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{summary.totalAdmissions}</Typography>
            <Typography color="textSecondary">Total Admissions</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{summary.totalBeds}</Typography>
            <Typography color="textSecondary">Total Beds</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{summary.occupiedBeds}</Typography>
            <Typography color="textSecondary">Occupied Beds</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">UGX {summary.totalRevenue.toLocaleString()}</Typography>
            <Typography color="textSecondary">Total Revenue</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5">UGX {summary.totalExpenses.toLocaleString()}</Typography>
            <Typography color="textSecondary">Total Expenses</Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}