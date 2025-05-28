// pharmacy/PharmacyInventory.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, Typography, IconButton } from '@mui/material';
import { Search, Delete, Edit } from '@mui/icons-material';
import { getInventory, updateStock, deleteMedication } from './pharmacyService';
import styles from './PharmacyInventory.module.css';

const PharmacyInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const data = await getInventory();
    setInventory(data);
  };

  const handleStockUpdate = async (id, newStock) => {
    await updateStock(id, newStock);
    fetchInventory();
  };

  const handleDelete = async (id) => {
    await deleteMedication(id);
    fetchInventory();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Medication', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { field: 'stock', headerName: 'Stock', width: 120, editable: true },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'expiry', headerName: 'Expiry Date', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleStockUpdate(params.row.id, params.row.stock)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Inventory Management</Typography>
      <Box className={styles.searchBar}>
        <TextField
          label="Search Medications"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          InputProps={{ startAdornment: <Search /> }}
        />
      </Box>
      <DataGrid
        rows={filteredInventory}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
      />
    </Box>
  );
};

export default PharmacyInventory;