// pharmacy/PharmacyReports.jsx
import React, { useState } from 'react';
import { Box, Typography, Select, MenuItem, Button } from '@mui/material';
import { generateStockReport, generateSalesReport } from './pharmacyService';
import styles from './PharmacyReports.module.css';

const PharmacyReports = () => {
  const [reportType, setReportType] = useState('stock');
  const [timeRange, setTimeRange] = useState('monthly');

  const handleGenerateReport = async () => {
    if (reportType === 'stock') {
      await generateStockReport(timeRange);
    } else {
      await generateSalesReport(timeRange);
    }
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Reports</Typography>
      <Box className={styles.controls}>
        <Select
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
          className={styles.select}
        >
          <MenuItem value="stock">Stock Report</MenuItem>
          <MenuItem value="sales">Sales Report</MenuItem>
        </Select>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={styles.select}
        >
          <MenuItem value="daily">Daily</MenuItem>
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleGenerateReport}>
          Generate Report
        </Button>
      </Box>
      {reportType === 'stock' && (
        <chartjs>
          {
            "type": "bar",
            "data": {
              "labels": ["Paracetamol", "Ibuprofen", "Amoxicillin", "Metformin"],
              "datasets": [{
                "label": "Stock Levels",
                "data": [500, 300, 200, 400],
                "backgroundColor": ["#2196F3", "#4CAF50", "#FFC107", "#F44336"],
                "borderColor": ["#1976D2", "#388E3C", "#FFA000", "#D32F2F"],
                "borderWidth": 1
              }]
            },
            "options": {
              "scales": {
                "y": {
                  "beginAtZero": true
                }
              }
            }
          }
        </chartjs>
      )}
      {reportType === 'sales' && (
        <chartjs>
          {
            "type": "line",
            "data": {
              "labels": ["Jan", "Feb", "Mar", "Apr", "May"],
              "datasets": [{
                "label": "Sales",
                "data": [1000, 1200, 900, 1500, 1300],
                "borderColor": "#2196F3",
                "fill": false
              }]
            },
            "options": {
              "scales": {
                "y": {
                  "beginAtZero": true
                }
              }
            }
          }
        </chartjs>
      )}
    </Box>
  );
};

export default PharmacyReports;
