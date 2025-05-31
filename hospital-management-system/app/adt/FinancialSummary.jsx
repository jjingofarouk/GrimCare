// app/adt/FinancialSummary.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { getAdmissions } from './adtService'; // Note: Replace with actual transaction/payroll endpoints
import styles from './FinancialSummary.module.css';

// Register Chart.js components for bar chart
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FinancialSummary() {
  const [financialData, setFinancialData] = useState({
    transactions: { REVENUE: 0, EXPENSE: 0, REFUND: 0 },
    payrolls: { PAID: 0, PENDING: 0 },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        // Placeholder: Implement actual API endpoints for transactions and payroll
        const admissions = await getAdmissions();
        // Mock data processing (replace with real API data)
        const mockTransactions = {
          REVENUE: admissions.length * 100000,
          EXPENSE: admissions.length * 50000,
          REFUND: admissions.length * 10000,
        };
        const mockPayrolls = {
          PAID: admissions.length * 200000,
          PENDING: admissions.length * 50000,
        };
        setFinancialData({
          transactions: mockTransactions,
          payrolls: mockPayrolls,
        });
        setError(null);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchFinancialData();
  }, []);

  const chartData = {
    labels: ['Revenue', 'Expense', 'Refund'],
    datasets: [
      {
        label: 'Transaction Amounts (UGX)',
        data: [
          financialData.transactions.REVENUE,
          financialData.transactions.EXPENSE,
          financialData.transactions.REFUND,
        ],
        backgroundColor: ['#059669', '#dc2626', '#d97706'],
        borderColor: ['#047857', '#b91c1c', '#b45309'],
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
          label: (context) => `${context.label}: UGX ${context.parsed.toLocaleString()}`,
        },
      },
      title: {
        display: true,
        text: 'Transaction Summary',
        color: '#1a3c34',
        font: { size: 16, weight: 'bold' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#1a3c34',
          callback: (value) => `UGX ${value.toLocaleString()}`,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          color: '#1a3c34',
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Financial Summary
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load financial data: {error}
        </Alert>
      )}
      <Box className={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
}