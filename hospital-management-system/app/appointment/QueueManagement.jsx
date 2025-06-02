"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getQueue, updateQueue } from './appointmentService';
import { format } from 'date-fns';

export default function QueueManagement({ doctorId }) {
  const [queues, setQueues] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const data = await getQueue({ doctorId });
        setQueues(data);
      } catch (err) {
        setError('Failed to fetch queue');
      }
    };
    fetchQueue();
  }, [doctorId]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateQueue(id, { status });
      setQueues((prev) => prev.map((q) => (q.id === id ? { ...q, status } : q)));
    } catch (err) {
      setError('Failed to update queue status');
    }
  };

  const columns = [
    { field: 'queueNumber', headerName: 'Queue Number', width: 120 },
    { 
      field: 'patientName', 
      headerName: 'Patient', 
      width: 150, 
      valueGetter: (params) => params.row.appointment?.patient?.user?.name || 'N/A' 
    },
    { 
      field: 'doctorName', 
      headerName: 'Doctor', 
      width: 150, 
      valueGetter: (params) => params.row.appointment?.doctor?.user?.name || 'N/A' 
    },
    { 
      field: 'date', 
      headerName: 'Date', 
      width: 200, 
      valueGetter: (params) => params.row.appointment?.date 
        ? format(new Date(params.row.appointment.date), 'PPp') 
        : 'N/A' 
    },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          {params.row.status === 'WAITING' && (
            <Button
              variant="contained"
              onClick={() => handleStatusChange(params.row.id, 'IN_PROGRESS')}
              sx={{ mr: 1 }}
            >
              Start
            </Button>
          )}
          {params.row.status === 'IN_PROGRESS' && (
            <Button
              variant="contained"
              onClick={() => handleStatusChange(params.row.id, 'COMPLETED')}
            >
              Complete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Queue Management</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={queues}
          columns={columns}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Box>
    </Box>
  );
}