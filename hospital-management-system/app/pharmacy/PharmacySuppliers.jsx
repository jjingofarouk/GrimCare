// pharmacy/PharmacySuppliers.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Search, Delete, Edit } from '@mui/icons-material';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from './pharmacyService';
import styles from './PharmacySuppliers.module.css';

const PharmacySuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data);
  };

  const handleAddSupplier = async () => {
    await addSupplier({ /* supplier details */ });
    fetchSuppliers();
  };

  const handleUpdateSupplier = async (id, data) => {
    await updateSupplier(id, data);
    fetchSuppliers();
  };

  const handleDeleteSupplier = async (id) => {
    await deleteSupplier(id);
    fetchSuppliers();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Supplier Name', width: 200 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'address', headerName: 'Address', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleUpdateSupplier(params.row.id, params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDeleteSupplier(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Supplier Management</Typography>
      <Box className={styles.controls}>
        <TextField
          label="Search Suppliers"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddSupplier}>
          Add Supplier
        </Button>
      </Box>
      <DataGrid
        rows={filteredSuppliers}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
      />
    </Box>
  );
};

export default PharmacySuppliers;
