"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, Button, TextField, MenuItem, Skeleton } from '@mui/material';
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton } from '@mui/x-data-grid';
import { getDoctors, updateDoctor, deleteDoctor } from './doctorService';
import styles from './DoctorList.module.css';

export default function DoctorList({ onEdit, onSelect }) {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        const data = await getDoctors();
        const mappedDoctors = data.map(doctor => ({
          id: doctor.id,
          name: doctor.user?.name || 'N/A',
          doctorId: doctor.doctorId || 'N/A',
          email: doctor.user?.email || 'N/A',
          specialty: doctor.specialty || 'N/A',
          licenseNumber: doctor.licenseNumber || 'N/A',
          phone: doctor.phone || 'N/A',
          office: doctor.office || 'N/A',
        }));
        setDoctors(mappedDoctors);
        setFilteredDoctors(mappedDoctors);
        setError(null);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError(error.response?.data?.details || error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctors();
  }, []);

  useEffect(() => {
    const filtered = doctors.filter(doctor =>
      (doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       doctor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
       doctor.doctorId.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (specialtyFilter ? doctor.specialty === specialtyFilter : true)
    );
    setFilteredDoctors(filtered);
  }, [searchQuery, specialtyFilter, doctors]);

  const handleCellEditStop = async (params) => {
    try {
      const updatedData = {
        name: params.row.name,
        email: params.row.email,
        specialty: params.row.specialty,
        licenseNumber: params.row.licenseNumber,
        phone: params.row.phone || null,
        office: params.row.office || null,
        [params.field]: params.value,
      };
      await updateDoctor(params.id, updatedData);
      setDoctors(doctors.map(row =>
        row.id === params.id ? { ...row, [params.field]: params.value } : row
      ));
    } catch (error) {
      console.error('Error updating doctor:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoctor(id);
      setDoctors(doctors.filter(row => row.id !== id));
    } catch (error) {
      console.error('Error deleting doctor:', error);
      setError(error.response?.data?.details || error.message);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'doctorId', headerName: 'Doctor ID', width: 120 },
    { field: 'email', headerName: 'Email', width: 180, editable: true },
    { field: 'specialty', headerName: 'Specialty', width: 150, editable: true },
    { field: 'licenseNumber', headerName: 'License Number', width: 150, editable: true },
    { field: 'phone', headerName: 'Phone', width: 120, editable: true },
    { field: 'office', headerName: 'Office', width: 120, editable: true },
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

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))].filter(s => s !== 'N/A');

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
        label="Filter by Specialty"
        select
        variant="outlined"
        size="small"
        value={specialtyFilter}
        onChange={(e) => setSpecialtyFilter(e.target.value)}
        sx={{ mr: 2, width: 200 }}
      >
        <MenuItem value="">All Specialties</MenuItem>
        {specialties.map(specialty => (
          <MenuItem key={specialty} value={specialty}>{specialty}</MenuItem>
        ))}
      </TextField>
      <GridToolbarFilterButton />
    </GridToolbarContainer>
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" className={styles.title}>
        Doctors List
      </Typography>
      {error && (
        <Alert severity="error" className={styles.alert}>
          Failed to load doctors: {error}
        </Alert>
      )}
      {loading ? (
        <Box className={styles.skeletonWrapper}>
          <Skeleton variant="rectangular" height={60} className={styles.skeleton} />
          <Skeleton variant="rectangular" height={400} className={styles.skeleton} />
        </Box>
      ) : doctors.length === 0 && !error ? (
        <Alert severity="info" className={styles.alert}>
          No doctors found.
        </Alert>
      ) : (
        <Box className={styles.tableWrapper}>
          <Box className={styles.dataGridWrapper}>
            <DataGrid
              rows={filteredDoctors}
              columns={columns}
              pageSizeOptions={[5, 10, 25]}
              disableRowSelectionOnClick
              initialState={{
                pagination: { paginationModel: { pageSize: 10 } },
              }}
              className={styles.dataGrid}
              onCellEditStop={handleCellEditStop}
              slots={{ toolbar: CustomToolbar }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}