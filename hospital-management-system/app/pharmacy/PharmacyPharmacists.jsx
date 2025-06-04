import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, TextField, Button, IconButton } from '@mui/material';
import { Search, Delete, Edit } from '@mui/icons-material';
import { getPharmacists, addPharmacist, updatePharmacist, deletePharmacist } from './pharmacyService';
import styles from './PharmacyPharmacists.module.css';

const PharmacyPharmacists = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [search, setSearch] = useState('');
  const [newPharmacist, setNewPharmacist] = useState({
    name: '',
    email: '',
    password: '',
    licenseNumber: '',
    phone: '',
    specialty: '',
  });

  useEffect(() => {
    fetchPharmacists();
  }, []);

  const fetchPharmacists = async () => {
    const data = await getPharmacists();
    setPharmacists(data);
  };

  const handleAddPharmacist = async () => {
    await addPharmacist(newPharmacist);
    fetchPharmacists();
    setNewPharmacist({
      name: '',
      email: '',
      password: '',
      licenseNumber: '',
      phone: '',
      specialty: '',
    });
  };

  const handleUpdatePharmacist = async (id, data) => {
    await updatePharmacist(id, data);
    fetchPharmacists();
  };

  const handleDeletePharmacist = async (id) => {
    await deletePharmacist(id);
    fetchPharmacists();
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { 
      field: 'name', 
      headerName: 'Name', 
      width: 200, 
      editable: true,
      valueGetter: ({ row }) => row.user.name,
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      width: 200, 
      editable: true,
      valueGetter: ({ row }) => row.user.email,
    },
    { 
      field: 'licenseNumber', 
      headerName: 'License Number', 
      width: 150, 
      editable: true,
    },
    { 
      field: 'phone', 
      headerName: 'Phone', 
      width: 150, 
      editable: true,
    },
    { 
      field: 'specialty', 
      headerName: 'Specialty', 
      width: 150, 
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleUpdatePharmacist(params.row.id, {
            name: params.row.user.name,
            email: params.row.user.email,
            licenseNumber: params.row.licenseNumber,
            phone: params.row.phone,
            specialty: params.row.specialty,
          })}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDeletePharmacist(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredPharmacists = pharmacists.filter(pharmacist =>
    pharmacist.user.name.toLowerCase().includes(search.toLowerCase()) ||
    pharmacist.user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Pharmacist Management</Typography>
      <Box className={styles.controls}>
        <TextField
          label="Search Pharmacists"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
          fullWidth
        />
        <Box className={styles.form}>
          <TextField
            label="Name"
            name="name"
            value={newPharmacist.name}
            onChange={(e) => setNewPharmacist({ ...newPharmacist, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={newPharmacist.email}
            onChange={(e) => setNewPharmacist({ ...newPharmacist, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={newPharmacist.password}
            onChange={(e) => setNewPharmacist({ ...newPharmacist, password: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="License Number"
            name="licenseNumber"
            value={newPharmacist.licenseNumber}
            onChange={(e) => setNewPharmacist({ ...newPharmacist, licenseNumber: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Phone"
            name="phone"
            value={newPharmacist.phone}
            onChange={(e) => setNewPharmacist({ ...newPharmacist, phone: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Specialty"
            name="specialty"
            value={newPharmacist.specialty}
            onChange={(e) => setNewPharmacist({ ...newPharmacist, specialty: e.target.value })}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleAddPharmacist} sx={{ mt: 2 }}>
            Add Pharmacist
          </Button>
        </Box>
      </Box>
      <DataGrid
        rows={filteredPharmacists}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
        onCellEditStop={(params, event) => {
          if (params.reason === 'enterKeyDown' || params.reason === 'cellFocusOut') {
            const updatedData = {
              name: params.field === 'name' ? params.value : params.row.user.name,
              email: params.field === 'email' ? params.value : params.row.user.email,
              licenseNumber: params.field === 'licenseNumber' ? params.value : params.row.licenseNumber,
              phone: params.field === 'phone' ? params.value : params.row.phone,
              specialty: params.field === 'specialty' ? params.value : params.row.specialty,
            };
            handleUpdatePharmacist(params.row.id, updatedData);
          }
        }}
      />
    </Box>
  );
};

export default PharmacyPharmacists;