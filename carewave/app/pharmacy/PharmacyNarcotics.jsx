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
      // Log inventory for debugging
      console.log('Inventory data:', inventory);
      // Ensure inventory is an array and filter narcotic drugs
      const narcoticDrugs = Array.isArray(inventory)
        ? inventory.filter(item => {
            const isNarcotic = item?.narcotic === true;
            if (!isNarcotic) console.log('Non-narcotic item filtered out:', item);
            return isNarcotic;
          })
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
    { field: 'category', headerName: 'Category', width: 150, valueGetter: ({ row }) => row?.category ?? 'Unknown' },
    { field: 'stockQuantity', headerName: 'Stock', width: 120, valueGetter: ({ row }) => row?.stockQuantity ?? 0 },
    { field: 'batchNumber', headerName: 'Batch Number', width: 150, valueGetter: ({ row }) => row?.batchNumber ?? 'N/A' },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 150,
      valueFormatter: ({ value }) => (value && !isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString() : '-'),
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      valueFormatter: ({ value }) => (typeof value === 'number' ? `$${value.toFixed(2)}` : '-'),
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
        margin="normal"
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