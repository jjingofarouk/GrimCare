// pharmacy/PharmacyNarcotics.jsx
// Narcotic drug tracking component

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, Typography, IconButton, Alert } from '@mui/material';
import { Search, Delete, Edit, QrCodeScanner } from '@mui/icons-material';
import { getInventory, updateStock, deleteMedication, getStockAlerts, scanBarcode } from './pharmacyService';
import styles from './PharmacyNarcotics.module.css';

const PharmacyNarcotics = () => {
  const [narcotics, setNarcotics] = useState([]);
  const [search, setSearch] = useState('');
  const [stockAlerts, setStockAlerts] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNarcotics();
    fetchStockAlerts();
  }, []);

  const fetchNarcotics = async () => {
    try {
      const data = await getInventory();
      // Log inventory for debugging
      console.log('Inventory data:', data);
      // Filter for narcotic medications
      const narcoticDrugs = Array.isArray(data)
        ? data.filter(item => {
            const isNarcotic = item?.narcotic === true;
            if (!isNarcotic) console.log('Non-narcotic item filtered out:', item);
            return isNarcotic;
          })
        : [];
      setNarcotics(narcoticDrugs);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch narcotics:', error);
      setError('Failed to fetch narcotic inventory');
      setNarcotics([]);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      const alerts = await getStockAlerts();
      // Filter alerts for narcotic medications only
      const narcoticAlerts = Array.isArray(alerts)
        ? alerts.filter(alert => alert?.narcotic === true)
        : [];
      setStockAlerts(narcoticAlerts);
    } catch (error) {
      console.error('Failed to fetch stock alerts:', error);
      setError('Failed to fetch stock alerts');
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      const parsedStock = parseInt(newStock);
      if (isNaN(parsedStock) || parsedStock < 0) {
        setError('Stock quantity must be a non-negative number');
        return;
      }
      await updateStock(id, parsedStock);
      await fetchNarcotics();
      await fetchStockAlerts();
      setError(null);
    } catch (error) {
      console.error('Failed to update stock:', error);
      setError('Failed to update stock');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      await fetchNarcotics();
      await fetchStockAlerts();
      setError(null);
    } catch (error) {
      console.error('Failed to delete medication:', error);
      setError('Failed to delete medication');
    }
  };

  const handleBarcodeScan = async () => {
    try {
      const medication = await scanBarcode(barcode);
      if (medication && medication.narcotic === true) {
        setNarcotics([medication, ...narcotics.filter(item => item.id !== medication.id)]);
        setBarcode('');
        setError(null);
      } else {
        setError('Scanned medication is not a narcotic or not found');
      }
    } catch (error) {
      console.error('Failed to scan barcode:', error);
      setError('Failed to scan barcode');
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90, valueGetter: ({ row }) => row?.id ?? 'N/A' },
    { field: 'name', headerName: 'Medication', width: 200, valueGetter: ({ row }) => row?.name ?? 'Unknown' },
    { field: 'category', headerName: 'Category', width: 150, valueGetter: ({ row }) => row?.category ?? 'Unknown' },
    {
      field: 'stockQuantity',
      headerName: 'Stock',
      width: 120,
      editable: true,
      type: 'number',
      valueGetter: ({ row }) => row?.stockQuantity ?? 0,
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 120,
      valueFormatter: ({ value }) => (typeof value === 'number' ? `$${value.toFixed(2)}` : '-'),
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry Date',
      width: 150,
      valueFormatter: ({ value }) => (value && !isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString() : '-'),
    },
    { field: 'barcode', headerName: 'Barcode', width: 150, valueGetter: ({ row }) => row?.barcode ?? 'N/A' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleStockUpdate(params.row.id, params.row.stockQuantity)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredNarcotics = narcotics.filter(item =>
    item?.name?.toLowerCase()?.includes(search.toLowerCase()) ?? false
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Narcotic Drug Tracking</Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {stockAlerts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Low stock alert for {stockAlerts.length} narcotic medications
        </Alert>
      )}
      <Box className={styles.searchBar}>
        <TextField
          label="Search Narcotics"
          variant="outlined"
          value={search ?? ''}
          onChange={(e) => setSearch(e.target.value ?? '')}
          InputProps={{ startAdornment: <Search /> }}
          fullWidth
          margin="normal"
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField
            label="Scan Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <IconButton onClick={handleBarcodeScan}>
            <QrCodeScanner />
          </IconButton>
        </Box>
      </Box>
      <DataGrid
        rows={filteredNarcotics}
        columns={columns}
        initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
        pageSizeOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
        onCellEditStop={(params, event) => {
          if (params.reason === 'enterKeyDown' || params.reason === 'cellFocusOut') {
            handleStockUpdate(params.row.id, params.value);
          }
        }}
      />
    </Box>
  );
};

export default PharmacyNarcotics;