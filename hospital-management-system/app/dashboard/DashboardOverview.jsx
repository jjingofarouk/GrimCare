"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Grid, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountingChart from './AccountingChart';
import FinancialSummary from '../adt/FinancialSummary';
import { getDashboardData } from './dashboardService';
import styles from './DashboardOverview.module.css';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const WidgetContent = styled(CardContent)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
}));

export default function DashboardOverview() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to fetch dashboard data');
      }
    };
    fetchData();
  }, []);

  return (
    <Box
      className={styles.container}
      sx={{
        p: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 2,
        minHeight: '100vh',
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, color: '#1976d2', fontWeight: 'bold', textAlign: 'center' }}
      >
        Accounting Dashboard
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
      )}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <WidgetContent>
              <Typography variant="h5" color="#1976d2">
                {data.totalTransactions || 0}
              </Typography>
              <Typography color="textSecondary">Total Transactions</Typography>
            </WidgetContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <WidgetContent>
              <Typography variant="h5" color="#1976d2">
                {data.pendingTransactions || 0}
              </Typography>
              <Typography color="textSecondary">Pending Transactions</Typography>
            </WidgetContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StyledCard>
            <WidgetContent>
              <Typography variant="h5" color="#1976d2">
                UGX {data.totalRevenue?.toLocaleString() || '0'}
              </Typography>
              <Typography color="textSecondary">Total Revenue</Typography>
            </WidgetContent>
          </StyledCard>
        </Grid>
      </Grid>
      <Card sx={{ p: 3, mb: 4, borderRadius: 2, background: '#ffffff' }}>
        <AccountingChart data={data.chartData || { labels: [], datasets: [] }} />
      </Card>
      <FinancialSummary />
    </Box>
  );
}