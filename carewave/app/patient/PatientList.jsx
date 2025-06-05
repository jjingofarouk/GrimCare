"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, MenuItem, Skeleton } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { getPatients, updatePatient, deletePatient } from '../adt/adtService';
import styles from './PatientList.module.css';

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true);
        const data = await getPatients();
        const mappedPatients = data.map(patient => ({
          id: patient.id,
          patientId: patient.patientId || '',
          name: patient.user?.name || '',
          email: patient.user?.email || '',
          phone: patient.phone || '',
          gender: patient.gender || '',
          dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : '',
          bloodType: patient.bloodType || '',
        }));
        setPatients(mappedPatients);
        setFilteredPatients(mappedPatients);
        setError(null);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(error.response?.data?.details || error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient =>
      (patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       patient.patientId.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (genderFilter ? patient.gender === genderFilter : true)
    );
    setFilteredPatients(filtered);
  }, [searchQuery, genderFilter, patients]);

  const handleCellEditCommit = async (params) => {
    try {
      const updatedData = {
        patientId: params.row.patientId || '',
        name: params.row.name || '',
        email: params.row.email || '',
        phone: params.row.phone || null,
        gender: params.row.gender || null,
        dateOfBirth: params.row.dateOfBirth ? new Date(params.row.dateOfBirth) : null,
        bloodType: params.row.bloodType || null,
        [params.field]: params.value,
      };
      await updatePatient(params.id, updatedData);
      setPatients(patients.map(row =>
        row.id === params.id ? { ...row, [params.field]: params.value } : row
      ));
    } catch (error) {
      console.error('Error updating patient:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(id);
      setPatients(patients.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'patientId', headerName: 'Patient ID', width: 120 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'email', headerName: 'Email', width: 180, editable: true },
    { field: 'phone', headerName: 'Phone', width: 150, editable: true },
    { field: 'gender', headerName: 'Gender', width: 100, editable: true },
    { field: 'dateOfBirth', headerName: 'Date of Birth', width: 150 },
    { field: 'bloodType', headerName: 'Blood Type', width: 120, editable: true },
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

  const genders = [...new Set(patients.map(patient => patient.gender))].filter(g => g !== '');

  const CustomToolbar = () => (
    <GridToolbarContainer className={styles.toolbar}>
      <TextField
        label="Search by Name, ID, or Email"
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mr: 2, width: 250 }}
      />
      <TextField
        label="Filter by Gender"
        select
        variant="outlined"
        size="small"
        value={genderFilter}
        onChange={(e) => setGenderFilter(e.target.value)}
        sx={{ mr: 2, width: 200 }}
      >
        <MenuItem value="">All Genders</MenuItem>
        {genders.map(gender => (
          <MenuItem key={gender} value={gender}>{gender}</MenuItem>
        ))}
      </TextField>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Patients List
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load patients: {error}
        </Alert>
      )}
      {loading ? (
        <Box className={styles.skeletonWrapper}>
          <Skeleton variant="rectangular" height={60} className={styles.skeleton} />
          <Skeleton variant="rectangular" height={400} className={styles.skeleton} />
        </Box>
      ) : patients.length === 0 && !error ? (
        <Alert severity="info" className={styles.alert}>
          No patients found.
        </Alert>
      ) : (
        <Box className={styles.tableWrapper}>
          <Box className={styles.dataGridWrapper}>
            <DataGrid
              rows={filteredPatients}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              initialState={{
                pagination: { paginationModel: { pageSize: nicho10 } },
              }}
              className={styles.dataGrid}
              onCellEditStop={handleCellEditCommit}
              slots={{ toolbar: CustomToolbar }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}