// app/adt/AdmissionList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AdmissionCard from './AdtCard';
import { getAdmissions } from './adtService';

export default function AdmissionList({ onSelectAdmission, refresh }) {
  const [admissions, setAdmissions] = useState([]);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card');

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const data = await getAdmissions();
        setAdmissions(Array.isArray(data) ? data : []);
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
      valueGetter: (params) => params.row?.admissionDate ? new Date(params.row.admissionDate).toLocaleDateString() : 'N/A',
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
        <Button variant="outlined" onClick={() => onSelectAdmission(params.row)} disabled={!params.row}>
          View
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Admissions</Typography>
        <Button variant="outlined" onClick={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}>
          Switch to {viewMode === 'card' ? 'Table' : 'Card'} View
        </Button>
      </Box>
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
      {viewMode === 'card' ? (
        <Box>
          {admissions.map((admission) => (
            <AdmissionCard key={admission.id} admission={admission} onViewDetails={onSelectAdmission} />
          ))}
        </Box>
      ) : (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={admissions}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            disableSelectionOnClick
          />
        </Box>
      )}
    </Box>
  );
}