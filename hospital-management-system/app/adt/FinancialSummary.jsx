// app/adt/FinancialSummary.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { getAdmissions } from './adtService'; // Note: We'll need to add transaction and payroll endpoints
import styles from './FinancialSummary.module.css';

export default function FinancialSummary() {
  const [financialData, setFinancialData] = useState({
    transactions: { REVENUE: 0, EXPENSE: 0, REFUND: 0 },
    payrolls: { PAID: 0, PENDING: 0 },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        // Placeholder: You'll need to implement actual API endpoints
        const admissions = await getAdmissions(); // Replace with actual transaction/payroll endpoints
        // Mock data processing (replace with real API data)
        const mockTransactions = {
          REVENUE: admissions.length * 100000, // Example calculation
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
    datasets: [{
      label: 'Transaction Amounts (UGX)',
      data: [
        financialData.transactions.REVENUE,
        financialData.transactions.EXPENSE,
        financialData.transactions.REFUND,
      ],
      backgroundColor: ['#059669', '#dc2626', '#d97706'],
    }],
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
      <Box className={styles.chartWrapper}>
        ```chartjs
        {
          type: 'bar',
          data: {
            labels: ['Revenue', 'Expense', 'Refund'],
            datasets: [{
              label: 'Transaction Amounts (UGX)',
              data: [
                ${financialData.transactions.REVENUE},
                ${financialData.transactions.EXPENSE},
                ${financialData.transactions.REFUND}
              ],
              backgroundColor: ['#059669', '#dc2626', '#d97706'],
              borderColor: ['#047857', '#b91c1c', '#b45309'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#1a3c34'
                }
              },
              title: {
                display: true,
                text: 'Transaction Summary',
                color: '#1a3c34'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  color: '#1a3c34'
                }
              },
              x: {
                ticks: {
                  color: '#1a3c34'
                }
              }
            }
          }
        }
        ); }
        
        
        