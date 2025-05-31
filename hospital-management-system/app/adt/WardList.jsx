// app/adt/WardList.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getWards } from './adtService';
import styles from './WardList.module.css';

export default function WardList() {
  const [wards, setWards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWards() {
      try {
        const data = await getWards();
        setWards(data.map(ward => ({
          id: ward.id,
          name: ward.name || 'N/A',
          department: ward.department || 'N/A',
          totalBeds: ward.totalBeds || 0,
          occupiedBeds: ward.occupiedBeds || 0,
          availability: ward.totalBeds - ward.occupiedBeds > 0 ? 'Available' : 'Full',
        })));
        setError(null);
      } catch (error) {
        console.error('Error fetching wards:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
    fetchWards();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Ward Name', width: 150 },
    { field: 'department', headerName: 'Department', width: 150 },
    { field: 'totalBeds', headerName: 'Total Beds', width: 120 },
    { field: 'occupiedBeds', headerName: 'Occupied Beds', width: 120 },
    {
      field: 'availability',
      headerName: 'Availability',
      width: 120,
      cellClassName: (params) => params.value === 'Available' ? styles.available : styles.full,
    },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Wards Overview
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load wards: {error}
        </Alert>
      )}
      {wards.length === 0 && !error && (
        <Alert severity="info" className={styles.alert}>
          No wards found.
        </Alert>
      )}
      <Box className={styles.tableWrapper}>
        <DataGrid
          rows={wards}
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