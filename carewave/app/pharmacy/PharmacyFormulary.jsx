
// pharmacy/PharmacyFormulary.jsx
// Formulary management component

import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField, Button } from '@mui/material';
import { getFormularies, addFormulary } from './pharmacyService';
import styles from './PharmacyFormulary.module.css';

const PharmacyFormulary = () => {
  const [formularies, setFormularies] = useState([]);
  const [newFormulary, setNewFormulary] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchFormularies();
  }, []);

  const fetchFormularies = async () => {
    const data = await getFormularies();
    setFormularies(data);
  };

  const handleAddFormulary = async () => {
    const formulary = await addFormulary(newFormulary);
    setFormularies([...formularies, formulary]);
    setNewFormulary({ name: '', description: '' });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'medications', headerName: 'Medications', width: 300, valueGetter: ({ value }) => value.map(m => m.name).join(', ') },
  ];

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Formulary Management</Typography>
      <Box className={styles.form}>
        <TextField
          label="Name"
          name="name"
          value={newFormulary.name}
          onChange={(e) => setNewFormulary({ ...newFormulary, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={newFormulary.description}
          onChange={(e) => setNewFormulary({ ...newFormulary, description: e.target.value })}
          fullWidth
        />
        <Button variant="contained" onClick={handleAddFormulary}>
          Add Formulary
        </Button>
      </Box>
      <DataGrid
        rows={formularies}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
      />
    </Box>
  );
};

export default PharmacyFormulary;