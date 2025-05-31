// app/adt/AdmissionList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAdmissions } from './adtService';

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
              rawData: admission // Store raw data for actions
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

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'wardName', headerName: 'Ward', width: 150 },
    { field: 'admissionDate', headerName: 'Admission Date', width: 150 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'triagePriority', headerName: 'Triage Priority', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => onSelectAdmission(params.row.rawData)}
          disabled={!params.row.rawData}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Admissions
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load admissions: {error}
        </Alert>
      )}
      {admissions.length === 0 && !error && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No admissions found.
        </Alert>
      )}
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={admissions}
          columns={columns}
          pageSizeOptions={[5, 10, 20, 50]}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
    </Box>
  );
}