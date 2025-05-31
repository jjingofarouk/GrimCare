// app/adt/AdmissionList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAdmissions } from './adtService';
import styles from './AdtList.module.css';

export default function AdmissionList({ onSelectAdmission, refresh }) {
  const [admissions, setAdmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const data = await getAdmissions();
        const formattedAdmissions = Array.isArray(data)
          ? data.map(admission => ({
              id: admission.id,
              patientName: admission.patient?.user?.name || 'N/A',
              wardName: admission.ward?.name || 'N/A',
              admissionDate: admission.admissionDate 
                ? new Date(admission.admissionDate).toLocaleDateString() 
                : 'N/A',
              doctorName: admission.doctor?.user?.name || 'N/A',
              triagePriority: admission.triagePriority || 'N/A',
              status: admission.status || 'N/A',
              rawData: admission
            }))
          : [];
        setAdmissions(formattedAdmissions);
        setError(null);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchAdmissions();
  }, [refresh]);

  const getPriorityCellClassName = (params) => {
    switch (params.value) {
      case 'HIGH': return styles.priorityHigh;
      case 'MEDIUM': return styles.priorityMedium;
      case 'LOW': return styles.priorityLow;
      default: return '';
    }
  };

  const getStatusCellClassName = (params) => {
    switch (params.value) {
      case 'ADMITTED': return styles.statusAdmitted;
      case 'DISCHARGED': return styles.statusDischarged;
      case 'PENDING': return styles.statusPending;
      default: return '';
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'wardName', headerName: 'Ward', width: 150 },
    { field: 'admissionDate', headerName: 'Admission Date', width: 150 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    {
      field: 'triagePriority',
      headerName: 'Triage Priority',
      width: 120,
      cellClassName: getPriorityCellClassName,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      cellClassName: getStatusCellClassName,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => onSelectAdmission(params.row.rawData)}
          disabled={!params.row.rawData}
          className={styles.actionButton}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Admissions
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load admissions: {error}
        </Alert>
      )}
      {admissions.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No admissions found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={admissions}
          columns={columns}
          pageSizeOptions={[5, 10, 20, 50]}
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