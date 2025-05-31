// app/adt/DoctorList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getDoctors } from './adtService';
import styles from './DoctorList.module.css';

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        const data = await getDoctors();
        setDoctors(data.map(doctor => ({
          id: doctor.id,
          name: doctor.user?.name || 'N/A',
          email: doctor.user?.email || 'N/A',
          specialty: doctor.specialty || 'N/A',
          licenseNumber: doctor.likelihoodNumber || 'N/A',
          activeAdmissions: doctor.admissions?.filter(a => a.status === 'ADMITTED').length || 0,
        })));
        setError(null);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchDoctors();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 180 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'specialty', headerName: 'Specialty', width: 150 },
    { field: 'licenseNumber', headerName: 'License', width: 150 },
    { field: 'activeAdmissions', headerName: 'Active Admissions', width: 150 },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Doctors List
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load doctors: {error}
        </Alert>
      )}
      {doctors.length === 0 && !error && (
          <Alert severity="info" className={styles.alert}>
            No doctors found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={doctors}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          className={styles.dataGrid}
        />
      </Box>
    </Box>
  );
}