"use client";
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Grid, Box, Alert, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import { getWards, getDoctors, getPatients, getAdmissions, getTransactions } from './adtService';
import { TrendingUp, People, LocalHospital, Bed } from '@mui/icons-material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const IconWrapper = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: color,
  marginBottom: theme.spacing(2),
}));

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
    <Paper
      sx={{
        p: 3,
        mb: 2,
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        ADT Financial Summary
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <IconWrapper color="#2196f3">
                <LocalHospital sx={{ color: '#fff' }} />
              </IconWrapper>
              <Typography variant="h5" color="#1976d2">{summary.totalWards}</Typography>
              <Typography color="textSecondary">Total Wards</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <IconWrapper color="#4caf50">
                <People sx={{ color: '#fff' }} />
              </IconWrapper>
              <Typography variant="h5" color="#1976d2">{summary.totalDoctors}</Typography>
              <Typography color="textSecondary">Total Doctors</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <IconWrapper color="#f44336">
                <People sx={{ color: '#fff' }} />
              </IconWrapper>
              <Typography variant="h5" color="#1976d2">{summary.totalPatients}</Typography>
              <Typography color="textSecondary">Total Patients</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <IconWrapper color="#ff9800">
                <TrendingUp sx={{ color: '#fff' }} />
              </IconWrapper>
              <Typography variant="h5" color="#1976d2">{summary.totalAdmissions}</Typography>
              <Typography color="textSecondary">Total Admissions</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <IconWrapper color="#3f51b5">
                <Bed sx={{ color: '#fff' }} />
              </IconWrapper>
              <Typography variant="h5" color="#1976d2">{summary.totalBeds}</Typography>
              <Typography color="textSecondary">Total Beds</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <IconWrapper color="#e91e63">
                <Bed sx={{ color: '#fff' }} />
              </IconWrapper>
              <Typography variant="h5" color="#1976d2">{summary.occupiedBeds}</Typography>
              <Typography color="textSecondary">Occupied Beds</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <IconWrapper color="#4caf50">
                <TrendingUp sx={{ color: '#fff' }} />
              </IconWrapper>
              <Typography variant="h5" color="#1976d2">UGX {summary.totalRevenue.toLocaleString()}</Typography>
              <Typography color="textSecondary">Total Revenue</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledCard>
            <CardContent>
              <IconWrapper color="#f44336">
                <TrendingUp sx={{ color: '#fff' }} />
              </IconWrapper>
              <Typography variant="h5" color="#1976d2">UGX {summary.totalExpenses.toLocaleString()}</Typography>
              <Typography color="textSecondary">Total Expenses</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Paper>
  );
}