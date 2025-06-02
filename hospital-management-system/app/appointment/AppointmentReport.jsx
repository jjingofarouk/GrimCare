"use client";

import React, { useState } from 'react';
import { Box, Typography, FormControl, Select, MenuItem, Button, Paper } from '@mui/material';
import { generateReport } from './appointmentService';
import styles from './AppointmentReport.module.css';

export default function AppointmentReport() {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    status: ''
  });
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    try {
      const data = await generateReport(filters);
      setReportData(data);
      setError(null);
    } catch (err) {
      setError('Failed to generate report');
    }
  };

  const departments = ['General Medicine', 'Pediatrics', 'Cardiology', 'Gynecology', 'Internal Medicine'];

  return (
    <Box className={styles.container}>
      <Typography variant="h4" gutterBottom>Appointment Report</Typography>
      <Box className={styles.filterSection}>
        <FormControl className={styles.field}>
          <input type="date" name="startDate" value={filters.startDate} onChange={handleChange} />
        </FormControl>
        <FormControl className={styles.field}>
          <input type="date" name="endDate" value={filters.endDate} onChange={handleChange} />
        </FormControl>
        <FormControl className={styles.field}>
          <Select name="department" value={filters.department} onChange={handleChange}>
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={styles.field}>
          <Select name="status" value={filters.status} onChange={handleChange}>
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="SCHEDULED">Scheduled</MenuItem>
            <MenuItem value="COMPLETED">Completed</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" onClick={handleGenerate}>Generate Report</Button>
      </Box>
      {error && <p className={styles.error}>{error}</p>}
      {reportData && (
        <Paper elevation={3} className={styles.reportSection}>
          <Typography variant="h5" gutterBottom>Report Results</Typography>
          <Typography>Total Appointments: {reportData.total}</Typography>
          <Typography>By Status: {JSON.stringify(reportData.byStatus)}</Typography>
          <Typography>By Department: {JSON.stringify(reportData.byDepartment)}</Typography>
          <Typography>By Doctor: {JSON.stringify(reportData.byDoctor)}</Typography>
        </Paper>
      )}
    </Box>
  );
}
