

// pharmacy/PharmacyNarcotics.jsx
// Narcotic drug tracking component

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField } from '@mui/material';
import { trackNarcotic, getInventory } from './pharmacyService';
import styles from './PharmacyNarcotics.module.css';

const PharmacyNarcotics = () => {
  const [narcotics, setNarcotics] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNarcotics();
  }, []);

  const fetchNarcotics = async () => {
    const inventory = await getInventory();
    const narcoticDrugs = inventory.filter(item => item.narcotic);
    setNarcotics(narcoticDrugs);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Medication', width: 200 },
    { field: 'stockQuantity', headerName: 'Stock', width: 120 },
    { field: 'batchNumber', headerName: 'Batch Number', width: 150 },
    { field: 'expiryDate', headerName: 'Expiry Date', width: 150, valueFormatter: ({ value }) => new Date(value).toLocaleDateString() },
    {
      field: 'history',
      headerName: 'History',
      width: 300,
      valueGetter: ({ row }) => {
        const history = [...row.dispensingRecords, ...row.stockAdjustments]
          .map(record => `${record.quantity} units ${record.quantity > 0 ? 'added' : 'dispensed'} on ${new Date(record.createdAt).toLocaleDateString()}`)
          .join(', ');
        return history;
      },
    },
  ];

  const filteredNarcotics = narcotics.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Narcotic Drug Tracking</Typography>
      <TextField
        label="Search Narcotics"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
      <DataGrid
        rows={filteredNarcotics}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
      />
    </Box>
  );
};

export default PharmacyNarcotics;