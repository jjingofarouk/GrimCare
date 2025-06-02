import React from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import CustomDataGrid from '../components/CustomDataGrid';
import { useApiData } from '../utils/api';
import { getQueue, updateQueue } from './appointmentService';
import styles from './Queue.module.css';

export default function QueueManagement({ doctors, doctorId }) {
  const { data: queues, error: queueError, loading: queueLoading } = useApiData(
    () => getQueue({ doctorId })
  );
  const [error, setError] = useState(null);

  const handleStatusChange = async (id, status) => {
    try {
      await updateQueue(id, { status });
      // Refresh handled by parent or API hook
    } catch (err) {
      setError('Failed to update queue status: ' + err.message);
    }
  };

  const columns = [
    { field: 'queueNumber', headerName: 'Queue Number', width: 120 },
    { field: 'patientName', headerName: 'Patient', width: 150 },
    { field: 'doctorName', headerName: 'Doctor', width: 150 },
    {
      field: 'date',
      headerName: 'Date',
      width: 200,
      valueGetter: (params) => params.row?.appointment?.date || 'N/A',
    },
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
      {(error || queueError) && (
        <Alert severity="error" className={styles.alert}>
          {error || queueError}
        </Alert>
      )}
      {queueLoading ? (
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