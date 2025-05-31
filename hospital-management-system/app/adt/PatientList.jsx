// app/adt/PatientList.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getPatients } from './adtService';
import styles from './PatientList.module.css';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      try {
        const data = await getPatients();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: Expected an array');
        }
        setPatients(
          data.map((patient) => ({
            id: patient.id ?? 'N/A',
            patientId: patient.patientId ?? 'N/A',
            name: patient.user?.name ?? 'N/A',
            phone: patient.phone ?? 'N/A',
            gender: patient.gender ?? 'N/A',
            insuranceProvider: patient.insuranceProvider ?? 'N/A',
            admissionCount: patient.admissions?.length ?? 0,
          }))
        );
        setError(null);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(error.response?.data?.details || error.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90, sortable: true },
    { field: 'patientId', headerName: 'Patient ID', width: 120, sortable: true },
    { field: 'name', headerName: 'Name', width: 150, sortable: true },
    { field: 'phone', headerName: 'Phone', width: 150, sortable: true },
    { field: 'gender', headerName: 'Gender', width: 100, sortable: true },
    { field: 'insuranceProvider', headerName: 'Insurance', width: 150, sortable: true },
    { field: 'admissionCount', headerName: 'Admissions', width: 120, type: 'number', sortable: true },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Patient List
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load patients: {error}
        </Alert>
      )}
      {loading && !error && (
        <Alert severity="info" className={styles.alert}>
          Loading patients...
        </Alert>
      )}
      {!loading && patients.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No patients found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={patients}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          className={styles.dataGrid}
          loading={loading}
        />
      </Box>
    </Box>
  );
}