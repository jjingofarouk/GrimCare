// pharmacy/PharmacyNarcotics.jsx
// Narcotic drug tracking component

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField } from '@mui/material';
import { getInventory } from './pharmacyService';
import styles from './PharmacyNarcotics.module.css';

const PharmacyNarcotics = () => {
  const [narcotics, setNarcotics] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNarcotics();
  }, []);

  const fetchNarcotics = async () => {
    try {
      const inventory = await getInventory();
      // Filter narcotic drugs (assuming narcotic is a boolean field; adjust if different)
      const narcoticDrugs = Array.isArray(inventory)
        ? inventory.filter(item => item?.narcotic === true || item?.formulary?.isNarcotic === true)
        : [];
      setNarcotics(narcoticDrugs);
    } catch (error) {
      console.error('Error fetching narcotics:', error);
      setNarcotics([]); // Fallback to empty array on error
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90, valueGetter: ({ row }) => row?.id ?? 'N/A' },
    { field: 'name', headerName: 'Medication', width: 200, valueGetter: ({ row }) => row?.name ?? 'Unknown' },
    { field: 'stockQuantity', headerName: 'Stock', width: 120, valueGetter: ({ row }) => row?.stockQuantity ?? 0 },
    { field: 'batchNumber', headerName: 'Batch Number', width: 150, valueGetter: ({ row }) => row?.batchNumber ?? 'N/A' },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 150,
      valueFormatter: ({ value }) => (value && !isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString() : '-'),
    },
    {
      field: 'history',
      headerName: 'History',
      width: 300,
      valueGetter: ({ row }) => {
        // Ensure dispensingRecords and stockAdjustments are arrays
        const dispensingRecords = Array.isArray(row?.dispensingRecords) ? row.dispensingRecords : [];
        const stockAdjustments = Array.isArray(row?.stockAdjustments) ? row.stockAdjustments : [];

        const history = [...dispensingRecords, ...stockAdjustments]
          .filter(record => record && record.createdAt && !isNaN(new Date(record.createdAt).getTime())) // Filter valid records
          .map(record => `${record.quantity ?? 0} units ${record.quantity > 0 ? 'added' : 'dispensed'} on ${new Date(record.createdAt).toLocaleDateString()}`)
          .join(', ');
        return history || 'No history available';
      },
    },
    {
      field: 'supplier',
      headerName: 'Supplier',
      width: 150,
      valueGetter: ({ row }) => row?.supplier?.name ?? 'Unknown',
    },
    {
      field: 'formulary',
      headerName: 'Formulary',
      width: 150,
      valueGetter: ({ row }) => row?.formulary?.name ?? 'Unknown',
    },
  ];

  const filteredNarcotics = narcotics.filter(item =>
    item?.name?.toLowerCase()?.includes(search.toLowerCase()) ?? false
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Narcotic Drug Tracking</Typography>
      <TextField
        label="Search Narcotics"
        value={search ?? ''}
        onChange={(e) => setSearch(e.target.value ?? '')}
        fullWidth
      />
      <DataGrid
        rows={filteredNarcotics}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
      />
    </Box>
  );
};

export default PharmacyNarcotics;