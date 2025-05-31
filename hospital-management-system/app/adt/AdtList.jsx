"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAdmissions } from './adtService';
import AdmissionCard from './AtCard';

export default function AdmissionList({ onSelectAdmission }) {
  const [admissions, setAdmissions] = useState([]);
  const [viewMode, setViewMode] = useState('card'); // card or table

  useEffect(() => {
    async function fetchAdmissions() {
      try {
        const data = await getAdmissions();
        setAdmissions(data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
      }
    }
    fetchAdmissions();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientName', headerName: 'Patient', width: 150, valueGetter: (params) => params.row.patient.user.name },
    { field: 'wardName', headerName: 'Ward', width: 150, valueGetter: (params) => params.row.ward?.name || 'N/A' },
    {
      field: 'admissionDate',
      headerName: 'Admission Date',
      width: 150,
      valueGetter: (params) => new Date(params.row.admissionDate).toLocaleDateString(),
    },
    { field: 'doctorName', headerName: 'Doctor', width: 150, valueGetter: (params) => params.row.doctor?.user.name || 'N/A' },
    { field: 'triagePriority', headerName: 'Triage Priority', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => onSelectAdmission(params.row)}>
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