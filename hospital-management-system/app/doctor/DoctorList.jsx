// DoctorList.js
'use client';
import React, { useState, useEffect } from 'react';
import { Grid, Button, Box } from '@mui/material';
import DoctorCard from './DoctorCard';
import * as doctorService from './doctorService';
import styles from './DoctorList.module.css';

const DoctorList = ({ onEdit, onSelect }) => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleDelete = async (id) => {
    try {
      await doctorService.deleteDoctor(id);
      setDoctors(doctors.filter((doctor) => doctor.id !== id));
    } catch (error) {
      console.error('Error deleting doctor:', error);
    }
  };

  return (
    <Box className={styles.container}>
      <Box mb={2}>
        <Button variant="contained" onClick={() => onEdit(null)}>
          Add New Doctor
        </Button>
      </Box>
      <Grid container spacing={2}>
        {doctors.map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor.id}>
            <DoctorCard
              doctor={doctor}
              onEdit={onEdit}
              onSelect={onSelect}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DoctorList;