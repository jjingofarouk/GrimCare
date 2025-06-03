"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, CircularProgress } from '@mui/material';
import CustomDataGrid from '../components/CustomDataGrid';
import api from '../api';
import styles from './Queue.module.css';

export default function QueueManagement({ doctorId }) {
  const [queues, setQueues] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQueue() {
      try {
        setLoading(true);
        const response = await fetch(`${api.BASE_URL}${api.API_ROUTES.QUEUE}?doctorId=${doctorId}`);
        if (!response.ok) throw new Error('Failed to fetch queue');
        const data = await response.json();
        const mappedQueues = data.map(queue => ({
          id: queue.id,
          queueNumber: queue.queueNumber || 'N/A',
          patientName: queue.patient?.user?.name || 'N/A',
          doctorName: queue.doctor?.user?.name || 'N/A',
          date: queue.date ? new Date(queue.date).toLocaleString() : 'N/A',
          status: queue.queueStatus || 'WAITING',
        }));
        setQueues(mappedQueues);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, [doctorId]);

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`${api.BASE_URL}${api.API_ROUTES.QUEUE}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!response.ok) throw new Error('Failed to update queue status');
      const updatedQueue = await response.json();
      setQueues(queues.map(queue =>
        queue.id === id ? { ...queue, status: updatedQueue.queueStatus } : queue
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update queue status: ' + err.message);
    }
  };

  const columns = [
    { field: 'queueNumber', headerName: 'Queue Number', width: 120 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <>
          {params.row?.status === 'WAITING' && (
            <Button
              variant="contained"
              onClick={() => handleStatusChange(params.id, 'IN_PROGRESS')}
              sx={{ mr: 1 }}
            >
              Start
            </Button>
          )}
          {params.row?.status === 'IN_PROGRESS' && (
            <Button
              variant="contained"
              onClick={() => handleStatusChange(params.id, 'COMPLETED')}
            >
              Complete
            </Button>
          )}
        </>
      ),
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h5" className={styles.title}>
        Queue Management
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          {error}
        </Alert>
      )}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box className={styles.gridContainer}>
          <CustomDataGrid rows={queues} columns={columns} />
        </Box>
      )}
    </Box>
  );
}