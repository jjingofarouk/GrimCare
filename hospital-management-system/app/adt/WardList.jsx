// app/adt/WardList.jsx
"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button } from '@mui/material';
import { DataGrid, GridCellEditStopReasons } from '@mui/x-data-grid';
import { getWards, updateWard, deleteWard } from './adtService';
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
          wardNumber: ward.wardNumber || 'N/A',
          department: ward.department || 'N/A',
          totalBeds: ward.totalBeds || 0,
          occupiedBeds: ward.occupiedBeds || 0,
          location: ward.location || 'N/A',
          nurseInCharge: ward.nurseInCharge || 'N/A',
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

  const handleCellEditCommit = async (params, event, details) => {
    if (details.reason === GridCellEditStopReasons.cellEditEnd) {
      try {
        const updatedData = {
          name: params.row.name,
          wardNumber: params.row.wardNumber,
          department: params.row.department,
          totalBeds: params.row.totalBeds,
          occupiedBeds: params.row.occupiedBeds,
          location: params.row.location,
          nurseInCharge: params.row.nurseInCharge,
          [params.field]: params.value,
        };
        await updateWard(params.id, updatedData);
        setWards(wards.map(row => 
          row.id === params.id ? { ...row, [params.field]: params.value } : row
        ));
      } catch (error) {
        console.error('Error updating ward:', error);
        setError(error.response?.data?.details || error.message);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWard(id);
      setWards(wards.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting ward:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Ward Name', width: 150, editable: true },
    { field: 'wardNumber', headerName: 'Ward Number', width: 120, editable: true },
    { field: 'department', headerName: 'Department', width: 150, editable: true },
    { field: 'totalBeds', headerName: 'Total Beds', width: 120, editable: true },
    { field: 'occupiedBeds', headerName: 'Occupied Beds', width: 120, editable: true },
    { field: 'location', headerName: 'Location', width: 150, editable: true },
    { field: 'nurseInCharge', headerName: 'Nurse in Charge', width: 150, editable: true },
    {
      field: 'availability',
      headerName: 'Availability',
      width: 120,
      cellClassName: (params) => params.value === 'Available' ? styles.available : styles.full,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(params.row.id)}
          className={styles.actionButton}
        >
          Delete
        </Button>
      ),
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
          onCellEditStop={handleCellEditCommit}
        />
      </Box>
    </Box>
  );
}