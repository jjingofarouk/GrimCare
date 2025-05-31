// app/adt/AdmissionList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAdmissions } from './adtService';

export default function AdmissionList({ onSelectAdmission, refresh }) {
  const [admissions, setAdmissions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const data = await getAdmissions();
        setAdmissions(Array.isArray(data) ? data.map(admission => ({
          ...admission,
          id: admission.id // Ensure id is set for DataGrid
        })) : []);
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
    {
      field: 'patientName',
      headerName: 'Patient',
      width: 150,
      valueGetter: (params) => params.row?.patient?.user?.name || 'N/A',
    },
    {
      field: 'wardName',
      headerName: 'Ward',
      width: 150,
      valueGetter: (params) => params.row?.ward?.name || 'N/A',
    },
    {
      field: 'admissionDate',
      headerName: 'Admission Date',
      width: 150,
      valueGetter: (params) => params.row?.admissionDate 
        ? new Date(params.row.admissionDate).toLocaleDateString() 
        : 'N/A',
    },
    {
      field: 'doctorName',
      headerName: 'Doctor',
      width: 150,
      valueGetter: (params) => params.row?.doctor?.user?.name || 'N/A',
    },
    {
      field: 'triagePriority',
      headerName: 'Triage Priority',
      width: 120,
      valueGetter: (params) => params.row?.triagePriority || 'N/A',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      valueGetter: (params) => params.row?.status || 'N/A',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button 
          variant="outlined" 
          onClick={() => onSelectAdmission(params.row)} 
          disabled={!params.row}
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
          disableSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </Box>
    </Box>
  );
}